require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const authRoute = require('./routes/auth');
const servicesRoute = require('./routes/services');
const appointmentsRoute = require('./routes/appointments');

// Routes Middleware
app.use('/api/user', authRoute);
app.use('/api/services', servicesRoute);
app.use('/api/appointments', appointmentsRoute);

app.get('/', (req, res) => {
  res.send('Samy Locks API is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
