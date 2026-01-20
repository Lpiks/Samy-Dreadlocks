require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Adds security headers
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'], // Allow env var + local dev defaults
  credentials: true
}));
app.use(express.json());

// Logging
app.use(morgan('dev')); // Log HTTP requests

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Database Connection
const connectDB = require('./config/db');
connectDB();

const authRoute = require('./routes/auth');
const servicesRoute = require('./routes/services');
const appointmentsRoute = require('./routes/appointments');

// Routes Middleware
app.use('/api/user', authRoute);
app.use('/api/services', servicesRoute);
app.use('/api/appointments', appointmentsRoute);
app.use('/api/messages', require('./routes/messages'));
app.use('/api/products', require('./routes/products'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/categories', require('./routes/categories'));

app.get('/', (req, res) => {
  res.send('Samy Locks API is running');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
