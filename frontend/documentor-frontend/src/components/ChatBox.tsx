// src/components/ChatBox.tsx
import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

const ChatBox: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.text }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        botMessage += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.sender === "bot") {
            return [...prev.slice(0, -1), { ...last, text: botMessage }];
          } else {
            return [
              ...prev,
              {
                id: Date.now() + 1,
                sender: "bot",
                text: botMessage,
                timestamp: new Date().toLocaleTimeString(),
              },
            ];
          }
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2 className="section-title">💬 Chat with Documents</h2>

      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            <div className="message-text">{msg.text}</div>
            <div className="timestamp">{msg.timestamp}</div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble bot">
            <div className="message-text">Bot is thinking...</div>
            <div className="timestamp">{new Date().toLocaleTimeString()}</div>
          </div>
        )}

        <div ref={messageEndRef}></div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
