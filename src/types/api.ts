export type AppRole = "member" | "admin";

export type AuthUser = {
  id: string;
  email: string | null;
  role: AppRole;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number | null;
};

export type AuthPayload = {
  session: AuthSession;
  user: AuthUser;
};

export type AnnouncementCategory = "announcement" | "release";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  version: string | null;
  pinned: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AnnouncementInput = {
  title: string;
  content: string;
  category: AnnouncementCategory;
  version: string | null;
  pinned: boolean;
  published: boolean;
};
