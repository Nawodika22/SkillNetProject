# SkillNet - Quick Start Guide

## Prerequisites
- Node.js & npm (for frontend)
- Java 21 (for backend)
- MySQL 8.0+
- Maven (for building Java services)

## Setup Instructions

### 1. Database Setup
```bash
# Create database (auto-created by Spring Boot, but ensure MySQL is running)
mysql -u root
# Database will be created automatically at: jdbc:mysql://localhost:3306/skillnet_db
```

### 2. Backend Services

#### User Service (Microservice 1) - Port 8081
```bash
cd backend/user-service
mvn clean install
mvn spring-boot:run
```
✓ Runs on http://localhost:8081
✓ Endpoints: /api/auth, /api/workers, /api/hr

#### Vacancy Service (Microservice 2) - Port 8082
```bash
cd backend/vacancy-service
mvn clean install
mvn spring-boot:run
```
✓ Runs on http://localhost:8082
✓ Endpoints: /api/vacancies

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```
✓ Runs on http://localhost:5173
✓ Auto-opens in browser

---

## Testing the Integration

### 1. Register as a Worker
1. Open http://localhost:5173
2. Click "Join the network" → Select "Worker"
3. Fill in details:
   - Email: worker@example.com
   - Password: password123
   - First Name: John
   - Last Name: Doe
   - Profession: Electrician
   - Years of Experience: 5
   - Location: Colombo
   - Phone: +94-123-456-789
4. Click "Create Account"

### 2. Worker Dashboard
- Edit profile information
- **Toggle Availability** (green = available, gray = unavailable)
- View profile creation date
- Update professional details

### 3. Register as HR
1. Click "Join the network" → Select "HR/Company"
2. Fill in details:
   - Email: hr@company.com
   - Password: password123
   - Company Name: Tech Company Ltd
   - Company Email: jobs@techcompany.com
   - HR Contact Name: Jane Smith
   - Location: Colombo
   - Phone: +94-111-222-333
3. Click "Create Account"

### 4. HR Dashboard
- View/edit company profile
- Create job vacancies (Microservice 2 integration)
- View all posted vacancies
- Delete vacancies
- Hire workers

### 5. Search Workers
- Click "Discover talent" from homepage
- Browse available workers
- Search by profession or location
- View worker profiles with availability status

---

## API Endpoints

### Authentication (Port 8081)
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/verify/{userId}
```

### Worker Profiles (Port 8081)
```
GET    /api/workers/profile/{userId}
PUT    /api/workers/profile/{userId}
PUT    /api/workers/{userId}/availability
GET    /api/workers/available/location/{location}
GET    /api/workers/available/profession/{profession}
GET    /api/workers/all
```

### HR Profiles (Port 8081)
```
GET    /api/hr/profile/{userId}
PUT    /api/hr/profile/{userId}
```

### Vacancies (Port 8082)
```
GET    /api/vacancies
POST   /api/vacancies
DELETE /api/vacancies/{id}
```

---

## File Structure

```
backend/
├── user-service/          # Microservice 1 (Port 8081)
│   ├── src/main/java/
│   │   └── com/skillnet/user_service/
│   │       ├── entity/
│   │       ├── dto/
│   │       ├── repository/
│   │       ├── service/
│   │       ├── controller/
│   │       └── config/
│   └── pom.xml
└── vacancy-service/       # Microservice 2 (Port 8082)

frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx              # Login form
│   │   ├── Register.jsx           # Registration form
│   │   ├── WorkerProfile.jsx      # Worker dashboard
│   │   ├── HRProfile.jsx          # HR profile
│   │   ├── WorkerSearch.jsx       # Worker search
│   │   └── HrDashboard.jsx        # HR dashboard
│   ├── services/
│   │   ├── authService.js         # Auth API client
│   │   └── vacancyService.js      # Vacancy API client
│   └── App.jsx                    # Main app component
├── package.json
└── vite.config.js
```

---

## Troubleshooting

### Issue: "Connection refused" when logging in
**Solution:** Ensure User Service is running on port 8081
```bash
cd backend/user-service
mvn spring-boot:run
```

### Issue: "CORS error" in browser
**Solution:** CORS is configured in SecurityConfig.java for ports 5173 & 3000

### Issue: Database connection error
**Solution:** Verify MySQL is running
```bash
# Check MySQL status
mysql -u root -p
```

### Issue: Port already in use
**Solution:** Kill process on that port
```bash
# Find process on port 8081
lsof -i :8081
# Kill process
kill -9 <PID>
```

---

## Key Features

✅ **Role-Based Authentication**
- Separate dashboards for Worker and HR
- Encrypted password storage (BCrypt)
- Session persistence via localStorage

✅ **Worker Management**
- Complete profile with professional details
- Real-time availability toggle
- Search by location or profession

✅ **Availability Toggle**
- Workers can mark as Available/Unavailable
- Affects visibility in search results
- Real-time backend update

✅ **Job Vacancy Management**
- HR can post job vacancies
- View active vacancies
- Delete vacancies

✅ **Search & Discovery**
- Find workers by profession
- Filter by location
- View verified profiles

---

## Next Steps

1. **Matching Engine** (Microservice 3): Implement algorithm to match vacancies with workers
2. **Real-time Chat**: Add messaging between HR and Workers
3. **Ratings & Reviews**: Worker rating system
4. **Payment Integration**: Payment processing for job completion
5. **Notifications**: Email/SMS alerts for new jobs

---

## Support

For issues or questions:
1. Check application logs in terminal
2. Verify all services are running
3. Check database connectivity
4. Review API response status codes
