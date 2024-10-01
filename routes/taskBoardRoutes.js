const express = require('express');

const TaskBoard = require('../Model/taskBoard');
const router = express.Router();

// GET all taskBoards
router.get('/getTasks', async (req, res) => {
    try {
        const taskBoards = await TaskBoard.find();
        res.status(200).json(taskBoards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/addTask', async (req, res) => {
    try {
        // Destructuring request body
        const { employee, email, isLoggedIn, task, currentProject } = req.body;

        // Check if all required fields are provided
        if (!employee || !email || isLoggedIn === undefined || !task || !currentProject) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new task
        const newTask = new TaskBoard({
            employee,
            email,
            isLoggedIn,
            task,
            currentProject
        });

        // Save the new task to the database
        await newTask.save();

        // Respond with a success message
        res.status(201).json({ message: 'TaskBoard created successfully', task: newTask });
    } catch (error) {
        // Log the error to the server console
        console.error('Error creating task:', error.message);

        // Respond with a 500 status and error message
        res.status(500).json({ message: 'Server error, please try again later', error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const taskBoard = await TaskBoard.findById(req.params.id);
        if (!taskBoard) return res.status(404).json({ message: 'TaskBoard not found' });
        await taskBoard.deleteOne();
        res.status(200).json({ message: 'TaskBoard deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;