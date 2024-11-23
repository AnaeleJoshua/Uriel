# Organisation Management API

A robust API for managing users, organisations, and their relationships. This project is built with **Node.js**, **Express**, and **Sequelize** as the ORM to interact with a relational database.

## Features

##### User Management:
 - Create, retrieve, update, and delete users.

##### Organization Management:
- Create, retrieve, and delete organizations.
- Associate users with organizations.
##### Secure Authentication:
- Refresh token-based authentication.
- Access token generation using JSON Web Tokens (JWT).
##### Transaction Management:
- Ensures data integrity using Sequelize transactions.
- Clean and Scalable Architecture:
- Follows MVC design pattern.
- Centralized error handling and database initialization.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A relational database (e.g., MySQL, PostgreSQL)
- Git

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/AnaeleJoshua/Uriel.git
   cd Uriel
   ```

### Technologies Used
- Runtime: Node.js
- Framework: Express.js
- Database: PostgreSQL
- ORM: Sequelize
- Authentication: JWT-based token system
- Deployment: Vercel (or other - - hosting platforms)
- Environment Management: dotenv

##### Clone the Repository:
```
bash

git clone https://github.com/AnaeleJoshua/Uriel.git
cd Uriel
```
Install Dependencies:
```
bash

npm install
```
##### Configure Environment Variables: 
Create a .env file in the root directory and populate it with the following variables:
```
plaintext


PORT=<your preferrable b>
DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<dbname>
ACCESS_TOKEN_SECRET=<your-access-token-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
```
Run Database Migrations: 
Initialize the database with Sequelize migrations.
```
bash

npx sequelize-cli db:migrate
```
Start the Server:
```
bash

npm start
```
##### API Endpoints
- Authentication
Method | Endpoint | Description
POST   | /login	  | Log in a user and issue tokens
POST	/refresh-token	Generate a new access token
User
Method	Endpoint	Description
GET	/users/:id	Retrieve user by ID
GET	/users	Retrieve all users
POST	/users	Create a new user
PUT	/users/:id	Update user details
DELETE	/users/:id	Delete a user
Organization
Method	Endpoint	Description
GET	/organizations/:id	Retrieve organization by ID
GET	/organizations	Retrieve all organizations
POST	/organizations	Create a new organization
DELETE	/organizations/:id	Delete an organization
User-Organization Association
Method	Endpoint	Description
POST	/organizations/:orgId/add-user	Add a user to an organization
Database Schema
User Table
Field	Type	Constraints
userId	INTEGER	Primary key
email	STRING	Unique, Not null
password	STRING	Not null
firstName	STRING	Not null
lastName	STRING	Not null
phone	STRING	Nullable
refreshToken	STRING	Nullable
Organization Table
Field	Type	Constraints
orgId	INTEGER	Primary key
name	STRING	Not null
description	STRING	Nullable
createdBy	STRING	Not null
UserOrganization Table
Field	Type	Constraints
userId	INTEGER	Foreign key (User)
orgId	INTEGER	Foreign key (Organization)
Project Structure

src/
├─ controllers/
│   ├── userController.js
│   ├── organisationController.js
│   └── refreshTokenController.js
├── models/
│   ├── user.js
│   ├── organisation.js
│   └── userOrganisation.js
├── config/
│   └── db.js
├── middleware/
│   └── authMiddleware.js
├── utils/
│   └── utility.js
├── app.js
├── routes.js
└── server.js
Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch for your feature/bug fix:
bash
Copy code
git checkout -b feature-name
Commit and push your changes:
bash
Copy code
git commit -m "Describe your changes"
git push origin feature-name
Open a pull request.
License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For inquiries or support, reach out to:

Name: Josh
Email: anaelejoshua@gmail.com
GitHub: https://github.com/AnaeleJoshua


