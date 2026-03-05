// Modelos de dominio para Dashboard

export interface DashboardSummary {
  totalUsers: number;
  totalRoles: number;
  totalSubscriptions: number;
}

export interface DashboardMetrics {
  activeUsers: number;
  newUsersThisMonth: number;
  revenueThisMonth: number;
}

export interface DashboardRecent {
  recentActivities: string[];
}

export interface DashboardNotification {
  message: string;
  date: Date;
}
