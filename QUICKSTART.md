# Quick Start Guide

Get your AI chatbot up and running in 2 minutes!

## Step 1: Download Files

Download these two files:
- `ai-chatbot.js`
- `ai-chatbot.css`

## Step 2: Add to Your HTML

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

## Step 3: Customize (Optional)

```javascript
const chatbot = new AIChatbot({
  primaryColor: '#your-brand-color',
  welcomeMessage: "Hello! How can I help?",
  position: 'bottom-right'
});
```

## That's It! 🎉

Your chatbot is now live. Visit your website and you'll see the chat button in the bottom-right corner.

## Next Steps

- [Configure colors and styling](README.md#configuration)
- [Connect to an AI API](INTEGRATION.md#api-integration-examples)
- [See more examples](examples.html)
- [Read full documentation](README.md)

## Need Help?

- Check the [README](README.md) for full documentation
- See [INTEGRATION.md](INTEGRATION.md) for platform-specific guides
- Open an [issue](https://github.com/8Liquid/ai-chatbot/issues) if you need support

