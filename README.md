# 🤖 Highly Customizable AI Support Bot

> A beautiful, modern, and highly customizable AI chatbot widget that can be easily embedded into any website. Built with vanilla JavaScript, zero dependencies, and fully customizable via configuration.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/)
[![Size](https://img.shields.io/badge/Size-~15KB-green.svg)](https://github.com)

## ✨ Features

- 🎨 **Highly Customizable** - Colors, position, size, messages, and more
- 🚀 **Zero Dependencies** - Pure vanilla JavaScript, no frameworks required
- 💬 **Modern UI** - Beautiful, responsive chat interface with smooth animations
- 🔌 **Easy Integration** - Simple 2-line setup
- 🤖 **AI Ready** - Built-in support for AI API integration
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🎯 **Theme Support** - Light, dark, and auto themes
- 💾 **Local Storage** - Message persistence across sessions
- ⌨️ **Keyboard Shortcuts** - Enter to send, smooth UX
- 🌐 **TypeScript Ready** - Easy to extend with TypeScript

## 📦 Installation

### CDN (Recommended)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/8Liquid/ai-chatbot@main/ai-chatbot.css">
<script src="https://cdn.jsdelivr.net/gh/8Liquid/ai-chatbot@main/ai-chatbot.js"></script>
```

### NPM

```bash
npm install ai-support-chatbot
```

### Manual Download

Download `ai-chatbot.js` and `ai-chatbot.css` from the [releases](https://github.com/8Liquid/ai-chatbot/releases) page.

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="ai-chatbot.css">
</head>
<body>
  <!-- Your website content -->
  
  <script src="ai-chatbot.js"></script>
  <script>
    const chatbot = new AIChatbot();
  </script>
</body>
</html>
```

That's it! The chatbot will automatically appear in the bottom-right corner.

## ⚙️ Configuration

### Full Configuration Options

```javascript
const chatbot = new AIChatbot({
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
  
  // Dimensions
  width: 380,
  height: 600,
  buttonSize: 60,
  
  // Messages
  welcomeMessage: "Hello! 👋 How can I help you?",
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
  
  // AI API Configuration
  apiEndpoint: 'https://api.example.com/chat',
  apiKey: 'your-api-key',
  apiHeaders: {
    'X-Custom-Header': 'value'
  },
  responseDelay: 800,
  
  // Customization
  customCSS: '/* Your custom CSS */',
  borderRadius: 20,
  shadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
  
  // Avatars
  showAvatar: true,
  botAvatar: 'https://example.com/bot-avatar.png',
  userAvatar: 'https://example.com/user-avatar.png',
  
  // Advanced
  zIndex: 9999,
  enableLocalStorage: true,
  storageKey: 'ai-chatbot-messages',
  maxMessages: 50,
  
  // Callbacks
  onOpen: () => console.log('Chat opened'),
  onClose: () => console.log('Chat closed'),
  onMessage: (message, isUser) => console.log('New message:', message),
  onError: (error) => console.error('Error:', error),
  
  // Knowledge base (for fallback responses)
  knowledgeBase: {
    greetings: ["Hello! How can I help?"],
    hours: ["We're open 9 AM - 6 PM EST"],
    contact: ["Contact us on Discord: @8Liquid"],
    pricing: ["Our plans start at $29/month"],
    default: ["I'm here to help!"]
  }
});
```

## 📚 Examples

### Example 1: Simple Setup

```javascript
const chatbot = new AIChatbot({
  welcomeMessage: "Hi! I'm here to help.",
  primaryColor: '#007bff'
});
```

### Example 2: Connect to OpenAI

```javascript
const chatbot = new AIChatbot({
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  apiKey: 'your-openai-api-key',
  apiHeaders: {
    'Content-Type': 'application/json'
  },
  generateAIResponse: async (userMessage) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${chatbot.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }
});
```

### Example 3: Custom Position and Colors

```javascript
const chatbot = new AIChatbot({
  position: 'bottom-left',
  primaryColor: '#10b981',
  primaryHover: '#059669',
  botBubbleColor: '#f3f4f6',
  userBubbleColor: '#10b981'
});
```

### Example 4: Dark Theme

```javascript
const chatbot = new AIChatbot({
  theme: 'dark',
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff',
  botBubbleColor: '#2d2d2d'
});
```

### Example 5: Programmatic Control

```javascript
const chatbot = new AIChatbot();

// Open chat programmatically
chatbot.open();

// Close chat
chatbot.close();

// Send message programmatically
chatbot.send("Hello from code!");

// Update configuration
chatbot.updateConfig({
  primaryColor: '#ff0000'
});

// Clear messages
chatbot.clear();
```

## 🎨 Customization Guide

### Custom CSS

You can add custom CSS using the `customCSS` option:

```javascript
const chatbot = new AIChatbot({
  customCSS: `
    #chatbot-button {
      box-shadow: 0 0 20px rgba(100, 108, 255, 0.5);
    }
    .chatbot-header {
      background: linear-gradient(45deg, #667eea, #764ba2);
    }
  `
});
```

### Custom Avatars

```javascript
const chatbot = new AIChatbot({
  botAvatar: 'https://your-domain.com/images/bot-avatar.svg',
  userAvatar: 'https://your-domain.com/images/user-avatar.png'
});
```

### Custom Knowledge Base

```javascript
const chatbot = new AIChatbot({
  knowledgeBase: {
    greetings: ["Hello!", "Hi there!", "Hey!"],
    faq: {
      shipping: "We ship within 2-3 business days",
      returns: "30-day return policy",
      support: "Contact us on Discord: @8Liquid"
    },
    default: ["Let me help you with that!"]
  }
});
```

## 🔌 API Integration

### OpenAI Integration

See the [OpenAI example](#example-2-connect-to-openai) above.

### Custom API

```javascript
const chatbot = new AIChatbot({
  apiEndpoint: 'https://your-api.com/chat',
  apiKey: 'your-api-key',
  // The bot will automatically format requests as:
  // POST { apiEndpoint }
  // Body: { message: string, context: Message[] }
  // Expected response: { response: string } or { message: string }
});
```

## 📖 API Reference

### Constructor

```javascript
new AIChatbot(config?: ChatbotConfig)
```

### Methods

#### `open()`
Opens the chat window programmatically.

#### `close()`
Closes the chat window programmatically.

#### `send(message: string)`
Sends a message programmatically.

#### `updateConfig(newConfig: Partial<ChatbotConfig>)`
Updates the chatbot configuration.

#### `clear()`
Clears all messages.

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with vanilla JavaScript
- Inspired by modern chat UI patterns
- Icons from [Heroicons](https://heroicons.com/)

## 📞 Support

- 💬 Discord: [@8Liquid](https://discord.com/users/8Liquid)
- 🐛 Issues: [GitHub Issues](https://github.com/8Liquid/ai-chatbot/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/8Liquid/ai-chatbot/discussions)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=8Liquid/ai-chatbot&type=Date)](https://star-history.com/#8Liquid/ai-chatbot&Date)

---
If you enjoy this project and want to support its development, consider leaving a tip — it truly helps me keep building and improving!
➡️ **[https://ko-fi.com/8liquid](https://ko-fi.com/8liquid)**




Made with ❤️ by 8Liquid
