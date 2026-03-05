// Modelos de dominio para Configuración del Sistema

export interface Settings {
  companyName: string;
  supportEmail: string;
}

export interface SettingsUpdate {
  companyName?: string;
  supportEmail?: string;
}
