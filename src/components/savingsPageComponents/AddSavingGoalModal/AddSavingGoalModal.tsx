import './AddSavingGoalModal.css'
import fireIconWhite from '../../../assets/desktop/svg/fireIconWhite.svg'
import globeIconWhite from '../../../assets/desktop/svg/globeIconWhite.svg'
import keyIconWhite from '../../../assets/desktop/svg/KeyIconWhite.svg'

import { useDispatch } from 'react-redux'
import { changeAddSavingModal } from '../../../store/store'

import xIconWhite from '../../../assets/desktop/svg/icons/xIconWhite.svg'
import { useContext, useRef, useState } from 'react'
import { savingEnum } from '../../../store/savings/types'
import { createSaving, getActionErrorMessage } from '../../../services/Firebase/FirestoreActions'
import { ChangeFirebaseContext } from '../../../Contexts/changeFirebaseContext'
import { showRewardToasts } from '../../../utils/toast'

export const AddSavingGoalModal = () => {
    const dispatch = useDispatch()
    const OnChangeFirebase = useContext(ChangeFirebaseContext)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

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

                        {error && <p style={{ color: '#121212', background: '#F2622E', borderRadius: '8px', padding: '8px 12px', fontWeight: 600 }}>{error}</p>}

                        <button id="AddSavingGoalRadioInputButton" disabled={saving} onClick={async (e) => {
                            e.preventDefault();
                            setError('')

                            const selectedImage = getSelectedImage();
                            if (!savingNameInputRef.current?.value.trim()) {
                                setError('Escribe el nombre de la meta.')
                                return
                            }
                            if (!savingColorInputRef.current?.value) {
                                setError('Elige un color.')
                                return
                            }
                            if (!selectedImage) {
                                setError('Elige una imagen.')
                                return
                            }

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

                            setSaving(true)
                            try {
                                const reward = await createSaving(OnChangeFirebase.logedUserUID, {
                                    savingName: savingNameInputRef.current.value,
                                    savingColor: savingColorInputRef.current.value,
                                    savingImage: actualSelectedImageName,
                                    savingTotalFee: Number(savingTotalFeeInputRef.current?.value),
                                    monthlySaving: Number(savingMonthlyInputRef.current?.value)
                                })
                                showRewardToasts(reward, 'Meta de ahorro creada')
                                await OnChangeFirebase.fetchAndSetUserData()
                                dispatch(changeAddSavingModal(false))
                            } catch (err) {
                                console.error(err)
                                setError(getActionErrorMessage(err))
                            } finally {
                                setSaving(false)
                            }
                        }}>{saving ? 'Saving...' : 'Create new saving'}</button>
                    </form>
                </div>
            </div>
        </>
    )
}
