# Foodify

Foodify is a full‑stack food ordering web app built with **React + TypeScript** (frontend) and **Node.js + Express + MongoDB (Mongoose)** (backend). Users can browse restaurants, add menu items to a cart, checkout, pay, and track orders. Restaurant admins can manage menus and monitor orders, and super admins can monitor the platform.

---

## Features

### Customer
- Browse restaurants and view restaurant details
- Add/remove items from cart and update item quantities
- Checkout with prefilled user details (name/phone)
- Place an order and proceed to payment
- View order history and order status tracking

### Restaurant Admin
- Dashboard
- Menu management
- Orders management

### Super Admin
- Dashboard
- User management
- Restaurant approvals
- All orders monitoring

---

## Tech Stack

### Frontend
- React + TypeScript
- React Router
- Tailwind CSS (UI styling)
- Lucide Icons
- Sonner (toast notifications)
- Axios (via `services/api`)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- REST APIs

---

## Project Structure (high level)

### Frontend
- `src/app/pages` – pages (Landing, Restaurants, Checkout, Orders, Payment, Profile, Admin)
- `src/app/components` – shared UI components
- `src/app/contexts` – global state (CartContext)
- `src/services/api` – Axios instance / API client

### Backend
- `models/` – Mongoose schemas (Cart, Order, Offer, etc.)
- `controllers/` – request handlers
- `routes/` – express routers
- `server.js / app.js` – server entry + route mounting

---

## Setup

### 1) Clone & install

```bash
git clone <your-repo-url>
cd Foodify
