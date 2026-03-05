// Modelos de dominio para Auditoría

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  date: Date;
}
