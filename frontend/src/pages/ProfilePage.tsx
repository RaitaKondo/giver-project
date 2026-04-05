import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  fetchUserPosts,
  fetchUserProfile,
  followUser,
  unfollowUser,
  type UserProfileResponse,
} from "../api/authApi";
import { PostCard } from "../features/posts/PostCard";
import { useAuth } from "../features/auth/useAuth";
import { toFeedPost } from "../features/posts/postMappers";
import { StatePanel } from "../shared/ui/StatePanel";
import type { Post } from "../types/models";

export function ProfilePage() {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const { isAuthenticated, profile: currentProfile } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmittingFollow, setIsSubmittingFollow] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setIsLoading(false);
        setErrorMessage("ユーザーIDが指定されていません。");
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const [profileResponse, postsResponse] = await Promise.all([
          fetchUserProfile(id),
          fetchUserPosts(id, 0, 50),
        ]);

        setProfile(profileResponse);
        setUserPosts(postsResponse.content.map((post) => toFeedPost(post)));
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "プロフィールの取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  const isMyProfile = useMemo(
    () => Boolean(profile && currentProfile && profile.id === currentProfile.id),
    [currentProfile, profile],
  );
  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    userPosts.forEach((post) => {
      post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [userPosts]);

  const avatarUrl = profile?.photoUrl?.trim() || (profile ? `https://api.dicebear.com/9.x/shapes/svg?seed=${profile.id}` : "");

  const handleFollowToggle = async () => {
    if (!profile) {
      return;
    }
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/users/${profile.id}`)}`);
      return;
    }

    setIsSubmittingFollow(true);
    try {
      if (profile.following) {
        await unfollowUser(profile.id);
        setProfile((prev) => (prev ? { ...prev, following: false } : prev));
      } else {
        await followUser(profile.id);
        setProfile((prev) => (prev ? { ...prev, following: true } : prev));
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "フォロー状態の更新に失敗しました。");
    } finally {
      setIsSubmittingFollow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <StatePanel message="プロフィールを読み込み中です..." />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <StatePanel message={errorMessage} tone="error" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <StatePanel message="プロフィールが見つかりませんでした。" tone="error" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <section className="mb-10 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <img alt={profile.displayName} className="h-28 w-28 rounded-full border-4 border-primary/20 object-cover" src={avatarUrl} />
            <div className="max-w-xl">
              <h1 className="mb-1 text-2xl font-bold tracking-tight">{profile.displayName}</h1>
              <p className="mb-3 text-slate-600">
                {profile.email || "メールアドレスはプロフィールに公開していません。"}
              </p>
              <p className="text-sm text-slate-500">
                参加日: {new Intl.DateTimeFormat("ja-JP").format(new Date(profile.createdAt))}
              </p>
            </div>
          </div>
          <div className="flex w-full gap-3 md:w-auto">
            {isMyProfile ? (
              <>
                <Link className="flex-1 rounded-lg bg-primary px-6 py-2.5 text-center font-semibold text-white transition-colors hover:bg-primary/90 md:flex-none" to="/me/profile">
                  プロフィール編集
                </Link>
                <Link className="flex-1 rounded-lg bg-slate-200 px-6 py-2.5 text-center font-semibold text-slate-900 transition-colors hover:bg-slate-300 md:flex-none" to="/me/dashboard">
                  ダッシュボード
                </Link>
              </>
            ) : (
              <button
                className="flex-1 rounded-lg bg-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60 md:flex-none"
                disabled={isSubmittingFollow}
                type="button"
                onClick={handleFollowToggle}
              >
                {profile.following ? "フォロー中" : "フォロー"}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-4 text-lg font-bold">アカウント情報</h3>
        <div className="flex flex-wrap gap-2">
          {profile.email ? (
            <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700">
              {profile.email}
            </span>
          ) : null}
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">総投稿数</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{userPosts.length}</p>
          <p className="mt-2 text-sm text-slate-500">このユーザーの公開投稿数です。</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">使用したタグ</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {topTags.length > 0 ? (
              topTags.map(([tag, count]) => (
                <span
                  className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                  key={tag}
                >
                  {tag} ({count})
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">まだタグ付きの投稿はありません。</span>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-bold">公開履歴</h3>
        {userPosts.length > 0 ? (
          userPosts.map((post) => <PostCard key={`profile-${post.id}`} post={post} />)
        ) : (
          <StatePanel message="このユーザーの公開投稿はまだありません。" />
        )}
      </section>
    </div>
  );
}
