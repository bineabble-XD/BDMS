import React, { createContext, useContext, useState } from "react";

const FloatingPanelContext = createContext(null);

export function FloatingPanelProvider({ children }) {
  const [openPanel, setOpenPanel] = useState(null); // "chatbot" | "widget" | null

  return (
    <FloatingPanelContext.Provider value={{ openPanel, setOpenPanel }}>
      {children}
    </FloatingPanelContext.Provider>
  );
}

export function useFloatingPanel() {
  const ctx = useContext(FloatingPanelContext);
  return ctx || { openPanel: null, setOpenPanel: () => {} };
}
