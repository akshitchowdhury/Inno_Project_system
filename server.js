// server.js

const express = require('express');
const mongoose = require('mongoose');
const User = require('./Model/user');
const Project = require('./Model/project');
const connectDB = require('./Lib/db');
var cors = require('cors')
const app = express();
const PORT = 3000;

const allowedOrigins = ['http://localhost:5173', '*'];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));
// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Connect to the database
connectDB();

// GET all users and their projects
app.get('/users', async (req, res) => {
    try {
        const users = await User.find().populate('projectIds');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('projectIds');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Create a user and assign a project
app.post('/addUsers', async (req, res) => {
    // const {username, email, password, department, projectName, projectDescription } = req.body;
    const {username, email, password, department } = req.body;

    try {
        // Create a new user
        const newUser = new User({
            username,
            email,
            password,
            department
                    });
        await newUser.save();

        // Create a new project and assign it to the user
        // const newProject = new Project({
        //     name: projectName,
        //     description: projectDescription,
        //     ownerId: newUser._id
        // });
        // await newProject.save();

        // Link the project to the user's projectIds
        // newUser.projectIds.push(newProject._id);
        await newUser.save();

        res.status(201).json({ user: newUser });
        // res.status(201).json({ user: newUser, project: newProject });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE: Delete a user and their projects
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Delete all projects associated with the user
        await Project.deleteMany({ ownerId: user._id });

        // Delete the user
        await user.deleteOne();

        res.status(200).json({ message: 'User and associated projects deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
