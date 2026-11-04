import './Expenses.css';

//Imagenes importadas
import MoveButton from '../../../assets/desktop/svg/MoveButton.svg'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export const Expenses = () => {

  const totalExpenses = useSelector((state: RootState) => state.userData.totalExpenses)

  return (
    <>

      <div className='expenses'>
        <img className="MoveButton" src={MoveButton} alt="MoveButton" />

        <h2>Total Expenses</h2>
        <h1>${totalExpenses}</h1>

      </div>

    </>
  );
}

