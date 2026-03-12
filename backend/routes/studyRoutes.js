const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  // Goal functions
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  markComplete,
  markIncomplete,
  
  // Practice Tracker functions (NEW)
  savePracticeSession,
  getPracticeSessions,
  getPracticeStats,
  getPracticeSessionById,
  deletePracticeSession,
  getTopicPerformance
} = require('../controllers/studyController');

// ============================================
// GOAL ROUTES (Your existing routes)
// ============================================
router.post('/goals', protect, createGoal);
router.get('/goals', protect, getGoals);
router.get('/goals/:id', protect, getGoalById);
router.put('/goals/:id', protect, updateGoal);
router.delete('/goals/:id', protect, deleteGoal);
router.patch('/goals/:id/complete', protect, markComplete);
router.patch('/goals/:id/incomplete', protect, markIncomplete);

// ============================================
// PRACTICE TRACKER ROUTES (NEW for Day 8)
// ============================================
router.post('/practice', protect, savePracticeSession);
router.get('/practice', protect, getPracticeSessions);
router.get('/practice/stats', protect, getPracticeStats);
router.get('/practice/topics', protect, getTopicPerformance);
router.get('/practice/:id', protect, getPracticeSessionById);
router.delete('/practice/:id', protect, deletePracticeSession);

module.exports = router;