import './nav.css';

import { useLocation } from 'react-router-dom';

import LogoCapy from '../../assets/desktop/svg/Logo.svg'

//Nav icons white
import dashboardIconWhite from '../../assets/desktop/svg/icons/navIcons/DashboardNavIconWhite.svg'
import expensesAndIncomeIconWhite from '../../assets/desktop/svg/icons/navIcons/ExpensesAndIncomeNavIconWhite.svg'
import savingsIconWhite from '../../assets/desktop/svg/icons/navIcons/SavingsNavIconWhite.svg'
import rewardsIconWhite from '../../assets/desktop/svg/icons/navIcons/RewardsNavIconWhite.svg'
// import configurationIconWhite from '../../assets/desktop/svg/icons/navIcons/ConfigurationNavIconWhite.svg'
import profileIconWhite from '../../assets/desktop/svg/icons/navIcons/ProfileNavIconWhite.svg'
import logOutIconWhite from '../../assets/desktop/svg/icons/navIcons/LogOutNavIconWhite.svg'
import profileIconBlack from "../../../src/assets/desktop/svg/icons/profileIconBlack.svg"

//Nav icons green
import dashboardIconBlack from '../../assets/desktop/svg/icons/navIcons/DashboardNavIconBlack.svg'
import expensesAndIncomeIconBlack from '../../assets/desktop/svg/icons/navIcons/ExpensesAndIncomeNavIconBlack.svg'
import savingsIconBlack from '../../assets/desktop/svg/icons/navIcons/SavingsNavIconBlack.svg'
import rewardsIconBlack from '../../assets/desktop/svg/icons/navIcons/RewardsNavIconBlack.svg'
import { routes } from '../../types/routesEnum';
import { NavigationHook } from '../../hooks/navigationHook';

export const GlobalAppNav = () => {

  const { handleNavigation, handleLogOut } = NavigationHook()
  const location = useLocation()


  switch (location.pathname) {
    case routes.dashboard:
      return < >
        <nav className='navContainer'>

          <div className='capy'>
            <img className="Logo" src={LogoCapy} alt="Logo" />
          </div>

          <div className='nav'>
            <div className='principal'>
              <img className="Dashboard focus" src={dashboardIconBlack} alt="Dashboard" />
              <img className="IncomeExpenses" src={expensesAndIncomeIconWhite} alt="IncomeExpenses" onClick={handleNavigation.navigateToExpensesAndIncomes} />
              <img className="Savings" src={savingsIconWhite} alt="Savings" onClick={handleNavigation.navigateToSavings} />
              <img className="Rewards" src={rewardsIconWhite} alt="Rewards" onClick={handleNavigation.navigateToRewards} />
              {/* <img className="Settings" src={configurationIconWhite} alt="Settings" onClick={handleNavigation.navigateToProfile} /> */}
            </div>

            <div className='last'>
              <img className="User" src={profileIconWhite} alt="User" onClick={handleNavigation.navigateToProfile} />
              <img className="LogOut" src={logOutIconWhite} alt="LogOut" onClick={() => { handleLogOut() }} />
            </div>
          </div>

        </nav>
      </>

    case routes.expensesAndIncome:
      return < >
        <nav className='navContainer'>

          <div className='capy'>
            <img className="Logo" src={LogoCapy} alt="Logo" />
          </div>

          <div className='nav'>
            <div className='principal'>
              <img className="Dashboard" src={dashboardIconWhite} alt="Dashboard" onClick={handleNavigation.navigateToDashboard} />
              <img className="IncomeExpenses focus" src={expensesAndIncomeIconBlack} alt="IncomeExpenses" />
              <img className="Savings" src={savingsIconWhite} alt="Savings" onClick={handleNavigation.navigateToSavings} />
              <img className="Rewards" src={rewardsIconWhite} alt="Rewards" onClick={handleNavigation.navigateToRewards} />
              {/* <img className="Settings" src={configurationIconWhite} alt="Settings" /> */}
            </div>

            <div className='last'>
              <img className="User" src={profileIconWhite} alt="User" onClick={handleNavigation.navigateToProfile} />
              <img className="LogOut" src={logOutIconWhite} alt="LogOut" onClick={() => { handleLogOut() }} />
            </div>
          </div>

        </nav>
      </>

    case routes.savings:
      return < >
        <nav className='navContainer'>

          <div className='capy'>
            <img className="Logo" src={LogoCapy} alt="Logo" />
          </div>

          <div className='nav'>
            <div className='principal'>
              <img className="Dashboard" src={dashboardIconWhite} alt="Dashboard" onClick={handleNavigation.navigateToDashboard} />
              <img className="IncomeExpenses" src={expensesAndIncomeIconWhite} alt="IncomeExpenses" onClick={handleNavigation.navigateToExpensesAndIncomes} />
              <img className="Savings focus" src={savingsIconBlack} alt="Savings" />
              <img className="Rewards" src={rewardsIconWhite} alt="Rewards" onClick={handleNavigation.navigateToRewards} />
              {/* <img className="Settings" src={configurationIconWhite} alt="Settings" /> */}
            </div>

            <div className='last'>
              <img className="User" src={profileIconWhite} alt="User" onClick={handleNavigation.navigateToProfile} />
              <img className="LogOut" src={logOutIconWhite} alt="LogOut" onClick={() => { handleLogOut() }} />
            </div>
          </div>

        </nav>
      </>

    case routes.rewards:
      return < >
        <nav className='navContainer'>

          <div className='capy'>
            <img className="Logo" src={LogoCapy} alt="Logo" />
          </div>

          <div className='nav'>
            <div className='principal'>
              <img className="Dashboard" src={dashboardIconWhite} alt="Dashboard" onClick={handleNavigation.navigateToDashboard} />
              <img className="IncomeExpenses" src={expensesAndIncomeIconWhite} alt="IncomeExpenses" onClick={handleNavigation.navigateToExpensesAndIncomes} />
              <img className="Savings" src={savingsIconWhite} alt="Savings" onClick={handleNavigation.navigateToSavings} />
              <img className="Rewards focus" src={rewardsIconBlack} alt="Rewards" />
              {/* <img className="Settings" src={configurationIconWhite} alt="Settings" /> */}
            </div>

            <div className='last'>
              <img className="User" src={profileIconWhite} alt="User" onClick={handleNavigation.navigateToProfile} />
              <img className="LogOut" src={logOutIconWhite} alt="LogOut" onClick={() => { handleLogOut() }} />
            </div>
          </div>

        </nav>
      </>
    case routes.profilePage:
      return < >
        <nav className='navContainer'>

          <div className='capy'>
            <img className="Logo" src={LogoCapy} alt="Logo" />
          </div>

          <div className='nav'>
            <div className='principal'>
              <img className="Dashboard" src={dashboardIconWhite} alt="Dashboard" onClick={handleNavigation.navigateToDashboard} />
              <img className="IncomeExpenses" src={expensesAndIncomeIconWhite} alt="IncomeExpenses" onClick={handleNavigation.navigateToExpensesAndIncomes} />
              <img className="Savings" src={savingsIconWhite} alt="Savings" onClick={handleNavigation.navigateToSavings} />
              <img className="Rewards" src={rewardsIconWhite} alt="Rewards" onClick={handleNavigation.navigateToRewards} />
              {/* <img className="Settings" src={configurationIconWhite} alt="Settings" /> */}
            </div>

            <div className='last'>
              <img className="User focus" src={profileIconBlack} alt="User" />
              <img className="LogOut" src={logOutIconWhite} alt="LogOut" onClick={() => { handleLogOut() }} />
            </div>
          </div>

        </nav>
      </>

    default:
      break;
  }
}