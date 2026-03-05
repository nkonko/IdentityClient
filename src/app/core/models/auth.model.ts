// Modelos de dominio para Autenticación

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiration: Date;
}

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}
