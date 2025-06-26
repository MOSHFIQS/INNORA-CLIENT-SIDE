# 🌐 Innora Client Side

Welcome to the **Innora** backend repository — a secure, scalable hotel room booking system designed for modern web applications. This server uses **Express.js** and **MongoDB**, supports JWT authentication with cookies, and ensures smooth room management and booking operations.

---

## 🔗 Live Server Link

**Backend Server:** [Innora Server on Vercel](innora-server-side.vercel.app)

**Frontend Client:** [Innora Client on Vercel](innora-client-side-1.vercel.app
)

---

## 🚀 Key Features

* 🔐 **Secure JWT Cookie Authentication** — Tokens are stored in HTTP-only cookies for better security.
* 🏛️ **Room Management** — Fetch, view, and review rooms, and track booked dates.
* 📅 **Booking System** — Users can book rooms, reschedule, or cancel with date conflict checks.
* ⭐ **User Reviews** — Submit and aggregate ratings and comments for rooms.
* 🔄 **Token Verification Middleware** — Ensures secure access to protected endpoints.
* ✅ **RESTful Design** — Clear, modular endpoint structure.

---

## 🧰 Core Dependencies

| Package       | Version | Purpose                          |
| ------------- | ------- | -------------------------------- |
| express       | latest  | API server framework             |
| cors          | latest  | Cross-Origin request support     |
| dotenv        | latest  | Environment variable loader      |
| cookie-parser | latest  | Parse cookies from HTTP requests |
| jsonwebtoken  | latest  | JWT creation and verification    |
| mongodb       | latest  | MongoDB database interaction     |

### 🖥️ Frontend Dependencies

| Package               | Purpose                         |
| --------------------- | ------------------------------- |
| next                  | React framework for SSR/SSG     |
| react / react-dom     | Core libraries for UI rendering |
| firebase              | Authentication and storage      |
| axios                 | API communication               |
| framer-motion         | Animations                      |
| tailwindcss + daisyUI | Styling toolkit                 |
| react-hot-toast       | Toast notifications             |
| react-icons           | Icon set                        |
| swiper / slick        | Carousel and sliders            |

---

## 📚 API Overview

### 🔐 Authentication

| Method | Endpoint  | Description                        |
| ------ | --------- | ---------------------------------- |
| POST   | `/jwt`    | Sign in and issue token via cookie |
| POST   | `/logout` | Clears JWT cookie on logout        |

---

### 🏛️ Room Management

| Method | Endpoint             | Access        | Description                        |
| ------ | -------------------- | ------------- | ---------------------------------- |
| GET    | `/rooms`             | Authenticated | Get all rooms (with email check)   |
| GET    | `/homePageRooms`     | Public        | Get all rooms for homepage display |
| GET    | `/rooms/:id`         | Public        | Get a single room by ID            |
| PATCH  | `/rooms/:id/reviews` | Public        | Add a review to a specific room    |

---

### 📅 Booking Management

| Method | Endpoint           | Access        | Description                          |
| ------ | ------------------ | ------------- | ------------------------------------ |
| GET    | `/bookings?email=` | Authenticated | Get all bookings for a specific user |
| POST   | `/bookings`        | Public        | Create a new room booking            |
| PATCH  | `/bookings/update` | Public        | Reschedule a booking                 |
| DELETE | `/bookings/:email` | Public        | Delete a specific booking            |
| GET    | `/allbookings`     | Public        | Get all bookings (admin use case)    |

---

## 🚧 Environment Variables

Create a `.env` file with the following keys:

```env
PORT=5000
DB_USER=your_db_username
DB_PASS=your_db_password
ACCESS_TOKEN=your_jwt_secret
```

---

## 🛠️ Installation

### Backend Setup

1. **Clone the backend repository**

```bash
git clone https://github.com/your-username/innora-server.git
cd innora-server
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

```bash
touch .env
# Add environment keys
```

4. **Run the server**

```bash
npm start
```

### Frontend Setup

1. **Clone the frontend repository**

```bash
git clone https://github.com/your-username/innora-client.git
cd innora-client
```

2. **Install frontend packages**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

---

## 👤 Example Admin Testing

Currently, there is no fixed admin login route, but booking access control is enforced via token + email match.

---

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more info.

---

Thank you for using the **Innora Hotel Booking System**! For bugs or contributions, please open an issue or submit a PR.
