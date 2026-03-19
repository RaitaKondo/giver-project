export function CreateRecordPage() {
  return (
    <div className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight">
            新しい投稿を作成
          </h1>
          <p className="mx-auto max-w-lg leading-relaxed text-slate-500">
            行動を言語化すると、次の一歩が見えやすくなります。個人情報は書かず、学びの形で共有しましょう。
          </p>
        </div>

        <form className="space-y-10">
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                1
              </span>
              <h2 className="text-xl font-bold">タイトル</h2>
            </div>
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-white p-4 text-base focus:border-primary focus:outline-none"
              placeholder="タイトルをかいてください"
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                2
              </span>
              <h2 className="text-xl font-bold">行動</h2>
            </div>
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-white p-4 text-base focus:border-primary focus:outline-none"
              placeholder="何をしたかを具体的に書いてください"
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                3
              </span>
              <h2 className="text-xl font-bold">迷い・障壁</h2>
            </div>
            <textarea
              className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-white p-4 text-base focus:border-primary focus:outline-none"
              placeholder="ためらった理由や難しかった点"
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                4
              </span>
              <h2 className="text-xl font-bold">結果・変化</h2>
            </div>
            <textarea
              className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-white p-4 text-base focus:border-primary focus:outline-none"
              placeholder="どんな変化があったか、どう感じたか"
            />
          </section>

          <section>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
              カテゴリ
            </h3>
            <div className="flex flex-wrap gap-2">
              {["地域支援", "教育", "環境", "キャリア", "メンタリング"].map(
                (category) => (
                  <button
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium transition-all hover:border-primary hover:text-primary"
                    key={category}
                    type="button"
                  >
                    {category}
                  </button>
                ),
              )}
            </div>
          </section>

          <div className="sticky bottom-8 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                    defaultChecked
                    type="checkbox"
                  />
                  公開投稿として共有する（デフォルト）
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  個人名・住所など特定可能情報を含まない
                </label>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl bg-slate-200 px-6 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-300"
                  type="button"
                >
                  下書き保存
                </button>
                <button
                  className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
                  type="submit"
                >
                  公開する
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
