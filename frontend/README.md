# Frontend - Platformă Civică

React frontend for the civic platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.tsx
│   │   ├── PostCard.tsx
│   │   ├── ReplyForm.tsx
│   │   └── ReplyList.tsx
│   ├── contexts/        # React Context providers
│   │   └── AuthContext.tsx
│   ├── pages/           # Page components
│   │   ├── AdminDashboard.tsx
│   │   ├── CreatePost.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── PostDetail.tsx
│   │   ├── Posts.tsx
│   │   ├── Profile.tsx
│   │   └── Register.tsx
│   ├── services/        # API client
│   │   └── api.ts
│   ├── styles/          # Global styles
│   │   └── global.css
│   ├── App.tsx          # Main app with routing
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design System

### Colors
- **Primary:** `#2563eb` (Blue)
- **Success:** `#16a34a` (Green)
- **Danger:** `#dc2626` (Red)
- **Warning:** `#ea580c` (Orange)
- **Background:** `#ffffff`, `#f8fafc`, `#f1f5f9`
- **Text:** `#0f172a`, `#475569`, `#94a3b8`

### Typography
- **Primary Font:** System font stack
- **Headings:** 600 weight
- **Body:** 1.6 line-height

### Components
- Buttons (primary, secondary, outline, danger, success)
- Form inputs with validation
- Cards with hover effects
- Alerts (success, error, warning, info)
- Badges
- Loading spinner

## 🛣️ Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/posts` - Public posts list
- `/posts/:id` - Post detail page
- `/profile` - User profile (protected)
- `/create-post` - Create new post (protected)
- `/admin` - Admin dashboard (admin only)

## 🔧 Configuration

### Vite Proxy

The frontend is configured to proxy API requests to the backend:

```typescript
// vite.config.ts
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5003',
      changeOrigin: true,
    },
  },
}
```

## 🔐 Authentication

Authentication is handled via JWT tokens stored in `localStorage`:

```typescript
// Login
const { token, user } = await authApi.login({ email, password });
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

The `AuthContext` provides:
- `user` - Current user object
- `loading` - Loading state
- `login(email, password)` - Login function
- `register(...)` - Registration function
- `logout()` - Logout function
- `updateUser(user)` - Update user data

## 📡 API Integration

All API calls are centralized in `src/services/api.ts`:

```typescript
import { authApi, userApi, postsApi, repliesApi, adminApi } from './services/api';

// Example: Get posts
const response = await postsApi.getPosts({ county: 'Arad' });
const posts = response.data.posts;

// Example: Create post
const formData = new FormData();
formData.append('body', 'Post content');
await postsApi.createPost(formData);
```

## 🎭 Features

### Public Features
- View all approved posts
- Filter posts by county and hospital
- View post details with images and replies
- Read replies

### Authenticated Features
- Create account
- Login/Logout
- Edit profile
- Create posts with images
- Add replies to posts
- Choose anonymity per post

### Admin Features
- View pending posts
- Approve or reject posts
- Full post management

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Desktop:** > 768px
- **Tablet:** 640px - 768px
- **Mobile:** < 640px

## 🧪 Development

### Prerequisites
- Node.js v18+
- Backend API running on port 5003

### Running Locally

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## 📦 Dependencies

### Production
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Client-side routing
- `axios` - HTTP client

### Development
- `vite` - Build tool
- `typescript` - Type checking
- `@vitejs/plugin-react` - React plugin for Vite
- `@types/*` - TypeScript type definitions

## 🎨 Styling

- **Global Styles:** `src/styles/global.css`
- **Component Styles:** Co-located CSS files (e.g., `Header.css`)
- **CSS Variables:** Design tokens in `:root`
- **No Framework:** Pure CSS with modern features

## 🔍 Key Components

### AuthContext
Manages authentication state across the app.

### Header
Navigation bar with conditional rendering based on auth state.

### PostCard
Reusable card component for displaying post previews.

### ReplyForm
Form for adding replies with character counter and anonymity option.

### ReplyList
Displays list of replies with author and timestamp.

## 📝 Best Practices

- TypeScript for type safety
- React Context for state management
- Centralized API client
- Protected routes with authentication
- Loading and error states
- Form validation
- Responsive design
- Accessible forms with labels
