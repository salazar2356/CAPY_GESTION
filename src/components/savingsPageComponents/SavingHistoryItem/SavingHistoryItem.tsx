import './SavingHistoryItem.css'

interface SavingHistoryItemProps {
    savingHistoryImage: string,
    savingHistoryColor: string,
    savingHistoryTitle: string,
    savingHistoryDate: string,
    savingHistoryDeposit: number
}

export const SavingHistoryItem = ({ savingHistoryImage, savingHistoryColor, savingHistoryTitle, savingHistoryDate, savingHistoryDeposit }: SavingHistoryItemProps) => {
    return <>
        <div className='savingsHistoryItem'>
            <div className='savingsHistoryItemTitle'>
                <img src={savingHistoryImage} alt="" style={{ backgroundColor: savingHistoryColor }} />
                <div className='savingsHistoryItemTitleText'>
                    <div className='savingsHistoryItemTitleTextNameDate'>
                        <h4>{savingHistoryTitle}</h4>
                        <p>{savingHistoryDate}</p>
                    </div>
                </div>
            </div>

            <p className='savingsHistoryItemAmount'>${savingHistoryDeposit}</p>
        </div>
    </>
}