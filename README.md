# Job Portal API

A comprehensive backend API for a job portal application built with NestJS. This application manages user profiles, job listings, applications, company profiles, feedback, and interviews.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Project Modules](#project-modules)
- [Testing](#testing)

## Project Structure

```
Assignment 8/
├─ src/
│  ├─ config/
│  │  └─ multer.config.ts
│  ├─ decorators/
│  │  └─ roles.decorator.ts
│  ├─ guard/
│  │  ├─ jwt-auth.guard.ts
│  │  └─ roles.guard.ts
│  ├─ modules/
│  │  ├─ application/
│  │  │  ├─ dto/
│  │  │  │  └─ application.dto.ts
│  │  │  ├─ entity/
│  │  │  │  └─ application.entity.ts
│  │  │  ├─ application.controller.ts
│  │  │  ├─ application.module.ts
│  │  │  └─ application.service.ts
│  │  ├─ companyProfiles/
│  │  │  ├─ dto/
│  │  │  │  └─ create-profile-dto.ts
│  │  │  ├─ entity/
│  │  │  │  └─ companyProfile.entity.ts
│  │  │  ├─ company-profile.module.ts
│  │  │  ├─ companyProfile.controller.ts
│  │  │  └─ companyProfile.service.ts
│  │  ├─ feedback/
│  │  │  ├─ dto/
│  │  │  │  └─ feedback-dto.ts
│  │  │  ├─ entity/
│  │  │  │  └─ feedback.entity.ts
│  │  │  ├─ feedback.controller.ts
│  │  │  ├─ feedback.module.ts
│  │  │  └─ feedback.service.ts
│  │  ├─ interview/
│  │  │  ├─ dto/
│  │  │  │  └─ interview-dto.ts
│  │  │  └─ interview.entity.ts
│  │  ├─ jobs/
│  │  │  ├─ dto/
│  │  │  │  └─ create-job-dto.ts
│  │  │  ├─ entity/
│  │  │  │  └─ job.entity.ts
│  │  │  ├─ job.controller.ts
│  │  │  ├─ job.module.ts
│  │  │  └─ job.service.ts
│  │  ├─ mail/
│  │  │  ├─ mail.module.ts
│  │  │  └─ mail.service.ts
│  │  └─ users/
│  │     ├─ dto/
│  │     │  ├─ create-user-dto.ts
│  │     │  ├─ login-user-dto.ts
│  │     │  └─ update-user-dto.ts
│  │     ├─ entity/
│  │     │  └─ user.entity.ts
│  │     ├─ users.controller.ts
│  │     ├─ users.module.ts
│  │     └─ users.service.ts
│  ├─ shared/
│  │  └─ redis/
│  │     ├─ redis.module.ts
│  │     └─ redis.service.ts
│  ├─ strategy/
│  │  └─ jwt.strategy.ts
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  └─ main.ts
├─ test/
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ uploads/
├─ .env
├─ .gitignore
├─ .prettierrc
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ tsconfig.build.json
└─ tsconfig.json

```

## Features

- **User Management**: Registration, authentication, and profile management
- **Job Listings**: Create, update, search, and apply for job postings
- **Company Profiles**: Companies can create and manage their profiles
- **Applications**: Job seekers can apply to jobs and track application status
- **Interviews**: Schedule and manage interview processes
- **Feedback System**: Collect and manage feedback for interviews and applications
- **Role-Based Access Control**: Different access levels for job seekers, employers, and admins
- **Email Notifications**: Automated email notifications for various events
- **File Upload**: Support for resume uploads and other documents
- **Redis Caching**: Improved performance with Redis caching

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: (Not explicitly specified in the file structure, likely MongoDB or SQL)
- **Authentication**: JWT (JSON Web Token)
- **Caching**: Redis
- **Email Service**: Custom mail module
- **File Upload**: Multer

## Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)
- Redis server
- Database server (MongoDB/PostgreSQL/MySQL)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jaychavada01/Assignment-8-Nest-Js-Job-Portal.git
   cd Assignment8
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the necessary environment variables (see [Environment Variables](#environment-variables) section).

4. Build the application:
   ```bash
   npm run build
   ```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## API Documentation

The API endpoints are organized by modules:

### Users

- `POST /users` - Register a new user
- `POST /users/login` - User login
- `GET /users/:id` - Get user profile
- `PATCH /users/:id` - Update user profile

### Jobs

- `POST /jobs` - Create a new job posting
- `GET /jobs` - List all jobs
- `GET /jobs/:id` - Get job details
- `PATCH /jobs/:id` - Update job details
- `DELETE /jobs/:id` - Delete a job posting

### Applications

- `POST /applications` - Submit a job application
- `GET /applications` - List applications
- `GET /applications/:id` - Get application details
- `PATCH /applications/:id` - Update application status

### Company Profiles

- `POST /company-profiles` - Create a company profile
- `GET /company-profiles/:id` - Get company profile
- `PATCH /company-profiles/:id` - Update company profile

### Feedback

- `POST /feedback` - Submit feedback

### Interviews

- `POST /interviews` - Schedule an interview

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRATION=1d

# Email Configuration
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your-email@example.com
MAIL_PASSWORD=your-email-password
MAIL_FROM=no-reply@example.com
```

## Authentication

The application uses JWT (JSON Web Token) for authentication. The auth module includes:

- JWT Strategy
- Auth Guards
- Role-based access control using decorators

## Project Modules

### Users Module

Handles user registration, authentication, and profile management.

### Jobs Module

Manages job postings, including creation, updating, and searching jobs.

### Applications Module

Manages job applications from submission to processing.

### Company Profiles Module

Handles company profile creation and management.

### Feedback Module

Manages feedback submission and retrieval.

### Interview Module

Handles interview scheduling and status management.

### Mail Module

Provides email notification services.

### Redis Module

Provides caching capabilities to improve application performance.

## Testing

### Running Unit Tests

```bash
npm run test
```

### Running End-to-End Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```
