import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        background: "linear-gradient(90deg, #FA4848 0%, #820000 100%)",
        padding: "20px 0",
        color: "white",
        textAlign: "center",
      }}
    >
      <p style={{ margin: 0, fontSize: "14px" }}>
        © {new Date().getFullYear()} Blood Donation Management System. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
