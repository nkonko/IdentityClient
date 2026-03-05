// Modelos de dominio para Roles y Permisos

export interface Permission {
  name: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface RoleCreate {
  name: string;
}

export interface RoleUpdate {
  name: string;
}
