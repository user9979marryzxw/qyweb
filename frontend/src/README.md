# Frontend API Layer

This project includes a decoupled API service layer for frontend-only interactions.

## Enabling/Disabling Mock
- To enable MSW mocks for offline development: Import and start the server in `main.ts`:
  ```typescript
  import { server } from './src/mock/server';
  if (process.env.NODE_ENV === 'development') {
    server.start();
  }