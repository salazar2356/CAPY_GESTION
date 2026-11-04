import './NavLanding.css'

import logoComplete from '../../../assets/desktop/svg/logoComplete.svg'

export const NavLanding = () => {
    const handleScroll = (elementId: string) => {
        console.log(elementId)
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return <>
        <nav id='navLandingContainer'>
            <img src={logoComplete} alt="" />

            <div id='navLandingSections'>
                <p onClick={() => { handleScroll('thirdSection') }}>Connections</p>
                <p onClick={() => { handleScroll('fourthSection') }}>Features</p>
                <p onClick={() => { handleScroll('fifthSection') }}>Reviews</p>
            </div>
        </nav>
    </>
}