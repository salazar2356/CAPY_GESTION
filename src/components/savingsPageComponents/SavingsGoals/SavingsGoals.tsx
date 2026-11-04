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
                {savingsGoalsItemsArray.map((goal) => {
                    switch (goal.goalImage) {
                        case savingEnum.fire:
                            return <SavingGoalItem key={goal.goalTitle + goal.goalMonthlySaving} goalImage={fireIconWhite} goalImageColor={goal.goalImageColor} goalTitle={goal.goalTitle} goalMonthlySaving={goal.goalMonthlySaving} goalActualFee={goal.goalActualFee} goalTotalFee={goal.goalTotalFee}></SavingGoalItem>
                        case savingEnum.globe:
                            return <SavingGoalItem key={goal.goalTitle + goal.goalMonthlySaving} goalImage={planetIconBlack} goalImageColor={goal.goalImageColor} goalTitle={goal.goalTitle} goalMonthlySaving={goal.goalMonthlySaving} goalActualFee={goal.goalActualFee} goalTotalFee={goal.goalTotalFee}></SavingGoalItem>
                        case savingEnum.key:
                            return <SavingGoalItem key={goal.goalTitle + goal.goalMonthlySaving} goalImage={KeyIconWhite} goalImageColor={goal.goalImageColor} goalTitle={goal.goalTitle} goalMonthlySaving={goal.goalMonthlySaving} goalActualFee={goal.goalActualFee} goalTotalFee={goal.goalTotalFee}></SavingGoalItem>
                        case savingEnum.other:
                            return <SavingGoalItem key={goal.goalTitle + goal.goalMonthlySaving} goalImage={""} goalImageColor={goal.goalImageColor} goalTitle={goal.goalTitle} goalMonthlySaving={goal.goalMonthlySaving} goalActualFee={goal.goalActualFee} goalTotalFee={goal.goalTotalFee}></SavingGoalItem>
                        default:
                            break;
                    }
                })}
            </div>
        </div>
    </>
}