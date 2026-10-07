export type AdminRole = "owner" | "director" | "manager";

export interface AdminInfo {
  role: AdminRole;
  bidang: string | null;
  displayName: string;
  username: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: AdminRole;
  bidang: string | null;
  displayName: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: AdminRole;
  bidang: string | null;
  displayName: string | null;
}
