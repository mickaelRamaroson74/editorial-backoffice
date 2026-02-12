# Express + TypeScript + SQLite + Prisma Backend

A production-ready REST API boilerplate with full CRUD, input validation, and error handling.

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express 4 |
| ORM | Prisma 5 |
| Database | SQLite |
| Validation | Zod |
| Security | Helmet + CORS |

## Project Structure

```
src/
├── index.ts              # Entry point & graceful shutdown
├── app.ts                # Express app (middleware + routes)
├── lib/
│   └── prisma.ts         # Prisma client singleton
├── controllers/
│   ├── userController.ts
│   └── postController.ts
├── routes/
│   ├── userRoutes.ts
│   └── postRoutes.ts
├── middleware/
│   ├── errorHandler.ts   # Global error handler + AppError class
│   └── validate.ts       # Zod validation middleware factory
└── types/
    └── index.ts          # Zod schemas + inferred types + API helpers

prisma/
├── schema.prisma         # DB schema (User + Post)
└── seed.ts               # Seed data
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env if needed (defaults work out of the box)
```

### 3. Set up the database
```bash
# Push schema to SQLite (dev)
npm run db:push

# Or use migrations (recommended for production)
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Start the server
```bash
# Development (hot reload)
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Health
```
GET /health
```

### Users

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List all users (with posts) |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PATCH | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user (cascades posts) |

### Posts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/posts` | List posts (`?published=true` to filter) |
| GET | `/api/posts/:id` | Get post by ID |
| POST | `/api/posts` | Create post |
| PATCH | `/api/posts/:id` | Update post |
| PATCH | `/api/posts/:id/publish` | Toggle published status |
| DELETE | `/api/posts/:id` | Delete post |

## Example Requests

### Create a user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "name": "Alice"}'
```

### Create a post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello World", "content": "My first post", "authorId": 1}'
```

### Get published posts only
```bash
curl http://localhost:3000/api/posts?published=true
```

### Publish a post
```bash
curl -X PATCH http://localhost:3000/api/posts/1/publish
```

## Response Format

All responses follow a consistent envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["email: Invalid email address"]
}
```

## Database Management

```bash
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:migrate   # Create and apply a new migration
```
