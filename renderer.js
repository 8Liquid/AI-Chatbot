// AI Support Bot Plugin
class AISupportBot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.isTyping = false;
    this.injectWidgetIfNeeded();
    this.initializeElements();
    this.attachEventListeners();
    this.setupAIResponses();
  }

  injectWidgetIfNeeded() {
    // Check if widget already exists
    if (document.getElementById('chatbot-widget')) {
      return;
    }

    // Inject the widget HTML
    const widgetHTML = `
      <div id="chatbot-widget" class="chatbot-widget">
        <button id="chatbot-toggle" class="chatbot-button" aria-label="Open chat">
          <svg class="chatbot-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="chatbot-badge">1</span>
        </button>
        <div id="chatbot-window" class="chatbot-window">
          <div class="chatbot-header">
            <div class="chatbot-header-content">
              <div class="chatbot-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <div class="chatbot-header-text">
                <h3>AI Support Assistant</h3>
                <p class="chatbot-status">
                  <span class="status-dot"></span>
                  Online
                </p>
              </div>
            </div>
            <button id="chatbot-close" class="chatbot-close" aria-label="Close chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div id="chatbot-messages" class="chatbot-messages">
            <div class="message bot-message">
              <div class="message-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <div class="message-content">
                <div class="message-bubble">
                  <p>Hello! 👋 I'm your AI support assistant. How can I help you today?</p>
                </div>
                <div class="message-time">Just now</div>
              </div>
            </div>
          </div>
          <div class="chatbot-input-container">
            <div id="chatbot-suggestions" class="chatbot-suggestions">
              <button class="suggestion-chip" data-suggestion="What are your hours?">What are your hours?</button>
              <button class="suggestion-chip" data-suggestion="Contact support">Contact support</button>
              <button class="suggestion-chip" data-suggestion="Pricing information">Pricing information</button>
            </div>
            <div class="chatbot-input-wrapper">
              <input 
                type="text" 
                id="chatbot-input" 
                class="chatbot-input" 
                placeholder="Type your message..."
                autocomplete="off"
                aria-label="Chat input"
              >
              <button id="chatbot-send" class="chatbot-send" aria-label="Send message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
  }

  initializeElements() {
    this.widget = document.getElementById('chatbot-widget');
    this.toggleBtn = document.getElementById('chatbot-toggle');
    this.window = document.getElementById('chatbot-window');
    this.closeBtn = document.getElementById('chatbot-close');
    this.messagesContainer = document.getElementById('chatbot-messages');
    this.input = document.getElementById('chatbot-input');
    this.sendBtn = document.getElementById('chatbot-send');
    this.suggestions = document.getElementById('chatbot-suggestions');
  }

  attachEventListeners() {
    this.toggleBtn.addEventListener('click', () => this.toggleChat());
    this.closeBtn.addEventListener('click', () => this.closeChat());
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Suggestion chips
    this.suggestions.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-suggestion');
        this.input.value = text;
        this.sendMessage();
      });
    });

    // Hide suggestions after first message
    this.input.addEventListener('focus', () => {
      if (this.messages.length === 0) {
        this.suggestions.style.display = 'none';
      }
    });
  }

  setupAIResponses() {
    // Knowledge base for AI responses
    this.knowledgeBase = {
      greetings: [
        "Hello! How can I assist you today?",
        "Hi there! What can I help you with?",
        "Hey! I'm here to help. What do you need?",
        "Greetings! How may I assist you?"
      ],
      hours: [
        "We're available Monday through Friday, 9 AM to 6 PM EST.",
        "Our support hours are 9 AM - 6 PM EST on weekdays.",
        "You can reach us Monday-Friday from 9 AM to 6 PM Eastern Time."
      ],
      contact: [
        "You can contact our support team on Discord: @8Liquid",
        "For support, reach us on Discord: @8Liquid",
        "Contact our team on Discord: @8Liquid"
      ],
      pricing: [
        "We offer flexible pricing plans. Our basic plan starts at $29/month, professional at $79/month, and enterprise is custom pricing. Would you like more details?",
        "Pricing varies by plan: Basic ($29/mo), Professional ($79/mo), and Enterprise (custom). I can provide more information if needed!",
        "Our plans range from $29/month for Basic to custom Enterprise solutions. What plan interests you?"
      ],
      default: [
        "I understand. Let me help you with that.",
        "That's a great question! Let me assist you.",
        "I can help you with that. Could you provide a bit more detail?",
        "Thanks for asking! Here's what I know about that...",
        "I'd be happy to help with that. Let me share some information."
      ]
    };
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.openChat();
    } else {
      this.closeChat();
    }
  }

  openChat() {
    this.window.classList.add('active');
    this.toggleBtn.classList.add('active');
    this.widget.classList.remove('closed');
    this.input.focus();
    
    // Hide badge when opened
    const badge = this.toggleBtn.querySelector('.chatbot-badge');
    if (badge) {
      badge.style.display = 'none';
    }
  }

  closeChat() {
    this.window.classList.remove('active');
    this.toggleBtn.classList.remove('active');
    this.isOpen = false;
  }

  addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (!isUser) {
      avatar.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      `;
    } else {
      avatar.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      `;
    }
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = `<p>${this.formatMessage(text)}</p>`;
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = this.getCurrentTime();
    
    content.appendChild(bubble);
    content.appendChild(time);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
    
    this.messages.push({ text, isUser, timestamp: new Date() });
  }

  formatMessage(text) {
    // Simple formatting for URLs and emphasis
    return text
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>');
  }

  getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  showTypingIndicator() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-message';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      </div>
      <div class="message-content">
        <div class="message-bubble">
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    
    this.messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) {
      typing.remove();
    }
    this.isTyping = false;
  }

  async generateAIResponse(userMessage) {
    // Simulate AI thinking time
    await this.delay(800 + Math.random() * 1200);
    
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    
    // Simple keyword-based responses (replace with actual AI API)
    if (this.matchKeywords(lowerMessage, ['hello', 'hi', 'hey', 'greetings'])) {
      response = this.getRandomResponse(this.knowledgeBase.greetings);
    } else if (this.matchKeywords(lowerMessage, ['hour', 'time', 'when', 'open', 'available'])) {
      response = this.getRandomResponse(this.knowledgeBase.hours);
    } else if (this.matchKeywords(lowerMessage, ['contact', 'email', 'phone', 'reach', 'support'])) {
      response = this.getRandomResponse(this.knowledgeBase.contact);
    } else if (this.matchKeywords(lowerMessage, ['price', 'pricing', 'cost', 'plan', 'subscription'])) {
      response = this.getRandomResponse(this.knowledgeBase.pricing);
    } else if (this.matchKeywords(lowerMessage, ['thank', 'thanks', 'appreciate'])) {
      response = "You're welcome! Is there anything else I can help you with?";
    } else if (this.matchKeywords(lowerMessage, ['bye', 'goodbye', 'see you', 'later'])) {
      response = "Goodbye! Feel free to come back if you need any help. Have a great day!";
    } else {
      response = this.getRandomResponse(this.knowledgeBase.default) + 
        " For specific questions about hours, contact info, or pricing, just ask!";
    }
    
    return response;
  }

  matchKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendMessage() {
    const text = this.input.value.trim();
    
    if (!text || this.isTyping) return;
    
    // Clear input and disable send button
    this.input.value = '';
    this.sendBtn.disabled = true;
    
    // Hide suggestions after first message
    if (this.suggestions) {
      this.suggestions.style.display = 'none';
    }
    
    // Add user message
    this.addMessage(text, true);
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Generate and add AI response
    try {
      const response = await this.generateAIResponse(text);
      this.hideTypingIndicator();
      this.addMessage(response, false);
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage("I apologize, but I'm having trouble processing that right now. Please try again.", false);
    }
    
    // Re-enable send button
    this.sendBtn.disabled = false;
    this.input.focus();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

// Initialize the bot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.chatbot = new AISupportBot();
  console.log('AI Support Bot initialized');
});
