const express = require('express');
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');
const taskBoardRoutes = require('./taskBoardRoutes');
const router = express.Router();

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/taskBoards', taskBoardRoutes);

module.exports = router;
