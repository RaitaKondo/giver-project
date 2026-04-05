import { useEffect, useState } from "react";
import { updateMyProfile, updateMyProfilePhoto } from "../api/authApi";
import { useAuth } from "../features/auth/useAuth";

const MAX_PROFILE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function MeProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setDisplayName(profile?.displayName ?? "");
    setEmail(profile?.email ?? "");
  }, [profile]);

  useEffect(() => {
    if (!selectedPhotoFile) {
      setPreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedPhotoFile);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [selectedPhotoFile]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setErrorMessage("");

    if (!file) {
      setSelectedPhotoFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("画像ファイルのみ選択できます。");
      event.currentTarget.value = "";
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
      setErrorMessage("プロフィール画像は 5MB 以下にしてください。");
      event.currentTarget.value = "";
      return;
    }

    setSelectedPhotoFile(file);
    event.currentTarget.value = "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");

    try {
      await updateMyProfile({
        displayName,
        email: email.trim() || null,
        photoUrl: null,
      });

      if (selectedPhotoFile) {
        await updateMyProfilePhoto(selectedPhotoFile);
      }

      await refreshProfile();
      setSelectedPhotoFile(null);
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
          display name、email、プロフィール画像を更新すると、今後のフォロー導線やプロフィール表示にも反映されます。
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
            <span className="text-sm font-semibold text-slate-700">プロフィール画像</span>
            <input
              accept="image/*"
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
              type="file"
              onChange={handlePhotoChange}
            />
            <p className="text-xs text-slate-500">画像は1枚のみ、最大5MBです。</p>
            {selectedPhotoFile ? (
              <p className="text-xs text-slate-500">
                選択中: {selectedPhotoFile.name} ({(selectedPhotoFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            ) : null}
            {previewUrl || profile?.photoUrl ? (
              <img
                alt="プロフィール画像プレビュー"
                className="mt-2 h-24 w-24 rounded-full border border-slate-200 object-cover"
                src={previewUrl ?? profile?.photoUrl ?? ""}
              />
            ) : null}
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
