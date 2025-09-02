# Event Booking Backend

Express REST API for user authentication, event management, bookings, and organizer features.

Features:
- User registration and login with JWT
- Protected routes via Bearer token
- Event browsing and details
- Booking creation and cancellation with capacity checks
- Organizer endpoints for creating/updating/deleting events and viewing stats
- Swagger docs served at /docs and OpenAPI JSON at /openapi.json
- Environment-driven configuration via .env

Quick start:
1. Copy .env.example to .env and set JWT_SECRET and others.
2. Install dependencies:
   npm install
3. Start dev server:
   npm run dev
4. Open API docs:
   http://localhost:3001/docs

Security:
- Set a strong JWT_SECRET in the environment.
- CORS origin can be set via CORS_ORIGIN (comma-separated for multiple origins).

Note:
- This implementation uses an in-memory store for simplicity. Replace src/models/store.js with a real database connection for production use.
