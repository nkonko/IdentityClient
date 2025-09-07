export interface UserRow {
  id? : string;
  name?: string;
  email?: string;
  roles?: string[];
  status: 'Active' | 'Inactive' | 'Blocked';
  lastLogin?: string;
}
