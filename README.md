# Smart Job Tracker

Smart Job Tracker is a full-stack job application management platform developed using React.js, Node.js, Express.js, MongoDB Atlas, Docker, and Tailwind CSS.

The project was designed to simulate a real-world recruitment and job tracking platform where users can search jobs, apply for roles, track applications, and manage job postings through an admin dashboard.

The application includes frontend and backend containerization using Docker along with cloud database integration and email notification functionality.

---

# Project Architecture

Frontend:

* React.js
* Tailwind CSS
* Vite

Backend:

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Nodemailer
* bcryptjs

DevOps and Deployment:

* Docker
* Docker Compose
* Docker Hub

---

# Features

## Authentication System

* User signup
* User signin
* Password encryption using bcryptjs
* Persistent login support
* Logout functionality

## Professional Job Dashboard

* Modern responsive UI inspired by real recruitment platforms
* Job listings with detailed information
* Search and filtering functionality
* Applied jobs tracking

## Job Search and Filters

Users can search and filter jobs using:

* Job title
* Company
* Skills
* Work mode
* Location
* Salary range

---

## Apply Job System

Users can:

* Open application modal
* Submit applications
* Upload application details
* Track applied jobs

Applied jobs remain persistent after page refresh using localStorage.

---

## Admin Dashboard

Admin functionality includes:

* Posting new jobs
* Viewing submitted applications
* Managing job listings
* Reviewing candidate information

---

## Email Notification System

The backend automatically sends email notifications whenever a user applies for a job.

Integrated using:

* Nodemailer
* Gmail SMTP

---

## MongoDB Atlas Integration

Cloud database integration was implemented using MongoDB Atlas.

Collections used:

* users
* jobs
* applications

---

## Docker Containerization

Frontend and backend were containerized separately using Docker.

Docker images were pushed to Docker Hub for deployment and portability.

---

# Technologies Used

## Frontend

* React.js
* Tailwind CSS
* Lucide React Icons
* Vite

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* bcryptjs
* Nodemailer
* dotenv

## DevOps

* Docker
* Docker Compose
* Docker Hub

---

# Project Folder Structure

```txt
smart-job-tracker
├── client
├── server
├── docker-compose.yml
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

---

# Frontend Setup

The frontend was created inside the `client` folder using React.js and Vite.

## Frontend Commands Used

```bash
cd client
npm install
npm run dev
```

After running the frontend:

```txt
VITE v8.0.12 ready
Local: http://localhost:5173/
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## Frontend Production Build

```bash
npm run build
```

Generated build files:

```txt
dist/index.html
dist/assets/index.css
dist/assets/index.js
```

---

# Frontend Architecture

## App.jsx

App.jsx was used as the primary frontend controller component.

Responsibilities:

* Authentication handling
* Dashboard rendering
* Job search and filtering
* Modal management
* API communication
* Applied jobs persistence
* State management

Major frontend features:

* Sign Up
* Sign In
* Job Search
* Job Application Forms
* Admin Dashboard
* Applied Job Tracking
* Profile Management

---

## main.jsx

main.jsx was used as the React entry point for rendering the application into the DOM.

Responsibilities:

* Connecting React application with DOM
* Rendering App.jsx
* Initializing frontend application

---

## index.css

index.css was used for:

* Tailwind imports
* Global styling
* Typography
* Layout consistency

---

# Backend Setup

The backend was created inside the `server` folder using Node.js and Express.js.

## Backend Commands Used

```bash
cd server
npm install
npm run dev
```

After running the backend:

```txt
Server running on http://localhost:5000
Connected to MongoDB
```

Backend runs on:

```txt
http://localhost:5000
```

---

# Backend Architecture

## server.js

server.js was used as the backend entry point.

Responsibilities:

* Express server setup
* Middleware configuration
* MongoDB connection
* API initialization
* Environment variable loading

The backend handled:

* Authentication APIs
* Job APIs
* Application APIs
* Email service integration

---

## MongoDB Models

The backend used:

* User Schema
* Job Schema
* Application Schema

Collections:

* users
* jobs
* applications

---

## REST APIs

Main APIs:

* /api/signup
* /api/signin
* /api/jobs
* /api/applications

Used for:

* User registration
* User login
* Job posting
* Job fetching
* Job applications
* Admin management

---

# MongoDB Atlas Setup

MongoDB Atlas was used as the cloud database service.

Database used:

```txt
jobtracker
```

MongoDB connection was managed using environment variables.

Example:

```env
MONGO_URI=your_mongodb_connection_string
```

---

# Admin Creation

Admin user was created through backend API.

Command used:

```bash
curl -X POST http://localhost:5000/api/create-admin
```

Successful response:

```json
{
  "message": "Admin created successfully"
}
```

---

# Email Notification Setup

Nodemailer was installed for email functionality.

Command used:

```bash
npm install nodemailer
```

Environment variables added inside `server/.env`:

```env
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
ADMIN_EMAIL=your_email
```

This enabled:

* Applicant confirmation emails
* Admin notification emails

---

# Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
ADMIN_EMAIL=your_email
PORT=5000
```

---

# Docker Setup

## Backend Dockerfile

Created inside:

```txt
server/Dockerfile
```

---

## Frontend Dockerfile

Created inside:

```txt
client/Dockerfile
```

---

## Docker Compose

Created in root folder:

```txt
docker-compose.yml
```

---

## Docker Build and Run

```bash
docker compose up --build
```

Successful Docker output:

```txt
Image job-tracker-backend Built
Image job-tracker-frontend Built
Container job-tracker-backend-1 Created
Container job-tracker-frontend-1 Created
Connected to MongoDB
VITE ready
```

---

# Docker Images

Frontend Docker Image:
https://hub.docker.com/r/himajaarabati/job-tracker-frontend

Backend Docker Image:
https://hub.docker.com/r/himajaarabati/job-tracker-backend

---

# Docker Hub Push Commands

Frontend image tagging:

```bash
docker tag job-tracker-frontend himajaarabati/job-tracker-frontend:latest
```

Backend image tagging:

```bash
docker tag job-tracker-backend himajaarabati/job-tracker-backend:latest
```

Frontend image push:

```bash
docker push himajaarabati/job-tracker-frontend:latest
```

Backend image push:

```bash
docker push himajaarabati/job-tracker-backend:latest
```

---

# GitHub Upload

The following files and folders were uploaded to GitHub:

```txt
client
server
docker-compose.yml
package.json
package-lock.json
README.md
.gitignore
```

---

# .gitignore

```gitignore
node_modules
.env
dist
.DS_Store
```

---

# Future Improvements

* Resume upload support
* JWT authentication
* Role-based authorization
* Real-time notifications
* Kubernetes deployment
* CI/CD pipeline integration
* Admin analytics dashboard

---

# Project Goal

The objective of this project was to build a scalable and production-style full-stack job tracking platform using modern frontend, backend, database, and containerization technologies while following real-world software engineering and DevOps practices.
