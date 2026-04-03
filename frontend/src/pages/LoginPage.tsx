import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isInitializing, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectPath = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get("redirect") || "/";
  }, [location.search]);

  if (!isInitializing && isAuthenticated) {
    return <Navigate replace to={redirectPath} />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName);
      }
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "ログインに失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <section className="rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_42%),linear-gradient(135deg,_#0f172a,_#1e293b)] p-8 text-white shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Member Access</p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">メールアドレスでログインして、自分の記録を育てる。</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200">
          投稿作成、ダッシュボード、プロフィール編集、保存、フォローはログイン後に使えます。まずはメール/パスワードで安全に始めましょう。
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["投稿作成", "公開・限定公開・非公開を使い分けて記録できます。"],
            ["ダッシュボード", "自分の投稿だけを集計して振り返れます。"],
            ["フォローと保存", "気になった実践を後から見返せます。"],
          ].map(([title, description]) => (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4" key={title}>
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Account</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {mode === "login" ? "ログイン" : "アカウント作成"}
            </h2>
          </div>
          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
            type="button"
            onClick={() => setMode((prev) => (prev === "login" ? "signup" : "login"))}
          >
            {mode === "login" ? "新規登録へ" : "ログインへ"}
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">表示名</span>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                placeholder="表示名"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </label>
          ) : null}

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">メールアドレス</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">パスワード</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              placeholder="8文字以上を推奨"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "処理中..." : mode === "login" ? "ログインする" : "アカウントを作成する"}
          </button>
        </form>

        <p className="mt-6 text-sm leading-relaxed text-slate-500">
          ログイン後はホームに戻るか、保護されたページへ自動で戻ります。公開投稿の閲覧だけなら
          <Link className="ml-1 font-semibold text-primary hover:underline" to="/">
            ホーム
          </Link>
          から続けられます。
        </p>
      </section>
    </div>
  );
}
