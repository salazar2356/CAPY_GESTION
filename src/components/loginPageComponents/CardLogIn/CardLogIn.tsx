import './CardLogIn.css';

import { useState } from "react";
import { doGoogleSignIn, doSignInWithEmailAndPassword } from "../../../services/Firebase/auth";
import { getRealUser, getUser } from "../../../services/Firebase/FirestoreUsers";
import { NavigationHook } from '../../../hooks/navigationHook';

import logoGoogle from '../../../assets/desktop/svg/logo/logoGoogle.svg'
import { useDispatch } from 'react-redux';
import { changeUserEmail, changeUserName, changeUserUID } from '../../../store/userData/slice';

function CardLogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch()

  const { handleNavigation } = NavigationHook()

  const handleLoginEmail = async () => {
    setError("");

    try {
      const userCredential = await doSignInWithEmailAndPassword(email, password);
      console.log("Usuario logueado:", userCredential.user);

      // const userData = await getUser(userCredential.user.uid)
      const userData = await getRealUser(userCredential.user.uid)
      console.log(userData)

      sessionStorage.setItem('userUID', userCredential.user.uid)

      if (userData) {
        dispatch(changeUserName(userData.name))
        dispatch(changeUserEmail(userData.email))
        dispatch(changeUserUID(userData.userUID))
        sessionStorage.setItem('userUID', userCredential.user.uid)

        if (userData) {
          dispatch(changeUserName(userData.name))
          dispatch(changeUserEmail(userData.email))
          dispatch(changeUserUID(userData.userUID))

          handleNavigation.navigateToDashboard()

        } else {
          alert("userData is undefined")
        }




        handleNavigation.navigateToDashboard()

      } else {
        alert("userData is undefined")
      }





    } catch (err) {
      console.log(err);
    }
  };

  //Inicio de sesión con Google
  const handleGoogleLogin = async () => {
    try {
      const result = await doGoogleSignIn();
      console.log("Usuario logueado con Google:", result.user);
      const userData = await getUser(result.user.uid)
      sessionStorage.setItem('userData', JSON.stringify({ auth: result.user, data: userData }))
      handleNavigation.navigateToDashboard()
      handleNavigation.navigateToDashboard()
    } catch (err) {
      console.log(err)
    }
  };

  return <>
    <div className='LogIn' id='cardLogin'>
      <h1>Sign In</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

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

      <p id='forgotPasswordText'>Forgot your password?</p>
      <button id='ButtonLogin' onClick={handleLoginEmail}>Log In</button>
      <div id="signUpGoogleContainer">
        <p>Or</p>
        <div id="googleIconContainer" onClick={handleGoogleLogin}>
          <img src={logoGoogle} alt="" />
          <p>Sign In with Google</p>
        </div>
      </div>

      <p id="Cuenta">Don't have an account? <span onClick={handleNavigation.navigateToRegister}>Register now</span></p>
    </div>
  </>
}

export default CardLogIn;