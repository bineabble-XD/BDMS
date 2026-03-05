import React, { useEffect, useRef, useState } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi 👋 I’m BDMS Assistant. How can I help you today?\n\nYou can ask:\n- How to donate blood?\n- Where to register?\n- Urgent requests?\n- Contact info?",
    },
  ]);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const quickReply = (text) => {
    const t = (text || "").toLowerCase();

    if (t.includes("donate") || t.includes("donation")) {
      return "To donate blood:\n1) Register/Login\n2) Complete your profile\n3) Check eligibility\n4) Find nearby hospitals / requests\n5) Confirm appointment (if available).\n\nIf you want, tell me your blood type and city.";
    }

    if (t.includes("register") || t.includes("sign up") || t.includes("signup")) {
      return "To register:\n- Click Register from the top menu\n- Fill your details\n- Verify your email (if enabled)\n- Login and complete your profile.";
    }

    if (t.includes("urgent") || t.includes("request")) {
      return "For urgent requests:\n- Go to “Urgent Requests” in the menu\n- You can view current requests\n- If you are a donor, you can respond to help.\n\nDo you want donors-only or hospital-side help?";
    }

    if (t.includes("login") || t.includes("log in")) {
      return "To login:\n- Click Log In from the menu\n- Enter your email and password\n- If you forgot password, use “Forgot Password”.";
    }

    if (t.includes("contact") || t.includes("help") || t.includes("support")) {
      return "For support:\n- Use the Feedback page in the menu\n- Or tell me your issue here and I’ll guide you step-by-step.";
    }

    if (t.includes("hospital")) {
      return "If you are a hospital user:\n- Register as Hospital\n- Manage requests in Hospital Dashboard\n- Track inventory and urgent requests.\n\nDo you want to add a new urgent request or manage inventory?";
    }

    return "Thanks! I can help with:\n- Donation steps\n- Register/Login\n- Urgent requests\n- Hospital dashboard\n\nType what you need, and I’ll guide you.";
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");

    const reply = quickReply(text);
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 400);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") send();
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 90, // ✅ Above your Widgets button
          zIndex: 9999,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          background: "#dc3545", // BDMS red
          color: "white",
          fontSize: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Open chat"
        title="Chat with BDMS"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 155, // sits above the button
            width: 320,
            maxWidth: "90vw",
            height: 420,
            maxHeight: "70vh",
            background: "white",
            borderRadius: 16,
            boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
            zIndex: 9999,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#dc3545",
              color: "white",
              padding: "12px 14px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>BDMS Chatbot</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: 18,
                cursor: "pointer",
              }}
              aria-label="Close chat"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              padding: 12,
              flex: 1,
              overflowY: "auto",
              background: "#f7f7f7",
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 12px",
                    borderRadius: 14,
                    whiteSpace: "pre-line",
                    background: m.from === "user" ? "#dc3545" : "white",
                    color: m.from === "user" ? "white" : "#111",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: 10,
              display: "flex",
              gap: 8,
              borderTop: "1px solid #eee",
              background: "white",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #ddd",
                outline: "none",
              }}
            />
            <button
              onClick={send}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: "#dc3545",
                color: "white",
                fontWeight: 700,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}