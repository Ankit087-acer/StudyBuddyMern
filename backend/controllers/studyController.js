const Goal = require('../models/Goal');

// @desc    Create a new goal
// @route   POST /api/study/goals
// @access  Private
const createGoal = async (req, res) => {
  try {
    const { title, subject, description, dueDate } = req.body;

    // Validation
    if (!title || !subject) {
      return res.status(400).json({ message: 'Title and subject are required' });
    }

    const goal = await Goal.create({
      userId: req.user._id,
      title,
      subject,
      description: description || '',
      dueDate: dueDate || null
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error('Create Goal Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all goals for user
// @route   GET /api/study/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    const { completed, subject, sort } = req.query;
    
    // Build filter object
    const filter = { userId: req.user._id };
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    
    if (subject) {
      filter.subject = subject;
    }
    
    // Build sort object
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'dueDate') {
      sortOption = { dueDate: 1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'completed') {
      sortOption = { completed: 1, createdAt: -1 };
    }
    
    const goals = await Goal.find(filter).sort(sortOption);
    
    // Separate completed and pending goals
    const pending = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);
    
    res.json({
      all: goals,
      pending,
      completed: completedGoals,
      stats: {
        total: goals.length,
        pending: pending.length,
        completed: completedGoals.length
      }
    });
  } catch (error) {
    console.error('Get Goals Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single goal by ID
// @route   GET /api/study/goals/:id
// @access  Private
const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error) {
    console.error('Get Goal By ID Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a goal
// @route   PUT /api/study/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
  try {
    const { title, subject, description, dueDate, completed } = req.body;
    
    // Find goal and verify ownership
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Update fields if provided
    if (title) goal.title = title;
    if (subject) goal.subject = subject;
    if (description !== undefined) goal.description = description;
    if (dueDate !== undefined) goal.dueDate = dueDate;
    
    // Handle completion status
    if (completed !== undefined) {
      if (completed && !goal.completed) {
        goal.completed = true;
        goal.completedAt = new Date();
      } else if (!completed && goal.completed) {
        goal.completed = false;
        goal.completedAt = null;
      }
    }
    
    await goal.save();
    res.json(goal);
  } catch (error) {
    console.error('Update Goal Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/study/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json({ message: 'Goal deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete Goal Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark goal as complete
// @route   PATCH /api/study/goals/:id/complete
// @access  Private
const markComplete = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { completed: true, completedAt: new Date() },
      { new: true }
    );
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error) {
    console.error('Mark Complete Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark goal as incomplete
// @route   PATCH /api/study/goals/:id/incomplete
// @access  Private
const markIncomplete = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { completed: false, completedAt: null },
      { new: true }
    );
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error) {
    console.error('Mark Incomplete Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  markComplete,
  markIncomplete
};