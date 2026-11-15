import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { CapyPopup } from "../capyPopupComponent/capyPopupComponent";
import './capyAssistantComponent.css';

import capyImage from '../../assets/desktop/svg/Capybara.svg'

export const CapyAssistant = () => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    // HU52: si el usuario desactivó el asistente, no se muestra en ninguna pantalla
    const assistantEnabled = useSelector((state: RootState) => state.userData.assistantEnabled);

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    if (!assistantEnabled) return null;

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
