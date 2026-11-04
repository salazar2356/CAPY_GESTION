import './Dashboard.css'

//Import Components
import { GlobalAppNav } from '../../components/Nav/Nav'
import { InteractiveGrid } from '../../components/dashboardPageComponents/InteractiveGrid/InteractiveGrid'
import { RootState } from '../../store/store'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { NavigationHook } from '../../hooks/navigationHook'
import { useUserFirebaseData } from '../../hooks/useUserFirebaseData'
import { CapyAssistant } from '../../components/capyAssistantComponent/capyAssistantComponent'

export const Dashboard = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [sessionStorageUserUID] = useState(() => sessionStorage.getItem('userUID'));
    const { handleNavigation } = NavigationHook();
    const { fetchAndSetUserData } = useUserFirebaseData(sessionStorageUserUID);

    const userDataRedux = useSelector((state: RootState) => state.userData);

    useEffect(() => {
        if (!isInitialized) {
            if (!sessionStorageUserUID) {
                handleNavigation.navigateToLogin();
            } else {
                fetchAndSetUserData();
            }
            setIsInitialized(true);
        }
    }, [isInitialized, handleNavigation, sessionStorageUserUID, fetchAndSetUserData]);

    return <>
        <main className='page' id='dashboardPage'>

            <div id='marginPage'>
                <GlobalAppNav></GlobalAppNav>

                <div id='ContentContainerDashboard'>
                    <div id='TitleTextContainer'>
                        <h1>Dashboard</h1>
                        <p><span className='TextHint'>Hola,</span> {userDataRedux.userName}</p>
                    </div>


                    <InteractiveGrid></InteractiveGrid>
                </div>


            </div>

            <div id='backgroundDashboard' className='backgroundPage'>

            </div>
            <CapyAssistant />
        </main >
    </>
}