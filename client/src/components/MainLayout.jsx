import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div className="app-shell">
      <Navbar />

      <div className="page-content">
        <Outlet />
      </div>

    </div>
  );
};

export default MainLayout;
