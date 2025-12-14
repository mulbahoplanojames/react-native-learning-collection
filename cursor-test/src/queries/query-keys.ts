/**
 * React Query Key Factory
 * Centralized query keys for consistent caching
 */

export const queryKeys = {
  // Auth
  auth: {
    user: ["auth", "user"] as const,
    session: ["auth", "session"] as const,
  },

  // Users
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", id] as const,
    profile: (id: string) => ["users", id, "profile"] as const,
  },

  // Appointments
  appointments: {
    all: ["appointments"] as const,
    lists: () => ["appointments", "list"] as const,
    list: (filters: Record<string, unknown>) =>
      ["appointments", "list", filters] as const,
    detail: (id: string) => ["appointments", id] as const,
    upcoming: ["appointments", "upcoming"] as const,
    past: ["appointments", "past"] as const,
  },

  // Health Profile
  healthProfile: {
    all: ["health-profile"] as const,
    detail: (userId: string) => ["health-profile", userId] as const,
  },

  // Providers
  providers: {
    all: ["providers"] as const,
    list: (filters: Record<string, unknown>) =>
      ["providers", "list", filters] as const,
    detail: (id: string) => ["providers", id] as const,
    profile: (id: string) => ["providers", id, "profile"] as const,
  },

  // Messages
  messages: {
    all: ["messages"] as const,
    chats: ["messages", "chats"] as const,
    chat: (chatId: string) => ["messages", "chat", chatId] as const,
    unread: ["messages", "unread"] as const,
  },

  // Health Records
  healthRecords: {
    all: ["health-records"] as const,
    list: (userId: string) => ["health-records", userId] as const,
    detail: (id: string) => ["health-records", id] as const,
  },

  // Community
  community: {
    all: ["community"] as const,
    circles: (filters?: Record<string, unknown>) =>
      ["community", "circles", filters || {}] as const,
    circle: (id: string) => ["community", "circle", id] as const,
    userCircles: ["community", "user-circles"] as const,
    posts: (circleId: string) =>
      ["community", "posts", circleId] as const,
    post: (id: string) => ["community", "post", id] as const,
  },

  // Wellness
  wellness: {
    all: ["wellness"] as const,
    content: ["wellness", "content"] as const,
    contentList: (filters: Record<string, unknown>) =>
      ["wellness", "content", filters] as const,
    detail: (id: string) => ["wellness", "content", id] as const,
  },

  // Notifications
  notifications: {
    all: ["notifications"] as const,
    list: (userId: string) => ["notifications", userId] as const,
    unread: (userId: string) => ["notifications", userId, "unread"] as const,
  },
} as const;
