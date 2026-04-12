# WalletWise

WalletWise is a full stack expense tracker and digital wallet management system built with React, Node.js, Express, Supabase, JWT, Context API, Tailwind CSS, and Recharts.

## Project Structure

```text
walletwise/
├── client/                   React frontend
│   ├── src/
│   │   ├── components/       Reusable UI components
│   │   ├── context/          Context API (global state)
│   │   ├── pages/            Page-level components
│   │   ├── services/         API service functions
│   │   ├── utils/            Helper/utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
└── server/                   Express backend
    ├── database/
    │   └── schema.sql
    ├── src/
    ├── .env
    ├── .env.example
    └── package.json
```

## Tech Stack

### Frontend
- **React 18** with Context API for state management
- **React Router v6** for client-side routing
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for HTTP requests
- **Vite** as the build tool

### Backend
- **Node.js** with **Express**
- **Supabase** as the database and backend-as-a-service
- **JWT** for authentication
- **bcryptjs** for password hashing

## Quick Start

### 1. Backend

```bash
cd server
npm install
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in `server/` based on `.env.example`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_secure_secret
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

## Database

The SQL schema is located at `server/database/schema.sql`. It includes tables for:
- **users** — authentication and profile info
- **wallets** — balance, income total, expense total, and savings per user
- **transactions** — individual income/expense entries with category, date, and notes
