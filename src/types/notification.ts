export interface Notification {
  id: string
  content: string
  createdAt: string
  isRead: boolean
  receiverId: string
  senderId: string
  title: string
  user: {
    id: string
    name: string
    email: string
  } | null
}