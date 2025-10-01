# Uriel | Organization Management API  

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/license/mit)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-v4-black?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow?style=flat&logo=jsonwebtokens&logoColor=black)
![Multer](https://img.shields.io/badge/Uploads-Multer-orange?style=flat)

> **Uriel is a secure user and organisation management REST API** designed for managing users, and organisation. It manages authentication,authourization, user management, organisation management, avatars, and organization-related operations.  
> Built with **Express.js**, it demonstrates best practices in backend engineering: authentication, validation, middleware usage, and clean project structure.  

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

==============================

## Database Schema

![Uriel ](./uriel.png)
![Uriel Database Schema](./src/images/uriel.drawio.png)

---

## 📊 Features

- 🔐 **Authentication**: Login, logout, token refresh  
- 🧾 **User Registration**: Schema-validated onboarding  
- 📧 **Email Confirmation**: Verify user emails before full access  
- 🔑 **Password Recovery**: Reset forgotten passwords securely  
- 👤 **User Management**: View & update user profiles  
- 🖼️ **Avatar Uploads**: Upload and serve profile pictures  

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
### 👤 Organisation (`/organisation`)
| Method | Endpoint                  | Description |
|--------|---------------------------|-------------|
| `GET`  | `/users/:id`              | Get user by ID (protected) |
| `PUT`  | `/users/update/:id`       | Update user profile (protected) |
| `POST` | `/users/:id/upload`       | Upload avatar (protected) |
| `GET`  | `/users/:id/avatar`       | Fetch user avatar (protected) |
| `POST` | `/users/:id/forget-password` | Simulate password recovery (demo) |

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
Running the App

bash
Copy
Edit
# Development
```
npm run dev
```
# Production
npm start
⚙️ Environment Configuration
Create a .env file with your settings:

- PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/uriel
- JWT_SECRET=your_secret_key
📱 Example Usage
- Register
-- POST /auth/register
Content-Type: application/json
```
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```
Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```
## 🔍 Architecture
```
src/
├── auth/                   # Auth controllers & logic
├── controllers/            # User & org controllers
├── middlewares/            # Custom middlewares
├── routes/                 # Route definitions
├── schemas/                # JSON schemas for validation
└── app.js                # App entry point
📄 License
```
* MIT License - see LICENSE for details.

* 👨‍💻 Author
Anaele Joshua Chukwuebuka
MSc IT | Backend Developer | Node.js Enthusiast

- [**GitHub** ](https://github.com/AnaeleJoshua)
- [**LinkedIn**: ](https://linkedin.com/in/joshua-anaele-2a917ab9)
- [**X** ](https://x.com/)
