# 🎓 TCE Smart Event Management Portal

A modern, role-based **Event Management Portal** developed for **Thiagarajar College of Engineering (TCE)**. The platform enables students to discover and register for departmental and college-wide events, while Event Coordinators can create, manage, and monitor events within their respective departments.

---

## 📌 Problem Statement

**Smart Event Management Portal**

Develop a web application to **create, manage, and register for events** in a college environment.

---

## 🚀 Project Overview

The **TCE Smart Event Management Portal** is designed to simplify event management within the college by providing a centralized platform for students and event coordinators.

The system supports:

- 👨‍🎓 Student Registration & Login
- 👨‍💼 Event Coordinator Login
- 📅 Department-based Event Management
- 🌍 College-wide Event Visibility
- 📝 Event Registration
- 📋 Registration Tracking
- 🔐 Role-Based Authentication
- 📱 Fully Responsive Design

---

## ✨ Key Features

### 👨‍🎓 Student Module

- Student Registration
- Secure Login
- View Department Events
- View College-Wide Events
- Search Events
- Register for Events
- View My Registrations
- Profile Management

---

### 👨‍💼 Event Coordinator Module

- Secure Login
- Create Events
- Edit Events
- Delete Events
- Manage Department Events
- View Registered Participants
- Export Participant List (Planned)

---

### 📅 Event Management

Each event contains:

- Event Title
- Banner Image
- Description
- Department
- Category
- Venue
- Date
- Time
- Maximum Seats
- Registration Deadline
- Event Visibility

---

## 🌍 Event Visibility

The portal supports two types of event visibility.

### 🏢 Department Only

Visible only to students of that department.

Example:

- IT Workshop
- CSE Department Symposium

---

### 🌐 College-Wide

Visible to students from all departments.

Example:

- Sports Tournament
- Hackathon
- Placement Drive
- NSS Camp
- NCC Camp

---

## 👥 User Roles

### Student

Students can:

- Register
- Login
- View Events
- Register for Events
- View Registered Events

---

### Event Coordinator

Event Coordinators can:

- Login
- Create Events
- Manage Events
- View Participants

> Coordinator accounts are pre-created by the administrator and cannot self-register.

---

## 🏗️ Technology Stack

### Frontend

- React (Vite)
- Bootstrap 5
- JavaScript (ES6)
- HTML5
- CSS3

### Backend

- Firebase Authentication
- Firebase Firestore
- Firebase Storage

### Deployment

- Vercel

### Version Control

- GitHub

---

## 📂 Folder Structure

```text
tce-smart-event-portal/

src/
│
├── assets/
├── components/
├── pages/
├── layouts/
├── firebase/
├── context/
├── hooks/
├── utils/
│
├── App.jsx
└── main.jsx
```

---

## 🔥 Firebase Collections

### Users

```text
users/

uid

name

email

department

phone

role
```

---

### Events

```text
events/

eventId

title

description

department

category

venue

date

time

maxSeats

registeredSeats

visibility

banner

createdBy
```

---

### Registrations

```text
registrations/

registrationId

studentId

eventId

registeredAt
```

---

## 🎨 UI Highlights

- Modern Startup Design
- Glassmorphism
- Blue & Purple Gradient Theme
- Responsive Layout
- Bootstrap Components
- Font Awesome Icons
- Smooth Animations
- Interactive Cards
- Professional Dashboard

---

## 📱 Responsive Design

The application is optimized for:

- 💻 Desktop
- 💼 Laptop
- 📱 Mobile
- 📲 Tablet

---

## 📌 Future Enhancements

- QR Code Event Pass
- Email Notifications
- Attendance Tracking
- Event Certificates
- Calendar Integration
- Push Notifications
- Analytics Dashboard
- Admin Panel

---

## 👨‍💻 Developed By

**Team Name:** *Code Crafters*

**Thiagarajar College of Engineering**

Department of Information Technology

---

## 📄 License

This project was developed for educational purposes as part of the **SiteCraft – Web Development Challenge** organized by the **TCE IITM IC Build Club**.
