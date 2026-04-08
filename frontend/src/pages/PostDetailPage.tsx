import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  bookmarkPost,
  fetchUserProfile,
  followUser,
  removeBookmark,
  unfollowUser,
} from "../api/authApi";
import {
  createComment,
  deleteComment,
  fetchComments,
  fetchPostById,
  toggleReaction,
  updateComment,
  type CommentResponse,
  type PostDetailResponse,
  type ReactionSummaryResponse,
  type ReactionType,
} from "../api/postApi";
import { useAuth } from "../features/auth/useAuth";
import {
  formatCreatedAt,
  toProfileSummary,
} from "../features/posts/postMappers";
import { StatePanel } from "../shared/ui/StatePanel";

const REACTION_OPTIONS: Array<{
  type: ReactionType;
  label: string;
  icon: string;
}> = [
  { type: "like", label: "いいね", icon: "thumb_up" },
  { type: "thanks", label: "ありがとう", icon: "favorite" },
  { type: "empathize", label: "共感", icon: "diversity_3" },
  { type: "inspiring", label: "刺激", icon: "bolt" },
];

const URL_PATTERN = /(?:https?:\/\/|www\.)\S+/i;

export function PostDetailPage() {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const { isAuthenticated, profile: currentProfile } = useAuth();
  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [reactionSummary, setReactionSummary] =
    useState<ReactionSummaryResponse | null>(null);
  const [newCommentBody, setNewCommentBody] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentBody, setEditingCommentBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<
    | "follow"
    | "bookmark"
    | "reaction"
    | "comment-create"
    | "comment-update"
    | "comment-delete"
    | null
  >(null);

  useEffect(() => {
    if (!id) {
      setErrorMessage("投稿が見つかりませんでした。");
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const [postResponse, commentsResponse] = await Promise.all([
          fetchPostById(id),
          fetchComments(id),
        ]);
        setPost(postResponse);
        setComments(commentsResponse);
        setReactionSummary({
          reactionCounts: postResponse.reactionCounts,
          myReactionType: postResponse.myReactionType,
          commentCount: postResponse.commentCount,
        });
        setIsFollowing(false);
        setIsBookmarked(false);

        if (
          isAuthenticated &&
          currentProfile &&
          postResponse.authorId !== currentProfile.id
        ) {
          const authorProfile = await fetchUserProfile(postResponse.authorId);
          setIsFollowing(authorProfile.following);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "投稿詳細の取得に失敗しました。",
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [currentProfile, id, isAuthenticated]);

  const profile = useMemo(
    () =>
      post
        ? toProfileSummary(
            post.authorId,
            post.authorDisplayName,
            post.authorPhotoUrl,
            post.contexts,
          )
        : null,
    [post],
  );
  const isOwnPost = Boolean(
    post && currentProfile && post.authorId === currentProfile.id,
  );

  const requireLogin = () => {
    if (isAuthenticated) {
      return true;
    }
    navigate(`/login?redirect=${encodeURIComponent(`/posts/${id}`)}`);
    return false;
  };

  const validateCommentBody = (value: string) => {
    const normalized = value.trim();
    if (!normalized) {
      throw new Error("コメントを入力してください。");
    }
    if (normalized.length > 300) {
      throw new Error("コメントは300文字以内で入力してください。");
    }
    if (URL_PATTERN.test(normalized)) {
      throw new Error("コメントにURLは含められません。");
    }
    return normalized;
  };

  const handleFollowToggle = async () => {
    if (!post || !requireLogin()) {
      return;
    }
    setIsSubmitting("follow");
    try {
      if (isFollowing) {
        await unfollowUser(post.authorId);
        setIsFollowing(false);
      } else {
        await followUser(post.authorId);
        setIsFollowing(true);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "フォローに失敗しました。",
      );
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!post || !requireLogin()) {
      return;
    }
    setIsSubmitting("bookmark");
    try {
      if (isBookmarked) {
        await removeBookmark(post.id);
        setIsBookmarked(false);
      } else {
        await bookmarkPost(post.id);
        setIsBookmarked(true);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "保存に失敗しました。",
      );
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleReactionToggle = async (type: ReactionType) => {
    if (!post || !requireLogin()) {
      return;
    }
    setIsSubmitting("reaction");
    setErrorMessage("");
    try {
      const summary = await toggleReaction(post.id, type);
      setReactionSummary(summary);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "リアクション更新に失敗しました。",
      );
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleCreateComment = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!post || !requireLogin()) {
      return;
    }

    setIsSubmitting("comment-create");
    setErrorMessage("");
    try {
      const normalizedBody = validateCommentBody(newCommentBody);
      const created = await createComment(post.id, normalizedBody);
      setComments((prev) => [...prev, created]);
      setReactionSummary((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev,
      );
      setNewCommentBody("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "コメント投稿に失敗しました。",
      );
    } finally {
      setIsSubmitting(null);
    }
  };

  const startEditComment = (comment: CommentResponse) => {
    setEditingCommentId(comment.id);
    setEditingCommentBody(comment.body);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!requireLogin()) {
      return;
    }
    setIsSubmitting("comment-update");
    setErrorMessage("");
    try {
      const normalizedBody = validateCommentBody(editingCommentBody);
      const updated = await updateComment(commentId, normalizedBody);
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? updated : comment)),
      );
      setEditingCommentId(null);
      setEditingCommentBody("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "コメント更新に失敗しました。",
      );
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!requireLogin()) {
      return;
    }
    setIsSubmitting("comment-delete");
    setErrorMessage("");
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setReactionSummary((prev) =>
        prev
          ? { ...prev, commentCount: Math.max(0, prev.commentCount - 1) }
          : prev,
      );
      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setEditingCommentBody("");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "コメント削除に失敗しました。",
      );
    } finally {
      setIsSubmitting(null);
    }
  };

  const canEditComment = (comment: CommentResponse) =>
    Boolean(currentProfile && comment.userId === currentProfile.id);

  const canDeleteComment = (comment: CommentResponse) =>
    Boolean(
      currentProfile && (comment.userId === currentProfile.id || isOwnPost),
    );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <StatePanel message="投稿を読み込み中です..." />
      </div>
    );
  }

  if (!post || !profile || !reactionSummary) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-14 sm:px-6 lg:px-8">
        <StatePanel
          message={errorMessage || "投稿が見つかりませんでした。"}
          tone="error"
        />
        <Link
          className="inline-flex font-bold text-primary hover:underline"
          to="/feed"
        >
          フィードへ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <Link className="hover:text-primary" to="/">
          ホーム
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link className="hover:text-primary" to="/feed">
          フィード
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">投稿詳細</span>
      </div>

      <div className="mb-10 flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <img
            alt={profile.name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/30 ring-offset-4"
            src={profile.avatar}
          />
          <div>
            <h3 className="text-xl font-bold">{profile.name}</h3>
            <p className="text-sm text-slate-500">
              {profile.expertise[0] ?? "コミュニティメンバー"} ・{" "}
              {formatCreatedAt(post.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isOwnPost ? (
            <button
              className="rounded-lg bg-primary px-6 py-2.5 font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
              disabled={isSubmitting === "follow"}
              type="button"
              onClick={handleFollowToggle}
            >
              {isFollowing ? "フォロー中" : "フォロー"}
            </button>
          ) : null}
          {/* <button
            className="rounded-lg border border-slate-200 p-2.5 transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
            disabled={isSubmitting === "bookmark"}
            type="button"
            onClick={handleBookmarkToggle}
          >
            <span className="material-symbols-outlined">
              {isBookmarked ? "bookmark_added" : "bookmark"}
            </span>
          </button> */}
        </div>
      </div>

      <article className="space-y-10">
        <h1 className="text-4xl font-extrabold leading-[1.2] tracking-tight sm:text-5xl">
          {post.title?.trim() || "無題の投稿"}
        </h1>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
              リアクション
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              コメント {reactionSummary.commentCount}件
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            {REACTION_OPTIONS.map((option) => {
              const active = reactionSummary.myReactionType === option.type;
              const count = reactionSummary.reactionCounts[option.type] ?? 0;
              return (
                <button
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-200 text-slate-700 hover:border-primary/50 hover:text-primary"
                  }`}
                  disabled={isSubmitting === "reaction"}
                  key={option.type}
                  type="button"
                  onClick={() => handleReactionToggle(option.type)}
                >
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">
                      {option.icon}
                    </span>
                    {option.label}
                  </span>
                  <span className="text-xs">{count}</span>
                </button>
              );
            })}
          </div>
        </section>

        {post.contexts.length > 0 ? (
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">
              日常文脈
            </h2>
            <div className="flex flex-wrap gap-2">
              {post.contexts.map((context) => (
                <span
                  className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700"
                  key={`${post.id}-${context.id}`}
                >
                  {context.name}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <span className="material-symbols-outlined text-sm">info</span> 行動
          </h2>
          <p className="text-lg leading-relaxed whitespace-pre-wrap text-slate-700">
            {post.actionText}
          </p>
        </section>

        {post.conflictText ? (
          <section className="rounded-xl border-l-4 border-primary bg-primary/5 p-6 italic text-slate-700">
            <h2 className="mb-3 text-sm font-bold not-italic text-slate-900">
              迷い・葛藤
            </h2>
            <p className="whitespace-pre-wrap">{post.conflictText}</p>
          </section>
        ) : null}

        {post.changeText ? (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="material-symbols-outlined text-sm">
                trending_up
              </span>{" "}
              結果
            </h2>
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-slate-700">
              {post.changeText}
            </p>
          </section>
        ) : null}

        {post.images.length > 0 ? (
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">
              画像
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {post.images.map((image) => (
                <img
                  alt={`${post.title?.trim() || "投稿"} の画像`}
                  className="w-full rounded-2xl object-cover shadow-sm"
                  key={image.id}
                  src={image.url}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-5 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-black">コメント</h2>
          {errorMessage && <StatePanel message={errorMessage} tone="error" />}
          <form className="space-y-3" onSubmit={handleCreateComment}>
            <textarea
              className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-white p-4 text-sm focus:border-primary focus:outline-none"
              maxLength={300}
              placeholder="コメントを入力してください（300文字以内、URL不可）"
              value={newCommentBody}
              onChange={(event) => setNewCommentBody(event.target.value)}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                {newCommentBody.length} / 300
              </p>
              <button
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting === "comment-create"}
                type="submit"
              >
                {isSubmitting === "comment-create"
                  ? "投稿中..."
                  : "コメント投稿"}
              </button>
            </div>
          </form>

          {comments.length === 0 ? (
            <StatePanel message="まだコメントがありません。最初のコメントを投稿してみましょう。" />
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => {
                const isEditing = editingCommentId === comment.id;
                return (
                  <div
                    className="rounded-xl border border-slate-200 bg-white p-4"
                    key={comment.id}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          alt={comment.userDisplayName}
                          className="h-9 w-9 rounded-full object-cover"
                          src={
                            comment.userPhotoUrl?.trim() ||
                            `https://api.dicebear.com/9.x/shapes/svg?seed=${comment.userId}`
                          }
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {comment.userDisplayName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatCreatedAt(comment.createdAt)}
                            {comment.edited ? " ・ 編集済み" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {canEditComment(comment) ? (
                          <button
                            className="text-xs font-semibold text-slate-500 hover:text-primary"
                            type="button"
                            onClick={() => startEditComment(comment)}
                          >
                            編集
                          </button>
                        ) : null}
                        {canDeleteComment(comment) ? (
                          <button
                            className="text-xs font-semibold text-red-500 hover:text-red-600"
                            disabled={isSubmitting === "comment-delete"}
                            type="button"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            削除
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          className="min-h-[90px] w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-primary focus:outline-none"
                          maxLength={300}
                          value={editingCommentBody}
                          onChange={(event) =>
                            setEditingCommentBody(event.target.value)
                          }
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
                            type="button"
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditingCommentBody("");
                            }}
                          >
                            キャンセル
                          </button>
                          <button
                            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                            disabled={isSubmitting === "comment-update"}
                            type="button"
                            onClick={() => handleUpdateComment(comment.id)}
                          >
                            保存
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                        {comment.body}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </article>
    </div>
  );
}
