import React from 'react';
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <p>
        Intern Managemen System ©{currentYear} Created for <strong>Managing Interns</strong>
      </p>
    </footer>
  );
};

export default Footer;