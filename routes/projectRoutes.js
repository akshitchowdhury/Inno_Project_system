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
    const { projectName, projectDescription, projectDomain,projectClient, assignedTo, projectStatus } = req.body;

    try {
        const newProject = new Project({
            projectName,
            projectDescription,
            projectDomain,
            projectClient,
            assignedTo,
            projectStatus
            
        });
        await newProject.save();
        res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT: Update project status by project ID
router.put('/updateStatus/:id', async (req, res) => {
    const { projectStatus } = req.body;  // Assuming you want to update 'projectStatus' field

    try {
        // Find the project by ID and update the projectStatus field
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id, // Find project by ID
            { projectStatus }, // Update 'projectStatus' field
            { new: true }   // Return the updated project
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project status updated successfully', project: updatedProject });
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
