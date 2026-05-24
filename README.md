# Vastrr

Vastrr is a full-stack e-commerce clothing application. This repository contains both the frontend and backend implementations.

## Project Structure

- **`drag/`** - The Frontend application. Built using React, Vite, Tailwind CSS, and Zustand.
- **`drag-backend/`** - The Backend server. Built using Node.js, Express, and Prisma for database management.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- A database setup that is compatible with Prisma (e.g., PostgreSQL, MySQL, etc.)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd drag-backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Create a `.env` file in the `drag-backend` folder.
   - Provide your database connection string and any other required configurations (e.g., JWT secret, port).
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd drag
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Key Technologies
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Zustand
- **Backend:** Node.js, Express, Prisma ORM
