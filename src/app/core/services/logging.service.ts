import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private readonly isProduction = this.checkProduction();

  private checkProduction(): boolean {
    // En una aplicación real, usarías environment.production
    // pero para esta demo usamos la detección de hostname
    return window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1' &&
           !window.location.hostname.includes('dev');
  }

  /**
   * Log de información - solo se muestra en desarrollo
   */
  log(component: string, message: string, ...args: any[]): void {
    if (!this.isProduction) {
      console.log(`[${component}] ${message}`, ...args);
    }
  }

  /**
   * Log de advertencias - se muestra siempre
   */
  warn(component: string, message: string, ...args: any[]): void {
    console.warn(`[${component}] ${message}`, ...args);
  }

  /**
   * Log de errores - se muestra siempre
   */
  error(component: string, message: string, ...args: any[]): void {
    console.error(`[${component}] ${message}`, ...args);
  }

  /**
   * Log de debug - solo en desarrollo y con flag adicional
   */
  debug(component: string, message: string, ...args: any[]): void {
    if (!this.isProduction && this.isDebugEnabled()) {
      console.debug(`[${component}] DEBUG: ${message}`, ...args);
    }
  }

  /**
   * Verifica si el debug está habilitado (localStorage flag)
   */
  private isDebugEnabled(): boolean {
    return localStorage.getItem('debug') === 'true';
  }

  /**
   * Habilitar/deshabilitar debug en runtime
   */
  setDebug(enabled: boolean): void {
    if (enabled) {
      localStorage.setItem('debug', 'true');
    } else {
      localStorage.removeItem('debug');
    }
  }
}