const express = require('express');
const router = express.Router();
const { getGeminiResponse } = require('../services/geminiService');

// In-memory storage (you can replace with MongoDB later)
const userChats = new Map();

const getUserChats = (userId) => {
  if (!userChats.has(userId)) {
    userChats.set(userId, []);
  }
  return userChats.get(userId);
};

// ============================================
// ROUTE: Create a new chat session
// ============================================
router.post('/session', (req, res) => {
  console.log('✅ POST /session called');
  
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = token ? token.substring(0, 10) : 'anonymous';
    
    const { title } = req.body;
    
    const newSession = {
      _id: Date.now().toString(),
      title: title || 'New Chat',
      messages: [],
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const userSessions = getUserChats(userId);
    userSessions.push(newSession);
    
    console.log(`✅ Session created: ${newSession._id}`);
    res.status(201).json(newSession);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTE: Send a message - USING GEMINI API
// ============================================
router.post('/message', async (req, res) => {
  console.log('✅ POST /message called - Using Gemini API');
  
  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Get user ID from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = token ? token.substring(0, 10) : 'anonymous';
    
    // Call Gemini API
    console.log('🤖 Calling Gemini API with message:', message);
    let aiResponseText;
    
    try {
      aiResponseText = await getGeminiResponse(message);
      console.log('✅ Gemini API response received');
    } catch (geminiError) {
      console.error('❌ Gemini API Error:', geminiError);
      aiResponseText = "I'm having trouble connecting to the AI service. Please try again in a moment.";
    }
    
    const aiMessage = {
      role: 'assistant',
      content: aiResponseText,
      timestamp: new Date().toISOString()
    };
    
    // Store in session if sessionId provided
    if (sessionId) {
      const userSessions = getUserChats(userId);
      const session = userSessions.find(s => s._id === sessionId);
      
      if (session) {
        // Add user message
        session.messages.push({
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        });
        
        // Add AI response
        session.messages.push(aiMessage);
        session.updatedAt = new Date().toISOString();
      }
    }
    
    res.json({
      sessionId: sessionId || 'new-' + Date.now(),
      message: aiMessage
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTE: Get chat history
// ============================================
router.get('/history', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = token ? token.substring(0, 10) : 'anonymous';
    
    const userSessions = getUserChats(userId);
    
    // Return only metadata, not full messages
    const sessions = userSessions.map(s => ({
      _id: s._id,
      title: s.title,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt
    }));
    
    res.json({ sessions });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTE: Get single session
// ============================================
router.get('/session/:sessionId', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = token ? token.substring(0, 10) : 'anonymous';
    
    const userSessions = getUserChats(userId);
    const session = userSessions.find(s => s._id === req.params.sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTE: Delete session
// ============================================
router.delete('/session/:sessionId', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = token ? token.substring(0, 10) : 'anonymous';
    
    const userSessions = getUserChats(userId);
    const index = userSessions.findIndex(s => s._id === req.params.sessionId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    userSessions.splice(index, 1);
    res.json({ message: 'Session deleted successfully' });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTE: Clear all chats
// ============================================
router.delete('/clear', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = token ? token.substring(0, 10) : 'anonymous';
    
    userChats.delete(userId);
    res.json({ message: 'All chats cleared successfully' });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;