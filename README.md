# Identity Client - Angular Frontend

Frontend Angular para sistema de identidad con integración al backend .NET.

## Versiones

- **Angular**: 20.2.3
- **Node**: 22+ (recomendado)
- **Proyecto**: identity-client
- **Salida del build**: `dist/identity-client/`

## Configuración de Environment

### Development
- **API URL**: `http://localhost:5000`
- **Environment**: `src/environments/environment.development.ts`

### Production  
- **API URL**: `/api` (proxy reverso)
- **Environment**: `src/environments/environment.ts`

## Instalación y Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
# El frontend estará disponible en http://localhost:4200
```

## Docker - Desarrollo con Hot Reload

```bash
# Construir imagen de desarrollo
docker build -f Dockerfile.dev -t identity-client-dev .

# Ejecutar contenedor de desarrollo
docker run -p 4200:4200 identity-client-dev

# El frontend estará disponible en http://localhost:4200 con hot reload habilitado
```

## Docker - Producción

```bash
# Construir imagen de producción
docker build -t identity-client .

# Ejecutar contenedor de producción 
docker run -p 8081:80 identity-client

# El frontend estará disponible en http://localhost:8081
```

## Integración con Backend

El frontend está configurado para trabajar con un backend .NET que debe estar ejecutándose en:

- **Desarrollo local**: `http://localhost:5000`
- **Docker**: hostname interno `api:8080`

### Proxy Reverso

El contenedor de producción incluye un nginx configurado con proxy reverso que:
- Sirve los archivos estáticos de Angular en `/`
- Redirige las llamadas de `/api/*` hacia `http://api:8080/api/`

## Scripts Disponibles

```bash
npm run start           # Desarrollo local (ng serve)
npm run start:docker    # Desarrollo en Docker (host 0.0.0.0, polling habilitado)
npm run build           # Build básico
npm run build:prod      # Build de producción optimizado
npm run test            # Ejecutar tests
npm run watch           # Build con watch para desarrollo
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── api/
│   │   │   └── api-client.ts          # Cliente API generado (NSwag)
│   │   ├── services/
│   │   │   └── api-config.service.ts  # Servicio de configuración de API
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts    # Interceptor de autenticación
│   │   └── store/                     # Estado global (NgRx)
│   ├── features/                      # Funcionalidades por módulo
│   └── shared/                        # Componentes compartidos
├── environments/
│   ├── environment.ts                 # Configuración producción
│   └── environment.development.ts     # Configuración desarrollo
```

## Configuración de API

El proyecto utiliza un cliente API generado con NSwag que se configura mediante:

1. **Environment variables**: Configuración de `apiBaseUrl`
2. **Dependency Injection**: Provider de `API_BASE_URL` en `app.config.ts`
3. **Servicio centralizado**: `ApiConfigService` para manejo uniforme de URLs

## Docker Compose (Ejemplo)

```yaml
version: '3.8'
services:
  identity-client:
    build: .
    ports:
      - "8081:80"
    depends_on:
      - api
      
  api:
    image: identity-api:latest
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
```

## Desarrollo

### Hot Reload en Docker
El `Dockerfile.dev` está configurado con:
- `CHOKIDAR_USEPOLLING=true` para file watching en contenedores
- `--host 0.0.0.0` para acceso externo
- `--poll 2000` para polling de cambios

### Arquitectura
- **State Management**: NgRx para manejo del estado global
- **HTTP Client**: Cliente generado automáticamente con NSwag
- **Autenticación**: JWT con interceptor automático
- **UI**: Angular Material para componentes de interfaz

## Troubleshooting

### CORS Issues
Si tienes problemas de CORS en desarrollo, asegúrate de que:
1. El backend .NET tenga configurado CORS correctamente
2. La URL en `environment.development.ts` sea correcta

### Docker Issues
- Verificar que el polling esté habilitado: `CHOKIDAR_USEPOLLING=true`
- Comprobar conectividad entre contenedores con `docker network ls`

### Build Issues
- Limpiar node_modules: `rm -rf node_modules && npm install`
- Verificar compatibilidad de versiones de Angular CLI: `ng version`
