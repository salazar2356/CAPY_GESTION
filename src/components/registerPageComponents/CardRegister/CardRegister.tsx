import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../services/Firebase/Firebase";

import './CardRegister.css';

import logoGoogle from '../../../assets/desktop/svg/logo/logoGoogle.svg'


import { createFinalUser, createUser } from "../../../services/Firebase/FirestoreUsers";
import { doGoogleSignIn } from "../../../services/Firebase/auth";

import { NavigationHook } from "../../../hooks/navigationHook";

function CardRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");

  const { handleNavigation } = NavigationHook()

  const handleRegister = async () => {

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      createFinalUser(userCredential.user.uid, username, email)

      sessionStorage.setItem('userUID', userCredential.user.uid)
      handleNavigation.navigateToDashboard()
    }
    catch (err) {
      console.log(err);
    }
  };

  //Registro con Google
  const handleGoogleRegister = async () => {
    //Este aun no funciona
    try {
      const result = await doGoogleSignIn();
      const userData = await createUser(result.user.uid, username, email)

      sessionStorage.setItem('userData', JSON.stringify({ auth: result.user, data: userData }))
      handleNavigation.navigateToDashboard()
      handleNavigation.navigateToDashboard()
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="Register">
      <h1>Sign Up</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

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
        <input id="box"
          type="checkbox"
          checked={acceptTerms}
          onChange={() => setAcceptTerms(!acceptTerms)}
        />
        <p id="CheckText">I accept the <span >terms</span> and <span>conditions</span></p>
      </div>

      <button onClick={handleRegister}>Sign Up</button>
      <div id="signUpGoogleContainer">
        <p>Or</p>
        <div id="googleIconContainer" onClick={handleGoogleRegister}>
          <img src={logoGoogle} alt="" />
          <p>Sign Up with Google</p>
        </div>
      </div>
      <h3 id="CrearCuenta">Already have an account? <span onClick={() => { handleNavigation.navigateToLogin() }}>Sign In</span></h3>
    </div>
  );
}

export default CardRegister;