import { useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import type { ActionCodeSettings } from "firebase/auth";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export function SecuritySettingsPage() {
  const { firebaseUser } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [currentPasswordForPasswordChange, setCurrentPasswordForPasswordChange] =
    useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const reauthenticate = async (currentPassword: string) => {
    if (!firebaseUser || !firebaseUser.email) {
      throw new Error("ログイン情報を確認できません。再ログイン後にお試しください。");
    }

    const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
    await reauthenticateWithCredential(firebaseUser, credential);
  };

  const handleEmailChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (!firebaseUser) {
        throw new Error("ログイン状態が確認できません。");
      }
      if (!newEmail.trim()) {
        throw new Error("新しいメールアドレスを入力してください。");
      }
      if (newEmail.trim() === (firebaseUser.email ?? "").trim()) {
        throw new Error("現在と同じメールアドレスです。");
      }
      if (!emailPassword) {
        throw new Error("現在のパスワードを入力してください。");
      }

      await reauthenticate(emailPassword);

      const actionCodeSettings: ActionCodeSettings = {
        url: `${window.location.origin}/`,
      };
      await verifyBeforeUpdateEmail(firebaseUser, newEmail.trim(), actionCodeSettings);

      setEmailPassword("");
      setMessage(
        "確認メールを送信しました。メール内リンク完了後、トップページへ遷移します。再ログインすると新しいメールアドレスが反映されます。",
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "メールアドレス変更に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (!firebaseUser) {
        throw new Error("ログイン状態が確認できません。");
      }
      if (!currentPasswordForPasswordChange) {
        throw new Error("現在のパスワードを入力してください。");
      }
      if (newPassword.length < 8) {
        throw new Error("新しいパスワードは8文字以上で入力してください。");
      }
      if (newPassword !== newPasswordConfirm) {
        throw new Error("新しいパスワードと確認用パスワードが一致しません。");
      }

      await reauthenticate(currentPasswordForPasswordChange);
      await updatePassword(firebaseUser, newPassword);

      setCurrentPasswordForPasswordChange("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setMessage("パスワードを更新しました。");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "パスワード変更に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Security</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">セキュリティ設定</h1>
          </div>
          <Link
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
            to="/me/profile"
          >
            プロフィールへ戻る
          </Link>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          メールアドレス変更は確認メールのリンク完了後に反映されます。
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleEmailChange}>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">新しいメールアドレス</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">現在のパスワード（再認証）</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              type="password"
              value={emailPassword}
              onChange={(event) => setEmailPassword(event.target.value)}
            />
          </label>
          <button
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "処理中..." : "メール変更リンクを送信"}
          </button>
        </form>

        <form className="mt-10 space-y-4 border-t border-slate-200 pt-8" onSubmit={handlePasswordChange}>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">現在のパスワード（再認証）</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              type="password"
              value={currentPasswordForPasswordChange}
              onChange={(event) => setCurrentPasswordForPasswordChange(event.target.value)}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">新しいパスワード</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">新しいパスワード（確認）</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              type="password"
              value={newPasswordConfirm}
              onChange={(event) => setNewPasswordConfirm(event.target.value)}
            />
          </label>
          <button
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "処理中..." : "パスワードを変更"}
          </button>
        </form>

        {message ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        ) : null}
        {errorMessage ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
}
