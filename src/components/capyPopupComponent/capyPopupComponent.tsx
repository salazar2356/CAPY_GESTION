import { useState } from "react";
import "./capyPopupComponent.css";

import fondoAddSavingsModal from '../../assets/desktop/jpg/fondoAddSavingsModal.jpg'

export const CapyPopup = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [showOkButton, setShowOkButton] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  console.log(showOkButton);


  const randomMessages = [
    "Track your expenses to avoid unnecessary debt.",
    "Metrics are key to making better financial decisions.",
    "A good financial plan is the foundation of success.",
    "Keep an eye on your savings goals regularly.",
    "Investing wisely today can lead to wealth tomorrow.",
    "Monitoring your spending habits is crucial for financial health.",
  ];

  const handleButtonClick = (message: string) => {
    setMessage(message);
    setShowOkButton(true);
    setShowButtons(false);
  };

  const handleBackClick = () => {
    setMessage(null);
    setShowOkButton(false);
    setShowButtons(true);
  };

  return (
    <div className="capy-popup" style={{ backgroundImage: fondoAddSavingsModal }}>
      {/* Mostrar los botones originales solo si showButtons es true */}
      {showButtons && (
        <>
          <button className="popup-btn" onClick={() => handleButtonClick(randomMessages[0])}>
            Give me a suggestion
          </button>
          <button className="popup-btn" onClick={() => handleButtonClick(randomMessages[1])}>
            Explain the metrics to me
          </button>
          <button className="popup-btn" onClick={() => handleButtonClick(randomMessages[2])}>
            Give me an idea
          </button>
          <button className="popup-btn" onClick={() => handleButtonClick(randomMessages[3])}>
            Customize Capy!
          </button>
        </>
      )}

      {/* Mostrar el mensaje y el botón "Back" */}
      {message && (
        <div className="message-container">
          <p>{message}</p>
          <button className="popup-btn" onClick={handleBackClick}>
            Back
          </button>
        </div>
      )}
    </div>
  );
};
