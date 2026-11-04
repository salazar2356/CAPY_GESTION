import './LandingFirstSectionButtons.css'
import { NavigationHook } from '../../../hooks/navigationHook'

export const LandingFirstSectionButtons = () => {
    const { handleNavigation } = NavigationHook()

    return <>
        <div id="LoginRegisterButtonsContainer">
            <button id="createAccountButton" onClick={handleNavigation.navigateToRegister}>Create Account</button>
            <button id="logInButton" onClick={handleNavigation.navigateToLogin}>Log in</button>
        </div>
    </>
}