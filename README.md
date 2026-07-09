# Loan Origination System (LOS)

Loan Origination System is a full-stack application for managing customer onboarding, loan products, loan applications, approvals, and reporting with role-based access.

## Tech Stack

- Backend: Java 21, Spring Boot 3, Spring Security, Spring Data JPA, MySQL, JWT
- Frontend: Angular 18, Angular Material, RxJS
- Build tools: Maven (backend), npm/Angular CLI (frontend)

## Project Structure

- `src/` - Spring Boot backend source code
- `frontend/` - Angular frontend source code
- `pom.xml` - Backend dependencies and Maven build config
- `src/main/resources/application.properties` - Backend runtime configuration

## Main Features

- Authentication with JWT (`/api/auth/signup`, `/api/auth/login`)
- Role-based access:
  - `ADMIN`
  - `BANK_OFFICER`
  - `CUSTOMER`
- Customer management and self-profile flow
- Asset and loan product management
- Loan application, eligibility checks, approval/reject/hold flows
- Dashboard and reports

## Frontend Routes

- Public: `/login`, `/signup`
- Customer: `/customer-profile`, `/loan-apply`, `/loans`, `/profile`
- Admin/Bank Officer: `/dashboard`, `/customers`, `/assets`, `/loan-products`, `/approvals`, `/reports`, `/profile`

## Backend API Modules

- `/api/auth` - signup/login
- `/api/customers` - customer CRUD, current customer profile
- `/api/assets` - asset CRUD
- `/api/loan-products` - loan product CRUD
- `/api/loan` - loan apply, list, details, approve/reject/hold
- `/api/creditscore` - credit score view/update
- `/api/dashboard` - dashboard stats

## Prerequisites

Install these tools before running:

- Java 21+
- Maven 3.9+
- Node.js 18+ (or 20+) and npm
- MySQL 8+

## Configuration

Backend config is in `src/main/resources/application.properties`.

Current defaults:

- Backend port: `8084`
- DB: `loan_origination_system` (auto-created if missing)
- Frontend API URL: `http://localhost:8084/api` (in `frontend/src/environments/environment.ts`)

Important: update DB credentials and JWT secret for your environment.

## How To Run

### 1) Start MySQL

Make sure MySQL is running and credentials in `application.properties` are correct.

### 2) Run Backend (Spring Boot)

From project root:

```bash
mvn spring-boot:run
```

Backend will start at:

- `http://localhost:8084`
- Health check: `http://localhost:8084/actuator/health`

### 3) Run Frontend (Angular)

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will run at:

- `http://localhost:4200`

## Build Commands

### Backend

```bash
mvn clean compile
```

### Frontend

```bash
cd frontend
npm run build
```

## Test Commands

### Backend tests

```bash
mvn test
```

### Frontend tests

```bash
cd frontend
npm test
```

## Notes

- Keep backend running before starting frontend.
- If `8084` is already in use, stop the old process or change `server.port`.
- CORS origins are controlled by `app.cors.allowed-origins` in backend config.

