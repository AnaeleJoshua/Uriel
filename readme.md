# Uriel | Organization Management API  

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/license/mit)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-v4-black?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow?style=flat&logo=jsonwebtokens&logoColor=black)
![Multer](https://img.shields.io/badge/Uploads-Multer-orange?style=flat)

> **Uriel is a secure user and organisation management REST API** designed for managing users and organisations. It manages authentication, authorization, user management, organisation management, avatars, and organization-related operations.  
> Built with **Express.js**, it demonstrates best practices in backend engineering: authentication, validation, middleware usage, and clean project structure.  

---

## 🧩 What Problem Does Uriel Solve?

Modern organizations need a secure, scalable way to manage users, teams, and organisational membership. Uriel solves the problem of fragmented user and organisation management by providing a unified API for authentication, user profiles, and organisation membership. It streamlines onboarding, profile updates, and secure access to organisational resources, reducing manual admin work and improving security.

> **Note:** Project management features (projects, tasks, comments) are planned for future releases. The database schema is designed to support these features as the application evolves.

---

## 🛠️ Tech Stack Used

- **Node.js** (v18+): Fast, scalable backend runtime
- **Express.js**: Modular REST API framework
- **PostgreSQL**: Reliable relational database
- **Sequelize**: ORM for database abstraction
- **JWT**: Secure authentication and authorization
- **Redis**: Token blacklisting and caching
- **Multer**: File uploads (avatars)
- **SendGrid**: Email workflows (confirmation, password recovery)
- **Swagger & Redoc**: API documentation

---

## 🏗️ Architecture Decisions

- **Modular Structure:**  
  Separated concerns into `/auth`, `/controllers`, `/middlewares`, `/routes`, and `/schemas` for maintainability and scalability.
- **Middleware-Driven:**  
  Custom middlewares for authentication, validation, error handling, and file uploads.
- **Database Abstraction:**  
  Used Sequelize for easy model management and migrations.
- **Token Security:**  
  JWT for stateless authentication, Redis for blacklisting used tokens.
- **Validation:**  
  AJV and custom schema validation for robust input checking.
- **API Documentation:**  
  Integrated Swagger and Redoc for clear, interactive API docs.

---

## 📚 What I Learned

- **Advanced JWT flows:** Implemented refresh tokens, blacklisting, and secure cookie handling.
- **Express Middleware Patterns:** Built reusable, composable middlewares for security and validation.
- **Database Modeling:** Designed scalable schemas for users, organizations, and relationships.
- **Cloud Integrations:** Integrated Redis (Upstash), SendGrid, and Cloudinary for real-world features.
- **API Documentation:** Automated OpenAPI spec generation and interactive docs.

---

## 🚧 Challenges Faced & Solutions

- **Token Blacklisting:**  
  Challenge: Preventing reuse of JWTs after logout.  
  Solution: Integrated Redis to store and check blacklisted tokens efficiently.

- **Email Delivery Reliability:**  
  Challenge: Ensuring password recovery and confirmation emails are delivered.  
  Solution: Used SendGrid and implemented robust error handling and retries.

- **File Upload Security:**  
  Challenge: Handling user avatars securely.  
  Solution: Used Multer with Cloudinary, validated file types and sizes.

- **Environment Parity:**  
  Challenge: Differences between local and cloud environments (e.g., Redis connection issues).  
  Solution: Added connection health checks, improved error logging, and documented setup steps.

- **Schema Validation:**  
  Challenge: Preventing invalid data from reaching controllers.  
  Solution: Built AJV-based validation middleware for all endpoints.

---

## 🎯 Project Purpose & Goals

Uriel is built to:  
- Provide a **solid authentication system** (JWT login, refresh, logout).  
- Enable **user profile management** (CRUD operations, avatar uploads).  
- Support **secure password recovery** with email workflows.  
- Demonstrate **scalable, modular Express.js architecture**.  

---

## 🛠️ Technical Skills Demonstrated

- **Authentication & Authorization** – JWT-based secure login system  
- **Schema Validation** – Robust request payload validation with middleware  
- **Middleware Development** – Custom middlewares for security, validation & uploads  
- **File Uploads** – Avatar handling with Multer  
- **REST API Design** – Clean and modular route structuring  
- **Security Best Practices** – Token protection, password recovery, email confirmation, used token blacklisting
- **Scalable Architecture** – Easy to extend for organizational resource management  
- **Caching** - Redis caching for used token blacklisting

---

## 🚀 Roadmap

- [x] Organisation and user management
- [x] Secure authentication and authorization
- [x] Avatar uploads and profile management
- [ ] **Project management (projects, tasks, comments) — *coming soon!***

---

## Database Schema

![Uriel Database Schema](./uriel.drawio.png)

The schema above shows the current structure for users and organisations, as well as the planned tables for projects, tasks, and comments. This forward-thinking design ensures Uriel can easily expand to full project management capabilities.

---

## 📊 Features

- 🔐 **Authentication**: Login, logout, token refresh  
- 🧾 **User Registration**: Schema-validated onboarding  
- 📧 **Email Confirmation**: Verify user emails before full access  
- 🔑 **Password Recovery**: Reset forgotten passwords securely  
- 👤 **User Management**: View & update user profiles  
- 🖼️ **Avatar Uploads**: Upload and serve profile pictures  
- 🏢 **Organisation Management**: Create, update, and manage organisations and memberships  
- 📁 **Project Management**: *(Coming soon!)* The schema and architecture are ready for future project, task, and comment management.

---

## 🏗️ API Endpoints

### 🔐 Authentication (`/auth`)
| Method | Endpoint                   | Description |
|--------|----------------------------|-------------|
| `POST` | `/auth/login`              | Login with email & password |
| `POST` | `/auth/register`           | Register a new user (validated) |
| `GET`  | `/auth/confirmation-email` | Confirm user email |
| `GET`  | `/auth/refresh`            | Refresh expired JWT tokens |
| `POST` | `/auth/password_recovery`  | Request password reset |
| `POST` | `/auth/logout`             | Log out user session |

---

### 👤 Users (`/users`)
| Method | Endpoint                  | Description |
|--------|---------------------------|-------------|
| `GET`  | `/users/:id`              | Get user by ID (protected) |
| `PUT`  | `/users/update/:id`       | Update user profile (protected) |
| `POST` | `/users/:id/upload`       | Upload avatar (protected) |
| `GET`  | `/users/:id/avatar`       | Fetch user avatar (protected) |
| `POST` | `/users/:id/forget-password` | Simulate password recovery (demo) |

---

### 🏢 Organisation (`/organisation`)
| Method | Endpoint                  | Description |
|--------|---------------------------|-------------|
| `GET`  | `/organisations`          | Get all organisations for a user |
| `POST` | `/organisations`          | Create a new organisation |
| `GET`  | `/organisations/{orgId}`  | Get organisation by ID |
| `GET`  | `/organisations/{orgId}/allUsers` | Get all users in an organisation |
| `POST` | `/organisations/{orgId}/addUser` | Add a user to an organisation |
| `PATCH`| `/organisations/{orgId}/assign-Admin` | Assign admin role to a user |
| `PATCH`| `/organisations/{orgId}/removeAdmin` | Remove admin role from a user |
| `DELETE`| `/organisations/{orgId}/remove-user` | Remove a user from organisation |
| `POST` | `/organisations/{orgId}/leave` | Leave organisation |

---

## 🔄 Authentication Flow (Mermaid.js)

```mermaid
flowchart TD
    A[User Registers] --> B[Email Confirmation Sent]
    B -->|Clicks Link| C[Email Verified]
    C --> D[Login with Email & Password]
    D --> E[JWT Access Token Issued]
    E --> F[Access Protected Routes]
    F --> G[Token Expired?]
    G -->|Yes| H[Refresh Token Endpoint]
    H --> I[New Access Token]
    G -->|No| F
    F --> J[Logout Request]
    J --> K[Invalidate Tokens]
```

---

- **`IsAuthenticatedMiddleware`** → Protects sensitive routes  
- **`SchemaValidationMiddleware`** → Ensures request payloads match schemas  
- **`uploadMiddleware`** → Handles file uploads with Multer  

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+  
- npm or yarn  
- PostgreSQL  

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/uriel-api.git
cd uriel-api
npm install
```

### Running the App

```bash
# Development
npm run dev

# Production
npm start
```

### ⚙️ Environment Configuration

Create a `.env` file with your settings:

```
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/uriel
JWT_SECRET=your_secret_key
```

### 📱 Example Usage

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

---

## 🔍 Architecture

```
src/
├── auth/                   # Auth controllers & logic
├── controllers/            # User & org controllers
├── middlewares/            # Custom middlewares
├── routes/                 # Route definitions
├── schemas/                # JSON schemas for validation
└── app.js                  # App entry point
```

---

## 📄 License

MIT License - see LICENSE for details.

---

## 👨‍💻 Author

Anaele Joshua Chukwuebuka  
MSc IT | Backend Developer
