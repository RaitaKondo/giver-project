import { Link } from "react-router-dom";
import { posts } from "../mock/data";

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-20 pt-20 md:pb-28 md:pt-28">
        <div className="absolute left-1/2 top-0 -z-10 h-[560px] w-[760px] -translate-x-1/2 bg-gradient-to-tr from-primary to-sky-300 opacity-20 blur-[120px]" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              safe design
            </span>
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl">
            善意の行動を記録して、
            <br />
            学びとして共有する。
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
            競争ではなく内省を中心にしたソーシャルラーニング。見せるためではなく、続けるためのプラットフォームです。
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              className="w-full min-w-[200px] rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary/30 transition-all hover:-translate-y-0.5 sm:w-auto"
              to="/posts/new"
            >
              記録をはじめる
            </Link>
            <Link
              className="w-full min-w-[200px] rounded-xl border border-slate-300 px-8 py-4 text-base font-bold text-slate-900 transition-all hover:bg-slate-100 sm:w-auto"
              to="/feed"
            >
              公開投稿を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              使い方
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              続けやすく、振り返りやすい4つのステップで設計しています。
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "学ぶ",
                "実践例やヒントから、無理のない貢献の形を見つけます。",
                "auto_stories",
              ],
              [
                "記録する",
                "やったこと・迷い・結果を短く残し、言語化します。",
                "edit_note",
              ],
              [
                "振り返る",
                "行動の変化を見返し、自分の価値観を育てます。",
                "psychology",
              ],
              [
                "フォローする",
                "他の人の実践を静かに追い、ヒントを得られます。",
                "visibility",
              ],
            ].map(([title, description, icon]) => (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-7"
                key={title}
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold">最新の公開投稿</h2>
              <p className="mt-3 text-slate-600">
                コミュニティの実践から、今すぐ試せる行動を見つけられます。
              </p>
            </div>
            <Link className="font-bold text-primary hover:underline" to="/feed">
              フィードを開く
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <div
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                key={post.id}
              >
                <p className="mb-2 text-xs font-semibold text-slate-500">
                  {post.createdAt}
                </p>
                <p className="line-clamp-4 leading-relaxed text-slate-700">
                  「{post.action}」
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
