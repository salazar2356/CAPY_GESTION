import { useState } from "react";
import { useDispatch } from "react-redux";
import './CardRegister.css';
import logoGoogle from '../../../assets/desktop/svg/logo/logoGoogle.svg';
import { NavigationHook } from "../../../hooks/navigationHook";

import {
  doCreateUserWithEmailAndPassword,
  doGoogleSignIn,
  getAuthErrorMessage
} from "../../../services/Firebase/auth";
import { createFinalUser, ensureUserDoc, type UserData } from "../../../services/Firebase/FirestoreUsers";
import { changeUserEmail, changeUserName, changeUserUID } from "../../../store/userData/slice";

function CardRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { handleNavigation } = NavigationHook();

  // Guarda los datos en Redux y sessionStorage y navega al dashboard
  const finishRegister = (userData: UserData) => {
    dispatch(changeUserName(userData.name));
    dispatch(changeUserEmail(userData.email));
    dispatch(changeUserUID(userData.userUID));
    sessionStorage.setItem('userUID', userData.userUID);
    handleNavigation.navigateToDashboard();
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    if (!username.trim() || !email.trim() || !password) {
      setError("Completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1. Crear el usuario en Firebase Auth
      const credential = await doCreateUserWithEmailAndPassword(email, password, username.trim());

      // 2. Crear su documento en Firestore (colección "realUsers")
      const userData = await createFinalUser(credential.user.uid, username.trim(), email.trim());

      if (!userData) {
        setError("No se pudieron guardar los datos del usuario.");
        return;
      }

      finishRegister(userData);
    } catch (err) {
      console.error(err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Registro con Google: si es la primera vez, crea el documento en "realUsers"
  const handleGoogleRegister = async () => {
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const result = await doGoogleSignIn();
      const userData = await ensureUserDoc(result.user);
      finishRegister(userData);
    } catch (err) {
      console.error(err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Register">
      <h1>Sign Up</h1>

      {error && <p style={{ color: "#ff4d4d", fontWeight: "bold", textAlign: "center" }}>{error}</p>}

      <h3>Name</h3>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <h3>Email</h3>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <h3>Password</h3>
      <input
        type="password"
        placeholder="Create password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <h3>Confirm password</h3>
      <input
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <div id="terminos">
        <input
          id="box"
          type="checkbox"
          checked={acceptTerms}
          onChange={() => setAcceptTerms(!acceptTerms)}
        />
        <p id="CheckText">I accept the <span>terms</span> and <span>conditions</span></p>
      </div>

      <button onClick={handleRegister} disabled={loading}>
        {loading ? "Loading..." : "Sign Up"}
      </button>

      <div id="signUpGoogleContainer">
        <p>Or</p>
        <div id="googleIconContainer" onClick={handleGoogleRegister}>
          <img src={logoGoogle} alt="Google logo" />
          <p>Sign Up with Google</p>
        </div>
      </div>

      <h3 id="CrearCuenta">
        Already have an account?{" "}
        <span onClick={handleNavigation.navigateToLogin}>
          Sign In
        </span>
      </h3>
    </div>
  );
}

export default CardRegister;


