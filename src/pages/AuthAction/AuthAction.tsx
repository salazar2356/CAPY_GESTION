// HU06 (CA3): página propia para restablecer la contraseña desde el enlace del correo.
// Firebase abre esta página con ?mode=resetPassword&oobCode=... (ver "Customize action URL"
// en Firebase > Authentication > Templates). También atiende la confirmación de cambio de correo (HU12).
import '../LogIn/LogIn.css';
import '../../components/loginPageComponents/CardLogIn/CardLogIn.css';

import { useEffect, useState } from 'react';
import vectorLogIn from '../../assets/desktop/svg/vectorLogIn.svg';
import Logo from '../../assets/desktop/svg/Logo.svg';
import { NavigationHook } from '../../hooks/navigationHook';
import {
  doApplyActionCode,
  doConfirmPasswordReset,
  doVerifyResetCode,
  getAuthErrorMessage
} from '../../services/Firebase/auth';

type Status = 'checking' | 'form' | 'saving' | 'invalid' | 'emailChanged';

// Lee los parámetros tanto de ?mode=... como de #/auth-action?mode=...
const readParams = () => {
  const fromSearch = new URLSearchParams(window.location.search);
  const hashQuery = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
  const fromHash = new URLSearchParams(hashQuery);
  return {
    mode: fromSearch.get('mode') ?? fromHash.get('mode'),
    oobCode: fromSearch.get('oobCode') ?? fromHash.get('oobCode'),
  };
};

export const AuthAction = () => {
  const { handleNavigation } = NavigationHook();
  const [{ mode, oobCode }] = useState(readParams);

  const [status, setStatus] = useState<Status>('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!oobCode) {
      setStatus('invalid');
      setError('El enlace no es válido. Pide uno nuevo desde "Forgot your password?".');
      return;
    }

    if (mode === 'resetPassword') {
      doVerifyResetCode(oobCode)
        .then((accountEmail) => {
          setEmail(accountEmail);
          setStatus('form');
        })
        .catch((err) => {
          setStatus('invalid');
          setError(getAuthErrorMessage(err));
        });
    } else if (mode === 'verifyAndChangeEmail' || mode === 'verifyEmail' || mode === 'recoverEmail') {
      doApplyActionCode(oobCode)
        .then(() => setStatus('emailChanged'))
        .catch((err) => {
          setStatus('invalid');
          setError(getAuthErrorMessage(err));
        });
    } else {
      setStatus('invalid');
      setError('El enlace no es válido.');
    }
  }, [mode, oobCode]);

  const handleSave = async () => {
    setError('');
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setStatus('saving');
    try {
      await doConfirmPasswordReset(oobCode!, password);
      // CA3: se actualiza y se lleva al usuario al inicio de sesión con un aviso
      sessionStorage.setItem('passwordResetOk', '1');
      window.history.replaceState(null, '', window.location.pathname + '#/login');
      handleNavigation.navigateToLogin();
    } catch (err) {
      setStatus('form');
      setError(getAuthErrorMessage(err));
    }
  };

  const goToLogin = () => {
    window.history.replaceState(null, '', window.location.pathname + '#/login');
    handleNavigation.navigateToLogin();
  };

  return <>
    <div className='page' id='logInPageContainer'>
      <div id='logoAndImageContainer'>
        <div id='logoAndTextContainer'>
          <img id="LogoImage" src={Logo} alt="" />
          <p>Capy</p>
        </div>
        <img id="LogInImage" src={vectorLogIn} alt="" />
      </div>

      <div className='LogIn' id='cardLogin'>
        {status === 'checking' && <h1 style={{ fontSize: '32px' }}>Checking link...</h1>}

        {(status === 'form' || status === 'saving') && <>
          <h1 style={{ fontSize: '40px' }}>New password</h1>
          <p style={{ width: '100%' }}>Account: <strong>{email}</strong></p>

          {error && <p style={{ color: "#ff4d4d", fontWeight: 'bold' }}>{error}</p>}

          <h3>New password</h3>
          <input
            type='password'
            placeholder='At least 6 characters'
            autoComplete='new-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='inputLogInData'
          />

          <h3>Confirm new password</h3>
          <input
            type='password'
            placeholder='Repeat your new password'
            autoComplete='new-password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className='inputLogInData'
          />

          <button id='ButtonLogin' onClick={handleSave} disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving...' : 'Save password'}
          </button>
        </>}

        {status === 'emailChanged' && <>
          <h1 style={{ fontSize: '36px' }}>Email confirmed</h1>
          <p>Tu correo se actualizó. Inicia sesión con tu nuevo correo.</p>
          <button id='ButtonLogin' onClick={goToLogin}>Go to Log In</button>
        </>}

        {status === 'invalid' && <>
          <h1 style={{ fontSize: '36px' }}>Invalid link</h1>
          <p style={{ color: "#ff4d4d", fontWeight: 'bold' }}>{error}</p>
          <button id='ButtonLogin' onClick={goToLogin}>Go to Log In</button>
        </>}
      </div>

      <div id='backgroundLogIn' className='backgroundPage'></div>
    </div>
  </>
}
