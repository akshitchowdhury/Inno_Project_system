const express = require('express');
const connectDB = require('./Lib/db');
const routes = require('./routes');
const cors = require('cors');  // Ensure cors is required
const app = express();
const PORT = 3000;

// Allowed origins
const allowedOrigins = [
  'https://inno-project-system-admin.vercel.app',  
  'https://inno-project-system-employee.vercel.app',  // Local development
];

// Set up CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // If the origin isn't in the allowed list, reject it
      return callback(new Error('Not allowed by CORS'));
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allow all required HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Include headers you need
  credentials: true,  // Enable credentials (cookies, etc.), if needed
  optionsSuccessStatus: 204  // Respond with 204 for preflight requests
}));

// Handle preflight requests (for CORS)
app.options('*', cors());  // This will handle preflight requests for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();

// Use the routes
app.use(routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
