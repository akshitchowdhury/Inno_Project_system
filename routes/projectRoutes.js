const express = require('express');
const Project = require('../Model/project');
const router = express.Router();

// GET all projects
router.get('/fetchProjects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Add a new project
router.post('/addProject', async (req, res) => {
    const { projectName, projectDescription, projectDomain } = req.body;

    try {
        const newProject = new Project({
            projectName,
            projectDescription,
            projectDomain
        });
        await newProject.save();
        res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE: Delete a project by ID
router.delete('/delProject/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) return res.status(404).json({ message: 'Project not found' });

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
