const express = require('express');
const User = require('../Model/user');
const Project = require('../Model/project');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = "helloInno@123";
// GET all users and their projects
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('projectIds');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('projectIds');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Create a user and assign a project
router.post('/addUsers', async (req, res) => {
    const { username, email, password, department } = req.body;

    try {
        const newUser = new User({ username, email, password, department });
        await newUser.save();
        res.status(201).json({ user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// router.put('/login', async (req, res) => {
//     const { email } = req.body;
//     try {
//         // Find the user by email
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Update the user details
        
//         user.isLoggedIn = true;

//         // Save the updated user to the database
//         await user.save();

//         res.status(200).json({ user });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


router.put('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if(!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '3h' });

        user.isLoggedIn = true;
        await user.save();

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put('/logout', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Bearer token

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        // Decode the token to get user info
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Set isLoggedIn to false in the user document
        user.isLoggedIn = false;
        await user.save();

        res.status(200).json({ message: 'User successfully logged out' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to log out', error: error.message });
    }
});


// router.put('/logout', async (req, res) => {
//     const { id,isLoggedIn } = req.body;
//     try {
//         // Find the user by email
//         const user = await User.findById(id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Update the user's isLoggedIn status to false
//         user.isLoggedIn = false;

//         // Save the updated user to the database
//         await user.save();

//         res.status(200).json({ message: 'Logged out successfully', user });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


// DELETE: Delete a user and their projects
router.delete('/:id', async (req, res) => {
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

module.exports = router;
