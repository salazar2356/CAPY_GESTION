import React, { useEffect, memo, useState, useCallback } from 'react';
import './Register.css'
import vectorRegisterDesktop from "../../assets/desktop/svg/vectorRegister.svg";
import vectorRegisterMobile from "../../assets/mobile/svg/vectorRegisterMob.svg";
import Logo from "../../assets/desktop/web/Logo.webp";
import CardRegister from "../../components/registerPageComponents/CardRegister/CardRegister";

export const Register: React.FC = memo(() => {
  const [vectorSrc, setVectorSrc] = useState<string>(
    window.innerWidth < 500 ? vectorRegisterMobile : vectorRegisterDesktop
  );

  const handleResize = useCallback(() => {
    setVectorSrc(window.innerWidth < 500 ? vectorRegisterMobile : vectorRegisterDesktop);
  }, []);

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <main className='page' id='registePageContainer'>
      <div id='logoAndImageContainer'>
        <div id='logoAndTextContainer'>
          <img id="LogoImage" src={Logo} alt="Logo de la aplicación" />
        </div>
        <img id="RegisterImage" src={vectorSrc} alt="Imagen de registro" loading="lazy" />
      </div>

      <CardRegister />

      <div id='backgroundRegister' className='backgroundPage'></div>
    </main>
  );
});
