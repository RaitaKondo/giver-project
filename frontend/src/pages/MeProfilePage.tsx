import { useEffect, useState } from "react";
import { updateMyProfile } from "../api/authApi";
import { useAuth } from "../features/auth/useAuth";

export function MeProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setDisplayName(profile?.displayName ?? "");
    setEmail(profile?.email ?? "");
    setPhotoUrl(profile?.photoUrl ?? "");
  }, [profile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");

    try {
      await updateMyProfile({
        displayName,
        email: email.trim() || null,
        photoUrl: photoUrl.trim() || null,
      });
      await refreshProfile();
      setMessage("プロフィールを更新しました。");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "プロフィール更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">My Profile</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">プロフィール編集</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          display name、email、photo URL を更新すると、今後のフォロー導線やプロフィール表示にも反映されます。
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">表示名</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">メールアドレス</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Photo URL</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              value={photoUrl}
              onChange={(event) => setPhotoUrl(event.target.value)}
            />
          </label>

          {message ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {message}
            </div>
          ) : null}
          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "保存中..." : "プロフィールを保存"}
          </button>
        </form>
      </div>
    </div>
  );
}
