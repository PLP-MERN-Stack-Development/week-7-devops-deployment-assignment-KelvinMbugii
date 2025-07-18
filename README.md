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
###Backend
Node.js & Express.js

MongoDB & Mongoose

JSON Web Tokens (JWT)

bcrypt for password hashing

Socket.io for real-time communication

node-cron for scheduled tasks

###Frontend
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
Navigate to backend directory (e.g. server/):


``` bash 
cd server
Install dependencies:

bash
pnpm install
# or
npm install
Create .env file in backend root with required variables:


bash
pnpm start

```
