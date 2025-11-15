# Client Setup Guide

## Prerequisites

- Node.js 16+ and npm 8+
- API server running on `http://localhost:3000`

## Installation Steps

### 1. Install Dependencies

```bash
cd fabric-samples/chaincode/topic/client
npm install
```

### 2. Environment Configuration

Create a `.env` file in the client directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=Quản Lý Đề Tài - Blockchain
```

### 3. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3001` with hot module replacement enabled.

### 4. Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Development Workflow

### TypeScript Type Checking

```bash
npm run lint
```

### File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── ui.tsx                 # Reusable UI components
│   │   ├── Header.tsx             # Application header
│   │   ├── Feedback.tsx           # Loading/Error/Success states
│   │   └── ProtectedRoute.tsx     # Route protection wrapper
│   └── topics/
│       ├── TopicCard.tsx          # Topic card display component
│       ├── RegisterTopicForm.tsx  # Registration form
│       ├── ApproveRejectForm.tsx  # Approval decision form
│       ├── EvaluationForm.tsx     # Evaluation submission form
│       └── UpdateProgressForm.tsx # Progress update form
├── pages/
│   ├── LoginPage.tsx              # Authentication page
│   ├── HomePage.tsx               # Dashboard/topic list
│   ├── RegisterTopicPage.tsx      # Topic registration page
│   └── TopicDetailPage.tsx        # Topic detail view
├── services/
│   └── apiClient.ts               # API client with interceptors
├── store/
│   ├── authStore.ts               # Authentication state (Zustand)
│   └── topicStore.ts              # Topic management state (Zustand)
├── types/
│   └── index.ts                   # TypeScript interfaces
├── styles/
│   └── index.css                  # Global and utility styles
├── App.tsx                        # Main app component with routing
└── main.tsx                       # React entry point
```

## Key Features Implementation

### Authentication Flow

1. User logs in at `/login` page
2. Credentials stored in Zustand auth store
3. User stored in localStorage for persistence
4. ProtectedRoute component guards routes
5. Organization context passed to API client

### Student Workflow

**Register Topic**
- Navigate to `/topics/register`
- Fill in topic details
- Submit to API via `apiClient.registerTopic()`
- Topic added to local store on success

**Track Progress**
- View topic at `/topics/:topicId`
- Go to "Tiến Độ" tab
- Update progress with stage and percentage
- Changes submitted via `apiClient.updateProgress()`

**View Status**
- Access topic detail page
- View approval status from blockchain
- See complete change history

### Supervisor Workflow

**Review Topics**
- Supervisor dashboard shows pending topics
- Click topic card to view details
- See topic description and metadata

**Approve/Reject**
- Use ApproveRejectForm component
- Add comments or rejection reasons
- Submit via `apiClient.approveTopic()` or `apiClient.rejectTopic()`

**Evaluate**
- After topic approval, add evaluation
- Submit rating (1-10) and comments
- Via `apiClient.addEvaluation()`

## API Integration Details

### Error Handling

The API client includes automatic error handling:

```typescript
- Request interceptor: Adds organization header
- Response interceptor: Catches and logs errors
- Retry logic: User can retry failed requests
```

### Organization Context

The client supports two organizations:

- **Org1**: Students (student role)
- **Org2**: Supervisors (supervisor role)

Organization set via login form and passed to all API calls via `x-org` header.

## Styling System

### Tailwind CSS Classes

**Components**
- `.card` - White box with shadow
- `.btn` - Base button style
- `.input-field` - Form input styling
- `.badge` - Status badge

**Color Variants**
- Primary (Blue): `btn-primary`, `badge-info`
- Success (Green): `btn-success`, `badge-success`
- Warning (Yellow): `badge-warning`
- Danger (Red): `btn-danger`, `badge-danger`

### Custom Utilities

Defined in `src/styles/index.css`:

```css
.btn-primary, .btn-secondary, .btn-danger, .btn-success
.badge-success, .badge-warning, .badge-danger, .badge-info
.input-field
.card
```

## State Management

### Zustand Stores

**authStore.ts**
- Manages user login/logout
- Stores user in localStorage
- Provides organization context

**topicStore.ts**
- Caches topic list data
- Handles loading/error states
- Provides CRUD operations

## Debugging

### Browser DevTools

1. Open Chrome/Firefox DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Use React DevTools extension for state inspection

### Common Issues

**API Connection Failed**
- Ensure API server is running on port 3000
- Check VITE_API_BASE_URL in .env file
- Verify CORS is enabled in API server

**TypeScript Errors**
- Run `npm run lint` to check for issues
- Ensure all dependencies are installed
- Check tsconfig.json aliases

**Styling Issues**
- Tailwind CSS may not compile CSS properly
- Run `npm run build` to verify production build
- Check tailwind.config.js configuration

## Performance Optimization

### Code Splitting

Vite automatically splits chunks for:
- Each page component
- Shared vendor libraries
- CSS files

### Image Optimization

Current app doesn't use images, but for future:
- Use WebP format when possible
- Lazy load images
- Use responsive images with srcset

## Deployment

### Environment-Specific Builds

Create separate `.env` files:

```
.env.development    # Local development
.env.staging        # Staging environment
.env.production     # Production
```

Build for specific environment:

```bash
# Development
npm run dev

# Production
npm run build
```

### Hosting Options

1. **Static Hosting**: GitHub Pages, Netlify, Vercel
2. **Docker**: Build Docker image with Node
3. **Kubernetes**: Deploy as containerized service

### Docker Example

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "preview"]
```

## Troubleshooting

### Hot Module Replacement (HMR) Issues

If changes don't reflect in browser:

1. Check browser console for errors
2. Hard refresh (Ctrl+Shift+R)
3. Clear browser cache
4. Restart dev server: `npm run dev`

### Module Not Found Errors

Verify path aliases in tsconfig.json:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

### Port Already in Use

Change Vite port in vite.config.ts:

```typescript
server: {
  port: 3001,  // Change to another port
}
```

## Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Zustand Guide](https://github.com/pmndrs/zustand)

## Support

For issues or questions:

1. Check existing error messages
2. Review browser console
3. Check API server logs
4. Verify environment configuration
