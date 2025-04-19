# Uriel - Organization Management API

Welcome to **Uriel** — a secure, modular, and scalable Node.js REST API built with **Express.js** for managing users, organizations, and authentication within your application.

Uriel is designed to streamline user account creation, authentication, avatar uploads, and password recovery while offering a simple structure for extension and maintenance.

---

## 🚀 Features

- 🔐 **Authentication System** – JWT-based login, refresh, and logout flows
- 📧 **Email Confirmation** – Verify email addresses before full access
- 🔁 **Token Refresh** – Securely renew access tokens
- 🧾 **User Registration** – Schema-validated user sign-up
- 🙍 **User Management** – Retrieve, update, and manage user profiles
- 🖼️ **Avatar Uploads** – Upload and retrieve user profile pictures
- 🔑 **Password Recovery** – Recover forgotten passwords securely

---

## 📁 Project Structure

```bash
.
├── auth/
│   ├── RegController.js
│   ├── confirm-email.js
│   ├── passwordRecovery.js
├── controllers/
│   ├── usersController.js
│   └── organisationsController.js
├── middlewares/
│   ├── IsAuthenticatedMiddleware.js
│   ├── SchemaValidationMiddleware.js
│   ├── uploadMiddleWare.js
│   └── isAuthourized.js
├── routes/
│   ├── accessTokenRoute.js
│   ├── loginRoute.js
│   ├── logoutRoute.js
│   ├── regRoute.js
│   ├── userRoutes.js
│   └── [organisationsRoutes.js](http://_vscodecontentref_/2)
├── schemas/
│   ├── registerPayload.js
│   └── organisation.js
└── index.js

🔌 API Endpoints
### 🧾 Authentication Routes (`/auth`)

| Method | Endpoint                  | Description                              |
|--------|---------------------------|------------------------------------------|
| POST   | `/auth/login`             | Login with email and password            |
| POST   | `/auth/register`          | Register a new user (with validation)    |
| GET    | `/auth/confirmation-email`| Trigger or confirm email verification    |
| GET    | `/auth/refresh`           | Refresh expired access tokens            |
| POST   | `/auth/password_recovery` | Request a password reset                 |
| POST   | `/auth/logout`

### 👤 User Routes (`/users`)

| Method | Endpoint                  | Description                              |
|--------|---------------------------|------------------------------------------|
| GET    | `/users/:id`              | Get user info by ID (protected)          |
| PUT    | `/users/update/:id`       | Update user profile (protected)          |
| POST   | `/users/:id/upload`       | Upload user avatar (protected)           |
| GET    | `/users/:id/avatar`       | Get user avatar (protected)              |
| POST   | `/users/:id/forget-password` | Simulate password recovery (logs a message) |


### 🏢 Organisation Routes (`/organisations`)

| Method | Endpoint                          | Description                                      |
|--------|-----------------------------------|--------------------------------------------------|
| GET    | `/organisations`                  | Retrieve all organisations (protected)          |
| POST   | `/organisations`                  | Create a new organisation (protected)           |
| GET    | `/organisations/:orgId`           | Get organisation details by ID (protected)      |
| GET    | `/organisations/:orgId/allUsers`  | Get all users in an organisation (admin/owner)  |
| POST   | `/organisations/:orgId/addUser`   | Add a user to an organisation (admin/owner)     |
| PATCH  | `/organisations/:orgId/assign-Admin` | Assign admin role to a user (owner only)       |
| PATCH  | `/organisations/:orgId/removeAdmin` | Remove admin role from a user (owner only)     |
| DELETE | `/organisations/:orgId/remove-user` | Remove a user from an organisation (admin/owner) |
| POST   | `/organisations/:orgId/leave`     | Leave an organisation (protected)               |

✅ Schema Validation
Registration is validated using a custom middleware with a JSON schema located in schemas/registerPayload.js.

🛡️ Middleware Overview
IsAuthenticatedMiddleware – Protects sensitive routes using access tokens

SchemaValidationMiddleware – Ensures incoming data matches predefined schemas

uploadMiddleWare – Handles multipart form data for image uploads


📦 Getting Started
Prerequisites
Node.js v14+

npm or yarn

MongoDB or any database setup for production (adjustable)

Installation
```bash
git clone https://github.com/your-username/uriel-api.git
cd uriel-api
npm install


Running the Server
```bash
    npm run dev

or for production:
```bash
    npm start


🧪 Testing Endpoints (Optional with Postman or Swagger)
You can test these routes using Postman or any HTTP client. Swagger documentation coming soon!

✨ Contributing
Have suggestions or want to add new features? Fork this repo and submit a pull request!

📜 License
This project is licensed under the MIT License.

👨‍💻 Author
Joshua Anaele
Backend Developer | DevOps Enthusiast | Node.js Lover
LinkedIn | Twitter | Portfolio

🌟 Star this repo!
