import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "90vh",
        fontFamily: "'Poppins', sans-serif",
        background: "#e0f7fa",
        overflow: "hidden",
      }}
    >
      {/* LEFT SIDEBAR */}
      <div
        style={{
          width: "270px",
          background: "linear-gradient(135deg, #00acc1, #00796b)",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
          overflowY: "auto", // ⭐ sidebar scroll enabled
        }}
      >
        {/* TOP SECTION */}
        <div>
          <button
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              background: "#ffffff",
              color: "#00796b",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            + New Chat
          </button>

          {/* Search */}
          <input
            type="text"
            placeholder="Search chat..."
            style={{
              marginTop: "18px",
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              background: "rgba(255,255,255,0.85)",
              fontSize: "13px",
            }}
          />

          <h3
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              color: "#e0f7fa",
              fontSize: "15px", // ⭐ reduced font size
              fontWeight: "700",
            }}
          >
            Chat History
          </h3>

          {/* Chat History Scroll */}
          <div
            style={{
              maxHeight: "350px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {["General Health", "Symptoms Check", "Diet Plans", "Medicine Info"].map(
              (item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.25)",
                    cursor: "pointer",
                    fontWeight: 500,
                    color: "#ffffff",
                    transition: "0.3s",
                    fontSize: "13px", // ⭐ smaller text
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        {/* PROFILE SECTION */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderTop: "2px solid rgba(255,255,255,0.3)",
            paddingTop: "15px",
          }}
        >
          <img
            src="https://via.placeholder.com/45"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
          <div>
            <strong style={{ fontSize: "13px" }}>User Name</strong>
            <p style={{ margin: 0, color: "#e0f7fa", fontSize: "11px" }}>
              View Profile
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT CHAT WINDOW (FIXED, NEVER SCROLL) */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // ⭐ prevents outer scroll
        }}
      >
        {/* MESSAGES (ONLY THIS AREA SCROLLS) */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto", // ⭐ messages scroll
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                background:
                  msg.sender === "user" ? "#00acc1" : "#ffffff",
                color: msg.sender === "user" ? "white" : "#00796b",
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: "12px",
                maxWidth: "60%",
                alignSelf:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                boxShadow: "0px 3px 12px rgba(0,0,0,0.1)",
                fontSize: "14px", // ⭐ smaller message text
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* INPUT BAR */}
        <div
          style={{
            padding: "15px",
            background: "#ffffff",
            borderTop: "3px solid #00acc1",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Ask MeduPulse anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #00acc1",
              outline: "none",
              background: "#e0f7fa",
              color: "#00796b",
              fontSize: "14px", 
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: "10px",
              padding: "12px 20px",
              background: "linear-gradient(135deg, #00acc1, #00796b)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              fontSize: "14px",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
