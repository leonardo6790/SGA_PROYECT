import React from "react";
import "./whatsapp.styles.css";

const WhatsappButton = () => {
  return (
    <a
      href="https://wa.me/573001234567" 
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
      />
    </a>
  );
};

export default WhatsappButton;
