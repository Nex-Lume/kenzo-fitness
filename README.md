# GymFlow - Gym Management Website MVP

GymFlow is a modern, responsive, full-stack Gym Management web application MVP. It is designed to accommodate client registrations (admissions), display membership plans, and provide dedicated dashboards for members and administrators.

## Features

### Frontend (Client Website)
- **Home Page**: Features clean headers, introduction grids, facilities descriptions, trainers, and CTA buttons.
- **Login Page**: Role-based access enabling redirection to Member or Admin dashboards.
- **Admission Request Page**: Gathers contact details, emergency phone number, and plan choices.
- **Plans Comparison**: Pricing cards matching Monthly, Quarterly, and Yearly plans.
- **Member Dashboard**: Displays subscription statistics (active, pending, or inactive), billing states, dates, and account details.
- **Admin Dashboard**: Visual overview of total users, active memberships, pending admissions, and estimated revenue. Includes a 5-item recent admissions feed with quick approval controls.
- **Admin Members Panel**: Searchable directories, inline editing/creation modal, and account deletion functions.

### Backend (REST API)
- Built on **Node.js** with **Express.js** and **Mongoose**.
- Encrypted password storage using **bcryptjs**.
- Session authentication powered by **JSON Web Tokens (JWT)**.
- Automated subscription expiry calculation based on active plan selection.

---

## Directory Structure

```
GymFlow/
├── backend/
│   ├── config/             # Database connection configurations
│   ├── controllers/        # REST route handlers (Auth, Member, Plan, Dash)
│   ├── middleware/         # Auth verification guards (JWT & Role verification)
│   ├── models/             # Mongoose DB Schemas (User, Member, MembershipPlan)
│   ├── routes/             # Express API Endpoints
│   ├── scripts/            # Database seed script (seed.js)
│   ├── .env.example        # Environment variable templates
│   ├── server.js           # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/            # Axios API config with JWT interceptor
    │   ├── components/     # Icons and layout templates
    │   ├── context/        # Auth context provider & hooks
    │   ├── layouts/        # Main & Dashboard wrapper components
    │   ├── pages/          # React route endpoints
    │   ├── routes/         # Protected and conditional router paths
    │   ├── App.jsx         # Router mounts
    │   ├── index.css       # Tailwind CSS v4 entry
    │   └── main.jsx
    └── vite.config.js      # Vite compilation configurations with Tailwind
```

---

## Database Seeding & Setup

The database seed script deletes any older records and seeds:
1. **Membership Plans**: Monthly ($49), Quarterly ($129), and Yearly ($399) tiers.
2. **Default Administrator User**: Email `admin@gymflow.com` (password: `admin123`).
3. **Default Member User**: Email `member@gymflow.com` (password: `member123`).

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- Local MongoDB installation or a MongoDB Atlas URI string

### 1. Backend Configuration
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Create an active `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Verify or update the environment variables in your `.env`:
   - `PORT`: Server port (defaults to `5000`)
   - `MONGO_URI`: MongoDB connection string (e.g. `mongodb://127.0.0.1:27017/gymflow` for local, or your MongoDB Atlas URI)
   - `JWT_SECRET`: Secret key for signing tokens
5. Seed the database with plans and accounts:
   ```bash
   npm run seed
   ```
6. Start the development API server:
   ```bash
   npm run dev
   ```

### 2. Frontend Configuration
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React client:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at: `http://localhost:5173`

---

## Default Login Credentials

After seeding, you can test the dashboards immediately using these credentials:

* **Admin Access**:
  - Email: `admin@gymflow.com`
  - Password: `admin123`
* **Demo Member Access**:
  - Email: `member@gymflow.com`
  - Password: `member123`

---

## MVP Improvements & New Features

### New Backend APIs
- **Contact Form**: `POST /api/contact`, `GET /api/contact`, `PUT /api/contact/:id/status`, `DELETE /api/contact/:id`
- **Member Renewals**: `PUT /api/members/:id/renew`
- **Payment Status**: `PUT /api/members/:id/payment-status`
- **Member Profile Update**: `PUT /api/members/profile`
- **Membership Plans**: Full CRUD API at `/api/plans`

### New Frontend Pages
- **/contact**: Public contact form.
- **/admin/messages**: Admin panel to view, update, and delete contact messages.
- **/admin/plans**: Admin panel to manage (create, edit, soft-delete) membership plans.
- **/dashboard/profile**: Member panel to view and edit personal information.

### Environment Variables
- `JWT_EXPIRE`: Define token expiration duration (e.g., `7d` or `24h`) in your `.env` file to control session length.

### How to Test Workflows

**1. Contact Form**
- Navigate to the **Home** or **Contact** page (`/contact`) as a public user.
- Fill out the form and submit it.
- Log in as an Admin and go to **Messages** (`/admin/messages`) to view, mark as read/replied, or delete the submission.

**2. Membership Renewal**
- Log in as a Member and navigate to the **Dashboard**.
- Click **Renew Membership**, select a plan, and submit.
- The member's status will update to "Pending" until an admin verifies the payment.

**3. Admin Payment Status Update**
- Log in as an Admin and navigate to **Members** (`/admin/members`).
- Locate the member in the table. You can use the new Search and Filters to find them easily.
- Use the **Payment** dropdown to change the status to "Paid". This will automatically activate the membership and update the expiration date based on the plan.

**4. Logout & Token Expiry Handling**
- The system uses a centralized error middleware and Axios interceptors to capture expired tokens (HTTP 401).
- If your token expires, the application will automatically log you out, clear your session, and redirect you to the login page with an appropriate error message.
- You can manually test this by clicking the **Sign Out** button in the dashboard sidebar.

---

## Phase 2 Features

### New Backend APIs
- **Slot Management**: `GET /api/slots`, `POST /api/slots`, `PUT /api/slots/:id`, `DELETE /api/slots/:id`
- **Bookings**: `POST /api/bookings`, `PUT /api/bookings/:id/cancel`, `GET /api/bookings/member`, `GET /api/bookings`
- **Attendance**: `POST /api/attendance/checkin`, `POST /api/attendance/checkout`, `GET /api/attendance/member`, `GET /api/attendance`
- **Peak Time & Expiry**: `GET /api/dashboard/peak-time`, `GET /api/dashboard/expiry`

### New Frontend Pages
- **/dashboard/book-slot**: Member panel to view available slots and book a session.
- **/dashboard/attendance**: Member panel to check in and out, and view their attendance history.
- **/peak-time**: Public page showing real-time gym crowd and occupancy.
- **/admin/slots**: Admin panel to manage (create, edit, delete) active gym slots.
- **/admin/attendance**: Admin panel to view all member check-ins for a given date.

### How to Test Phase 2 Workflows

**1. Slot Booking**
- Log in as a Member and navigate to **Book Slot**.
- Choose a date. View slot availability and click **Book** on an active slot. You can only book one slot per day.
- Admin can manage these slots at **Bookings** (`/admin/slots`).

**2. Attendance**
- Log in as a Member and navigate to **Attendance**.
- Ensure you have a booking for today. Click **Check In** to start your session, and **Check Out** when you're done.
- Admin can view today's attendance logs at **Attendance** (`/admin/attendance`).

**3. Peak Time Forecast**
- Navigate to the public **Peak Time** page (`/peak-time`).
- View the real-time occupancy percentages and status (Low, Medium, Peak) based on current bookings versus gym capacity.

**4. Expiry Reminders**
- If a member is expiring within 15 days, a warning banner will appear on their Dashboard.
- Admins can view a categorized list of expiring members on their Dashboard Overview.

---

## Phase 3 Features

### New Roles & Authentication
- Added **Trainer** and **Reception** roles.
- **Test Credentials**:
  - Trainer: `trainer@gymflow.com` / `trainer123`
  - Reception: `reception@gymflow.com` / `reception123`

### New Modules
- **Razorpay Integration**: Members can checkout and renew their plans with Razorpay dummy keys.
- **QR Check-in**: Members have a QR code generated for their booking. Receptionists can scan it via `html5-qrcode`.
- **Analytics & Reports**: Admin dashboard with Chart.js visualization for Revenue and table for Members, with CSV and PDF export functionality.
- **Email & Auditing**: Backend `nodemailer` for notifications and robust audit logging for administrative actions.
