# Admin Panel Skill

This skill provides a comprehensive guide and set of patterns for building a modern, secure, and feature-rich Admin Panel for educational institutions (Schools/Colleges).

## Core Technologies

- **Frontend**: React (Vite), TypeScript, Tailwind CSS
- **Backend/Auth**: Supabase (PostgreSQL + Realtime)
- **Icons**: Lucide React
- **State Management**: React Context API

## Features & Implementation Details

### 1. Secure Login System

- **Authentication**: Use Supabase Auth for email/password login.
- **Session Management**: Persistent sessions with automatic redirection.
- **Security**: Protected routes using an `AuthContext` and `ProtectedRoute` component.
- **UI**: Premium, centered login card with background overlays and connection status indicators.

### 2. Dashboard Overview

- **Metric Cards**: Display key statistics (e.g., Total Students, Active Staff, Pending Admissions).
- **System Status**: Real-time connection status to the database/API.
- **Quick Links**: Easy access to common tasks (e.g., "Add New Student", "Post Announcement").

### 3. Content Management Systems (CMS)

- **Banner/Slider Manager**: CRUD operations for homepage sliders with image preview.
- **News Ticker**: Manage scrolling announcements with priority levels.
- **Notification Center**: Categorized alerts (Student, Faculty, Academic, General).
- **Gallery Manager**: Manage event photos and albums.

### 4. Educational Records Management

- **Admission Manager**: Handle new applications, filter by status, and view detailed forms.
- **Student Database**: Searchable list of students with profile details.
- **Faculty Management**: Staff directory with department-wise filtering.

## Design Patterns

- **Layout**: Sidebar navigation with a collapsible menu for mobile.
- **Feedback**: Loading states (spinners), success toasts, and error alerts.
- **Responsive**: Mobile-first design for all admin controls.
- **Consistency**: Centralized theme tokens and reusable header/table components.

## Best Practices

- **Real-time Updates**: Use Supabase Realtime for instant updates across the dashboard.
- **Error Handling**: Graceful handling of network failures and invalid inputs.
- **Performance**: Memoize heavy computations and use efficient data fetching patterns (e.g., pre-fetching in GlobalContext).
