import React, { memo } from 'react';
import './Register.css';
import vectorRegisterDesktop from "../../assets/desktop/svg/vectorRegister.svg";
import Logo from "../../assets/desktop/web/Logo.webp";
import CardRegister from "../../components/registerPageComponents/CardRegister/CardRegister";

export const Register: React.FC = memo(() => {
  return (
    <main className='page' id='registePageContainer'>
      <div id='logoAndImageContainer'>
        <div id='logoAndTextContainer'>
          <img id="LogoImage" src={Logo} alt="Logo de la aplicación" />
        </div>
        <img id="RegisterImage" src={vectorRegisterDesktop} alt="Imagen de registro" loading="lazy" />
      </div>

      <CardRegister />

      <div id='backgroundRegister' className='backgroundPage'></div>
    </main>
  );
});