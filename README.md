# 🛍️ Loomly — Enterprise-Grade E-Commerce Platform

A production-ready, full-stack e-commerce web application engineered with the MERN stack. Built with an emphasis on **network layer resilience**, **concurrency control**, and **secure distributed state management**.

---

## 📑 Table of Contents

- [Architectural Deep Dive & Case Study](#-architectural-deep-dive--case-study)
  - [1. The Thundering Herd Problem: Concurrency & Mutex Interceptor](#1-the-thundering-herd-problem-concurrency--mutex-interceptor)
  - [2. Stale Closures & Memory Safety in React Lifecycle](#2-stale-closures--memory-safety-in-react-lifecycle)
  - [3. Zero-Trust Auth Model (Dual-Token Pattern)](#3-zero-trust-auth-model-dual-token-pattern)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Configuration & Getting Started](#-getting-started)

---

## 🔬 Architectural Deep Dive & Case Study

### 1. The Thundering Herd Problem: Concurrency & Mutex Interceptor

#### The Problem

In standard single-page applications (SPAs), when an Access Token expires while multiple parallel HTTP calls are dispatched (e.g., fetching user profile, cart count, and product notifications simultaneously), every request returns an `HTTP 401/403` status concurrently.

- **Naive Approach:** Each failing request initiates its own `/auth/token` refresh call.
- **Failure Mode:** Triggers a race condition on the backend. In strict refresh token rotation environments, multiple calls with the same refresh token trigger **Refresh Token Reuse Detection**, immediately revoking the user's session and forcing an unexpected logout.

#### The Engineering Solution

Implemented a client-side **Mutex (Mutual Exclusion) Lock** inside the Axios response interceptor utilizing a shared singleton promise (`refreshPromise`):

```text
[Request 1] ─── (403 Expired) ───► [Acquires Mutex: refreshPromise created] ───► POST /auth/token
[Request 2] ─── (403 Expired) ───────────┐
[Request 3] ─── (403 Expired) ───────────┴──► [Awaits existing refreshPromise]
                                                        │
[All Requests Replayed] ◄─── (Tokens Re-injected) ◄─────┘ (Mutex reset to null)
```

1. The first failed request checks `if (!refreshPromise)`. Being `null`, it instantiates the network call and assigns it to `refreshPromise`.
2. Any concurrent failed requests find `refreshPromise` truthy and bypass spawning new network requests, queuing up on the exact same promise instance.
3. Upon completion, a `.finally()` block resets `refreshPromise = null`, reopening the lock for future token lifecycles while previously queued requests retry transparently with `originalRequest._retry = true`.

---

### 2. Stale Closures & Memory Safety in React Lifecycle

#### The Problem

Axios interceptors are global singletons instantiated outside React's render tree.

- **Stale Closures:** Capturing React component state (`token`) inside an interceptor registered with an empty dependency array (`[]`) locks the interceptor scope onto the initial snapshot (`null`), causing all outgoing requests to fail silently.
- **Memory Leaks:** Re-registering interceptors on every state change creates duplicate interceptor chains inside Axios, amplifying request overhead and compounding unhandled promise rejections.

#### The Engineering Solution

- **Zero-Delay Ref Synchronization:** Decoupled interceptor lifecycle from React re-renders by utilizing `useRef(token)`. Outgoing requests perform a live reference lookup (`tokenRef.current`) at the exact millisecond the HTTP packet is constructed.
- **Deterministic Cleanup (`eject`):** Interceptors register exactly once on mount (`[]`) and return an explicit cleanup function leveraging `axiosInstance.interceptors.{request|response}.eject(id)`, completely mitigating dangling listeners and memory leaks under React StrictMode mounting cycles.

---

### 3. Zero-Trust Auth Model (Dual-Token Pattern)

- **Access Token:** Short-lived (15 minutes), held strictly in-memory (React State / Ref). Never persisted to `localStorage` or `sessionStorage` to mitigate persistent Cross-Site Scripting (XSS) extraction vectors.
- **Refresh Token:** Long-lived (7 days), stored in an `HttpOnly`, `SameSite=Strict`, `Secure` cookie, completely inaccessible to JavaScript.
- **Silent Bootstrap:** An isolated vanilla `axios` instance boots on initial page load to verify session validity via credentials before rendering protected routes, eliminating UI flickering.

---

## ⚡ Key Features

### Security & Authentication

- Silent token rotation with client-side Mutex locking.
- In-memory token management with persistent session bootstrapping.
- Role-based Route Protection (Public, Authenticated, Admin).

### E-Commerce Capabilities

- **Product Catalog:** Real-time search, categorization, and multi-attribute filtering.
- **Cart Management:** Persistent shopping cart with instant optimistic quantity updates.
- **Checkout Pipeline:** Multi-step order review, address validation, and payment processing state machine.
- **User Dashboard:** Order history, shipping tracking, and profile management.

---

## 🛠️ Tech Stack

### Frontend

- **Core:** React 19, Vite
- **Routing:** React Router v6
- **State & Networking:** Context API, Custom Hooks, Axios (Custom Interceptors & Mutex)
- **Styling:** Bootstrap 5, Custom CSS

### Backend

- **Runtime:** Node.js, Express.js
- **Database:** MongoDB, Mongoose ODM
- **Security:** JSON Web Tokens (JWT), bcrypt, CORS, Cookie-Parser

---

## 📂 Project Directory Structure

```text
Loomly/
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance & custom interceptor definitions
│   │   ├── context/         # AuthContext & CartContext with custom reducers
│   │   ├── components/      # Atomic UI components, Modals, Loaders
│   │   ├── pages/           # Route views (Home, Shop, Cart, Checkout, Auth)
│   │   ├── routes/          # ProtectedRoute and RoleRoute wrappers
│   │   └── App.jsx          # Root provider tree & router setup
│   └── vite.config.js
│
├── backend/
│   ├── config/              # Database connection & environment parsing
│   ├── controllers/         # Request handling & HTTP status abstraction
│   ├── middleware/          # Auth verification, Rate limiters, Error handlers
│   ├── models/              # Mongoose schemas (User, Product, Order)
│   ├── routes/              # Express REST API endpoints
│   └── server.js            # App initialization & graceful shutdown listeners
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (`>= 18.x`)
- MongoDB (`>= 6.x` locally or MongoDB Atlas connection string)

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone [https://github.com/yourusername/loomly.git](https://github.com/yourusername/loomly.git)
cd loomly

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the **backend/** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_super_secret_access_key
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the **frontend/** directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Running Locally

```bash
# Terminal 1: Run Backend Server
cd backend
npm run dev

# Terminal 2: Run Frontend Development Server
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.
