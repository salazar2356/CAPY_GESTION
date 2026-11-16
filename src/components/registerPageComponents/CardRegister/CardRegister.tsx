import { useState, type FormEvent } from 'react';
import './CardRegister.css';
import logoGoogle from '../../../assets/desktop/svg/logo/logoGoogle.svg';
import { NavigationHook } from '../../../hooks/navigationHook';
import { authErrorMessage, doGoogleSignIn, doRegister } from '../../../services/Firebase/auth';

function CardRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { handleNavigation } = NavigationHook();

  const register = async (google = false) => {
    if (busy) return;
    setError('');
    if (!acceptTerms) { setError('Debes aceptar los términos y condiciones.'); return; }
    if (!google && password !== confirmPassword) { setError('Las contraseñas no coinciden.'); return; }
    if (!google && !username.trim()) { setError('Ingresa tu nombre.'); return; }
    setBusy(true);
    try {
      if (google) await doGoogleSignIn();
      else await doRegister(username, email, password);
      handleNavigation.navigateToDashboard();
    } catch (err) { setError(authErrorMessage(err)); }
    finally { setBusy(false); }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void register();
  };

  return <div className="Register">
    <h1>Sign Up</h1>
    {error && <p role="alert" style={{ color: '#ff7676', fontWeight: 'bold', textAlign: 'center' }}>{error}</p>}
    <form onSubmit={handleSubmit}>
      <h3><label htmlFor="register-name">Name</label></h3>
      <input id="register-name" type="text" placeholder="Enter your name" value={username}
        onChange={event => setUsername(event.target.value)} autoComplete="name" required maxLength={100} />
      <h3><label htmlFor="register-email">Email</label></h3>
      <input id="register-email" type="email" placeholder="Enter your email" value={email}
        onChange={event => setEmail(event.target.value)} autoComplete="email" required />
      <h3><label htmlFor="register-password">Password</label></h3>
      <input id="register-password" type="password" placeholder="Create password" value={password}
        onChange={event => setPassword(event.target.value)} autoComplete="new-password" required minLength={6} />
      <h3><label htmlFor="register-confirm">Confirm password</label></h3>
      <input id="register-confirm" type="password" placeholder="Confirm your password" value={confirmPassword}
        onChange={event => setConfirmPassword(event.target.value)} autoComplete="new-password" required minLength={6} />
      <div id="terminos">
        <input id="box" type="checkbox" checked={acceptTerms} onChange={event => setAcceptTerms(event.target.checked)} required />
        <label htmlFor="box" id="CheckText">I accept the <span>terms</span> and <span>conditions</span></label>
      </div>
      <button type="submit" disabled={busy}>{busy ? 'Please wait…' : 'Sign Up'}</button>
    </form>
    <div id="signUpGoogleContainer"><p>Or</p>
      <button id="googleIconContainer" type="button" disabled={busy} onClick={() => void register(true)}>
        <img src={logoGoogle} alt="" /><span>Sign Up with Google</span>
      </button>
    </div>
    <h3 id="CrearCuenta">Already have an account?{' '}
      <button className="auth-text-button" type="button" onClick={handleNavigation.navigateToLogin}>Sign In</button>
    </h3>
  </div>;
}

export default CardRegister;
