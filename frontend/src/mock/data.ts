import type { Post, User } from '../types/models'

export const users: User[] = [
  {
    id: 'alex',
    name: 'アレックス・リベラ',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    bio: 'キャリア支援とピアメンタリングを中心に、地域で学び合いの場づくりをしています。',
    expertise: ['ピアメンタリング', 'キャリア相談', '学習支援', 'コミュニティ運営'],
    joinedAt: '2022年1月',
  },
  {
    id: 'mika',
    name: '三上 美香',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80',
    bio: '地域食堂と子ども向け読書会を運営。小さな行動の積み重ねを大切にしています。',
    expertise: ['食支援', '読書支援', '地域連携'],
    joinedAt: '2023年4月',
  },
  {
    id: 'kenji',
    name: '田中 健司',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
    bio: '環境活動家。ゼロウェイストの取り組みを各地で実践・共有しています。',
    expertise: ['環境保全', 'ワークショップ', '再利用'],
    joinedAt: '2021年10月',
  },
]

export const posts: Post[] = [
  {
    id: '1',
    authorId: 'mika',
    authorName: '三上 美香',
    authorAvatar: users[1].avatar,
    authorRole: '教育メンター',
    createdAt: '2時間前',
    title: '移動式ミニ図書館を町内に設置しました',
    action:
      '寄付された本を防水ボックスに整理し、3つの集合住宅に巡回配置。週ごとに内容を入れ替えました。',
    hesitation:
      '本が傷まないか、管理が続くか不安でした。最初は協力者が集まるかも読めませんでした。',
    outcome:
      '1か月で延べ120冊が貸し出され、親子の読書会が自然発生。運営ボランティアも5名増えました。',
    lesson:
      '最初から完璧を目指さず、回る仕組みを先に作ると継続しやすいと実感しました。',
    tags: ['#教育', '#地域', '#継続'],
    isPublic: true,
  },
  {
    id: '2',
    authorId: 'kenji',
    authorName: '田中 健司',
    authorAvatar: users[2].avatar,
    authorRole: '環境アドボケイト',
    createdAt: '5時間前',
    title: '近所向けコンポスト講座を開催',
    action:
      '家庭用コンポストの使い方を説明し、参加者10世帯にスターターキットを配布しました。',
    hesitation:
      '難しそうという印象を持たれないか心配で、講座内容をかなり噛み砕いて準備しました。',
    outcome:
      '2週間で可燃ごみの量が目に見えて減り、参加者同士で運用ノウハウを共有する流れが生まれました。',
    lesson: '導入時は手順を3つに絞ると、実践のハードルを大きく下げられます。',
    tags: ['#環境', '#ワークショップ'],
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
    isPublic: true,
  },
  {
    id: '3',
    authorId: 'alex',
    authorName: 'アレックス・リベラ',
    authorAvatar: users[0].avatar,
    authorRole: 'キャリアサポーター',
    createdAt: '昨日',
    title: '初めての転職準備を1on1でサポート',
    action:
      '職務経歴書の構成を一緒に見直し、面接で伝える実績の言語化を2回に分けて支援しました。',
    hesitation:
      '相手の自己評価を下げずに改善点を伝える難しさがあり、言葉選びに時間を使いました。',
    outcome: '応募書類の通過率が改善し、本人の不安が軽くなったとフィードバックをもらえました。',
    lesson: '助言より先に、相手の意図を確認する時間を取ると対話がスムーズになります。',
    tags: ['#キャリア', '#メンタリング'],
    isPublic: true,
  },
]

export const getPostById = (id: string) => posts.find((post) => post.id === id)
export const getUserById = (id: string) => users.find((user) => user.id === id)
