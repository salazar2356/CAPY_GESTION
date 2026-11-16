import React from "react";
import "./SummaryCard.css";

interface ResumenCardProps {
  icon: string;
  title: string;
  content: string | number;
  backgroundColor: string;
  textDark: boolean
}

const SummaryCard: React.FC<ResumenCardProps> = ({ icon, title, content, backgroundColor, textDark }) => {

  if (!textDark) {
    return <>
      <div className="resumen-card" style={{ backgroundColor }}>
        <div className="icono">
          <img src={icon} alt={title} className="icono-imagen" />
        </div>
        <div>
          <p className="titulo">{title}</p>
          <p className="contenido">{content}</p>
        </div>
      </div>
    </>
  } else {
    return <>
      <div className="resumen-card" style={{ backgroundColor }}>
        <div className="icono">
          <img src={icon} alt={title} className="icono-imagen" />
        </div>
        <div>
          <p className="titulo darkText">{title}</p>
          <p className="contenido darkText">{content}</p>
        </div>
      </div>
    </>
  }
};

export default SummaryCard;
