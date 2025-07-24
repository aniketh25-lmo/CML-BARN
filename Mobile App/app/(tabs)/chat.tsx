import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, X } from 'lucide-react-native';
import ChatBot from '@/components/ChatBot';

export default function ChatScreen() {
  const [isChatVisible, setIsChatVisible] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Expert Chat</Text>
        <Text style={styles.subtitle}>Get instant help from our AI assistant</Text>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setIsChatVisible(!isChatVisible)}
        >
          {isChatVisible ? (
            <X size={20} color="#FFFFFF" />
          ) : (
            <MessageCircle size={20} color="#FFFFFF" />
          )}
          <Text style={styles.toggleButtonText}>
            {isChatVisible ? 'Close Chat' : 'Open Chat'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chat Container */}
      <View style={styles.chatContainer}>
        {isChatVisible ? (
          <ChatBot visible={true} />
        ) : (
          <View style={styles.chatPlaceholder}>
            <MessageCircle size={64} color="#9CA3AF" />
            <Text style={styles.placeholderTitle}>Chat Assistant</Text>
            <Text style={styles.placeholderText}>
              Tap "Open Chat" to start a conversation with our AI assistant
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatContainer: {
    flex: 1,
  },
  chatPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});