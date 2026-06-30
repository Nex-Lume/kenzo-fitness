const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  credentials: true,
}));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

const { errorHandler } = require('./middleware/errorMiddleware');

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/qr', require('./routes/qrRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/diets', require('./routes/dietRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));

// Root API Endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'KenzoFitness Backend API is running smoothly.',
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
