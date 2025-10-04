# Medical Image Diagnostics - Frontend

A modern React-based web application for medical image diagnostics using AI-powered analysis for brain tumors, breast cancer, and stroke detection.

## 🚀 Features

- **Multi-Modal Diagnosis**: Support for brain tumor (MRI), breast cancer (mammograms/histology), and stroke (MRI) analysis
- **AI-Powered Analysis**: Integration with machine learning models for accurate medical diagnosis
- **User Authentication**: Secure JWT-based authentication with registration and password reset
- **Account Management**: Profile updates, password changes, and account deactivation
- **Dashboard Analytics**: Comprehensive dashboard with diagnosis statistics and trends
- **Image Upload & Processing**: Drag-and-drop image upload with real-time processing
- **Diagnosis History**: Complete history of all diagnoses with detailed results
- **Reports & Analytics**: Generate detailed reports and view analytics
- **Real-time Chat**: AI-powered healthcare assistant for medical queries
- **User Settings**: Comprehensive settings for preferences, notifications, and privacy
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**:
  - React Query for server state
  - Zustand for global app state
- **Routing**: React Router v6
- **HTTP Client**: Axios with request/response interceptors
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## 📁 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── layout/        # Layout components
│   │   ├── medical/       # Medical-specific components
│   │   └── chat/          # Chat components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries and services
│   │   ├── apiClient.ts   # Axios client configuration
│   │   ├── authService.ts # Authentication service
│   │   ├── *-service.ts   # API service modules
│   │   └── utils.ts       # Utility functions
│   ├── pages/             # Page components
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript type definitions
│   └── data/              # Static data and dummy data
├── index.html             # Main HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── components.json        # shadcn/ui configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun package manager
- Backend API server running (see server README)

### Installation

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   # Using npm
   npm install

   # Using bun (recommended)
   bun install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the client directory:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

4. **Start the development server**:
   ```bash
   # Using npm
   npm run dev

   # Using bun
   bun run dev
   ```

5. **Open your browser** and navigate to `http://localhost:8080`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000/api/v1` |

### API Integration

The frontend communicates with the backend through RESTful APIs:

- **Authentication**: `/auth/login`, `/auth/register`, `/auth/refresh-token`, `/auth/check-username/{username}`
- **User Management**: `/auth/me`, `/auth/settings`, `/auth/profile`, `/auth/change-password`, `/auth/account`
- **Diagnosis**: `/diagnosis/diagnose`, `/breast-cancer/diagnose`, `/stroke/diagnose`
- **History**: `/diagnosis/`, `/breast-cancer/`, `/stroke/`
- **Statistics**: `/statistics/dashboard`, `/statistics/analytics`

## 🎨 UI Components

### Key Components

- **EnhancedImageUpload**: Drag-and-drop image upload with preview
- **AnalysisDashboard**: Main layout with navigation
- **DiagnosisResult**: Display diagnosis results with confidence scores
- **MedicalChat**: AI-powered healthcare assistant
- **Settings**: Comprehensive user settings and account management
- **Dashboard**: Analytics dashboard with charts and statistics

### Design System

- **Colors**: Medical theme with blue and green accents
- **Typography**: Clean, readable fonts with proper hierarchy
- **Icons**: Lucide React icons for consistency
- **Responsive**: Mobile-first responsive design

## 🔐 Authentication Flow

1. **Registration**: User creates account with email verification and real-time username availability checking
2. **Login**: JWT tokens issued with refresh token rotation
3. **Protected Routes**: Automatic token refresh and route protection
4. **Profile Management**: Update personal information and preferences
5. **Password Management**: Change password with current password verification
6. **Account Settings**: Comprehensive settings for notifications, privacy, and UI preferences
7. **Account Deactivation**: Soft delete account with data anonymization
8. **Logout**: Secure token cleanup

## 📊 Diagnosis Workflow

1. **Image Upload**: User selects diagnosis type and uploads medical image
2. **AI Processing**: Image sent to backend for ML model analysis
3. **Results Display**: Real-time results with confidence scores and segmentation
4. **History Storage**: All diagnoses saved for future reference
5. **Reports**: Generate detailed PDF reports

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Environment Setup

For production deployment, ensure the following environment variables are set:

```env
VITE_API_URL=https://your-api-domain.com/api/v1
```

## 🤝 Contributing

1. Follow the existing code style and TypeScript conventions
2. Use meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the server README for backend setup
- Review the API documentation at `/docs` when the server is running
- Open an issue for bugs or feature requests</content>
<parameter name="filePath">c:\Users\kojoprince\Documents\projects\Medical-Image-Diagnostics\client\README.md