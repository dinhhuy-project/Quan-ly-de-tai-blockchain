# Client Application for Blockchain Topic Management

A modern React + TypeScript client interface for the blockchain-based topic management system built with Hyperledger Fabric.

## Features

### For Students (Org1)
- **Register Topic**: Submit new topics with details (title, description, field)
- **Track Progress**: Update progress with stage, percentage, and details
- **View Status**: Check approval status of submitted topics
- **History**: View all changes made to topics

### For Supervisors (Org2)
- **Approve/Reject**: Review and approve or reject student topics
- **Track Progress**: Monitor student project progress
- **Evaluate**: Add evaluations and ratings to approved topics
- **Manage**: View all topics across students

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Components**: Custom components with React Icons
- **Routing**: React Router v6
- **Notifications**: React Hot Toast

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── ui.tsx       # Button, Input, Select, etc.
│   │   ├── Header.tsx   # App header
│   │   ├── Feedback.tsx # Loading, Error, Success
│   │   └── ProtectedRoute.tsx
│   └── topics/          # Topic-specific components
│       ├── TopicCard.tsx
│       ├── RegisterTopicForm.tsx
│       ├── ApproveRejectForm.tsx
│       ├── EvaluationForm.tsx
│       └── UpdateProgressForm.tsx
├── pages/
│   ├── LoginPage.tsx    # Authentication
│   ├── HomePage.tsx     # Dashboard
│   ├── RegisterTopicPage.tsx
│   └── TopicDetailPage.tsx
├── services/
│   └── apiClient.ts     # API communication
├── store/
│   ├── authStore.ts     # Auth state management
│   └── topicStore.ts    # Topics state management
├── types/
│   └── index.ts         # TypeScript interfaces
├── styles/
│   └── index.css        # Global styles
└── App.tsx              # Main app component
```

## Installation

1. Navigate to the client directory:
```bash
cd fabric-samples/chaincode/topic/client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your API server URL:
```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=Quản Lý Đề Tài - Blockchain
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3001`

### Build for Production
```bash
npm run build
```

### Type Checking
```bash
npm run lint
```

## Usage

### Login
1. Enter your ID (e.g., SV001 for students, GV001 for supervisors)
2. Enter your name
3. Select your role (Student or Supervisor)
4. Choose your organization (Org1 for students, Org2 for supervisors)
5. Click Login

### Student Workflow
1. **Home**: View your registered topics
2. **Register New Topic**: Click "+ Đăng Ký Đề Tài Mới"
3. **View Details**: Click "Chi tiết" on any topic
4. **Update Progress**: Go to "Tiến Độ" tab and update your project progress
5. **Check Status**: View approval status in the "Chi Tiết" tab

### Supervisor Workflow
1. **Home**: View pending topics from students
2. **Review Topic**: Click "Chi tiết"
3. **Approve/Reject**: Use the approval form in "Chi Tiết" tab
4. **Evaluate**: After approval, add evaluations using the evaluation form
5. **Track Progress**: Monitor progress in the "Tiến Độ" tab

## API Integration

The client communicates with the REST API server via the `apiClient` service:

- **Base URL**: `http://localhost:3000/api`
- **Organization Header**: `x-org` (org1 or org2)
- **Response Format**: JSON

### Supported Endpoints

**Student Operations**
- `POST /api/topics/register` - Register new topic
- `PUT /api/topics/:topicId/progress` - Update progress
- `GET /api/topics/:topicId/approval-status` - Get approval status
- `GET /api/topics/:topicId/change-history` - Get change history

**Supervisor Operations**
- `PUT /api/topics/:topicId/approve` - Approve topic
- `PUT /api/topics/:topicId/reject` - Reject topic
- `POST /api/topics/:topicId/evaluation` - Add evaluation
- `GET /api/topics/:topicId/progress` - Track progress

**Common Operations**
- `GET /api/topics` - Get all topics
- `GET /api/topics/:topicId` - Get topic details
- `GET /api/topics/student/:studentId` - Get student topics
- `GET /api/topics/supervisor/:supervisorId` - Get supervisor topics
- `GET /api/topics/status/:status` - Filter by status
- `GET /api/topics/field/:field` - Filter by field

## Styling

The application uses Tailwind CSS with custom component utilities:

- `.btn` - Base button style
- `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success` - Button variants
- `.card` - Card component
- `.input-field` - Input/select/textarea styling
- `.badge` - Badge component with variants

## State Management

### Auth Store (Zustand)
Manages user authentication and organization context
- `login(user)` - Authenticate user
- `logout()` - Clear authentication
- `setOrganization(org)` - Switch organization

### Topic Store (Zustand)
Manages topic data and list operations
- `fetchTopics()` - Get all topics
- `fetchTopicsByStudent(studentId)` - Get student topics
- `fetchTopicsBySupervisor(supervisorId)` - Get supervisor topics
- `addTopic(topic)` - Add topic to local state

## Error Handling

The application includes comprehensive error handling:
- API request/response errors with user-friendly messages
- Form validation with detailed error messages
- Loading states during async operations
- Success/error notifications with React Hot Toast

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Apache 2.0
