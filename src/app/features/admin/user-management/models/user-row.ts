export interface UserRow {
  id? : string;
  name?: string;
  email?: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
}
