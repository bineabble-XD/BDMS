import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFloatingPanel } from "../context/FloatingPanelContext";
import { useLanguage } from "../context/LanguageContext";
import { getChatbotStrings } from "../locales/chatbotStrings";
import { SETTINGS_KEYS } from "../utils/settingsUtils";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const formatTime = (lang, date = new Date()) =>
  new Date(date).toLocaleTimeString(lang === "AR" ? "ar-OM" : "en-GB", {
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

/** Match user intent in English or Arabic */
function matchTopic(t, ar) {
  return {
    donate:
      t.includes("donate") ||
      t.includes("donation") ||
      t.includes("how to donate") ||
      ar.includes("تبرع") ||
      ar.includes("التبرع") ||
      ar.includes("بالدم"),
    register:
      t.includes("register") ||
      t.includes("sign up") ||
      t.includes("signup") ||
      ar.includes("تسجيل") ||
      ar.includes("سجل") ||
      ar.includes("حساب"),
    urgent:
      t.includes("urgent") ||
      t.includes("request") ||
      ar.includes("عاجل") ||
      ar.includes("طلب") ||
      ar.includes("طوارئ"),
    login:
      t.includes("login") ||
      t.includes("log in") ||
      ar.includes("دخول") ||
      ar.includes("تسجيل الدخول") ||
      ar.includes("كلمة المرور"),
    hospital:
      t.includes("hospital") ||
      ar.includes("مستشفى") ||
      ar.includes("مستشفيات"),
    contact:
      t.includes("contact") ||
      (t.includes("help") && !t.includes("hospital")) ||
      t.includes("support") ||
      ar.includes("دعم") ||
      ar.includes("مساعدة") ||
      ar.includes("اتصال"),
    eligibility:
      t.includes("eligible") ||
      t.includes("eligibility") ||
      t.includes("can i donate") ||
      ar.includes("أهلية") ||
      ar.includes("أتبرع") ||
      ar.includes("هل يمكن"),
    appointment:
      t.includes("appointment") ||
      ar.includes("موعد") ||
      ar.includes("مواعيد") ||
      ar.includes("حجز"),
    inventory:
      t.includes("inventory") ||
      t.includes("stock") ||
      t.includes("blood bank") ||
      ar.includes("مخزون") ||
      ar.includes("بنك الدم") ||
      ar.includes("الدم"),
    report:
      t.includes("report") ||
      t.includes("pdf") ||
      t.includes("excel") ||
      ar.includes("تقرير") ||
      ar.includes("تقارير") ||
      ar.includes("إكسل"),
  };
}

function quickActionsForRole(role, S) {
  const L = S.labels;
  const donor = [
    { label: L.how_to_donate, action: "how_to_donate" },
    { label: L.register, action: "register" },
    { label: L.login_help, action: "login_help" },
    { label: L.urgent_requests, action: "urgent_requests" },
    { label: L.my_appointments, action: "my_appointments" },
    { label: L.check_eligibility, action: "check_eligibility" },
    { label: L.contact_info, action: "contact_info" },
  ];
  const hospital = [
    { label: L.hospital_help, action: "hospital_help" },
    { label: L.hospital_appointments, action: "hospital_appointments" },
    { label: L.hospital_blood_bank, action: "hospital_blood_bank" },
    { label: L.hospital_inventory, action: "hospital_inventory" },
    { label: L.hospital_urgent_requests, action: "hospital_urgent_requests" },
    { label: L.hospital_reports, action: "hospital_reports" },
    { label: L.contact_info, action: "contact_info" },
  ];
  const admin = [
    { label: L.admin_dashboard, action: "admin_dashboard" },
    { label: L.admin_reports, action: "admin_reports" },
    { label: L.admin_hospitals, action: "admin_hospitals" },
    { label: L.contact_info, action: "contact_info" },
  ];
  const guest = [
    { label: L.how_to_donate, action: "how_to_donate" },
    { label: L.register, action: "register" },
    { label: L.login_help, action: "login_help" },
    { label: L.urgent_requests, action: "urgent_requests" },
    { label: L.hospital_help, action: "hospital_help" },
    { label: L.contact_info, action: "contact_info" },
  ];
  if (role === "donor") return donor;
  if (role === "hospital") return hospital;
  if (role === "admin") return admin;
  return guest;
}

function buildWelcome(role, displayName, S) {
  if (role === "donor") return S.welcomeDonor(displayName);
  if (role === "hospital") return S.welcomeHospital(displayName);
  if (role === "admin") return S.welcomeAdmin(displayName);
  return S.welcomeGuest;
}

export default function ChatbotWidget() {
  const navigate = useNavigate();
  const endRef = useRef(null);
  const { language } = useLanguage();
  const S = useMemo(() => getChatbotStrings(language), [language]);
  const isRtl = language === "AR";

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("bdmsUser") || "null");
    } catch {
      return null;
    }
  }, []);

  const role = getUserRole(user);
  const displayName = user?.fName || S.userGreeting;

  const { openPanel, setOpenPanel } = useFloatingPanel();
  const open = openPanel === "chatbot";
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => {
    let u = null;
    try {
      u = JSON.parse(localStorage.getItem("bdmsUser") || "null");
    } catch {
      u = null;
    }
    const lang = localStorage.getItem(SETTINGS_KEYS.LANGUAGE) || "EN";
    const S0 = getChatbotStrings(lang);
    const r0 = getUserRole(u);
    const dn = u?.fName || S0.userGreeting;
    return [
      {
        id: 1,
        from: "bot",
        text: buildWelcome(r0, dn, S0),
        time: formatTime(lang),
        quickActions: quickActionsForRole(r0, S0),
      },
    ];
  });

  useEffect(() => {
    const dn = user?.fName || S.userGreeting;
    setMessages([
      {
        id: Date.now(),
        from: "bot",
        text: buildWelcome(role, dn, S),
        time: formatTime(language),
        quickActions: quickActionsForRole(role, S),
      },
    ]);
  }, [language]);

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
        time: formatTime(language),
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
      urgent_requests: "/urgent",
      hospital_appointments: "/hospital-appointments",
      hospital_blood_bank: `/blood-bank/${user?._id || user?.id || ""}`,
      hospital_inventory: "/inventory",
      hospital_urgent_requests: "/urgent",
      hospital_reports: "/hospital-reports",
      admin_dashboard: "/dashboard",
      admin_reports: "/reports",
      admin_hospitals: "/AdminManRequest",
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
    const ar = (text || "").trim();
    const m = matchTopic(t, ar);

    if (m.donate) {
      return {
        text: S.qaDonate,
        quickActions: [
          { label: S.labels.register, action: "register" },
          { label: S.labels.urgent_requests, action: "urgent_requests" },
          { label: S.labels.check_eligibility, action: "check_eligibility" },
        ],
      };
    }

    if (m.register) {
      return {
        text: S.qaRegister,
        quickActions: [{ label: S.labels.register, action: "register" }],
      };
    }

    if (m.urgent) {
      const requests = await fetchMatchingUrgentRequests();

      if (requests && requests.length > 0) {
        const first = requests[0];
        const hospitalName = first?.hospital?.hospitalName || S.hospitalFallback;
        return {
          text: S.qaUrgentMatches(requests.length, hospitalName),
          quickActions: [{ label: S.labels.urgent_requests, action: "urgent_requests" }],
        };
      }

      return {
        text: S.qaUrgentNone,
        quickActions: [{ label: S.labels.urgent_requests, action: "urgent_requests" }],
      };
    }

    if (m.login) {
      return { text: S.qaLogin };
    }

    if (m.hospital) {
      return {
        text: S.qaHospital,
        quickActions: [
          { label: S.labels.hospital_appointments, action: "hospital_appointments" },
          { label: S.labels.hospital_blood_bank, action: "hospital_blood_bank" },
          { label: S.labels.hospital_inventory, action: "hospital_inventory" },
          { label: S.labels.hospital_reports, action: "hospital_reports" },
        ],
      };
    }

    if (m.contact) {
      return { text: S.qaContact };
    }

    if (m.eligibility) {
      return {
        text: S.qaEligibility,
        quickActions: [{ label: S.labels.check_eligibility, action: "check_eligibility" }],
      };
    }

    if (m.appointment && role === "donor") {
      return {
        text: S.qaApptDonor,
        quickActions: [{ label: S.labels.my_appointments, action: "my_appointments" }],
      };
    }

    if (m.appointment && role === "hospital") {
      return {
        text: S.qaApptHospital,
        quickActions: [{ label: S.labels.hospital_appointments, action: "hospital_appointments" }],
      };
    }

    if (m.inventory) {
      return {
        text: S.qaInventory,
        quickActions: [
          { label: S.labels.hospital_blood_bank, action: "hospital_blood_bank" },
          { label: S.labels.hospital_inventory, action: "hospital_inventory" },
        ],
      };
    }

    if (m.report) {
      return {
        text: S.qaReports,
        quickActions:
          role === "hospital"
            ? [{ label: S.labels.hospital_reports, action: "hospital_reports" }]
            : role === "admin"
              ? [{ label: S.labels.admin_reports, action: "admin_reports" }]
              : [],
      };
    }

    return {
      text: S.qaFallback,
      quickActions: quickActionsForRole(role, S),
    };
  };

  const handleAction = async (action) => {
    const label = S.labels[action] || action;
    addMessage("user", label);

    if (action === "how_to_donate") {
      replyWithTyping(S.actionHowToDonate);
      return;
    }

    if (action === "login_help") {
      replyWithTyping(S.actionLoginHelp);
      return;
    }

    if (action === "check_eligibility") {
      replyWithTyping(S.actionEligibility);
      return;
    }

    if (action === "contact_info") {
      replyWithTyping(S.actionContact);
      return;
    }

    if (action === "hospital_help") {
      replyWithTyping(S.actionHospitalHelp, {
        quickActions: [
          { label: S.labels.hospital_appointments, action: "hospital_appointments" },
          { label: S.labels.hospital_blood_bank, action: "hospital_blood_bank" },
          { label: S.labels.hospital_inventory, action: "hospital_inventory" },
          { label: S.labels.hospital_reports, action: "hospital_reports" },
        ],
      });
      return;
    }

    navigateByAction(action);
    replyWithTyping(S.opening(label));
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
        type="button"
        onClick={() => setOpenPanel(open ? null : "chatbot")}
        className="chatbot-fab"
        style={{
          position: "fixed",
          right: 98,
          left: "auto",
          bottom: 12,
          zIndex: 9999,
        }}
        aria-label={S.uiAriaOpen}
        title={S.uiFabTitle}
      >
        {open ? "✕" : <FaRobot size={18} />}
      </button>

      {open && (
        <div
          dir={isRtl ? "rtl" : "ltr"}
          lang={isRtl ? "ar" : "en"}
          style={{
            position: "fixed",
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
            right: 98,
            left: "auto",
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
            <span>{S.uiChatbotTitle}</span>
            <button
              type="button"
              onClick={() => setOpenPanel(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: 18,
                cursor: "pointer",
              }}
              aria-label={S.uiAriaClose}
              title={S.uiCloseTitle}
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
                    textAlign: isRtl ? "right" : "left",
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
                        justifyContent: isRtl ? "flex-end" : "flex-start",
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
                    textAlign: isRtl ? "right" : "left",
                  }}
                >
                  {S.uiTyping}
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
              flexDirection: isRtl ? "row-reverse" : "row",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={S.uiPlaceholder}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #ddd",
                outline: "none",
                textAlign: isRtl ? "right" : "left",
              }}
            />
            <button
              type="button"
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
              {S.uiSend}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
