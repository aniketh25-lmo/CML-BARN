import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

const ChatStream = () => {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const managerToken = localStorage.getItem('managerToken');
    const farmerToken = localStorage.getItem('farmerToken');

    try {
      if (managerToken) {
        const decoded = jwtDecode(managerToken);
        const payload = decoded?.payload || decoded;
        const name = payload.name;
        const email = payload.email;
        if (!name || !email) throw new Error('Invalid manager token structure');
        setUser({ name, role: 'manager' });
      } else if (farmerToken) {
        const decoded = jwtDecode(farmerToken);
        const payload = decoded?.payload || decoded;
        const name = payload.name;
        const aadharNumber = payload.aadharNumber;
        if (!name || !aadharNumber) throw new Error('Invalid farmer token structure');
        setUser({ name, role: 'farmer' });
      } else {
        throw new Error('No token found');
      }
    } catch (err) {
      console.error('Token decoding error:', err.message);
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/chat/messages');
        const data = await res.json();
        setMessages(data.data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputMsg.trim() || !user?.name || !user?.role) {
      alert('User info missing. Please login again.');
      return;
    }

    const payload = {
      senderName: user.name,
      senderRole: user.role,
      message: inputMsg.trim(),
    };

    try {
      const res = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(`Send failed: ${result?.errors?.[0]?.msg || result?.error || 'Unknown error'}`);
      } else {
        setInputMsg('');
      }

    } catch (err) {
      console.error('Send error:', err);
      alert('Something went wrong while sending the message.');
    }
  };

  if (!user) return <p>Loading chat...</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Manager–Farmer Chat</h2>
        <div style={styles.chatBox}>
          {messages.map((msg, index) => (
            <div
              key={index}
              ref={index === messages.length - 1 ? scrollRef : null}
              style={{
                ...styles.message,
                ...(msg.senderRole === user.role && msg.senderName === user.name
                  ? styles.self
                  : styles.other),
              }}
            >
              <strong>{msg.senderName} ({msg.senderRole}):</strong>
              <div>{msg.message}</div>
            </div>
          ))}
        </div>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            style={styles.input}
          />
          <button
            onClick={handleSend}
            style={styles.button}
            disabled={!user || !inputMsg.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatStream;

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Full viewport height
    backgroundColor: '#e9ecef',
  },
  container: {
    width: '100%',
    maxWidth: '600px',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1rem',
    fontWeight: 'bold',
    fontSize: '1.5rem'
  },
  chatBox: {
    height: '400px',
    overflowY: 'auto',
    padding: '1rem',
    background: '#ffffff',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  message: {
    marginBottom: '10px',
    padding: '0.5rem',
    borderRadius: '5px',
  },
  self: {
    backgroundColor: '#d1e7dd',
    textAlign: 'right',
  },
  other: {
    backgroundColor: '#f8d7da',
    textAlign: 'left',
  },
  inputWrapper: {
    display: 'flex',
    gap: '10px',
    marginTop: '1rem',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #aaa',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: '#198754',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
  }
};
