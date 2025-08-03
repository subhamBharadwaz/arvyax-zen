# 🧘 Arvyax Zen Wellness App

A full-stack wellness platform built with **Next.js (App Router, TanStack Query)** on the frontend and **Node.js + Express + MongoDB** on the backend. It supports JWT-based auth, session creation with draft and publish modes, and a fully featured dashboard.

---

## 📁 Project Structure

arvyax-zen/
├── server/ # Backend - Express, MongoDB
├── web/ # Frontend - Next.js 15 (App Router)
└── README.md # Project setup instructions

---

## 🛠️ Prerequisites

- **Node.js** ≥ 18
- **PNPM** ≥ 8
- **MongoDB Atlas**

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/subhamBharadwaz/arvyax-zen.git
cd arvyax-zen
```

### 2. Setup the Backend

`cd server`
`cp .env.example .env`
`pnpm install`
`pnpm dev`

⚠️ Make sure to configure your .env with MongoDB Atlas URI, JWT secrets, etc.

### 3. Setup the Frontend

`cd ../web`
`cp .env.example .env.local`
`pnpm install`
`pnpm dev`

⚠️ The frontend expects the backend to run at http://localhost:4000 (update .env.local if needed).

### 🚀 Features

- 🔐 JWT Auth (access + refresh tokens)

- 📝 Session Editor with auto-save & draft/publish toggle

- 📊 Dashboard to manage sessions

- 🍪 Secure Cookie handling for auth

- ⚛️ Feature-Based Folder Structure (auth, session, dashboard, etc.)

- 💅 Built with Shadcn UI, React Hook Form, and Zod

### 📌 Notes

- Backend runs on http://localhost:4000

- Frontend runs on http://localhost:3000

- Both server and web folders use .env files — be sure to configure them correctly before running.
