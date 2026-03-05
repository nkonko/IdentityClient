// Barrel export para clientes de API generados con NSwag
// Los archivos se generan ejecutando: .\generate-api-clients.ps1 desde la raíz del workspace
//
// Para regenerar los clientes:
// 1. Asegúrate de que ambas APIs estén corriendo
// 2. Ejecuta: .\generate-api-clients.ps1

// Identity API - Autenticación, usuarios, roles
export * from './identity-api-client';

// Dashboard API - Subscriptions, Settings, Payments, Dashboard
// Re-export explícito para evitar conflicto de ApiException
export {
  DASHBOARD_API_BASE_URL,
  DashboardClient,
  DashboardMetricsDto,
  DashboardNotificationDto,
  DashboardRecentDto,
  DashboardSummaryDto,
  PaymentWebhookDto,
  PaymentWebhookResponseDto,
  SettingsDto,
  SettingsUpdateDto,
  SubscriptionCreateDto,
  SubscriptionDto,
  SubscriptionUpdateDto,
} from './dashboard-api-client';
export type {
  IDashboardClient,
  IDashboardMetricsDto,
  IDashboardNotificationDto,
  IDashboardRecentDto,
  IDashboardSummaryDto,
  IPaymentWebhookDto,
  IPaymentWebhookResponseDto,
  ISettingsDto,
  ISettingsUpdateDto,
  ISubscriptionCreateDto,
  ISubscriptionDto,
  ISubscriptionUpdateDto,
} from './dashboard-api-client';
