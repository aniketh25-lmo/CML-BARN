import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface ChatBotProps {
  visible?: boolean;
}

export default function ChatBot({ visible = false }: ChatBotProps) {
  const chatbotHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Chatbot</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f8fafc;
        }
        #chatbot-container {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
      </style>
    </head>
    <body>
      <div id="chatbot-container"></div>
      <script src="https://cdn.botpress.cloud/webchat/v3.0/inject.js"></script>
      <script src="https://files.bpcontent.cloud/2025/06/25/15/20250625151118-4W4EJ8MS.js"></script>
      <script>
        // Initialize the chatbot when the page loads
        window.addEventListener('load', function() {
          // The chatbot should automatically initialize from the injected scripts
          console.log('Chatbot initialized');
        });
      </script>
    </body>
    </html>
  `;

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: chatbotHTML }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  webview: {
    flex: 1,
  },
});