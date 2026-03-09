const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  markComplete,
  markIncomplete
} = require('../controllers/studyController');

// All routes are protected
router.post('/goals', protect, createGoal);
router.get('/goals', protect, getGoals);
router.get('/goals/:id', protect, getGoalById);
router.put('/goals/:id', protect, updateGoal);
router.delete('/goals/:id', protect, deleteGoal);
router.patch('/goals/:id/complete', protect, markComplete);
router.patch('/goals/:id/incomplete', protect, markIncomplete);

module.exports = router;