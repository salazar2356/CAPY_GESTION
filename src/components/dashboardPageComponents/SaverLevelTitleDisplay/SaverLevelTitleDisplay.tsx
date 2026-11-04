import './SaverLevelTitleDisplay.css'

import noviceSaverLevel from '../../../assets/desktop/png/noviceSaverLevel.png'

export const SaverLevelTitleDisplay = () => {
    return <>
        <div id='SaverLevelTitleDisplayContainer'>
            <h3>Novice</h3>
            <img src={noviceSaverLevel} alt="" />
        </div>
    </>
}