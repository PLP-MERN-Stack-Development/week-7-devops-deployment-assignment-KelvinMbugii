###  MediCare Appointment System
A full-stack MERN (MongoDB, Express, React, Node.js) medical appointment system with user authentication, role-based access, appointment scheduling, and notifications.

## Project Overview

MediCare Appointment System provides:

User roles: Admin, Doctor, Patient

User registration and login with JWT authentication

Appointment booking and management

Real-time notifications via Socket.io

Role-based route protection

Admin panel to manage users, clinics, and notifications

## Technologies
### Backend
Node.js & Express.js

MongoDB & Mongoose

JSON Web Tokens (JWT)

bcrypt for password hashing

Socket.io for real-time communication

node-cron for scheduled tasks

### Frontend
React.js with Hooks and Context API

Vite build tool

React Router v6

Tailwind CSS for styling

lucide-react icons

### Getting Started
## Prerequisites

Node.js (v16+ recommended)

MongoDB (local or cloud)

pnpm or npm installed

## Backend Setup
1.Navigate to backend directory (e.g. server/):

``` bash 
cd server
```
2. Install dependencies:

```bash
pnpm install
## or
npm install
```
3. Create .env file in backend root with required variables:

4. Run Backend server 
```bash
pnpm start
```
## Frontend Setup
1. Navigate to frontend

```bash
cd client
```
2. Install dependencies
```bash
pnpm install
# or
npm install
```
3. Create a .env

4. Run frontend development server

```bash
pnpm run dev
# or
npm run dev
```
## Build for production
```bash
pnpm run build
# or 
npm run build
```

### Deployed link
```bash https://medicare-sr9t.onrender.com
```
