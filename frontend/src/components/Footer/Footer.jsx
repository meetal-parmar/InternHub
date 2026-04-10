import React from 'react';
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <p>
        Toshal Management System ©{currentYear} Created By <strong>Toshal Infotech</strong>
      </p>
    </footer>
  );
};

export default Footer;