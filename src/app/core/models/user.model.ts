// Modelos de dominio para Usuarios

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Blocked = 'Blocked',
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: UserStatus;
  position?: string;
  bio?: string;
  lastLogin?: Date;
  profilePictureUrl?: string;
}

export interface UserCreate {
  email: string;
  name: string;
  password: string;
  roles?: string[];
}

export interface UserUpdate {
  email?: string;
  name?: string;
  position?: string;
  bio?: string;
  profilePictureUrl?: string;
  status?: UserStatus;
}

export interface UserPasswordChange {
  currentPassword: string;
  newPassword: string;
}
