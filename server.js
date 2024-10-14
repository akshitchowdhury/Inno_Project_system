const express = require('express');
const connectDB = require('./Lib/db');
const cors = require('cors');
const routes = require('./routes');
const app = express();
const PORT = 3000;

// const allowedOrigins = ['http://localhost:5173','http://localhost:5174'];
const allowedOrigins = ['*'];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));


// const allowedOrigins = ['*'];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Check if the origin is allowed
//     if (allowedOrigins.includes(origin) ) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type'],
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();

// Use the routes
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
