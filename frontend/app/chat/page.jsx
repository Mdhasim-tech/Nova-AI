"use client"
import './page.css'
import { useRef, useEffect } from 'react';
import { useState } from 'react';
import Head from 'next/head';


export default function ChatPage() {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const endOfMessagesRef = useRef(null);

useEffect(() => {
  endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [chat, loading]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = { sender: 'user', text: question };
    setChat([...chat, userMessage]);
    setLoading(true);
    setQuestion('');

    try {
      const res = await fetch('http://127.0.0.1:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      const botMessage = {
        sender: 'bot',
        text: data.response || data.error || 'Something went wrong.',
      };

      setChat(prev => [...prev, botMessage]);
    } catch (err) {
      setChat(prev => [
        ...prev,
        { sender: 'bot', text: 'Server error. Try again later.' },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAsk();
  };

  return (
    <>
      <Head>
        <title>Chat with Nova</title>
      </Head>

      <div className="main">
        <h2 className="title">Chat with <span className="nova">Nova</span></h2>
        <div className="chatBox">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="message bot">Nova is typing...</div>}
          <div ref={endOfMessagesRef} />
        </div>

        <div className="inputArea">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask Nova anything..."
            className="chatInput"
          />
          <button className="ctaButton" onClick={handleAsk}>Send</button>
        </div>
      </div>
    </>
  );
}
