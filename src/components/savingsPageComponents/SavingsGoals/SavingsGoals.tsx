import './SavingsGoals.css'

import { SavingGoalItem, SavingGoalItemProps } from '../SavingGoalItem/SavingGoalItem'
import { useDispatch } from 'react-redux'
import { changeAddSavingModal } from '../../../store/store'
import { savingEnum } from '../../../store/savings/types'

import fireIconWhite from '../../../assets/desktop/svg/fireIconWhite.svg'
import planetIconBlack from '../../../assets/desktop/svg/planetIconBlack.svg'
import KeyIconWhite from '../../../assets/desktop/svg/KeyIconWhite.svg'

interface SavingsGoalsProps {
    savingsGoalsItemsArray: Array<SavingGoalItemProps>
}

export const SavingsGoals = ({ savingsGoalsItemsArray }: SavingsGoalsProps) => {
    const dispatch = useDispatch()


    return <>
        <div id='savingsGoalsContainer'>
            <div id='savingsGoalsHeader'>
                <h3>Savings Goals</h3>
                <button onClick={() => {
                    dispatch(changeAddSavingModal(true))
                }}>Create savings goal</button>
            </div>

            <div id='savingsGoalsListContainer'>
                {savingsGoalsItemsArray.length === 0 && (
                    <p style={{ color: '#F9F9F9' }}>You don't have savings goals yet. Create your first one!</p>
                )}
                {savingsGoalsItemsArray.map((goal) => {
                    const imageByType: Record<string, string> = {
                        [savingEnum.fire]: fireIconWhite,
                        [savingEnum.globe]: planetIconBlack,
                        [savingEnum.key]: KeyIconWhite,
                        [savingEnum.other]: ""
                    }
                    return <SavingGoalItem key={goal.goalTitle} {...goal} goalImage={imageByType[goal.goalImage] ?? ""}></SavingGoalItem>
                })}
            </div>
        </div>
    </>
}