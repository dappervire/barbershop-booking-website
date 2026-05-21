# Barbershop Booking System

A full-stack web application for managing barbershop appointments. Customers can browse services and book appointments, while admins can review and manage bookings through a protected dashboard.

> **Note:** This is a learning project built to practice full-stack development — backend API design, authentication, and vanilla frontend (no frameworks). Built as a first backend project.

## Features

- **Public booking page** — customers select a service, pick a date and time, and submit a booking
- **Admin authentication** — secure login with JWT and bcrypt-hashed passwords
- **Admin dashboard** — view all bookings, approve or reject each one
- **Rate limiting** — login endpoint protected against brute-force attempts
- **Responsive design** — works on both desktop and mobile

## Tech Stack

**Backend**
- Node.js
- Express
- PostgreSQL
- JSON Web Token (JWT) for authentication
- bcrypt for password hashing
- express-rate-limit

**Frontend**
- HTML, CSS, vanilla JavaScript (no framework)
- Fetch API for communication with the backend

## Project Structure

```
barbershop-booking/
├── public/                  # Frontend (served as static files)
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── booking.js
│   │   ├── admin-login.js
│   │   ├── admin-dashboard.js
│   │   └── toast.js
│   ├── index.html           # Public booking page
│   ├── admin-login.html     # Admin login
│   └── admin-dashboard.html # Admin dashboard
├── src/
│   ├── db/
│   │   ├── pool.js          # PostgreSQL connection
│   │   └── seed-admin.js    # Script to create the first admin
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   └── routes/
│       ├── services.js
│       ├── bookings.js
│       └── auth.js
├── server.js                # Entry point
├── .env                     # Environment variables (not committed)
└── package.json
```

## API Endpoints

| Method | Endpoint          | Access      | Description                       |
|--------|-------------------|-------------|-----------------------------------|
| GET    | `/services`       | Public      | List all available services       |
| POST   | `/bookings`       | Public      | Create a new booking              |
| GET    | `/bookings`       | Admin (JWT) | List all bookings                 |
| PATCH  | `/bookings/:id`   | Admin (JWT) | Update a booking status           |
| POST   | `/auth/login`     | Public      | Admin login, returns a JWT token  |

## Setup

### Prerequisites

- Node.js installed
- PostgreSQL installed and running

### 1. Clone the repository

```bash
git clone https://github.com/dappervire/barbershop-booking-website.git
cd barbershop-booking-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a PostgreSQL database named `barbershop`, then create the required tables:

```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  service_id INTEGER REFERENCES services(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admin (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

### 4. Configure environment variables

Create a `.env` file in the project root with the following variables:

```
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=barbershop
JWT_SECRET=your_secret_key
PORT=3000
```

> Never commit your `.env` file. It is already listed in `.gitignore`.

### 5. Create the first admin

```bash
node src/db/seed-admin.js
```

This creates an admin account with the default credentials defined in the script.

### 6. Run the server

```bash
node server.js
```

The app will be available at `http://localhost:3000`.

## Usage

- Visit `http://localhost:3000` to access the customer booking page.
- Click **Login sebagai Admin** (or visit `/admin-login.html`) to log in as an admin.
- After logging in, manage bookings from the dashboard.

## What I Learned

This project helped me practice:

- Building a REST API with Express and PostgreSQL
- JWT authentication and password hashing with bcrypt
- DOM manipulation and the Fetch API in vanilla JavaScript
- Connecting a frontend to a backend through a single Express server
- Debugging with browser DevTools
- Responsive design with CSS Flexbox and media queries

## Author

**Fatih** — [@dappervire](https://github.com/dappervire)
