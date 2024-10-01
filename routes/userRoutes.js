const express = require('express');
const User = require('../Model/user');
const Project = require('../Model/project');
const router = express.Router();

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
