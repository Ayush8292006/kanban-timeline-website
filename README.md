# ProjectFlow - Task Management App

A task management application with Kanban board, sortable list view, and timeline view. Built with React, TypeScript, and Tailwind CSS.

## Live Demo

"kanban-timeline-website.vercel.app"

## Features

- 3 Views - Kanban board (drag & drop), sortable list (virtual scrolling), timeline view
- Custom Drag & Drop - Built with HTML5 drag events, no external libraries
- Virtual Scrolling - Handles 500+ tasks in list view without performance issues
- Live Collaboration - Shows who's viewing which task (simulated with 4 users)
- Advanced Filters - Filter by status, priority, assignee, due date range
- URL Sync - Filters saved in URL, share filtered views with anyone
- Responsive - Works on desktop (1280px+) and tablet (768px)

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS (styling)
- Zustand (state management)
- date-fns (date handling)
- Vite (build tool)
- Lucide React (icons)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Ayush8292006/kanban-timeline-website.git
cd kanban-timeline-website

# Install dependencies
npm install

# Start development server
npm run dev