# Backend API - Platformă Civică

REST API pentru platforma civică de documentare experiențe medicale.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed

# Development
npm run dev

# Production
npm run build
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database connection
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, upload, etc.
│   ├── migrations/      # SQL migrations
│   ├── routes/          # API routes
│   ├── scripts/         # Migration and seed scripts
│   ├── types/           # TypeScript type definitions
│   └── server.ts        # Express app entry
├── uploads/             # Uploaded images (auto-created)
├── package.json
├── tsconfig.json
└── .env.example
```

## 🗄️ Database Schema

### users
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `name` (VARCHAR, nullable)
- `county` (VARCHAR, nullable)
- `show_real_name` (BOOLEAN, default: false)
- `is_admin` (BOOLEAN, default: false)
- `created_at` (TIMESTAMP)

### posts
- `id` (SERIAL PRIMARY KEY)
- `author_id` (INTEGER, FK to users)
- `title` (VARCHAR, nullable)
- `body` (TEXT)
- `unit_name` (VARCHAR)
- `locality` (VARCHAR)
- `county` (VARCHAR)
- `incident_date` (DATE, nullable)
- `status` (VARCHAR: 'pending', 'approved', 'rejected')
- `display_name` (VARCHAR)
- `created_at` (TIMESTAMP)

### attachments
- `id` (SERIAL PRIMARY KEY)
- `post_id` (INTEGER, FK to posts)
- `file_path` (VARCHAR)
- `created_at` (TIMESTAMP)

### replies
- `id` (SERIAL PRIMARY KEY)
- `post_id` (INTEGER, FK to posts)
- `author_id` (INTEGER, FK to users)
- `body` (VARCHAR, max 500)
- `display_name` (VARCHAR)
- `created_at` (TIMESTAMP)

## 📡 API Endpoints

### Authentication

#### POST `/api/auth/register`
Register new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "county": "Arad"
}
```

**Response:**
```json
{
  "message": "Cont creat cu succes.",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "county": "Arad",
    "showRealName": false,
    "isAdmin": false,
    "createdAt": "2025-12-07T10:00:00.000Z"
  }
}
```

#### POST `/api/auth/login`
Login user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Get current user (requires auth)

**Headers:**
```
Authorization: Bearer <token>
```

### User Profile

#### GET `/api/users/profile`
Get user profile (requires auth)

#### PUT `/api/users/profile`
Update user profile (requires auth)

**Request Body:**
```json
{
  "name": "Updated Name",
  "county": "Cluj",
  "showRealName": true
}
```

### Posts

#### POST `/api/posts`
Create new post (requires auth)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `title` (optional)
- `body` (required, min 30 chars)
- `unitName` (required)
- `locality` (required)
- `county` (required)
- `incidentDate` (optional, YYYY-MM-DD)
- `useRealName` (boolean)
- `images` (files, optional, max 5MB each)

#### GET `/api/posts`
Get public posts

**Query Parameters:**
- `county` (optional)
- `unitName` (optional, partial match)
- `limit` (optional, default: 20)
- `offset` (optional, default: 0)

#### GET `/api/posts/:id`
Get post by ID

### Replies

#### POST `/api/posts/:id/replies`
Add reply to post (requires auth)

**Request Body:**
```json
{
  "body": "Comment text (max 500 chars)",
  "useRealName": false
}
```

#### GET `/api/posts/:id/replies`
Get replies for post

### Admin

#### GET `/api/admin/posts/pending`
Get pending posts (admin only)

#### PUT `/api/admin/posts/:id/approve`
Approve post (admin only)

#### PUT `/api/admin/posts/:id/reject`
Reject post (admin only)

## 🔧 Environment Variables

```env
PORT=5003
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=civic_platform
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

## 🛡️ Security

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Admin authorization middleware
- File upload validation (type and size)
- SQL injection prevention with parameterized queries

## 📦 Dependencies

### Production
- `express` - Web framework
- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `multer` - File upload handling
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Development
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution
- `ts-node-dev` - Development server with auto-reload
- `@types/*` - TypeScript type definitions

## 🧪 Testing

```bash
# Start development server
npm run dev

# Test health endpoint
curl http://localhost:5003/health

# Test registration
curl -X POST http://localhost:5003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with demo data
