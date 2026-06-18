# Campus Placement Management System

An enterprise-grade, role-based platform designed to coordinate and streamline college placements. Connecting **Students**, **Placement Officers/Admins**, and **Corporate Recruiters** in a single ecosystem.

---

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, React Router DOM, Axios, Tailwind CSS, Recharts, Lucide Icons.
- **Backend**: Java 21, Spring Boot 3.3.x, Spring Security (JWT), Spring Data JPA, Hibernate, Lombok, Maven.
- **Database**: MySQL 8.
- **API Documentation**: Swagger UI, Postman Collection.

---

## 📂 Project Structure

```text
Placement_mgt_project/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/placement/mgt/
│   │   │   │   ├── config/          # SecurityConfig, JwtService, JwtFilter, WebConfig, Swagger
│   │   │   │   ├── controller/      # AuthController, StudentController, RecruiterController, OfficerController
│   │   │   │   ├── dto/             # LoginRequest, RegisterRequest, StudentProfileDto, DashboardStatsDto, etc.
│   │   │   │   ├── entity/          # User, Role, Student, Recruiter, Company, Job, Application, etc.
│   │   │   │   ├── exception/       # ResourceNotFoundException, GlobalExceptionHandler
│   │   │   │   ├── repository/      # UserRepository, JobRepository, ApplicationRepository, etc.
│   │   │   │   └── service/         # AuthService, ProfileService, JobService, ApplicationService, etc.
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── pom.xml                  # Backend dependency manager
├── frontend/
│   ├── src/
│   │   ├── context/                 # AuthContext (authentication provider)
│   │   ├── layouts/                 # DashboardLayout (role sidebars, headers)
│   │   ├── pages/                   # Home, About, Login, Register, Dashboards, Profiles, Jobs, etc.
│   │   ├── routes/                  # ProtectedRoutes, RoleRoute (guards)
│   │   ├── services/                # api.js (Axios client with silent JWT refresh)
│   │   ├── App.jsx                  # Main routing tree
│   │   ├── index.css                # Tailwind directives & design system overrides
│   │   └── main.jsx                 # Entry point renderer
│   ├── tailwind.config.js           # Theme and scanning boundaries
│   ├── postcss.config.js
│   └── package.json                 # Frontend dependencies
├── placement_management.sql         # Database schema & initial roles/users
└── placement_management_postman_collection.json # API endpoints collection
```

---

## 📊 System Diagrams

### 1. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    roles ||--o{ users : "has"
    users ||--|| students : "profile"
    users ||--|| recruiters : "profile"
    companies ||--o{ recruiters : "employs"
    companies ||--o{ jobs : "posts"
    companies ||--o{ placement_drives : "coordinates"
    students ||--o{ applications : "submits"
    jobs ||--o{ applications : "receives"
    applications ||--o{ interviews : "triggers"
    users ||--o{ notifications : "receives"
    users ||--o{ refresh_tokens : "lifecycle"
    users ||--o{ audit_logs : "actions"

    roles {
        bigint id PK
        varchar name UK
    }
    users {
        bigint id PK
        varchar email UK
        varchar password
        bigint role_id FK
        boolean is_active
        timestamp created_at
    }
    companies {
        bigint id PK
        varchar company_name UK
        varchar industry
        varchar hr_name
        varchar email UK
        varchar phone
        varchar website
        text address
        text description
        boolean is_approved
    }
    students {
        bigint id PK
        bigint user_id FK
        varchar name
        varchar phone
        varchar gender
        date dob
        text address
        varchar department
        varchar branch
        decimal cgpa
        int passing_year
        text skills
        varchar resume_path
        boolean is_verified
    }
    recruiters {
        bigint id PK
        bigint user_id FK
        bigint company_id FK
        varchar name
        varchar phone
    }
    jobs {
        bigint id PK
        bigint company_id FK
        varchar title
        text description
        decimal package_amount
        varchar job_type
        varchar location
        text skills_required
        decimal min_cgpa
        int batch_year
        date deadline
    }
    applications {
        bigint id PK
        bigint student_id FK
        bigint job_id FK
        varchar status
        varchar resume_path
        timestamp applied_at
        text remarks
    }
    placement_drives {
        bigint id PK
        varchar drive_name
        bigint company_id FK
        date date
        time time
        varchar venue
        text eligibility_criteria
        date registration_deadline
        varchar status
    }
    interviews {
        bigint id PK
        bigint application_id FK
        date date
        time time
        varchar mode
        varchar meeting_link
        text feedback
        varchar status
    }
```

### 2. Use Case Diagram

```mermaid
graph TD
    subgraph Users
        S[Student]
        R[Recruiter]
        O[Placement Officer / Admin]
    end

    subgraph Portal Core
        UC1(Register & Login)
        UC2(Update CV & Academic Details)
        UC3(Browse & Apply for Jobs)
        UC4(Verify Profiles)
        UC5(Approve Partner Companies)
        UC6(Publish Job Posts)
        UC7(Shortlist Candidates)
        UC8(Schedule Interviews)
        UC9(Create Placement Drives)
        UC10(Review Placement Statistics)
    end

    S --> UC1
    S --> UC2
    S --> UC3
    
    R --> UC1
    R --> UC6
    R --> UC7
    R --> UC8
    
    O --> UC1
    O --> UC4
    O --> UC5
    O --> UC9
    O --> UC10
```

### 3. Sequence Diagram (Hiring Workflow)

```mermaid
sequenceDiagram
    autonumber
    actor Student
    actor Recruiter
    actor Officer
    participant DB as MySQL Database

    Officer->>DB: Verify Student Profile (is_verified = true)
    Recruiter->>DB: Post Job Vacancy (min_cgpa, batch)
    Student->>DB: Request Eligible Jobs
    DB-->>Student: Return list of active eligible postings
    Student->>DB: Apply for Job (upload resume reference)
    DB-->>Recruiter: Update Applicant list
    Recruiter->>DB: Shortlist student and Schedule Interview
    DB-->>Student: Alert: In-App notification & email log
    Recruiter->>DB: Submit interview feedback and mark Selected
    DB-->>Student: Alert: Selection Banner
    DB-->>Officer: Update analytic stats chart
```

---

## 🛠️ Run & Setup Guide

### 1. Database Setup
1. Open **MySQL Workbench** or command line.
2. Create database `placement_management` (if not created):
   ```sql
   CREATE DATABASE placement_management;
   ```
3. Import the `placement_management.sql` file.

### 2. Backend Setup (Spring Boot)
1. Open the `/backend` folder in **IntelliJ IDEA**.
2. Open `src/main/resources/application.properties`.
3. Update database credentials:
   ```properties
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
4. Run the project by executing the main file `PlacementManagementApplication.java` or executing:
   ```bash
   mvn spring-boot:run
   ```
   *The server runs at `http://localhost:8080`.*
5. API Documentation is served at:
   - **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`

### 3. Frontend Setup (React)
1. Open the `/frontend` folder in **VS Code**.
2. Install package nodes:
   ```bash
   npm install
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```
   *The portal will open at `http://localhost:5173`.*

---

## 🔑 Default Accounts (Seed Data)

The database imports two pre-configured role-based users for testing. Passwords are case-sensitive.

| User Role | Username / Email | Password | Role Capability |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@placement.com` | `admin123` | Direct verification / Analytics access |
| **Placement Officer** | `officer@placement.com` | `officer123` | Verification / Scheduling Drives |
