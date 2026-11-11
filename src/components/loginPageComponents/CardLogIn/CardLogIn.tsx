import './CardLogIn.css';

import { useState } from "react";
import { useDispatch } from 'react-redux';

import {
  doGoogleSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  getAuthErrorMessage
} from "../../../services/Firebase/auth";
import { getRealUser, ensureUserDoc, type UserData } from "../../../services/Firebase/FirestoreUsers";
import { NavigationHook } from '../../../hooks/navigationHook';
import { changeUserEmail, changeUserName, changeUserUID } from '../../../store/userData/slice';

import logoGoogle from '../../../assets/desktop/svg/logo/logoGoogle.svg';

function CardLogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { handleNavigation } = NavigationHook();

  // Guarda los datos en Redux y sessionStorage y navega al dashboard
  const finishLogin = (userData: UserData) => {
    dispatch(changeUserName(userData.name));
    dispatch(changeUserEmail(userData.email));
    dispatch(changeUserUID(userData.userUID));
    sessionStorage.setItem('userUID', userData.userUID);
    handleNavigation.navigateToDashboard();
  };

  const handleLoginEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;
    setError("");
    setInfo("");

    if (!email.trim() || !password) {
      setError("Escribe tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await doSignInWithEmailAndPassword(email, password);
      const userData = await getRealUser(userCredential.user.uid);

      if (!userData) {
        setError("No se encontraron los datos del usuario.");
        return;
      }

      finishLogin(userData);
    } catch (err) {
      console.error(err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Inicio de sesión con Google (si es la primera vez, crea el documento en "realUsers")
  const handleGoogleLogin = async () => {
    if (loading) return;
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const result = await doGoogleSignIn();
      const userData = await ensureUserDoc(result.user);
      finishLogin(userData);
    } catch (err) {
      console.error(err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Recuperar contraseña (HU06): usa el correo escrito en el campo Email
  const handleForgotPassword = async () => {
    setError("");
    setInfo("");
    if (!email.trim()) {
      setError("Escribe tu correo arriba y vuelve a presionar 'Forgot your password?'.");
      return;
    }
    try {
      await doPasswordReset(email);
      setInfo("Si el correo está registrado, te llegará un enlace para restablecer tu contraseña en unos minutos. Revisa también la carpeta de spam.");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <>
      <div className='LogIn' id='cardLogin'>
        <h1>Sign In</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {info && <p style={{ color: "#A8F25D" }}>{info}</p>}

        <h3>Email</h3>
        <input
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='inputLogInData'
        />

        <h3>Password</h3>
        <input
          type='password'
          placeholder='Enter your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='inputLogInData'
        />

        <p id='forgotPasswordText' onClick={handleForgotPassword}>Forgot your password?</p>
        <button id='ButtonLogin' onClick={handleLoginEmail} disabled={loading}>
          {loading ? 'Loading...' : 'Log In'}
        </button>
        <div id="signUpGoogleContainer">
          <p>Or</p>
          <div id="googleIconContainer" onClick={handleGoogleLogin}>
            <img src={logoGoogle} alt="Google logo" />
            <p>Sign In with Google</p>
          </div>
        </div>

        <p id="Cuenta">
          Don't have an account?{" "}
          <span onClick={handleNavigation.navigateToRegister}>
            Register now
          </span>
        </p>
      </div>
    </>
  );
}

export default CardLogIn;