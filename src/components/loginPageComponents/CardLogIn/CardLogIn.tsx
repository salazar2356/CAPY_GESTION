import './CardLogIn.css';
import { useState, type FormEvent } from 'react';
import { authErrorMessage, doGoogleSignIn, doPasswordReset, doSignInWithEmailAndPassword } from '../../../services/Firebase/auth';
import { NavigationHook } from '../../../hooks/navigationHook';
import logoGoogle from '../../../assets/desktop/svg/logo/logoGoogle.svg';

function CardLogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const { handleNavigation } = NavigationHook();

  const login = async (google = false) => {
    if (busy) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (google) await doGoogleSignIn();
      else await doSignInWithEmailAndPassword(email.trim(), password);
      handleNavigation.navigateToDashboard();
    } catch (err) { setError(authErrorMessage(err)); }
    finally { setBusy(false); }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void login();
  };

  const resetPassword = async () => {
    if (!email.trim()) { setError('Ingresa tu correo para recuperar la contraseña.'); return; }
    setBusy(true);
    setError('');
    try {
      await doPasswordReset(email);
      setNotice('Si existe una cuenta con ese correo, recibirás un enlace para recuperar el acceso.');
    } catch (err) { setError(authErrorMessage(err)); }
    finally { setBusy(false); }
  };

  return <div className="LogIn" id="cardLogin">
    <h1>Sign In</h1>
    {error && <p role="alert" style={{ color: '#ff7676' }}>{error}</p>}
    {notice && <p role="status">{notice}</p>}
    <form onSubmit={handleSubmit}>
      <h3><label htmlFor="login-email">Email</label></h3>
      <input id="login-email" type="email" placeholder="Enter your email" value={email}
        onChange={event => setEmail(event.target.value)} className="inputLogInData" autoComplete="email" required />
      <h3><label htmlFor="login-password">Password</label></h3>
      <input id="login-password" type="password" placeholder="Enter your password" value={password}
        onChange={event => setPassword(event.target.value)} className="inputLogInData" autoComplete="current-password" required />
      <p id="forgotPasswordText"><button className="auth-text-button" type="button" disabled={busy} onClick={() => void resetPassword()}>Forgot your password?</button></p>
      <button id="ButtonLogin" type="submit" disabled={busy}>{busy ? 'Please wait…' : 'Log In'}</button>
    </form>
    <div id="signUpGoogleContainer">
      <p>Or</p>
      <button id="googleIconContainer" type="button" disabled={busy} onClick={() => void login(true)}>
        <img src={logoGoogle} alt="" /><span>Sign In with Google</span>
      </button>
    </div>
    <p id="Cuenta">Don't have an account?{' '}
      <button className="auth-text-button" type="button" onClick={handleNavigation.navigateToRegister}>Register now</button>
    </p>
  </div>;
}

export default CardLogIn;
