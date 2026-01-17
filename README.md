# EliteBazar - Premium E-Commerce Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4.svg)

**EliteBazar** is a high-performance, modern e-commerce application designed as a **Client-Side Monolith**. It delivers a complete full-stack experience—including product browsing, checkout, order management, and analytics—running entirely within the browser using advanced state management and local persistence.

---

## 🚀 Key Features

### 🛍️ User Portal (The Shop)
*   **Cinematic Design**: Immersive hero section with smooth animations and bento-grid layouts.
*   **Dynamic Catalog**: Filter, sort, and search products with instant results.
*   **Seamless Checkout**: Guest and User checkout flows with address management and coupon support.
*   **User Dashboard**: Order history, wishlist management, and profile settings.

### 🛠️ Admin Portal (The Control Center)
*   **Visual Analytics**: Interactive 3D charts for revenue, category distribution, and stock levels.
*   **Content Management System (CMS)**:
    *   Dynamically update Homepage Banners.
    *   Edit "About Us" and "Contact" page stories and details.
*   **Order Management**: Process orders from "New" to "Delivered".
*   **Product CRUD**: Add, edit, or remove products and manage inventory.

### 🤝 Distributor Portal (Affiliate System)
*   **Dedicated Access**: Secure login for brand partners.
*   **Performance Tracking**: Track orders placed using specific distributor coupon codes.
*   **Real-Time Metrics**: View total revenue generated and average order value.

---

## 🛠️ Technology Stack

*   **Core**: [React 18](https://react.dev/), [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/)
*   **State Management**: React Context API + LocalStorage Persistence
*   **Animation**: [Framer Motion](https://www.framer.com/motion/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project folder:
    ```bash
    cd "E-Commerce Website Development"
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Visit `http://localhost:5173` in your browser.

---

## 🔑 Default Credentials

Use these credentials to explore the protected portals.

| Role | Portal URL | Username | Password | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `/admin/login` | `admin` | `admin123` | Full access to Dashboard & CMS |
| **Distributor** | `/distributor/login` | `john@example.com` | `distributor123` | Tracks orders for coupon `DIST2025` |
| **User** | `/login` | `user@example.com` | `password123` | Demo customer account |

*(Note: Data is persisted in your browser's LocalStorage. To reset the app to its default state, simply clear your browser's application data/cache.)*

---

## 🏗️ Architecture Overview

This project uses a **Virtual Backend** architecture.

*   **State as Database**: The `StoreContext.tsx` acts as the central database, managing relational data (Users, Orders, Products).
*   **Persistence**: All state changes are immediately synced to `localStorage`, ensuring data survives page reloads.
*   **Security**: Portals are protected by simulated auth guards that check user roles before rendering protected routes.

For a deep dive into the system design, check the `architecture_design.md` file in the documentation.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/      # Reusable UI components (Buttons, Charts, Layouts)
│   ├── contexts/        # Global State (StoreContext)
│   ├── pages/
│   │   ├── admin/       # Admin Portal Pages
│   │   ├── distributor/ # Distributor Portal Pages
│   │   └── user/        # Public Shop Pages
│   └── App.tsx          # Main Router Configuration
├── lib/                 # Utilities and Helpers
└── styles/              # Global CSS and Tailwind Config
```