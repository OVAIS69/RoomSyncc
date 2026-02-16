# RoomSync - Smart Room Booking System

A comprehensive web application for managing classroom and laboratory bookings in educational institutions. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Overview of room availability and statistics
- **Room Booking**: Faculty and admin can book rooms with conflict detection
- **Interactive Blueprint**: Visual representation of campus blocks and room status
- **Role-based Access**: Different permissions for faculty, admin, and students
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
src/
├── components/
│   └── RoomSync.tsx    # Main application component
├── App.tsx             # App wrapper
├── index.tsx           # Entry point
└── index.css           # Global styles with Tailwind CSS
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Create React App

## Development Team

- **Noorsharma Ansari** (29802B0044) - Project Lead & Backend Developer
- **Sneha Singh** (29302C0008) - Frontend Developer & UI/UX Designer  
- **Mohd Ovais Shaikh** (29302B0058) - Full Stack Developer & Database Designer

## Usage

1. **Dashboard**: View overall statistics and quick room status
2. **Booking**: Select rooms, dates, and times for events
3. **Blueprint**: Interactive map showing all rooms and their availability
4. **About**: Project information and team details
5. **Support**: Contact form and FAQ section

The application automatically prevents double bookings and provides real-time room availability status.
