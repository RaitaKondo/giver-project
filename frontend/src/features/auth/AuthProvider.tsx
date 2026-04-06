import { createContext, startTransition, useEffect, useState, type PropsWithChildren } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { fetchCurrentUser, type UserProfileResponse } from "../../api/authApi";
import { firebaseAuth } from "../../lib/firebase";

type AuthContextValue = {
  firebaseUser: User | null;
  profile: UserProfileResponse | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const MAX_DISPLAY_NAME_LENGTH = 100;

export function AuthProvider({ children }: PropsWithChildren) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (nextUser) => {
      startTransition(() => {
        setFirebaseUser(nextUser);
      });

      if (!nextUser) {
        startTransition(() => {
          setProfile(null);
          setIsInitializing(false);
        });
        return;
      }

      try {
        await nextUser.getIdToken(true);
        const nextProfile = await fetchCurrentUser();
        startTransition(() => {
          setProfile(nextProfile);
          setIsInitializing(false);
        });
      } catch {
        startTransition(() => {
          setProfile(null);
          setIsInitializing(false);
        });
      }
    });

    return unsubscribe;
  }, []);

  const refreshProfile = async () => {
    const nextProfile = await fetchCurrentUser();
    startTransition(() => {
      setProfile(nextProfile);
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
    await refreshProfile();
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    const normalizedDisplayName = displayName.trim();
    if (!normalizedDisplayName) {
      throw new Error("表示名は必須です。");
    }
    if (normalizedDisplayName.length > MAX_DISPLAY_NAME_LENGTH) {
      throw new Error("表示名は100文字以内で入力してください。");
    }

    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await updateProfile(credential.user, { displayName: normalizedDisplayName });
    await credential.user.getIdToken(true);
    await refreshProfile();
  };

  const signOutUser = async () => {
    await signOut(firebaseAuth);
    startTransition(() => {
      setProfile(null);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        isInitializing,
        isAuthenticated: Boolean(firebaseUser),
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
