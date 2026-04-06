import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFloatingPanel } from "../context/FloatingPanelContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const formatTime = (date = new Date()) =>
  new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Muscat",
  });

const getUserRole = (user) => {
  if (!user) return "guest";
  if (user.isAdmin) return "admin";
  if (user.isHospital || user.role === "Hospital") return "hospital";
  return "donor";
};

const normalize = (text) => (text || "").trim().toLowerCase();

export default function ChatbotWidget() {
  const navigate = useNavigate();
  const endRef = useRef(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("bdmsUser") || "null");
    } catch {
      return null;
    }
  }, []);

  const role = getUserRole(user);
  const userName = user?.fName || "there";

  const donorQuickActions = [
    { label: "How to Donate", action: "how_to_donate" },
    { label: "Register", action: "register" },
    { label: "Login Help", action: "login_help" },
    { label: "Urgent Requests", action: "urgent_requests" },
    { label: "My Appointments", action: "my_appointments" },
    { label: "Eligibility", action: "check_eligibility" },
    { label: "Contact Info", action: "contact_info" },
  ];

  const hospitalQuickActions = [
    { label: "Hospital Help", action: "hospital_help" },
    { label: "Appointments", action: "hospital_appointments" },
    { label: "Blood Bank", action: "hospital_blood_bank" },
    { label: "Inventory", action: "hospital_inventory" },
    { label: "Urgent Requests", action: "hospital_urgent_requests" },
    { label: "Reports", action: "hospital_reports" },
    { label: "Contact Info", action: "contact_info" },
  ];

  const adminQuickActions = [
    { label: "Dashboard", action: "admin_dashboard" },
    { label: "Reports", action: "admin_reports" },
    { label: "Hospital Requests", action: "admin_hospitals" },
    { label: "Contact Info", action: "contact_info" },
  ];

  const guestQuickActions = [
    { label: "How to Donate", action: "how_to_donate" },
    { label: "Register", action: "register" },
    { label: "Login Help", action: "login_help" },
    { label: "Urgent Requests", action: "urgent_requests" },
    { label: "Hospital Help", action: "hospital_help" },
    { label: "Contact Info", action: "contact_info" },
  ];

  const quickActions =
    role === "donor"
      ? donorQuickActions
      : role === "hospital"
      ? hospitalQuickActions
      : role === "admin"
      ? adminQuickActions
      : guestQuickActions;

  const buildWelcomeMessage = () => {
    if (role === "donor") {
      return `Hi ${userName} 👋 I’m BDMS Assistant. How can I help you today?

You can ask:
- How to donate blood?
- Where to register?
- Urgent requests?
- Login help?
- Contact info?
- My appointments?
- Eligibility?`;
    }

    if (role === "hospital") {
      return `Hi ${userName} 👋 I’m BDMS Assistant. How can I help you today?

You can ask:
- Hospital dashboard help?
- Appointments?
- Inventory?
- Blood bank?
- Urgent requests?
- Reports?
- Contact info?`;
    }

    if (role === "admin") {
      return `Hi ${userName} 👋 I’m BDMS Assistant. How can I help you today?

You can ask:
- Dashboard?
- Reports?
- Hospital requests?
- Contact info?`;
    }

    return `Hi 👋 I’m BDMS Assistant. How can I help you today?

You can ask:
- How to donate blood?
- Where to register?
- Urgent requests?
- Login help?
- Contact info?
- Hospital help?`;
  };

  const { openPanel, setOpenPanel } = useFloatingPanel();
  const open = openPanel === "chatbot";
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: buildWelcomeMessage(),
      time: formatTime(),
      quickActions,
    },
  ]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, isTyping]);

  const addMessage = (from, text, extra = {}) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        from,
        text,
        time: formatTime(),
        ...extra,
      },
    ]);
  };

  const replyWithTyping = (text, extra = {}) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage("bot", text, extra);
    }, 450);
  };

  const navigateByAction = (action) => {
    const routes = {
      register: "/register",
      my_appointments: "/my-appointments",
      urgent_requests: "/urgent-requests",
      hospital_appointments: "/hospital-appointments",
      hospital_blood_bank: `/blood-bank/${user?._id || user?.id || ""}`,
      hospital_inventory: "/inventory",
      hospital_urgent_requests: "/urgent-requests",
      hospital_reports: "/hospital-reports",
      admin_dashboard: "/admin-dash",
      admin_reports: "/admin-report",
      admin_hospitals: "/admin-hospital-requests",
    };

    const route = routes[action];
    if (route) navigate(route);
  };

  const fetchMatchingUrgentRequests = async () => {
    try {
      if (!user?._id || role !== "donor") return null;
      const res = await fetch(`${API_BASE}/urgent-requests/matching/${user._id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data?.requests || [];
    } catch {
      return null;
    }
  };

  const quickReply = async (text) => {
    const t = normalize(text);

    if (t.includes("donate") || t.includes("donation") || t.includes("how to donate")) {
      return {
        text: `To donate blood:
1) Register/Login
2) Complete your profile
3) Check eligibility
4) Find nearby hospitals / requests
5) Confirm appointment (if available)

If you want, tell me your blood type and city.`,
        quickActions: [
          { label: "Register", action: "register" },
          { label: "Urgent Requests", action: "urgent_requests" },
          { label: "Eligibility", action: "check_eligibility" },
        ],
      };
    }

    if (t.includes("register") || t.includes("sign up") || t.includes("signup")) {
      return {
        text: `To register:
- Click Register from the top menu
- Fill your details
- Verify your email (if enabled)
- Login and complete your profile.`,
        quickActions: [{ label: "Register", action: "register" }],
      };
    }

    if (t.includes("urgent") || t.includes("request")) {
      const requests = await fetchMatchingUrgentRequests();

      if (requests && requests.length > 0) {
        const first = requests[0];
        const hospitalName = first?.hospital?.hospitalName || "a hospital";
        return {
          text: `For urgent requests:
- Go to “Urgent Requests” in the menu
- You can view current requests
- If you are a donor, you can respond to help

Right now, there are ${requests.length} urgent request(s) matching your type. The latest is from ${hospitalName}.`,
          quickActions: [{ label: "Urgent Requests", action: "urgent_requests" }],
        };
      }

      return {
        text: `For urgent requests:
- Go to “Urgent Requests” in the menu
- You can view current requests
- If you are a donor, you can respond to help

Do you want donors-only or hospital-side help?`,
        quickActions: [{ label: "Urgent Requests", action: "urgent_requests" }],
      };
    }

    if (t.includes("login") || t.includes("log in")) {
      return {
        text: `To login:
- Click Log In from the menu
- Enter your email and password
- If you forgot password, use “Forgot Password”.`,
      };
    }

    if (t.includes("contact") || t.includes("help") || t.includes("support")) {
      return {
        text: `For support:
- Use the Feedback page in the menu
- Or tell me your issue here and I’ll guide you step-by-step.`,
      };
    }

    if (t.includes("hospital")) {
      return {
        text: `If you are a hospital user:
- Register as Hospital
- Manage requests in Hospital Dashboard
- Track inventory and urgent requests

Do you want to add a new urgent request or manage inventory?`,
        quickActions: [
          { label: "Appointments", action: "hospital_appointments" },
          { label: "Blood Bank", action: "hospital_blood_bank" },
          { label: "Inventory", action: "hospital_inventory" },
          { label: "Reports", action: "hospital_reports" },
        ],
      };
    }

    if (
      t.includes("eligible") ||
      t.includes("eligibility") ||
      t.includes("can i donate")
    ) {
      return {
        text: `Basic donation eligibility usually depends on:
- age
- general health
- time since last donation
- medical condition
- medication use

A strong next step for your project is to make this a mini eligibility checker.`,
        quickActions: [{ label: "Eligibility", action: "check_eligibility" }],
      };
    }

    if (t.includes("appointment") && role === "donor") {
      return {
        text: "You can manage and review your bookings from the My Appointments page.",
        quickActions: [{ label: "My Appointments", action: "my_appointments" }],
      };
    }

    if (t.includes("appointment") && role === "hospital") {
      return {
        text: "You can review approved donations and completed donations from the hospital appointments page.",
        quickActions: [{ label: "Appointments", action: "hospital_appointments" }],
      };
    }

    if (t.includes("inventory") || t.includes("stock") || t.includes("blood bank")) {
      return {
        text: "You can manage blood stock, donation records, and expiry dates from the Blood Bank and Inventory pages.",
        quickActions: [
          { label: "Blood Bank", action: "hospital_blood_bank" },
          { label: "Inventory", action: "hospital_inventory" },
        ],
      };
    }

    if (t.includes("report") || t.includes("pdf") || t.includes("excel")) {
      return {
        text: "You can use the Reports page to view stock summaries and export data as PDF or Excel.",
        quickActions:
          role === "hospital"
            ? [{ label: "Reports", action: "hospital_reports" }]
            : role === "admin"
            ? [{ label: "Reports", action: "admin_reports" }]
            : [],
      };
    }

    return {
      text: `Thanks! I can help with:
- Donation steps
- Register/Login
- Urgent requests
- Hospital dashboard
- Inventory and reports
- Contact/support

Type what you need, and I’ll guide you.`,
      quickActions,
    };
  };

  const handleAction = async (action) => {
    const labels = {
      how_to_donate: "How to Donate",
      register: "Register",
      login_help: "Login Help",
      urgent_requests: "Urgent Requests",
      my_appointments: "My Appointments",
      check_eligibility: "Eligibility",
      contact_info: "Contact Info",
      hospital_help: "Hospital Help",
      hospital_appointments: "Appointments",
      hospital_blood_bank: "Blood Bank",
      hospital_inventory: "Inventory",
      hospital_urgent_requests: "Urgent Requests",
      hospital_reports: "Reports",
      admin_dashboard: "Dashboard",
      admin_reports: "Reports",
      admin_hospitals: "Hospital Requests",
    };

    const label = labels[action] || action;
    addMessage("user", label);

    if (action === "how_to_donate") {
      replyWithTyping(
        `To donate blood:
1) Register/Login
2) Complete your profile
3) Check eligibility
4) Find nearby hospitals / requests
5) Confirm appointment (if available)

If you want, tell me your blood type and city.`
      );
      return;
    }

    if (action === "login_help") {
      replyWithTyping(
        `To login:
- Click Log In from the menu
- Enter your email and password
- If you forgot password, use “Forgot Password”.`
      );
      return;
    }

    if (action === "check_eligibility") {
      replyWithTyping(
        `Basic donation eligibility usually depends on:
- age
- general health
- time since last donation
- medical condition
- medication use

You can also turn this into a full eligibility checker in your project.`
      );
      return;
    }

    if (action === "contact_info") {
      replyWithTyping(
        `For support:
- Use the Feedback / Instagram page in the menu
- Or tell me your issue here and I’ll guide you step-by-step.`
      );
      return;
    }

    if (action === "hospital_help") {
      replyWithTyping(
        `If you are a hospital user:
- Register as Hospital
- Manage requests in Hospital Dashboard
- Track inventory and urgent requests

Do you want help with appointments, inventory, or reports?`,
        {
          quickActions: [
            { label: "Appointments", action: "hospital_appointments" },
            { label: "Blood Bank", action: "hospital_blood_bank" },
            { label: "Inventory", action: "hospital_inventory" },
            { label: "Reports", action: "hospital_reports" },
          ],
        }
      );
      return;
    }

    navigateByAction(action);
    replyWithTyping(`Opening ${label} for you.`);
  };

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    addMessage("user", text);
    setInput("");

    const reply = await quickReply(text);
    replyWithTyping(reply.text, {
      quickActions: reply.quickActions || [],
    });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") send();
  };

  return (
    <>
      <button
        onClick={() => setOpenPanel(open ? null : "chatbot")}
        className="chatbot-fab"
        style={{
          position: "fixed",
          right: 98,
          bottom: 12,
          zIndex: 9999,
        }}
        aria-label="Open chat"
        title="Chat with BDMS"
      >
        {open ? "✕" : <FaRobot size={18} />}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            right: 98,
            bottom: 64,
            width: 360,
            maxWidth: "90vw",
            height: 500,
            maxHeight: "75vh",
            background: "white",
            borderRadius: 16,
            boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
            zIndex: 9999,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #eee",
          }}
        >
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
              onClick={() => setOpenPanel(null)}
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

          <div
            style={{
              padding: 12,
              flex: 1,
              overflowY: "auto",
              background: "#f7f7f7",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
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
                  <div>{m.text}</div>

                  {m.quickActions?.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginTop: 10,
                      }}
                    >
                      {m.quickActions.map((btn) => (
                        <button
                          key={btn.action}
                          type="button"
                          onClick={() => handleAction(btn.action)}
                          style={{
                            border: "1px solid #dc3545",
                            background: "#fff5f6",
                            color: "#dc3545",
                            borderRadius: 999,
                            padding: "6px 10px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 11,
                      opacity: 0.7,
                    }}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 12px",
                    borderRadius: 14,
                    background: "white",
                    color: "#666",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                    fontStyle: "italic",
                  }}
                >
                  BDMS Assistant is typing...
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

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
              disabled={!input.trim()}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "none",
                cursor: input.trim() ? "pointer" : "not-allowed",
                background: "#dc3545",
                color: "white",
                fontWeight: 700,
                opacity: input.trim() ? 1 : 0.6,
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