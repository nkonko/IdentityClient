// Barrel export para clientes de API generados con NSwag
// Los archivos se generan ejecutando: .\generate-api-clients.ps1 desde la raíz del workspace
//
// Para regenerar los clientes:
// 1. Asegúrate de que ambas APIs estén corriendo
// 2. Ejecuta: .\generate-api-clients.ps1

// Identity API - Autenticación, usuarios, roles
export * from './identity-api-client';

// Dashboard API - Subscriptions, Settings, Payments, Dashboard
export * from './dashboard-api-client';
