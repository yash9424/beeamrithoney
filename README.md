# 🍯 Beeamrit — Full-Stack E-Commerce

Rare vintage organic honey store — **Next.js 16 App Router + MongoDB + NextAuth + Tailwind v4**.

---

## 🚀 Quick Start

### 1. Install MongoDB
Download [MongoDB Community](https://www.mongodb.com/try/download/community) locally, or use a free [MongoDB Atlas](https://cloud.mongodb.com) cloud cluster.

### 2. Configure `.env.local`
```env
MONGODB_URI=mongodb://localhost:27017/beeamrit
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run
```bash
npm install
npm run dev
```
Open **http://localhost:3000**

### 4. Seed Demo Products
1. Register the **first account** — it auto-becomes **Admin**
2. Go to **Admin → Settings** → click **"Seed Demo Products"**

---

## 📱 All Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, featured products, origin story, testimonials |
| `/shop` | Collection grid — filter by collection, volume, search, sort |
| `/product/[slug]` | Product detail — gallery, quantity, volume, add to cart |
| `/cart` | Cart review + full checkout (delivery + payment form) |
| `/login` | Login / Register (email + password) |
| `/account` | User account — overview and order history |
| `/admin` | Admin dashboard — quarterly revenue, new customers, orders |
| `/admin/orders` | Order management with live status update dropdown |
| `/admin/inventory` | Full product CRUD — create/edit/delete + image upload |
| `/admin/customers` | Customer directory |
| `/admin/settings` | Store config + demo data seeding |

---

## ✨ Feature List

- **Auth** — NextAuth credentials (email/password); Google OAuth ready
- **Cart** — Zustand persistent cart with slide-out drawer
- **Checkout** — Delivery details form + card / digital wallet → creates order in MongoDB
- **Image Upload** — Saves to `/public/uploads/` locally; Cloudinary if configured
- **Admin Panel** — Product CRUD, order status management, customer list, stats dashboard
- **Auto Admin** — First registered account gets admin role automatically
- **Responsive** — Mobile, tablet, and desktop layouts

---

## 🔐 Admin Access

Register the **very first account** — it is automatically granted the `admin` role. All subsequent registrations are `user` role.

---

## ☁️ Optional: Cloudinary Image Hosting

Add to `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```
Without Cloudinary, uploaded images are saved to `public/uploads/` (local disk).

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | MongoDB (`beeamrit` database) |
| Auth | NextAuth.js v4 (JWT) |
| Cart state | Zustand (persisted) |
| Styling | Tailwind CSS v4 |
| Notifications | react-hot-toast |
| Forms | react-hook-form |
| Icons | lucide-react |
| Passwords | bcryptjs |
| Images | Cloudinary / local upload |
