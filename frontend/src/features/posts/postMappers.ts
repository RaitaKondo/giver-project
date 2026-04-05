import type {
  PostContextResponse,
  PostDetailResponse,
  PostSummaryResponse,
} from "../../api/postApi";
import type { Post } from "../../types/models";

export type ProfileSummary = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  joinedAt: string;
  expertise: string[];
};

export function toFeedPost(post: PostSummaryResponse): Post {
  const profile = toProfileSummary(
    post.authorId,
    post.authorDisplayName,
    post.authorPhotoUrl,
    post.contexts,
  );

  return {
    id: post.id,
    authorId: post.authorId,
    authorName: profile.name,
    authorAvatar: profile.avatar,
    authorRole: profile.expertise[0] ?? "コミュニティメンバー",
    createdAt: formatCreatedAt(post.createdAt),
    title: post.title?.trim() || "無題の投稿",
    action: post.actionTextPreview,
    outcome: post.changeText ?? undefined,
    tags: toTags(post.contexts),
    image: post.thumbnailUrl ?? undefined,
    isPublic: post.visibility === "PUBLIC",
  };
}

export function toDetailPost(post: PostDetailResponse): Post {
  const profile = toProfileSummary(
    post.authorId,
    post.authorDisplayName,
    post.authorPhotoUrl,
    post.contexts,
  );

  return {
    id: post.id,
    authorId: post.authorId,
    authorName: profile.name,
    authorAvatar: profile.avatar,
    authorRole: profile.expertise[0] ?? "コミュニティメンバー",
    createdAt: formatCreatedAt(post.createdAt),
    title: post.title?.trim() || "無題の投稿",
    action: post.actionText,
    hesitation: post.conflictText ?? undefined,
    outcome: post.changeText ?? undefined,
    tags: toTags(post.contexts),
    image: post.images[0]?.url,
    isPublic: post.visibility === "PUBLIC",
  };
}

export function toProfileSummary(
  authorId: string,
  displayName: string | null | undefined,
  photoUrl: string | null | undefined,
  contexts: PostContextResponse[],
): ProfileSummary {
  const expertise = contexts.slice(0, 3).map((context) => context.name);

  return {
    id: authorId,
    name: displayName?.trim() || "ユーザー",
    avatar: photoUrl?.trim() || `https://api.dicebear.com/9.x/shapes/svg?seed=${authorId}`,
    bio: "投稿者プロフィールはアカウント情報をもとに表示しています。",
    joinedAt: "β版",
    expertise: expertise.length > 0 ? expertise : ["コミュニティ投稿"],
  };
}

export function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function toTags(contexts: PostContextResponse[]): string[] {
  const tags = contexts.map((context) => `#${context.name}`);
  return tags.length > 0 ? tags : ["#文脈未設定"];
}
