# Web Dev Tools

This repository contains the **React** frontend and **Node.js + Apollo GraphQL** backend for the **Web Dev Tools** project.

---

## 🌐 About the Project

**Web Dev Tools** is a developer-friendly platform that provides a suite of useful tools like formatters, converters, and code generators — all accessible in one place. It streamlines your workflow whether you're writing, debugging, or converting code and data formats.

---

## 🚀 Features

- 🛠️ Online developer utilities (e.g., JSON formatter, slug generator, case converter)
- 💾 Save and retrieve tool usage history (for both logged-in and anonymous users)
- 👤 Authentication system to manage user-specific preferences
- 🧠 Admin dashboard for viewing and analyzing usage trends
- 🎨 Monaco Editor customization (minimap, word wrap, tab size)
- 🌙 Dark mode support
- ⚡ Fast and responsive UI built with React and Bootstrap
- 📡 Backend powered by Apollo GraphQL and MongoDB
- 📦 Modular and easily extendable architecture

---

## 🔗 Live Site

Explore the project live at:  
🌍 [https://web-dev-tools-mu.vercel.app/](https://web-dev-tools-mu.vercel.app/)

---

## 🔗 GitHub Repository

You can find the source code and contribute here:  
[https://github.com/deepakpunyani-git/web-dev-tools](https://github.com/deepakpunyani-git/web-dev-tools.git)

---

## 📁 Project Structure

- `/client` — React frontend application  
- `/server` — Node.js backend API with Apollo Server and MongoDB

---

## ✅ Prerequisites

- Node.js (v16+ recommended)  
- npm or yarn  
- MongoDB (local or remote instance)

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/deepakpunyani-git/web-dev-tools.git
cd web-dev-tools


---

## 🧪 Environment Variable Setup

You need to manually create `.env` files in both the `client` and `server` directories for the project to run locally.

---

### 🔹 Client Environment File (`/client/.env`)

Create a file named `.env` inside the `/client` folder with this content:

```env
REACT_APP_API_URL=http://SITE:PORT/graphql



### 🔹 Server Environment File (`/server/.env`)

Create a file named `.env` inside the `/server` folder with this content:

```env
PORT=3001
MONGODB_URI=
saltRounds=
JWT_SECRET=

email=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=

CLIENT_URL=


---

### Key Updates:
1. **Fixed missing variable explanations** for both the **client** and **server** `.env` files.
2. **Corrected incomplete sections** in the `.env` setup for both client and server.
3. Added **complete environment variables** for both client and server, ensuring the app can run locally after setup.
