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
├─ dist/
│  ├─ config/
│  │  ├─ multer.config.d.ts
│  │  ├─ multer.config.js
│  │  └─ multer.config.js.map
│  ├─ modules/
│  │  ├─ application/
│  │  │  ├─ dto/
│  │  │  │  ├─ application.dto.d.ts
│  │  │  │  ├─ application.dto.js
│  │  │  │  └─ application.dto.js.map
│  │  │  ├─ model/
│  │  │  │  ├─ application.model.d.ts
│  │  │  │  ├─ application.model.js
│  │  │  │  └─ application.model.js.map
│  │  │  ├─ application.controller.d.ts
│  │  │  ├─ application.controller.js
│  │  │  ├─ application.controller.js.map
│  │  │  ├─ application.module.d.ts
│  │  │  ├─ application.module.js
│  │  │  ├─ application.module.js.map
│  │  │  ├─ application.service.d.ts
│  │  │  ├─ application.service.js
│  │  │  └─ application.service.js.map
│  │  ├─ auth/
│  │  │  ├─ auth.module.d.ts
│  │  │  ├─ auth.module.js
│  │  │  ├─ auth.module.js.map
│  │  │  ├─ jwt-auth.guard.d.ts
│  │  │  ├─ jwt-auth.guard.js
│  │  │  ├─ jwt-auth.guard.js.map
│  │  │  ├─ jwt.strategy.d.ts
│  │  │  ├─ jwt.strategy.js
│  │  │  ├─ jwt.strategy.js.map
│  │  │  ├─ roles.decorator.d.ts
│  │  │  ├─ roles.decorator.js
│  │  │  ├─ roles.decorator.js.map
│  │  │  ├─ roles.guard.d.ts
│  │  │  ├─ roles.guard.js
│  │  │  └─ roles.guard.js.map
│  │  ├─ companyProfiles/
│  │  │  ├─ dto/
│  │  │  │  ├─ create-profile-dto.d.ts
│  │  │  │  ├─ create-profile-dto.js
│  │  │  │  └─ create-profile-dto.js.map
│  │  │  ├─ model/
│  │  │  │  ├─ companyProfile.model.d.ts
│  │  │  │  ├─ companyProfile.model.js
│  │  │  │  └─ companyProfile.model.js.map
│  │  │  ├─ company-profile.module.d.ts
│  │  │  ├─ company-profile.module.js
│  │  │  ├─ company-profile.module.js.map
│  │  │  ├─ companyProfile.controller.d.ts
│  │  │  ├─ companyProfile.controller.js
│  │  │  ├─ companyProfile.controller.js.map
│  │  │  ├─ companyProfile.service.d.ts
│  │  │  ├─ companyProfile.service.js
│  │  │  └─ companyProfile.service.js.map
│  │  ├─ feedback/
│  │  │  ├─ dto/
│  │  │  │  ├─ feedback-dto.d.ts
│  │  │  │  ├─ feedback-dto.js
│  │  │  │  └─ feedback-dto.js.map
│  │  │  ├─ model/
│  │  │  │  ├─ feedback.model.d.ts
│  │  │  │  ├─ feedback.model.js
│  │  │  │  └─ feedback.model.js.map
│  │  │  ├─ feedback.controller.d.ts
│  │  │  ├─ feedback.controller.js
│  │  │  ├─ feedback.controller.js.map
│  │  │  ├─ feedback.module.d.ts
│  │  │  ├─ feedback.module.js
│  │  │  ├─ feedback.module.js.map
│  │  │  ├─ feedback.service.d.ts
│  │  │  ├─ feedback.service.js
│  │  │  └─ feedback.service.js.map
│  │  ├─ interview/
│  │  │  ├─ dto/
│  │  │  │  ├─ interview-dto.d.ts
│  │  │  │  ├─ interview-dto.js
│  │  │  │  └─ interview-dto.js.map
│  │  │  ├─ interview.model.d.ts
│  │  │  ├─ interview.model.js
│  │  │  └─ interview.model.js.map
│  │  ├─ jobs/
│  │  │  ├─ dto/
│  │  │  │  ├─ create-job-dto.d.ts
│  │  │  │  ├─ create-job-dto.js
│  │  │  │  └─ create-job-dto.js.map
│  │  │  ├─ model/
│  │  │  │  ├─ job.model.d.ts
│  │  │  │  ├─ job.model.js
│  │  │  │  └─ job.model.js.map
│  │  │  ├─ job.controller.d.ts
│  │  │  ├─ job.controller.js
│  │  │  ├─ job.controller.js.map
│  │  │  ├─ job.module.d.ts
│  │  │  ├─ job.module.js
│  │  │  ├─ job.module.js.map
│  │  │  ├─ job.service.d.ts
│  │  │  ├─ job.service.js
│  │  │  └─ job.service.js.map
│  │  ├─ mail/
│  │  │  ├─ mail.module.d.ts
│  │  │  ├─ mail.module.js
│  │  │  ├─ mail.module.js.map
│  │  │  ├─ mail.service.d.ts
│  │  │  ├─ mail.service.js
│  │  │  └─ mail.service.js.map
│  │  ├─ users/
│  │  │  ├─ dto/
│  │  │  │  ├─ create-user-dto.d.ts
│  │  │  │  ├─ create-user-dto.js
│  │  │  │  ├─ create-user-dto.js.map
│  │  │  │  ├─ login-user-dto.d.ts
│  │  │  │  ├─ login-user-dto.js
│  │  │  │  ├─ login-user-dto.js.map
│  │  │  │  ├─ update-user-dto.d.ts
│  │  │  │  ├─ update-user-dto.js
│  │  │  │  └─ update-user-dto.js.map
│  │  │  ├─ model/
│  │  │  │  ├─ user.model.d.ts
│  │  │  │  ├─ user.model.js
│  │  │  │  └─ user.model.js.map
│  │  │  ├─ users.controller.d.ts
│  │  │  ├─ users.controller.js
│  │  │  ├─ users.controller.js.map
│  │  │  ├─ users.module.d.ts
│  │  │  ├─ users.module.js
│  │  │  ├─ users.module.js.map
│  │  │  ├─ users.service.d.ts
│  │  │  ├─ users.service.js
│  │  │  └─ users.service.js.map
│  │  ├─ indexModel.d.ts
│  │  ├─ indexModel.js
│  │  └─ indexModel.js.map
│  ├─ shared/
│  │  └─ redis/
│  │     ├─ redis.module.d.ts
│  │     ├─ redis.module.js
│  │     ├─ redis.module.js.map
│  │     ├─ redis.service.d.ts
│  │     ├─ redis.service.js
│  │     └─ redis.service.js.map
│  ├─ app.controller.d.ts
│  ├─ app.controller.js
│  ├─ app.controller.js.map
│  ├─ app.module.d.ts
│  ├─ app.module.js
│  ├─ app.module.js.map
│  ├─ app.service.d.ts
│  ├─ app.service.js
│  ├─ app.service.js.map
│  ├─ main.d.ts
│  ├─ main.js
│  ├─ main.js.map
│  └─ tsconfig.build.tsbuildinfo
├─ src/
│  ├─ config/
│  │  └─ multer.config.ts
│  ├─ modules/
│  │  ├─ application/
│  │  │  ├─ dto/
│  │  │  │  └─ application.dto.ts
│  │  │  ├─ model/
│  │  │  │  └─ application.model.ts
│  │  │  ├─ application.controller.ts
│  │  │  ├─ application.module.ts
│  │  │  └─ application.service.ts
│  │  ├─ auth/
│  │  │  ├─ auth.module.ts
│  │  │  ├─ jwt-auth.guard.ts
│  │  │  ├─ jwt.strategy.ts
│  │  │  ├─ roles.decorator.ts
│  │  │  └─ roles.guard.ts
│  │  ├─ companyProfiles/
│  │  │  ├─ dto/
│  │  │  │  └─ create-profile-dto.ts
│  │  │  ├─ model/
│  │  │  │  ├─ companyProfile.model.js
│  │  │  │  └─ companyProfile.model.ts
│  │  │  ├─ company-profile.module.ts
│  │  │  ├─ companyProfile.controller.ts
│  │  │  └─ companyProfile.service.ts
│  │  ├─ feedback/
│  │  │  ├─ dto/
│  │  │  │  └─ feedback-dto.ts
│  │  │  ├─ model/
│  │  │  │  └─ feedback.model.ts
│  │  │  ├─ feedback.controller.ts
│  │  │  ├─ feedback.module.ts
│  │  │  └─ feedback.service.ts
│  │  ├─ interview/
│  │  │  ├─ dto/
│  │  │  │  └─ interview-dto.ts
│  │  │  └─ interview.model.ts
│  │  ├─ jobs/
│  │  │  ├─ dto/
│  │  │  │  └─ create-job-dto.ts
│  │  │  ├─ model/
│  │  │  │  └─ job.model.ts
│  │  │  ├─ job.controller.ts
│  │  │  ├─ job.module.ts
│  │  │  └─ job.service.ts
│  │  ├─ mail/
│  │  │  ├─ mail.module.ts
│  │  │  └─ mail.service.ts
│  │  ├─ users/
│  │  │  ├─ dto/
│  │  │  │  ├─ create-user-dto.ts
│  │  │  │  ├─ login-user-dto.ts
│  │  │  │  └─ update-user-dto.ts
│  │  │  ├─ model/
│  │  │  │  └─ user.model.ts
│  │  │  ├─ users.controller.ts
│  │  │  ├─ users.module.ts
│  │  │  └─ users.service.ts
│  │  └─ indexModel.ts
│  ├─ shared/
│  │  └─ redis/
│  │     ├─ redis.module.ts
│  │     └─ redis.service.ts
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