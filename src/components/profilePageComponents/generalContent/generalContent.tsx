import React, { useState } from 'react';
import './generalContent.css';

interface GeneralContentProps {
  name: string;
  email: string;
  rank: string; 
}

export const GeneralContent: React.FC<GeneralContentProps> = ({ name, email, rank }) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = () => {
    setIsChecked((prev) => !prev);
    console.log(`Capy Assistant ${!isChecked ? 'Enabled' : 'Disabled'}`);
  };

  return (
    <div>
      <div className="nameInfo">
        <h2 className="name">{name}</h2>
        <p className='rango'>{rank}</p> 
      </div>
      <h3 className="email">{email}</h3>
      
      <div className='capyAssitant'>
      <h2 className="capyOption">Capy assistant</h2>
      <label className="switch">
        <input 
          type="checkbox" 
          checked={isChecked} 
          onChange={toggleSwitch} 
        />
        <span className="slider"></span>
      </label>
      </div>
     
    </div>
  );
};
