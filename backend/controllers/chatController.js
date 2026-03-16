const Chat = require('../models/Chat');

// Mock response function (temporary until Gemini is fully integrated)
const getMockResponse = (message) => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return "Hello! I'm your StudyBuddy AI assistant. How can I help you with your studies today?";
  }
  if (lowerMsg.includes('physics')) {
    return "Physics is fascinating! What specific topic would you like help with? I can explain concepts like mechanics, electromagnetism, thermodynamics, or quantum physics.";
  }
  if (lowerMsg.includes('chemistry')) {
    return "Chemistry is all about understanding matter! I can help with organic chemistry, periodic table, chemical reactions, or solving numerical problems.";
  }
  if (lowerMsg.includes('math')) {
    return "Mathematics is the language of science! I can help with calculus, algebra, trigonometry, or geometry. What topic are you working on?";
  }
  if (lowerMsg.includes('biology')) {
    return "Biology explains life itself! I can help with cell biology, genetics, human physiology, or ecology. What would you like to know?";
  }
  if (lowerMsg.includes('study plan')) {
    return "I'd be happy to help create a study plan! First, tell me your exam (JEE/NEET), available time per day, and weak subjects.";
  }
  if (lowerMsg.includes('jee')) {
    return "For JEE preparation, focus on understanding concepts deeply, practice numerical problems regularly, and revise formulas daily. Which subject would you like help with?";
  }
  if (lowerMsg.includes('neet')) {
    return "For NEET preparation, biology is key! Focus on NCERT thoroughly, practice diagrams, and understand concepts. Chemistry and Physics require regular numerical practice too.";
  }
  
  return `I understand you're asking about: "${message}". I'm here to help with your studies! Could you please provide more details about what you'd like to learn?`;
};

// @desc    Send a message and get AI response
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let session;
    
    // Find or create session
    if (sessionId) {
      session = await Chat.findOne({ _id: sessionId, userId: req.user._id });
    }
    
    if (!session) {
      // Create new session
      session = new Chat({
        userId: req.user._id,
        title: message.length > 30 ? message.substring(0, 30) + '...' : message,
        messages: []
      });
    }

    // Add user message to session
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Get AI response (mock for now)
    const aiResponseText = getMockResponse(message);

    // Add AI response to session
    const aiMessage = {
      role: 'assistant',
      content: aiResponseText,
      timestamp: new Date()
    };

    session.messages.push(aiMessage);
    await session.save();

    res.status(200).json({
      sessionId: session._id,
      message: aiMessage
    });
    
  } catch (error) {
    console.error('Chat Controller Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get response from AI assistant'
    });
  }
};

// @desc    Get all chat sessions for user
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const sessions = await Chat.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('title createdAt updatedAt');
    
    res.status(200).json({ sessions });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a specific chat session with all messages
// @route   GET /api/chat/session/:sessionId
// @access  Private
const getChatSession = async (req, res) => {
  try {
    const session = await Chat.findOne({
      _id: req.params.sessionId,
      userId: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.status(200).json(session);
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a new empty chat session
// @route   POST /api/chat/session
// @access  Private
const createChatSession = async (req, res) => {
  try {
    const { title } = req.body;
    
    const session = await Chat.create({
      userId: req.user._id,
      title: title || 'New Chat',
      messages: []
    });
    
    res.status(201).json(session);
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a chat session
// @route   DELETE /api/chat/session/:sessionId
// @access  Private
const deleteChatSession = async (req, res) => {
  try {
    const session = await Chat.findOneAndDelete({
      _id: req.params.sessionId,
      userId: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.status(200).json({ 
      message: 'Session deleted successfully',
      sessionId: req.params.sessionId 
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete all chat sessions for user
// @route   DELETE /api/chat/clear
// @access  Private
const clearAllChats = async (req, res) => {
  try {
    await Chat.deleteMany({ userId: req.user._id });
    
    res.status(200).json({ 
      message: 'All chat sessions cleared successfully'
    });
  } catch (error) {
    console.error('Clear all chats error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update chat session title
// @route   PUT /api/chat/session/:sessionId
// @access  Private
const updateSessionTitle = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const session = await Chat.findOneAndUpdate(
      { _id: req.params.sessionId, userId: req.user._id },
      { title },
      { new: true }
    );
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.status(200).json(session);
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getChatSession,
  createChatSession,
  deleteChatSession,
  clearAllChats,
  updateSessionTitle
};