---
description: Repository Information Overview
alwaysApply: true
---

# IdentityClient Information

## Summary
IdentityClient is an Angular-based web application for user identity management. It provides authentication, user registration, profile management, and administrative user management features. The application is built with Angular 20 and uses NgRx for state management.

## Structure
- **src/app/core**: Core functionality including API clients, services, guards, interceptors, and store
- **src/app/features**: Feature modules (login, register, dashboard, profile, admin)
- **src/app/shared**: Shared components like headers
- **public**: Static assets
- **dist**: Build output directory

## Language & Runtime
**Language**: TypeScript
**Version**: ES2022 target
**Build System**: Angular CLI (v20.2.1)
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- Angular (v20.2.3): Core framework, animations, forms, router
- Angular Material (v20.2.1): UI component library
- NgRx (v20.0.1): State management (store, effects, entity)
- RxJS (v7.8.0): Reactive programming library

**Development Dependencies**:
- Angular CLI (v20.2.1): Command-line tools
- TypeScript (v5.9.2): Programming language
- Jasmine (v5.5.0): Testing framework
- Karma (v6.4.0): Test runner

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm start

# Production build
npm run build
```

## Testing
**Framework**: Jasmine with Karma
**Test Location**: src/**/*.spec.ts
**Naming Convention**: *.spec.ts
**Configuration**: tsconfig.spec.json, angular.json (test section)
**Run Command**:
```bash
npm test
```

## Application Features
- **Authentication**: Login, register, password recovery
- **User Management**: Profile editing, user administration
- **Security**: Route guards for protected routes
- **State Management**: NgRx store for application state
- **API Integration**: HTTP client with interceptors for API communication
