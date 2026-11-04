import './TotalBalance.css';

//Import images
import MoveButton from '../../../assets/desktop/svg/MoveButton.svg'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export const TotalBalance = () => {

  const TotalBalance = useSelector((state: RootState) => state.userData.totalBalance)

  return (
    <>
      <div className='balance'>
        <img className="MoveButton" src={MoveButton} alt="MoveButton" />

        <h3>Total Balance</h3>
        <h1>${TotalBalance}</h1>
        <h3>This month you have added: $21000</h3>

      </div>

    </>
  );
}
