import { useState } from "react";
import { CapyPopup } from "../capyPopupComponent/capyPopupComponent";
import './capyAssistantComponent.css';

import capyImage from '../../assets/desktop/svg/Capybara.svg'

export const CapyAssistant = () => {
    const [isPopupVisible, setPopupVisible] = useState(false);

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    return (
        <div>
            <div className="assistant" onClick={togglePopup}>
                <img
                    src={capyImage}
                    alt=""
                    className="assistant-img"
                />
            </div>
            {isPopupVisible && (
                <CapyPopup></CapyPopup>
            )}
        </div>
    );
};
