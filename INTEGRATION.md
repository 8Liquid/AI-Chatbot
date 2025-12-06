# Integration Guide

## Quick Integration

### 1. Include Files

Add the CSS and JavaScript files to your HTML:

```html
<link rel="stylesheet" href="path/to/ai-chatbot.css">
<script src="path/to/ai-chatbot.js"></script>
```

### 2. Initialize

```javascript
const chatbot = new AIChatbot();
```

That's it! The chatbot is now live on your page.

## Integration Examples

### Basic Website Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
  <link rel="stylesheet" href="ai-chatbot.css">
</head>
<body>
  <!-- Your website content -->
  
  <script src="ai-chatbot.js"></script>
  <script>
    const chatbot = new AIChatbot({
      welcomeMessage: "Welcome to our site! How can we help?",
      primaryColor: '#your-brand-color'
    });
  </script>
</body>
</html>
```

### React Integration

```jsx
import { useEffect } from 'react';
import 'ai-chatbot/ai-chatbot.css';

function App() {
  useEffect(() => {
    // Dynamically import the chatbot
    import('ai-chatbot/ai-chatbot.js').then(({ AIChatbot }) => {
      window.chatbot = new AIChatbot({
        welcomeMessage: "Hello from React!",
        primaryColor: '#61dafb'
      });
    });
  }, []);

  return (
    <div className="App">
      {/* Your React app */}
    </div>
  );
}
```

### Vue.js Integration

```vue
<template>
  <div id="app">
    <!-- Your Vue app -->
  </div>
</template>

<script>
import 'ai-chatbot/ai-chatbot.css';

export default {
  name: 'App',
  mounted() {
    import('ai-chatbot/ai-chatbot.js').then(({ AIChatbot }) => {
      this.chatbot = new AIChatbot({
        welcomeMessage: "Hello from Vue!",
        primaryColor: '#42b983'
      });
    });
  }
}
</script>
```

### Next.js Integration

Create `pages/_app.js`:

```javascript
import { useEffect } from 'react';
import 'ai-chatbot/ai-chatbot.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import('ai-chatbot/ai-chatbot.js').then(({ AIChatbot }) => {
      if (typeof window !== 'undefined') {
        window.chatbot = new AIChatbot({
          welcomeMessage: "Welcome to our Next.js site!",
          primaryColor: '#0070f3'
        });
      }
    });
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```

### WordPress Integration

1. Upload `ai-chatbot.js` and `ai-chatbot.css` to your theme directory
2. Add to your theme's `functions.php`:

```php
function enqueue_chatbot() {
    wp_enqueue_style('ai-chatbot-css', get_template_directory_uri() . '/ai-chatbot.css');
    wp_enqueue_script('ai-chatbot-js', get_template_directory_uri() . '/ai-chatbot.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_chatbot');
```

3. Add initialization code to your theme's footer:

```php
<script>
const chatbot = new AIChatbot({
  welcomeMessage: "Welcome to <?php echo get_bloginfo('name'); ?>!"
});
</script>
```

### Shopify Integration

1. Upload `ai-chatbot.js` and `ai-chatbot.css` to your theme assets
2. In your theme's `theme.liquid`, add before `</head>`:

```liquid
{{ 'ai-chatbot.css' | asset_url | stylesheet_tag }}
```

3. Before `</body>`, add:

```liquid
{{ 'ai-chatbot.js' | asset_url | script_tag }}
<script>
const chatbot = new AIChatbot({
  welcomeMessage: "Welcome to {{ shop.name }}!",
  primaryColor: '{{ settings.color_primary }}'
});
</script>
```

## API Integration Examples

### OpenAI GPT Integration

```javascript
const chatbot = new AIChatbot({
  generateAIResponse: async (userMessage, messageHistory) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          ...messageHistory.slice(-10).map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          })),
          { role: 'user', content: userMessage }
        ]
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
});
```

### Anthropic Claude Integration

```javascript
const chatbot = new AIChatbot({
  generateAIResponse: async (userMessage) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': 'YOUR_ANTHROPIC_API_KEY',
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{ role: 'user', content: userMessage }]
      })
    });
    
    const data = await response.json();
    return data.content[0].text;
  }
});
```

### Custom Backend API

```javascript
const chatbot = new AIChatbot({
  apiEndpoint: 'https://your-backend.com/api/chat',
  apiKey: 'your-api-key',
  apiHeaders: {
    'X-Custom-Header': 'value'
  }
});
```

Your backend should accept:
```json
{
  "message": "user message",
  "context": [/* previous messages */]
}
```

And return:
```json
{
  "response": "bot response"
}
```

## Troubleshooting

### Chatbot not appearing

1. Check that both CSS and JS files are loaded
2. Ensure no JavaScript errors in console
3. Verify the script runs after DOM is ready

### Styling issues

1. Check z-index conflicts (default is 9999)
2. Ensure your site's CSS isn't overriding chatbot styles
3. Use `customCSS` option for specific overrides

### API integration issues

1. Check browser console for errors
2. Verify CORS settings on your API
3. Use `onError` callback to handle errors gracefully

## Best Practices

1. **Load chatbot asynchronously** for better page performance
2. **Use CDN** for faster loading times
3. **Customize colors** to match your brand
4. **Set up proper error handling** with `onError` callback
5. **Test on multiple browsers** before deployment
6. **Monitor API usage** when using paid AI services

