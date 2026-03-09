const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['physics', 'chemistry', 'math', 'biology']
  },
  description: {
    type: String,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
goalSchema.index({ userId: 1, completed: 1 });
goalSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model('Goal', goalSchema);