# SkillNet Frontend - User Service Integration

## Integration Summary

The frontend has been successfully integrated with the **User & Worker Profile Service** (Port 8081).

### New Services Created

#### 1. **authService.js** (`src/services/authService.js`)
Handles all authentication and user profile management:
- `authService.register()` - Register new HR or Worker accounts
- `authService.login()` - Login with email/password
- `authService.verify()` - Verify user account
- `workerService.getProfile()` - Get worker profile
- `workerService.updateProfile()` - Update worker profile
- `workerService.updateAvailability()` - Toggle worker availability
- `workerService.getAvailableByLocation()` - Search workers by location
- `workerService.getAvailableByProfession()` - Search workers by profession
- `hrService.getProfile()` - Get HR profile
- `hrService.updateProfile()` - Update HR profile

### New Components Created

#### 2. **Login.jsx** (`src/pages/Login.jsx`)
- Email/password login form
- Error handling and loading states
- Redirects to register page
- Stores auth data in localStorage

#### 3. **Register.jsx** (`src/pages/Register.jsx`)
- Role-based registration (HR or WORKER)
- Separate form fields for each role type
- Dynamically populated form based on role selection
- Password encryption validation
- Success redirect to dashboard

#### 4. **WorkerProfile.jsx** (`src/pages/WorkerProfile.jsx`)
- View and edit worker profile information
- **Availability Toggle** - Real-time status update (Available/Unavailable)
- Professional information display
- Contact details management
- Bio/description editing
- Availability status visual indicator

#### 5. **HRProfile.jsx** (`src/pages/HRProfile.jsx`)
- View and edit HR company profile
- Company information management
- HR contact details
- Company description editing
- Profile metadata (created/updated dates)

#### 6. **WorkerSearch.jsx** (`src/pages/WorkerSearch.jsx`)
- Search available workers by location or profession
- Real-time availability status filter
- Worker cards with full profile details
- Contact information display
- Professional background info

### Updated Components

#### 7. **App.jsx** (Complete Redesign)
- Multi-page routing based on authentication state
- Auth state management with localStorage persistence
- Separate page components for:
  - **HomePage** - Public landing page with worker search
  - **WorkerProfilePage** - Worker dashboard
  - **HRDashboardPage** - HR workspace (integrated with vacancy management)
  - **WorkerSearchPage** - Advanced worker search

### API Integration

All services connect to **Port 8081** (User Service):

```
http://localhost:8081/api/auth     - Authentication endpoints
http://localhost:8081/api/workers  - Worker profile endpoints
http://localhost:8081/api/hr       - HR profile endpoints
```

### Features Implemented

✅ **Role-Based Authentication**
- Separate registration for HR and Worker accounts
- Password encryption (BCrypt on backend)
- Role-specific dashboard routing

✅ **Worker Profile Management**
- Complete profile with professional details
- Email verification field
- Years of experience tracking
- Location-based services

✅ **Availability Toggle**
- Real-time availability status switching
- Workers can mark as Available/Unavailable
- Visibility control for search queries

✅ **Worker Search**
- Search by location
- Search by profession
- Real-time availability filtering
- Verified profile display

✅ **HR Features**
- Company profile management
- HR contact information
- Company description
- Integration with vacancy management (Microservice 2)

### Data Flow

```
Frontend (React)
    ↓
authService.js (API Client)
    ↓
Port 8081 (User Service)
    ↓
MySQL Database (skillnet_db)
```

### Authentication Flow

1. **Registration**: User fills role-specific form → POST /api/auth/register → User & Profile created → localStorage auth
2. **Login**: Email/password → POST /api/auth/login → User verified → localStorage auth
3. **Profile Access**: Authenticated user → GET /api/workers/profile/{userId} or /api/hr/profile/{userId}

### Storage

- **Authentication**: localStorage (auth data persists across page reloads)
- **Backend**: MySQL database via JPA/Hibernate

### Prerequisites for Running

1. Start User Service (Port 8081):
   ```
   cd backend/user-service
   mvn spring-boot:run
   ```

2. Start Frontend Dev Server:
   ```
   cd frontend
   npm run dev
   ```

3. MySQL should be running with `skillnet_db` database

### Testing

- Navigate to http://localhost:5173
- Click "Join the network" to register
- Select role (Worker or HR)
- Fill in role-specific details
- Upon success, redirect to role-specific dashboard
- For Workers: View/edit profile and toggle availability
- For HR: View profile and manage job vacancies (Microservice 2)
