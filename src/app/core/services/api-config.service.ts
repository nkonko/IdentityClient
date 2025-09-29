import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  
  get apiBaseUrl(): string {
    return environment.apiBaseUrl;
  }
  
  getFullUrl(endpoint: string): string {
    // Remover "/" del inicio del endpoint si existe
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Asegurar que la URL base no termine con "/"
    const baseUrl = this.apiBaseUrl.endsWith('/') ? this.apiBaseUrl.slice(0, -1) : this.apiBaseUrl;
    
    return `${baseUrl}/${cleanEndpoint}`;
  }
}
