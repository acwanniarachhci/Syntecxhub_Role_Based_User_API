# Syntecxhub Role-Based User Management API

A REST API with role-based access control (admin / user), built with Node.js, Express, MongoDB (Mongoose) and JWT.
Created as part of the Syntecxhub Back-End Development Internship (Week 4, Project 1).

## Features

- User model with `role` (`user` / `admin`) and `isBlocked`
- Signup always creates a regular `user` (no privilege escalation)
- JWT contains the user's id and role
- `protect` middleware (authentication) and `restrictTo("admin")` middleware (authorization)
- Admin endpoints to list users, block / unblock, promote / demote
- Blocked users cannot log in and their existing tokens stop working
- Admins cannot block or demote their own account
- Audit log of every admin action (who, what, whom, when)
- Admin account created via a seed script

## Tech Stack

Node.js, Express, MongoDB + Mongoose, bcryptjs, jsonwebtoken, dotenv

## Getting Started

1. Clone the repo and run `npm install`
2. Create a `.env` file:

PORT=5006
MONGO_URI=mongodb://127.0.0.1:27017/syntecxhub_roles
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1h
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@12345

3. Create the admin account: `npm run seed`
4. Run `npm run dev`

## API Endpoints

| Method | Endpoint                          | Access     | Description                    |
|--------|-----------------------------------|------------|--------------------------------|
| POST   | /api/auth/signup                  | Public     | Register (role is always user) |
| POST   | /api/auth/login                   | Public     | Login and receive a JWT        |
| GET    | /api/users/me                     | Logged-in  | Current user profile           |
| GET    | /api/admin/users                  | Admin      | List users (`?role=`, `?blocked=`) |
| GET    | /api/admin/users/:id              | Admin      | Get one user                   |
| PATCH  | /api/admin/users/:id/block        | Admin      | Block a user                   |
| PATCH  | /api/admin/users/:id/unblock      | Admin      | Unblock a user                 |
| PATCH  | /api/admin/users/:id/promote      | Admin      | Promote user to admin          |
| PATCH  | /api/admin/users/:id/demote       | Admin      | Demote admin to user           |
| GET    | /api/admin/audit-logs             | Admin      | View audit log                 |

## Status Codes

| Code | Meaning                                         |
|------|-------------------------------------------------|
| 200  | Success                                         |
| 201  | User created                                    |
| 400  | Validation error / invalid ID / invalid action  |
| 401  | Missing, invalid or expired token / bad login   |
| 403  | Forbidden (not admin) or account blocked        |
| 404  | User or route not found                         |
| 409  | Username or email already exists                |
| 500  | Server error                                    |

## Screenshots

Screenshot 2026-11-01 131859.png
Screenshot 2026-11-01 132015.png
Screenshot 2026-11-01 132039.png
Screenshot 2026-11-01 132113.png
Screenshot 2026-11-01 132145.png
Screenshot 2026-11-01 132629.png

## Author

Amandi Wanniarachchi