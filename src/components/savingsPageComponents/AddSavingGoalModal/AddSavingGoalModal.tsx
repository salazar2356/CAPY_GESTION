import './AddSavingGoalModal.css'
import fireIconWhite from '../../../assets/desktop/svg/fireIconWhite.svg'
import globeIconWhite from '../../../assets/desktop/svg/globeIconWhite.svg'
import keyIconWhite from '../../../assets/desktop/svg/KeyIconWhite.svg'

import { useDispatch, useSelector } from 'react-redux'
import { changeAddSavingModal, RootState } from '../../../store/store'

import xIconWhite from '../../../assets/desktop/svg/icons/xIconWhite.svg'
import { useContext, useRef } from 'react'
import { savingEnum } from '../../../store/savings/types'
import { CreatedNewSaving } from '../../../services/Firebase/FirestoreUsers'
import { ChangeFirebaseContext } from '../../../Contexts/changeFirebaseContext'
import { convertISOStringToTimestamp } from '../../../utils/timestampConvertion'

export const AddSavingGoalModal = () => {
    const dispatch = useDispatch()
    const OnChangeFirebase = useContext(ChangeFirebaseContext)
    const savingsArray = useSelector((state: RootState) => state.savings.savingsData);

    const savingNameInputRef = useRef<HTMLInputElement>(null)
    const savingColorInputRef = useRef<HTMLSelectElement>(null)

    const savingMonthlyInputRef = useRef<HTMLInputElement>(null)
    const savingTotalFeeInputRef = useRef<HTMLInputElement>(null)

    
    const getSelectedImage = () => {
        const selectedRadio = document.querySelector('input[name="AddSavingGoalRadioInputImage"]:checked') as HTMLInputElement;
        return selectedRadio ? selectedRadio.id : null;
    };

    return (
        <>
            <div
                id="AddSavingGoalModalFondo"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        dispatch(changeAddSavingModal(false))
                    }
                }}
            >
                <div id="AddSavingGoalModalContainer">
                    <button id='AddSavingGoalCloseModalButton' onClick={() => {
                        dispatch(changeAddSavingModal(false))
                    }}>
                        <img src={xIconWhite} alt="" />
                    </button>

                    <form action="" id="AddSavingGoalModalContainerForm">
                        <h3>New savings</h3>
                        <div className="inputTextContainer">
                            <label htmlFor="">Saving name</label>
                            <input type="text" placeholder="Enter saving name" ref={savingNameInputRef} />
                        </div>

                        <div className="inputTextContainer">
                            <label htmlFor="">Saving Color</label>
                            <select ref={savingColorInputRef} id='selectColor'>
                                <option value="">Choose saving color</option>
                                <option value="blue">Blue</option>
                                <option value="green">Green</option>
                                <option value="orange">Orange</option>
                            </select>
                        </div>
                        
                        <label htmlFor="AddSavingGoalRadioInputContainer" id="selectSavingPicture">
                            Select saving picture
                        </label>

                        <div id="AddSavingGoalRadioInputContainer">
                            <div className="AddSavingGoalRadioInputItem">
                                <input type="radio" name="AddSavingGoalRadioInputImage" id="AddSavingGoalRadioInputFire" />
                                <label htmlFor="AddSavingGoalRadioInputFire">
                                    <img src={fireIconWhite} alt="" />
                                </label>
                            </div>

                            <div className='AddSavingGoalRadioInputItem' id='selectSavingPicture'>
                                <input type="radio" name="AddSavingGoalRadioInputImage" id="AddSavingGoalRadioInputPlanet" ></input>
                                <label htmlFor="AddSavingGoalRadioInputPlanet">
                                    <img src={globeIconWhite} alt="" />
                                </label>
                            </div>

                            <div className='AddSavingGoalRadioInputItem' id='selectSavingPicture'>
                                <input type="radio" name="AddSavingGoalRadioInputImage" id="AddSavingGoalRadioInputKey" ></input>
                                <label htmlFor="AddSavingGoalRadioInputKey">
                                    <img src={keyIconWhite} alt="" />
                                </label>
                            </div>
                        </div>

                        <div className="inputTextContainer">
                            <label htmlFor="">Total Amount</label>
                            <input type="number" placeholder="Enter the total amount of the saving" ref={savingTotalFeeInputRef} />
                        </div>

                        <div className="inputTextContainer">
                            <label htmlFor="">Monthly Amount</label>
                            <input type="number" placeholder="Enter the monthly savings amount" ref={savingMonthlyInputRef} />
                        </div>

                        <button id="AddSavingGoalRadioInputButton" onClick={(e) => {
                            e.preventDefault();

                            const selectedImage = getSelectedImage();

                            if (savingNameInputRef.current && selectedImage) {
                                let actualSelectedImageName: savingEnum = savingEnum.other
                                switch (selectedImage) {
                                    case "AddSavingGoalRadioInputFire":
                                        actualSelectedImageName = savingEnum.fire
                                        break;
                                    case "AddSavingGoalRadioInputPlanet":
                                        actualSelectedImageName = savingEnum.globe
                                        break;
                                    case "AddSavingGoalRadioInputKey":
                                        actualSelectedImageName = savingEnum.key
                                        break;
                                    default:
                                        break;
                                }

                                const convertionOfSavingsArrayToTimestamp = savingsArray.map((storeSaving) => ({
                                    ...storeSaving,
                                    savingHistory: storeSaving.savingHistory.map((storeSavingHistory) => ({
                                        ...storeSavingHistory,
                                        date: convertISOStringToTimestamp(storeSavingHistory.date),
                                    })),
                                }))

                                if (savingColorInputRef.current && savingTotalFeeInputRef.current && savingMonthlyInputRef.current) {
                                    CreatedNewSaving(OnChangeFirebase.logedUserUID, savingColorInputRef.current.value, actualSelectedImageName, savingNameInputRef.current.value, parseInt(savingTotalFeeInputRef.current.value), parseInt(savingMonthlyInputRef.current.value), convertionOfSavingsArrayToTimestamp, OnChangeFirebase.fetchAndSetUserData)
                                    dispatch(changeAddSavingModal(false))
                                } else {
                                    console.log("Some addSaving modal ref is null")
                                }
                            }
                        }}>Create new saving</button>
                    </form>
                </div>
            </div>
        </>
    )
}
