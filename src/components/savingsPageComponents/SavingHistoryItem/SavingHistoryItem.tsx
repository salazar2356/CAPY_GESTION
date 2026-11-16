import './SavingHistoryItem.css'

interface SavingHistoryItemProps {
    savingHistoryImage: string,
    savingHistoryColor: string,
    savingHistoryTitle: string,
    savingHistoryDate: string,
    savingHistoryDeposit: number,
    savingHistoryReason?: string   // HU38: motivo del retiro
}

export const SavingHistoryItem = ({ savingHistoryImage, savingHistoryColor, savingHistoryTitle, savingHistoryDate, savingHistoryDeposit, savingHistoryReason }: SavingHistoryItemProps) => {
    const isWithdrawal = savingHistoryDeposit < 0
    return <>
        <div className='savingsHistoryItem'>
            <div className='savingsHistoryItemTitle'>
                <img src={savingHistoryImage} alt="" style={{ backgroundColor: savingHistoryColor }} />
                <div className='savingsHistoryItemTitleText'>
                    <div className='savingsHistoryItemTitleTextNameDate'>
                        <h4>{savingHistoryTitle}</h4>
                        <p>{savingHistoryDate}{isWithdrawal ? ` · Withdrawal${savingHistoryReason ? `: ${savingHistoryReason}` : ''}` : ''}</p>
                    </div>
                </div>
            </div>

            <p className='savingsHistoryItemAmount' style={isWithdrawal ? { color: '#F2622E' } : undefined}>
                {isWithdrawal ? `-$${Math.abs(savingHistoryDeposit)}` : `$${savingHistoryDeposit}`}
            </p>
        </div>
    </>
}
