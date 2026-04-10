/**
 * Chatbot copy — keyed by LanguageContext language code (EN | AR)
 */
export const chatbotStrings = {
  EN: {
    userGreeting: "there",
    welcomeDonor: (name) =>
      `Hi ${name} 👋 I’m BDMS Assistant. How can I help you today?\n\nYou can ask:\n- How to donate blood?\n- Where to register?\n- Urgent requests?\n- Login help?\n- Contact info?\n- My appointments?\n- Eligibility?`,
    welcomeHospital: (name) =>
      `Hi ${name} 👋 I’m BDMS Assistant. How can I help you today?\n\nYou can ask:\n- Hospital dashboard help?\n- Appointments?\n- Inventory?\n- Blood bank?\n- Urgent requests?\n- Reports?\n- Contact info?`,
    welcomeAdmin: (name) =>
      `Hi ${name} 👋 I’m BDMS Assistant. How can I help you today?\n\nYou can ask:\n- Dashboard?\n- Reports?\n- Hospital requests?\n- Contact info?`,
    welcomeGuest: `Hi 👋 I’m BDMS Assistant. How can I help you today?\n\nYou can ask:\n- How to donate blood?\n- Where to register?\n- Urgent requests?\n- Login help?\n- Contact info?\n- Hospital help?`,

    qaDonate: `To donate blood:\n1) Register/Login\n2) Complete your profile\n3) Check eligibility\n4) Find nearby hospitals / requests\n5) Confirm appointment (if available)\n\nIf you want, tell me your blood type and city.`,
    qaRegister: `To register:\n- Click Register from the top menu\n- Fill your details\n- Verify your email (if enabled)\n- Login and complete your profile.`,
    qaUrgentNone: `For urgent requests:\n- Go to “Urgent Requests” in the menu\n- You can view current requests\n- If you are a donor, you can respond to help\n\nDo you want donors-only or hospital-side help?`,
    qaUrgentMatches: (count, hospitalName) =>
      `For urgent requests:\n- Go to “Urgent Requests” in the menu\n- You can view current requests\n- If you are a donor, you can respond to help\n\nRight now, there are ${count} urgent request(s) matching your type. The latest is from ${hospitalName}.`,
    qaLogin: `To login:\n- Click Log In from the menu\n- Enter your email and password\n- If you forgot password, use “Forgot Password”.`,
    qaContact: `For support:\n- Use the Feedback page in the menu\n- Or tell me your issue here and I’ll guide you step-by-step.`,
    qaHospital: `If you are a hospital user:\n- Register as Hospital\n- Manage requests in Hospital Dashboard\n- Track inventory and urgent requests\n\nDo you want to add a new urgent request or manage inventory?`,
    qaEligibility: `Basic donation eligibility usually depends on:\n- age\n- general health\n- time since last donation\n- medical condition\n- medication use\n\nA strong next step for your project is to make this a mini eligibility checker.`,
    qaApptDonor: "You can manage and review your bookings from the My Appointments page.",
    qaApptHospital:
      "You can review approved donations and completed donations from the hospital appointments page.",
    qaInventory:
      "You can manage blood stock, donation records, and expiry dates from the Blood Bank and Inventory pages.",
    qaReports:
      "You can use the Reports page to view stock summaries and export data as PDF or Excel.",
    qaFallback: `Thanks! I can help with:\n- Donation steps\n- Register/Login\n- Urgent requests\n- Hospital dashboard\n- Inventory and reports\n- Contact/support\n\nType what you need, and I’ll guide you.`,

    actionHowToDonate: `To donate blood:\n1) Register/Login\n2) Complete your profile\n3) Check eligibility\n4) Find nearby hospitals / requests\n5) Confirm appointment (if available)\n\nIf you want, tell me your blood type and city.`,
    actionLoginHelp: `To login:\n- Click Log In from the menu\n- Enter your email and password\n- If you forgot password, use “Forgot Password”.`,
    actionEligibility: `Basic donation eligibility usually depends on:\n- age\n- general health\n- time since last donation\n- medical condition\n- medication use\n\nYou can also turn this into a full eligibility checker in your project.`,
    actionContact: `For support:\n- Use the Feedback / Instagram page in the menu\n- Or tell me your issue here and I’ll guide you step-by-step.`,
    actionHospitalHelp: `If you are a hospital user:\n- Register as Hospital\n- Manage requests in Hospital Dashboard\n- Track inventory and urgent requests\n\nDo you want help with appointments, inventory, or reports?`,

    opening: (label) => `Opening ${label} for you.`,
    hospitalFallback: "a hospital",

    labels: {
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
    },

    uiChatbotTitle: "BDMS Chatbot",
    uiTyping: "BDMS Assistant is typing...",
    uiPlaceholder: "Type a message...",
    uiSend: "Send",
    uiAriaOpen: "Open chat",
    uiFabTitle: "Chat with BDMS",
    uiAriaClose: "Close chat",
    uiCloseTitle: "Close",
  },

  AR: {
    userGreeting: "هناك",
    welcomeDonor: (name) =>
      `مرحباً ${name} 👋 أنا مساعد BDMS. كيف يمكنني مساعدتك اليوم؟\n\nيمكنك السؤال عن:\n- كيفية التبرع بالدم؟\n- أين أتسجّل؟\n- الطلبات العاجلة؟\n- مساعدة تسجيل الدخول؟\n- معلومات الاتصال؟\n- مواعيدي؟\n- الأهلية؟`,
    welcomeHospital: (name) =>
      `مرحباً ${name} 👋 أنا مساعد BDMS. كيف يمكنني مساعدتك اليوم؟\n\nيمكنك السؤال عن:\n- لوحة المستشفى؟\n- المواعيد؟\n- المخزون؟\n- بنك الدم؟\n- الطلبات العاجلة؟\n- التقارير؟\n- الاتصال؟`,
    welcomeAdmin: (name) =>
      `مرحباً ${name} 👋 أنا مساعد BDMS. كيف يمكنني مساعدتك اليوم؟\n\nيمكنك السؤال عن:\n- لوحة التحكم؟\n- التقارير؟\n- طلبات المستشفيات؟\n- الاتصال؟`,
    welcomeGuest: `مرحباً 👋 أنا مساعد BDMS. كيف يمكنني مساعدتك اليوم؟\n\nيمكنك السؤال عن:\n- كيفية التبرع بالدم؟\n- أين أتسجّل؟\n- الطلبات العاجلة؟\n- تسجيل الدخول؟\n- الاتصال؟\n- مساعدة المستشفى؟`,

    qaDonate: `للتبرع بالدم:\n1) سجّل / ادخل إلى حسابك\n2) أكمل ملفك\n3) تحقّق من الأهلية\n4) ابحث عن مستشفيات أو طلبات قريبة\n5) أكّد الموعد (إن وُجد)\n\nإن أردت، أخبرني بفصيلة دمك ومدينتك.`,
    qaRegister: `للتسجيل:\n- اختر «التسجيل» من القائمة\n- املأ بياناتك\n- فعّل بريدك (إن طُلب)\n- سجّل الدخول وأكمل ملفك.`,
    qaUrgentNone: `للطلبات العاجلة:\n- افتح «الطلبات العاجلة» من القائمة\n- يمكنك عرض الطلبات الحالية\n- إن كنت متبرعاً يمكنك المساعدة\n\nهل تريد مساعدة للمتبرعين أم للمستشفى؟`,
    qaUrgentMatches: (count, hospitalName) =>
      `للطلبات العاجلة:\n- افتح «الطلبات العاجلة» من القائمة\n- يمكنك عرض الطلبات الحالية\n- إن كنت متبرعاً يمكنك المساعدة\n\nيوجد الآن ${count} طلب(ات) تطابق فصيلتك. آخرها من ${hospitalName}.`,
    qaLogin: `لتسجيل الدخول:\n- اختر «تسجيل الدخول» من القائمة\n- أدخل البريد وكلمة المرور\n- إن نسيت كلمة المرور استخدم «نسيت كلمة المرور».`,
    qaContact: `للدعم:\n- استخدم صفحة «الملاحظات» في القائمة\n- أو اشرح مشكلتك هنا وسأرشدك خطوة بخطوة.`,
    qaHospital: `إن كنت مستخدماً لمستشفى:\n- سجّل كمستشفى\n- أدر الطلبات من لوحة المستشفى\n- تابع المخزون والطلبات العاجلة\n\nهل تريد إضافة طلب عاجل أو إدارة المخزون؟`,
    qaEligibility: `تعتمد أهلية التبرع عادة على:\n- العمر\n- الصحة العامة\n- الوقت منذ آخر تبرع\n- الحالة الطبية\n- الأدوية\n\nيمكن لاحقاً إضافة فاحص أهلية تفاعلي.`,
    qaApptDonor: "يمكنك إدارة حجوزاتك من صفحة «مواعيدي».",
    qaApptHospital: "يمكنك مراجعة الموافقات والتبرعات المكتملة من صفحة مواعيد المستشفى.",
    qaInventory: "يمكنك إدارة مخزون الدم وسجلات التبرع وتواريخ الانتهاء من «بنك الدم» و«المخزون».",
    qaReports: "يمكنك استخدام «التقارير» لعرض ملخص المخزون وتصدير PDF أو Excel.",
    qaFallback: `يمكنني المساعدة في:\n- خطوات التبرع\n- التسجيل / الدخول\n- الطلبات العاجلة\n- لوحة المستشفى\n- المخزون والتقارير\n- الدعم\n\nاكتب ما تحتاجه وسأرشدك.`,

    actionHowToDonate: `للتبرع بالدم:\n1) سجّل / ادخل\n2) أكمل ملفك\n3) تحقّق من الأهلية\n4) ابحث عن مستشفيات أو طلبات\n5) أكّد الموعد\n\nإن أردت، أخبرني بفصيلة دمك ومدينتك.`,
    actionLoginHelp: `لتسجيل الدخول:\n- اختر «تسجيل الدخول» من القائمة\n- أدخل البريد وكلمة المرور\n- إن نسيت كلمة المرور استخدم «نسيت كلمة المرور».`,
    actionEligibility: `تعتمد الأهلية على العمر والصحة وآخر تبرع والحالة الطبية والأدوية.\n\nيمكن تطوير فاحص أهلية كامل لاحقاً.`,
    actionContact: `للدعم:\n- استخدم صفحة «الملاحظات» أو وسائل التواصل من القائمة\n- أو اشرح مشكلتك هنا.`,
    actionHospitalHelp: `لمستخدمي المستشفى:\n- سجّل كمستشفى\n- أدر الطلبات من اللوحة\n- تابع المخزون والطلبات العاجلة\n\nهل تحتاج مساعدة في المواعيد أو المخزون أو التقارير؟`,

    opening: (label) => `جارٍ فتح «${label}» لك.`,
    hospitalFallback: "مستشفى",

    labels: {
      how_to_donate: "كيفية التبرع",
      register: "التسجيل",
      login_help: "مساعدة الدخول",
      urgent_requests: "الطلبات العاجلة",
      my_appointments: "مواعيدي",
      check_eligibility: "الأهلية",
      contact_info: "الاتصال",
      hospital_help: "مساعدة المستشفى",
      hospital_appointments: "المواعيد",
      hospital_blood_bank: "بنك الدم",
      hospital_inventory: "المخزون",
      hospital_urgent_requests: "الطلبات العاجلة",
      hospital_reports: "التقارير",
      admin_dashboard: "لوحة التحكم",
      admin_reports: "التقارير",
      admin_hospitals: "طلبات المستشفيات",
    },

    uiChatbotTitle: "محادثة BDMS",
    uiTyping: "المساعد يكتب...",
    uiPlaceholder: "اكتب رسالة...",
    uiSend: "إرسال",
    uiAriaOpen: "فتح المحادثة",
    uiFabTitle: "محادثة مع BDMS",
    uiAriaClose: "إغلاق المحادثة",
    uiCloseTitle: "إغلاق",
  },
};

export function getChatbotStrings(lang) {
  return chatbotStrings[lang] || chatbotStrings.EN;
}
