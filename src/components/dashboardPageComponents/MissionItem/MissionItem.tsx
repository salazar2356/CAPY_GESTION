import './MissionItem.css'

import logoWhite from '../../../assets/desktop/svg/logo/logoCapyMoneyWhite.svg'
import logoBlack from '../../../assets/desktop/svg/logo/logoCapyMoneyBlack.svg'

interface MissionItemProps {
    text: string,
    gainAmount: string,
    backgroundColor: string,
    capyPointsDark: boolean,
    isCompleted: boolean
}

export const MissionItem = ({ text, gainAmount, backgroundColor, capyPointsDark, isCompleted }: MissionItemProps) => {
    console.log('Prueba')

    if (isCompleted) {
        if (!capyPointsDark) {
            return <>
                <div className='MissionItemContainer'>
                    <p className='MissionDesc'>{text}</p>

                    <div className='MissionCapyPoints ligth' style={{ backgroundColor: backgroundColor }}>
                        <img src={logoWhite} alt="" />
                        <div className='CapyPointsAmount' >
                            <p className='Capypoints lightTex'>Completed</p>
                            <p className='Gain lightTex'>+{gainAmount}</p>
                        </div>
                    </div>
                </div>
            </>
        }

        return <>
            <div className='MissionItemContainer'>
                <p className='MissionDesc'>{text}</p>

                <div className='MissionCapyPoints' style={{ backgroundColor: backgroundColor }}>
                    <img src={logoBlack} alt="" />
                    <div className='CapyPointsAmount dark' >
                        <p className='Capypoints darkText'>Completed</p>
                        <p className='Gain darkText'>+{gainAmount}</p>
                    </div>
                </div>
            </div>
        </>
    } else {

        if (!capyPointsDark) {
            return <>
                <div className='MissionItemContainer'>
                    <p className='MissionDesc'>{text}</p>

                    <div className='MissionCapyPoints ligth' style={{ backgroundColor: backgroundColor }}>
                        <img src={logoWhite} alt="" />
                        <div className='CapyPointsAmount' >
                            <p className='Capypoints lightTex'>Capypoints</p>
                            <p className='Gain lightText'>+{gainAmount}</p>
                        </div>
                    </div>
                </div>
            </>
        }

        return <>
            <div className='MissionItemContainer'>
                <p className='MissionDesc'>{text}</p>

                <div className='MissionCapyPoints' style={{ backgroundColor: backgroundColor }}>
                    <img src={logoBlack} alt="" />
                    <div className='CapyPointsAmount dark' >
                        <p className='Capypoints darkText'>Capypoints</p>
                        <p className='Gain darkText'>+{gainAmount}</p>
                    </div>
                </div>
            </div>
        </>

    }
}