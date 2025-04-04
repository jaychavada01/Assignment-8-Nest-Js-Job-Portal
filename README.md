# Assignment 8 - NestJS User Management & Authentication System

## Description

This is a full-featured NestJS-based application designed as part of **Assignment 8**. It implements a user authentication and role-based authorization system using **NestJS**, **Sequelize**, and **PostgreSQL**. It also supports file uploads (e.g., profile pictures, resumes) using **Multer** and includes JWT-based login and registration workflows for different user roles.

---

## 📁 Project Structure

```
Canvas Assignment 8/
├─ dist/                    # Compiled JavaScript output
├─ src/                    # Application source code
│  ├─ config/              # Multer (file upload) configuration
│  ├─ modules/             # Modular structure
│  │  ├─ auth/             # Auth-related logic (JWT, guards, roles)
│  │  └─ users/            # User model, DTOs, controller, service
│  ├─ app.controller.ts    # Basic root controller
│  ├─ app.module.ts        # Main application module
│  ├─ app.service.ts       # Basic app service
│  └─ main.ts              # Entry point
├─ uploads/                # Directory for uploaded files
├─ test/                   # End-to-end tests
├─ .env                    # Environment variables (e.g., DB config)
├─ package.json            # Project dependencies and scripts
├─ tsconfig.json           # TypeScript compiler options
├─ README.md               # Project documentation
```

---

## 🚀 Features

- ✅ JWT-based authentication
- 👥 Role-based access control (Admin, Employer, JobSeeker)
- 🔒 Password hashing using bcryptjs
- 📄 File upload support with Multer (e.g., resume, profile picture)
- 🛡️ Guards & decorators for protecting routes
- 🧰 Sequelize ORM for PostgreSQL
- 🔄 DTO validation with class-validator
- 🧪 Unit & e2e testing with Jest

---

## 🧑‍💻 User Roles

- **Admin**

  - Can be created via script (ensures one always exists on startup)
  - Has access to management-level features

- **Employer**

  - Can register, login, and upload profile picture

- **JobSeeker**
  - Can register with profile picture and resume upload

---

### Configure Environment

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=assignment8
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### Run the application

```bash
# Development mode with hot-reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

### Run Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e
```

---

## 📂 Key Modules

### Auth Module (`src/modules/auth`)

- **JWT Strategy** for validating access tokens
- **Guards**: `JwtAuthGuard`, `RolesGuard`
- **Decorators**: `@Roles()` to restrict access based on roles

### Users Module (`src/modules/users`)

- User model defined with Sequelize and `sequelize-typescript`
- DTOs for registration, login, update
- Upload logic to accept different file types conditionally based on role

---

## 📤 File Uploads

- Configured via `multer.config.ts`
- Upload destination: `/uploads`
- Conditional uploads:
  - **JobSeeker**: Resume (PDF/DOC) + Profile Picture
  - **Employer/Admin**: Only Profile Picture

---

## 🛠 Tech Stack

- **NestJS** 11 (Modular architecture)
- **Sequelize ORM** + **PostgreSQL**
- **JWT** for authentication
- **Multer** for handling file uploads
- **Passport** for authentication strategies
- **Jest** for testing

---

## 🧪 Testing

- **Unit Tests**: Business logic validation
- **E2E Tests**: API contract & behavior

To run all tests:

```bash
npm run test
npm run test:e2e
```

---

## 📜 Scripts

| Script      | Description                     |
| ----------- | ------------------------------- |
| `start`     | Run the app normally            |
| `start:dev` | Run in watch mode (auto-reload) |
| `build`     | Compile TS to JS (dist folder)  |
| `test`      | Run unit tests                  |
| `test:e2e`  | Run end-to-end tests            |
| `format`    | Format code using Prettier      |
| `lint`      | Run ESLint with auto-fix        |

---

## ✅ Todo Enhancements (Optional)

- ✅ Admin panel integration
- ✅ Refresh token implementation
- ✅ Rate limiting & throttling
- ✅ Swagger documentation
- ✅ CI/CD pipeline integration

---
