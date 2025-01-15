export type StorefrontUserRole = 'owner' | 'member' | 'editor';

export interface StorefrontUser {
  id: string;
  user_id: string;
  role: StorefrontUserRole;
  profiles: {
    email: string;
  };
}