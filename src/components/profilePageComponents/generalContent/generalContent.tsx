import React from 'react';
import './generalContent.css';

interface GeneralContentProps {
  name: string;
  email: string;
  rank: string;
  assistantEnabled: boolean;                 // HU52
  onToggleAssistant: (enabled: boolean) => void;
}

export const GeneralContent: React.FC<GeneralContentProps> = ({ name, email, rank, assistantEnabled, onToggleAssistant }) => {
  return (
    <div>
      <div className="nameInfo">
        <h2 className="name">{name}</h2>
        <p className='rango'>{rank}</p>
      </div>
      <h3 className="email">{email}</h3>

      {/* HU52: activar o desactivar el asistente Capy */}
      <div className='capyAssitant'>
        <h2 className="capyOption">Capy assistant</h2>
        <label className="switch">
          <input
            type="checkbox"
            aria-label="Capy assistant"
            checked={assistantEnabled}
            onChange={(e) => onToggleAssistant(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>

    </div>
  );
};
