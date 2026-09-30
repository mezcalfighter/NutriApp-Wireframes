# NutriApp - Nutritionist & Patient Management System

A mobile-first web application for nutritionists to manage patients and diet plans, and for patients to track their progress and schedule appointments.

## Features

### Authentication
- Shared login for both nutritionists and patients
- MFA (Multi-Factor Authentication) required for nutritionists
- Account lockout after 5 failed login attempts (30-minute lockout)
- Password reset functionality

### Nutritionist Portal
- **Dashboard**: Overview of appointments, patients, and quick stats
- **Patient Management**: Add, edit, view patient details and history
- **Diet Templates**: Create reusable diet templates with drag-and-drop meal planning
- **Diet Assignment**: Assign and customize diets for patients
- **Appointments**: View, approve, and manage appointment requests
- **Availability**: Set weekly availability schedule
- **Profile**: Manage personal information and MFA settings

### Patient Portal
- **Dashboard**: Daily overview, meal tracking, progress summary
- **Current Diet**: View assigned diet plan with detailed nutrition info
- **Progress Tracking**: Weight tracking with history and goal visualization
- **Appointments**: Schedule, view, and manage appointments
- **Profile**: Update personal and health information

## Demo Credentials

### Nutritionist Login
- Email: `demo@nutritionist.com`
- Password: `demo123`
- MFA Code: `123456`

### Patient Login
- Email: `demo@patient.com`
- Password: `demo123`

## Navigation

The app features a bottom navigation bar for easy mobile access:

**Nutritionist:**
- Home, Patients, Schedule, Templates, Profile

**Patient:**
- Home, Diet, Progress, Appointments, Profile

## Design System

- **Primary Color**: Emerald (Green) - #10b981
- **Mobile-First**: Optimized for mobile devices with responsive design
- **Clean UI**: Modern, healthcare-focused aesthetic
- **Accessible**: Clear typography and proper contrast ratios

## Technical Stack

- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Mobile-first responsive design

## Screen Count

Total: ~28 screens

**Authentication**: 5 screens
**Nutritionist Portal**: 13 screens
**Patient Portal**: 10 screens
