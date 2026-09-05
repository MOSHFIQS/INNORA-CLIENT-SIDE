# 🌐 INNORA Hotel Management System — Client Web Application

Welcome to the **INNORA Client Application**, a luxury hotel reservation platform and administrative dashboard built with **Next.js 15 (App Router)**, **Redux Toolkit**, **RTK Query**, and **Tailwind CSS**.

---

## 🌟 Key Features & Architecture

### 🏨 Guest Experience & Booking Portal
- **Luxury Aesthetic:** Tailored dark mode, gold styling (`#b99d75`, `#c0a783`), serif typography, and Framer Motion transitions.
- **Dynamic Banners & Highlights:** Live homepage carousel slides and featured suites fetched from the backend.
- **Suites Catalog (`/rooms`):** Instant search, guest capacity filtering, category selection, and price sorting.
- **Room Details (`/roomDetails/[id]`):** Rich suite descriptions, high-resolution galleries, amenities breakdown, and verified guest reviews.
- **Instant Suite Reservation (`/booking/[id]`):** Interactive check-in/out date picker with automatic total price calculation and guest collision handling.
- **Reservation History (`/myBookings`):** View past and active reservations, modal-based rescheduling, reservation cancellation, and direct review submission.
- **Inquiry Portal (`/contact`):** Submit contact messages and banquet reservation requests.

---

### 📊 Multi-Role Management Dashboard (`/dashboard`)
An enterprise dashboard designed for hotel staff and administrators with role-specific views:
- **Overview (`/dashboard`):** Real-time key performance indicators (Total Revenue, Total Bookings, Occupancy Rate %, Active Suites), 6-month revenue trends, recent reservations, and latest guest reviews.
- **Suites Management (`/dashboard/rooms`):** Comprehensive room inventory management (Add/Edit suites, price adjustments, capacity, room status, availability toggle).
- **Reservations Desk (`/dashboard/bookings`):** Search bookings, adjust guest dates, and process status transitions (`CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`).
- **Review Moderation (`/dashboard/reviews`):** Moderate guest feedback and delete inappropriate reviews.
- **Inquiries Desk (`/dashboard/inquiries`):** Review guest inquiries and update ticket statuses (`PENDING`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).
- **Staff & User Roles (`/dashboard/users`):** Manage customer accounts and assign elevated staff/admin roles (`STAFF`, `ADMIN`, `SUPER_ADMIN`).
- **Hotel Settings & Banners (`/dashboard/settings`):** Configure hotel contact info, check-in/out policies, and manage homepage carousel slides.
- **Profile & Security (`/dashboard/profile`):** Update personal details and change account password.

---

### 🗂️ Redux Toolkit & RTK Query Architecture

```
INNORA-CLIENT-SIDE/src/
├── redux/
│   ├── store.js                  # Redux store with baseApi middleware
│   ├── ReduxProvider.jsx         # Client provider wrapper
│   ├── slices/
│   │   └── authSlice.js          # Authentication state, current user, role
│   └── api/
│       ├── baseApi.js            # RTK Query base with credentials & automatic unwrapping
│       ├── authApi.js            # Login, register, me, profile, change password
│       ├── roomApi.js            # Rooms CRUD, featured suites, availability
│       ├── bookingApi.js         # Bookings, my bookings, reschedule, cancel, status
│       ├── reviewApi.js          # Room reviews, submit review, moderate
│       ├── dashboardApi.js       # Admin stats & customer metrics
│       ├── inquiryApi.js         # Contact & banquet inquiries
│       ├── settingApi.js         # Hotel settings & banner slides
│       ├── userApi.js            # User management & role assignment
│       └── uploadApi.js          # Image upload service
├── hooks/
│   └── useAuth.js                # Custom hook for reactive auth state & permissions
├── components/
│   ├── auth/
│   │   ├── AuthInitializer.jsx  # Background session restore from HttpOnly cookie
│   │   └── ProtectedRoute.jsx   # Route guard protecting dashboard and myBookings
│   ├── dashboard/                # Dashboard Sidebar, Header, StatCards
│   └── ...                       # Navbar, Footer, RoomCard, Banner
└── app/
    ├── dashboard/                # Management dashboard sub-pages
    ├── rooms/                    # Room catalog
    ├── roomDetails/[id]/         # Room details & reviews
    ├── booking/[id]/             # Booking reservation modal/page
    ├── myBookings/               # Guest reservation history
    ├── signin/                   # Sign in page
    ├── signup/                   # Sign up page
    └── contact/                  # Contact & inquiries page
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in `INNORA-CLIENT-SIDE/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🔑 Demo Accounts for Immediate Testing

| Role | Email | Password | Dashboard Access |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@innora.com` | `Admin@123456` | Full Platform & User Management |
| **Admin** | `admin@innora.com` | `Admin@123456` | Bookings, Rooms, Reviews, Inquiries |
| **Staff** | `staff@innora.com` | `Staff@123456` | Front-Desk Operations & Check-in/out |
| **Customer** | `customer@innora.com` | `Customer@123456` | Guest Reservation History & Stays |

---

## 📜 License
This project is licensed under the **MIT License**.
