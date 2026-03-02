export type Post = {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  authorRole: string
  createdAt: string
  title: string
  action: string
  hesitation: string
  outcome: string
  lesson: string
  tags: string[]
  image?: string
  isPublic: boolean
}

export type User = {
  id: string
  name: string
  avatar: string
  bio: string
  expertise: string[]
  joinedAt: string
}
