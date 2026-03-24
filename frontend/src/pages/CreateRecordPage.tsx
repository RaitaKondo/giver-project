import { useEffect, useMemo, useState } from "react";

import {
  createPost,
  fetchContextMasters,
  type ContextMasterResponse,
  type Visibility,
} from "../api/postApi";

export function CreateRecordPage() {
  // タイトルは任意項目
  const [title, setTitle] = useState("");

  // バックエンドの posts.action_text に対応
  const [actionText, setActionText] = useState("");

  // バックエンドの posts.conflict_text に対応
  const [conflictText, setConflictText] = useState("");

  // バックエンドの posts.change_text に対応
  const [changeText, setChangeText] = useState("");

  // バックエンドの visibility に対応
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");

  // 画像は最大4枚
  const [images, setImages] = useState<File[]>([]);

  // 投稿文脈はマスターから複数選択する
  const [contextMasters, setContextMasters] = useState<ContextMasterResponse[]>(
    [],
  );
  const [selectedContextIds, setSelectedContextIds] = useState<number[]>([]);
  const [isLoadingContexts, setIsLoadingContexts] = useState(true);

  // 利用者に確認させたい注意事項用
  const [confirmedNoPersonalInfo, setConfirmedNoPersonalInfo] = useState(false);

  // UI状態
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const actionTextLength = actionText.length;
  const conflictTextLength = conflictText.length;
  const changeTextLength = changeText.length;
  const titleLength = title.length;

  useEffect(() => {
    const loadContextMasters = async () => {
      try {
        setIsLoadingContexts(true);
        const response = await fetchContextMasters();
        setContextMasters(response);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "文脈マスターの取得に失敗しました。",
        );
      } finally {
        setIsLoadingContexts(false);
      }
    };

    loadContextMasters();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      !isSubmitting &&
      actionText.trim().length > 0 &&
      confirmedNoPersonalInfo &&
      images.length <= 4
    );
  }, [actionText, confirmedNoPersonalInfo, images.length, isSubmitting]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    // MIME の簡易チェック
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    const nextImages = [...images, ...imageFiles].slice(0, 4);
    setImages(nextImages);

    // 同じファイルを再選択できるように input をリセット
    event.currentTarget.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setActionText("");
    setConflictText("");
    setChangeText("");
    setVisibility("PUBLIC");
    setImages([]);
    setSelectedContextIds([]);
    setConfirmedNoPersonalInfo(false);
  };

  const handleToggleContext = (contextId: number) => {
    setSelectedContextIds((prev) =>
      prev.includes(contextId)
        ? prev.filter((id) => id !== contextId)
        : [...prev, contextId],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 送信前にメッセージを初期化
    setErrorMessage("");
    setSuccessMessage("");

    // 最低限のフロント側チェック
    if (!actionText.trim()) {
      setErrorMessage("「行動」は必須です。");
      return;
    }

    if (!confirmedNoPersonalInfo) {
      setErrorMessage("個人情報を含まないことを確認してください。");
      return;
    }

    if (images.length > 4) {
      setErrorMessage("画像は4枚までです。");
      return;
    }

    setIsSubmitting(true);

    try {
      // バックエンドの @RequestPart("request") に渡す JSON 本体
      const requestPayload = {
        title: title.trim() || null,
        actionText: actionText.trim(),
        conflictText: conflictText.trim() || null,
        changeText: changeText.trim() || null,
        visibility,
        contextIds: selectedContextIds,
      };

      const createdPost = await createPost(requestPayload, images);

      setSuccessMessage("投稿を公開しました。");
      resetForm();

      // 必要なら詳細画面遷移に使える
      console.log("created post:", createdPost);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "予期しないエラーが発生しました。",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <form className="space-y-10" onSubmit={handleSubmit}>
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                1
              </span>
              <h2 className="text-xl font-bold">タイトル</h2>
            </div>

            <textarea
              className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-white p-4 text-base focus:border-primary focus:outline-none"
              maxLength={200}
              placeholder="タイトルをかいてください（任意）"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <p className="text-right text-xs text-slate-400">
              {titleLength} / 200
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                2
              </span>
              <h2 className="text-xl font-bold">行動</h2>
            </div>

            <textarea
              className="min-h-[140px] w-full rounded-xl border border-slate-200 bg-white p-4 text-base focus:border-primary focus:outline-none"
              maxLength={1000}
              placeholder="何をしたかを具体的に書いてください"
              required
              value={actionText}
              onChange={(event) => setActionText(event.target.value)}
            />

            <p className="text-right text-xs text-slate-400">
              {actionTextLength} / 1000
            </p>
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
              maxLength={1000}
              placeholder="ためらった理由や難しかった点"
              value={conflictText}
              onChange={(event) => setConflictText(event.target.value)}
            />

            <p className="text-right text-xs text-slate-400">
              {conflictTextLength} / 1000
            </p>
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
              maxLength={1000}
              placeholder="どんな変化があったか、どう感じたか"
              value={changeText}
              onChange={(event) => setChangeText(event.target.value)}
            />

            <p className="text-right text-xs text-slate-400">
              {changeTextLength} / 1000
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              公開範囲
            </h3>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  value: "PUBLIC",
                  label: "公開",
                  description: "誰でも見られます",
                },
                {
                  value: "FOLLOWERS",
                  label: "フォロワーのみ",
                  description: "フォロー関係のある人向け",
                },
                {
                  value: "PRIVATE",
                  label: "非公開",
                  description: "自分用メモとして保存",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    visibility === option.value
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 bg-white hover:border-primary/50"
                  }`}
                >
                  <input
                    checked={visibility === option.value}
                    className="sr-only"
                    name="visibility"
                    type="radio"
                    value={option.value}
                    onChange={() => setVisibility(option.value as Visibility)}
                  />
                  <p className="font-bold text-slate-800">{option.label}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {option.description}
                  </p>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                5
              </span>
              <h2 className="text-xl font-bold">画像</h2>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
              <input
                accept="image/*"
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                multiple
                type="file"
                onChange={handleImageChange}
              />

              <p className="mt-3 text-xs text-slate-500">
                画像は最大4枚まで。画像ファイルのみ追加できます。
              </p>

              {images.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {images.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <p className="truncate text-sm font-medium text-slate-700">
                        {file.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        className="mt-3 text-sm font-semibold text-red-500 hover:text-red-600"
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                6
              </span>
              <h2 className="text-xl font-bold">日常文脈</h2>
            </div>

            <p className="text-sm leading-relaxed text-slate-500">
              この投稿がどんな場面や関係性で起きたかを選んでください。複数選択できます。
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              {isLoadingContexts ? (
                <p className="text-sm text-slate-500">文脈を読み込み中です...</p>
              ) : contextMasters.length === 0 ? (
                <p className="text-sm text-slate-500">
                  選択可能な文脈がまだ登録されていません。
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {contextMasters.map((context) => {
                    const selected = selectedContextIds.includes(context.id);

                    return (
                      <label
                        key={context.id}
                        className={`cursor-pointer rounded-2xl border p-4 transition ${
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-slate-200 hover:border-primary/40"
                        }`}
                      >
                        <input
                          checked={selected}
                          className="sr-only"
                          type="checkbox"
                          onChange={() => handleToggleContext(context.id)}
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-800">
                              {context.name}
                            </p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                              {context.category}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                              selected
                                ? "bg-primary text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {selected ? "選択中" : "未選択"}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {successMessage}
            </div>
          )}

          <div className="sticky bottom-8 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">
                  投稿前の確認
                </p>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    checked={visibility === "PUBLIC"}
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                    readOnly
                    type="checkbox"
                  />
                  公開設定は現在「{visibility}」です
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    checked={confirmedNoPersonalInfo}
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                    type="checkbox"
                    onChange={(event) =>
                      setConfirmedNoPersonalInfo(event.target.checked)
                    }
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
                  className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!canSubmit}
                  type="submit"
                >
                  {isSubmitting ? "送信中..." : "公開する"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
