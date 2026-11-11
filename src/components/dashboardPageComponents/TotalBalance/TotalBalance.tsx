import './TotalBalance.css';

//Import images
import MoveButton from '../../../assets/desktop/svg/MoveButton.svg'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export const TotalBalance = () => {

  const TotalBalance = useSelector((state: RootState) => state.userData.totalBalance)
  const realIncomes = useSelector((state: RootState) => state.incomes.realIncomes)

  // Ingresos registrados en el mes actual
  const now = new Date()
  const addedThisMonth = realIncomes
    .filter((income) => {
      const date = new Date(income.incomeDate)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
    .reduce((acc, income) => acc + income.incomeAmount, 0)

  return (
    <>
      <div className='balance'>
        <img className="MoveButton" src={MoveButton} alt="MoveButton" />

        <h3>Total Balance</h3>
        <h1>${TotalBalance}</h1>
        <h3>This month you have added: ${addedThisMonth}</h3>

      </div>

    </>
  );
}
