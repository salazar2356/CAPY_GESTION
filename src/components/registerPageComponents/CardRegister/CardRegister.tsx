import { useState } from "react";
import './CardRegister.css';
import logoGoogle from '../../../assets/desktop/svg/logo/logoGoogle.svg';
import { NavigationHook } from "../../../hooks/navigationHook";

function CardRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");

  const { handleNavigation } = NavigationHook();

  const handleRegister = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");

    // Redirección directa al Dashboard para la prueba/presentación
    try {
      sessionStorage.setItem('userUID', 'demo-user-123');
      if (handleNavigation && handleNavigation.navigateToDashboard) {
        handleNavigation.navigateToDashboard();
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.log(err);
      window.location.href = "/dashboard";
    }
  };

  // Registro con Google (simulado para demo)
  const handleGoogleRegister = () => {
    try {
      sessionStorage.setItem('userData', JSON.stringify({ auth: { uid: 'google-demo' }, data: { username: 'Usuario Google' } }));
      if (handleNavigation && handleNavigation.navigateToDashboard) {
        handleNavigation.navigateToDashboard();
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.log(err);
      window.location.href = "/dashboard";
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

      <button onClick={handleRegister}>Sign Up</button>

      <div id="signUpGoogleContainer">
        <p>Or</p>
        <div id="googleIconContainer" onClick={handleGoogleRegister}>
          <img src={logoGoogle} alt="Google logo" />
          <p>Sign Up with Google</p>
        </div>
      </div>

      <h3 id="CrearCuenta">
        Already have an account?{" "}
        <span onClick={() => { 
          if (handleNavigation && handleNavigation.navigateToLogin) {
            handleNavigation.navigateToLogin();
          } else {
            window.location.href = "/login";
          }
        }}>
          Sign In
        </span>
      </h3>
    </div>
  );
}

export default CardRegister;