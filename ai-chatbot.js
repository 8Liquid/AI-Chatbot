/**
 * AI Support Bot - Highly Customizable Chatbot Plugin
 * @version 1.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // Default configuration
  const DEFAULT_CONFIG = {
    // Appearance
    theme: 'light', // 'light', 'dark', or 'auto'
    primaryColor: '#646cff',
    primaryHover: '#535bf2',
    backgroundColor: '#ffffff',
    textColor: '#1a1a1a',
    botBubbleColor: '#f0f0f0',
    userBubbleColor: '#646cff',
    userTextColor: '#ffffff',
    
    // Position
    position: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    bottom: 20,
    right: 20,
    top: 20,
    left: 20,
    
    // Widget dimensions
    width: 380,
    height: 600,
    buttonSize: 60,
    
    // Messages
    welcomeMessage: "Hello! 👋 I'm your AI support assistant. How can I help you today?",
    placeholder: 'Type your message...',
    statusText: 'Online',
    title: 'AI Support Assistant',
    
    // Behavior
    autoOpen: false,
    showBadge: true,
    badgeText: '1',
    showSuggestions: true,
    suggestions: [
      'What are your hours?',
      'Contact support',
      'Pricing information'
    ],
    
    // API Configuration
    apiEndpoint: null,
    apiKey: null,
    apiHeaders: {},
    responseDelay: 800, // Minimum delay in ms to simulate typing
    
    // Custom styling
    customCSS: null,
    borderRadius: 20,
    shadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
    
    // Avatar & Icons
    showAvatar: true,
    botAvatar: null, // Custom SVG or image URL
    userAvatar: null,
    
    // Animations
    animations: true,
    animationDuration: 300,
    
    // Advanced
    zIndex: 9999,
    enableLocalStorage: true,
    storageKey: 'ai-chatbot-messages',
    maxMessages: 50,
    
    // Callbacks
    onOpen: null,
    onClose: null,
    onMessage: null,
    onError: null,
    
    // Knowledge base (for fallback responses)
    knowledgeBase: {
      greetings: [
        "Hello! How can I assist you today?",
        "Hi there! What can I help you with?",
        "Hey! I'm here to help. What do you need?"
      ],
      hours: [
        "We're available Monday through Friday, 9 AM to 6 PM EST."
      ],
      contact: [
        "You can contact our support team at support@example.com or call us at 1-800-555-0123."
      ],
      pricing: [
        "We offer flexible pricing plans. Our basic plan starts at $29/month."
      ],
      default: [
        "I understand. Let me help you with that.",
        "That's a great question! Let me assist you.",
        "Thanks for asking! Here's what I know about that..."
      ]
    }
  };

  /**
   * Main AI Chatbot Class
   */
  class AIChatbot {
    constructor(userConfig = {}) {
      this.config = this.mergeConfig(DEFAULT_CONFIG, userConfig);
      this.isOpen = false;
      this.messages = [];
      this.isTyping = false;
      this.init();
    }

    /**
     * Merge user config with defaults
     */
    mergeConfig(defaults, user) {
      const merged = { ...defaults };
      for (const key in user) {
        if (user[key] !== null && typeof user[key] === 'object' && !Array.isArray(user[key])) {
          merged[key] = this.mergeConfig(merged[key] || {}, user[key]);
        } else {
          merged[key] = user[key];
        }
      }
      return merged;
    }

    /**
     * Initialize the chatbot
     */
    init() {
      this.injectStyles();
      this.injectWidget();
      this.initializeElements();
      this.attachEventListeners();
      this.loadMessages();
      this.applyPosition();
      
      if (this.config.autoOpen) {
        setTimeout(() => this.openChat(), 500);
      }
    }

    /**
     * Inject custom styles based on configuration
     */
    injectStyles() {
      if (document.getElementById('ai-chatbot-styles')) {
        return;
      }

      const style = document.createElement('style');
      style.id = 'ai-chatbot-styles';
      style.textContent = this.generateCSS();
      document.head.appendChild(style);

      // Add custom CSS if provided
      if (this.config.customCSS) {
        const customStyle = document.createElement('style');
        customStyle.id = 'ai-chatbot-custom-styles';
        customStyle.textContent = this.config.customCSS;
        document.head.appendChild(customStyle);
      }
    }

    /**
     * Generate CSS based on configuration
     */
    generateCSS() {
      const pos = this.config.position;
      const bottom = pos.includes('bottom') ? this.config.bottom + 'px' : 'auto';
      const top = pos.includes('top') ? this.config.top + 'px' : 'auto';
      const right = pos.includes('right') ? this.config.right + 'px' : 'auto';
      const left = pos.includes('left') ? this.config.left + 'px' : 'auto';

      return `
        #chatbot-widget {
          position: fixed;
          bottom: ${bottom};
          right: ${right};
          top: ${top};
          left: ${left};
          z-index: ${this.config.zIndex};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        #chatbot-button {
          width: ${this.config.buttonSize}px;
          height: ${this.config.buttonSize}px;
          background: linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.config.primaryHover} 100%);
        }
        #chatbot-window {
          width: ${this.config.width}px;
          height: ${this.config.height}px;
          border-radius: ${this.config.borderRadius}px;
          box-shadow: ${this.config.shadow};
        }
        .chatbot-header {
          background: linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.config.primaryHover} 100%);
        }
        .bot-message .message-bubble {
          background: ${this.config.botBubbleColor};
          color: ${this.config.textColor};
        }
        .user-message .message-bubble {
          background: ${this.config.userBubbleColor};
          color: ${this.config.userTextColor};
        }
        .chatbot-messages {
          background: ${this.config.backgroundColor};
        }
        .chatbot-input {
          background: ${this.config.backgroundColor};
          color: ${this.config.textColor};
        }
      `;
    }

    /**
     * Inject widget HTML
     */
    injectWidget() {
      if (document.getElementById('chatbot-widget')) {
        return;
      }

      const widgetHTML = this.generateWidgetHTML();
      document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    /**
     * Generate widget HTML
     */
    generateWidgetHTML() {
      const badgeHTML = this.config.showBadge 
        ? `<span class="chatbot-badge">${this.config.badgeText}</span>` 
        : '';
      
      const botAvatarHTML = this.config.botAvatar 
        ? `<img src="${this.config.botAvatar}" alt="Bot" />`
        : `<svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>`;

      const suggestionsHTML = this.config.showSuggestions && this.config.suggestions.length > 0
        ? `<div id="chatbot-suggestions" class="chatbot-suggestions">
            ${this.config.suggestions.map(s => 
              `<button class="suggestion-chip" data-suggestion="${s}">${s}</button>`
            ).join('')}
          </div>`
        : '';

      return `
        <div id="chatbot-widget" class="chatbot-widget" data-position="${this.config.position}">
          <button id="chatbot-button" class="chatbot-button" aria-label="Open chat">
            <svg class="chatbot-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            ${badgeHTML}
          </button>
          <div id="chatbot-window" class="chatbot-window">
            <div class="chatbot-header">
              <div class="chatbot-header-content">
                ${this.config.showAvatar ? `
                <div class="chatbot-avatar">
                  ${botAvatarHTML}
                </div>
                ` : ''}
                <div class="chatbot-header-text">
                  <h3>${this.config.title}</h3>
                  <p class="chatbot-status">
                    <span class="status-dot"></span>
                    ${this.config.statusText}
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
            <div id="chatbot-messages" class="chatbot-messages"></div>
            <div class="chatbot-input-container">
              ${suggestionsHTML}
              <div class="chatbot-input-wrapper">
                <input 
                  type="text" 
                  id="chatbot-input" 
                  class="chatbot-input" 
                  placeholder="${this.config.placeholder}"
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
    }

    /**
     * Apply position styling
     */
    applyPosition() {
      const widget = document.getElementById('chatbot-widget');
      if (!widget) return;

      const pos = this.config.position;
      if (pos === 'bottom-left') {
        widget.style.left = this.config.left + 'px';
        widget.style.right = 'auto';
      } else if (pos === 'top-right') {
        widget.style.top = this.config.top + 'px';
        widget.style.bottom = 'auto';
      } else if (pos === 'top-left') {
        widget.style.left = this.config.left + 'px';
        widget.style.right = 'auto';
        widget.style.top = this.config.top + 'px';
        widget.style.bottom = 'auto';
      }
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
      this.widget = document.getElementById('chatbot-widget');
      this.button = document.getElementById('chatbot-button');
      this.window = document.getElementById('chatbot-window');
      this.closeBtn = document.getElementById('chatbot-close');
      this.messagesContainer = document.getElementById('chatbot-messages');
      this.input = document.getElementById('chatbot-input');
      this.sendBtn = document.getElementById('chatbot-send');
      this.suggestions = document.getElementById('chatbot-suggestions');

      // Add welcome message
      if (this.messages.length === 0) {
        this.addMessage(this.config.welcomeMessage, false);
      }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
      this.button.addEventListener('click', () => this.toggleChat());
      this.closeBtn.addEventListener('click', () => this.closeChat());
      this.sendBtn.addEventListener('click', () => this.sendMessage());
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      if (this.suggestions) {
        this.suggestions.querySelectorAll('.suggestion-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            const text = chip.getAttribute('data-suggestion');
            this.input.value = text;
            this.sendMessage();
          });
        });
      }

      this.input.addEventListener('focus', () => {
        if (this.suggestions && this.messages.length <= 1) {
          this.suggestions.style.display = 'none';
        }
      });
    }

    /**
     * Toggle chat window
     */
    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    /**
     * Open chat window
     */
    openChat() {
      this.isOpen = true;
      this.window.classList.add('active');
      this.button.classList.add('active');
      const badge = this.button.querySelector('.chatbot-badge');
      if (badge) badge.style.display = 'none';
      this.input.focus();
      
      if (this.config.onOpen) {
        this.config.onOpen();
      }
    }

    /**
     * Close chat window
     */
    closeChat() {
      this.isOpen = false;
      this.window.classList.remove('active');
      this.button.classList.remove('active');
      
      if (this.config.onClose) {
        this.config.onClose();
      }
    }

    /**
     * Add message to chat
     */
    addMessage(text, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
      
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      
      if (isUser) {
        avatar.innerHTML = this.config.userAvatar 
          ? `<img src="${this.config.userAvatar}" alt="User" />`
          : `<svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>`;
      } else {
        avatar.innerHTML = this.config.botAvatar 
          ? `<img src="${this.config.botAvatar}" alt="Bot" />`
          : `<svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>`;
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
      this.saveMessages();
      
      if (this.config.onMessage) {
        this.config.onMessage(text, isUser);
      }
    }

    /**
     * Format message text
     */
    formatMessage(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
        .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>');
    }

    /**
     * Get current time string
     */
    getCurrentTime() {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
      if (this.isTyping) return;
      
      this.isTyping = true;
      const typingDiv = document.createElement('div');
      typingDiv.className = 'message bot-message typing-message';
      typingDiv.id = 'typing-indicator';
      
      typingDiv.innerHTML = `
        <div class="message-avatar">
          ${this.config.botAvatar 
            ? `<img src="${this.config.botAvatar}" alt="Bot" />`
            : `<svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>`
          }
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

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
      const typing = document.getElementById('typing-indicator');
      if (typing) typing.remove();
      this.isTyping = false;
    }

    /**
     * Generate AI response
     */
    async generateAIResponse(userMessage) {
      // If custom response function is provided, use it
      if (this.config.generateAIResponse && typeof this.config.generateAIResponse === 'function') {
        try {
          return await this.config.generateAIResponse(userMessage, this.messages);
        } catch (error) {
          console.error('Custom AI Response Error:', error);
          if (this.config.onError) {
            this.config.onError(error);
          }
          return this.getFallbackResponse(userMessage);
        }
      }
      
      // If API endpoint is configured, use it
      if (this.config.apiEndpoint) {
        try {
          const response = await fetch(this.config.apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...this.config.apiHeaders,
              ...(this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {})
            },
            body: JSON.stringify({
              message: userMessage,
              context: this.messages.slice(-5)
            })
          });
          
          if (!response.ok) throw new Error('API request failed');
          
          const data = await response.json();
          return data.response || data.message || data.text || data.choices?.[0]?.message?.content || 'I received your message, but I\'m not sure how to respond.';
        } catch (error) {
          console.error('AI API Error:', error);
          if (this.config.onError) {
            this.config.onError(error);
          }
          return this.getFallbackResponse(userMessage);
        }
      }
      
      // Otherwise use fallback responses
      return this.getFallbackResponse(userMessage);
    }

    /**
     * Get fallback response based on keywords
     */
    getFallbackResponse(userMessage) {
      const lowerMessage = userMessage.toLowerCase();
      const kb = this.config.knowledgeBase;
      
      if (this.matchKeywords(lowerMessage, ['hello', 'hi', 'hey', 'greetings'])) {
        return this.getRandom(kb.greetings);
      } else if (this.matchKeywords(lowerMessage, ['hour', 'time', 'when', 'open', 'available'])) {
        return this.getRandom(kb.hours);
      } else if (this.matchKeywords(lowerMessage, ['contact', 'email', 'phone', 'reach'])) {
        return this.getRandom(kb.contact);
      } else if (this.matchKeywords(lowerMessage, ['price', 'pricing', 'cost', 'plan'])) {
        return this.getRandom(kb.pricing);
      } else if (this.matchKeywords(lowerMessage, ['thank', 'thanks'])) {
        return "You're welcome! Is there anything else I can help you with?";
      } else if (this.matchKeywords(lowerMessage, ['bye', 'goodbye'])) {
        return "Goodbye! Feel free to come back if you need any help. Have a great day!";
      }
      
      return this.getRandom(kb.default);
    }

    /**
     * Match keywords in message
     */
    matchKeywords(text, keywords) {
      return keywords.some(keyword => text.includes(keyword));
    }

    /**
     * Get random item from array
     */
    getRandom(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Delay helper
     */
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Send message
     */
    async sendMessage() {
      const text = this.input.value.trim();
      if (!text || this.isTyping) return;
      
      this.input.value = '';
      this.sendBtn.disabled = true;
      
      if (this.suggestions) {
        this.suggestions.style.display = 'none';
      }
      
      this.addMessage(text, true);
      this.showTypingIndicator();
      
      try {
        await this.delay(this.config.responseDelay + Math.random() * 1200);
        const response = await this.generateAIResponse(text);
        this.hideTypingIndicator();
        this.addMessage(response, false);
      } catch (error) {
        this.hideTypingIndicator();
        this.addMessage("I apologize, but I'm having trouble processing that right now. Please try again.", false);
      }
      
      this.sendBtn.disabled = false;
      this.input.focus();
    }

    /**
     * Scroll to bottom
     */
    scrollToBottom() {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    /**
     * Save messages to localStorage
     */
    saveMessages() {
      if (!this.config.enableLocalStorage) return;
      
      try {
        const toSave = this.messages.slice(-this.config.maxMessages);
        localStorage.setItem(this.config.storageKey, JSON.stringify(toSave));
      } catch (e) {
        console.warn('Failed to save messages:', e);
      }
    }

    /**
     * Load messages from localStorage
     */
    loadMessages() {
      if (!this.config.enableLocalStorage) return;
      
      try {
        const saved = localStorage.getItem(this.config.storageKey);
        if (saved) {
          this.messages = JSON.parse(saved);
          this.messages.forEach(msg => {
            // Re-render saved messages
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.isUser ? 'user-message' : 'bot-message'}`;
            // ... (simplified, would need full message rendering)
          });
        }
      } catch (e) {
        console.warn('Failed to load messages:', e);
      }
    }

    /**
     * Public API: Update configuration
     */
    updateConfig(newConfig) {
      this.config = this.mergeConfig(this.config, newConfig);
      // Re-initialize with new config
      this.init();
    }

    /**
     * Public API: Open chat programmatically
     */
    open() {
      this.openChat();
    }

    /**
     * Public API: Close chat programmatically
     */
    close() {
      this.closeChat();
    }

    /**
     * Public API: Send message programmatically
     */
    send(message) {
      this.input.value = message;
      this.sendMessage();
    }

    /**
     * Public API: Clear messages
     */
    clear() {
      this.messages = [];
      this.messagesContainer.innerHTML = '';
      this.addMessage(this.config.welcomeMessage, false);
      if (this.config.enableLocalStorage) {
        localStorage.removeItem(this.config.storageKey);
      }
    }
  }

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIChatbot;
  } else {
    global.AIChatbot = AIChatbot;
  }

})(typeof window !== 'undefined' ? window : this);

