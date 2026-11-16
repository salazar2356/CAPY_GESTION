// HU17: últimos movimientos en el Dashboard
import '../../MovementsHistory/MovementsHistory.css';

import { useState } from 'react';
import { EditMovementModal, MovementItem, MovementRow, useMovements } from '../../MovementsHistory/MovementsHistory';
import { NavigationHook } from '../../../hooks/navigationHook';
import MoveButton from '../../../assets/desktop/svg/MoveButton.svg';

const MAX_ITEMS = 5;

export const RecentMovements = () => {
    const movements = useMovements().slice(0, MAX_ITEMS);
    const [selected, setSelected] = useState<MovementItem | null>(null);
    const { handleNavigation } = NavigationHook();

    return (
        <div className="recentMovements">
            <img className="MoveButton" src={MoveButton} alt="MoveButton" />
            <div className="movementsHistoryTop">
                <h3>Latest movements</h3>
                <button className="seeAllMovements" onClick={handleNavigation.navigateToExpensesAndIncomes}>See all →</button>
            </div>

            {movements.length === 0 ? (
                <p className="movementsEmpty">Register your first income or expense in Expenses &amp; Income.</p>
            ) : (
                <ul style={{ padding: 0, margin: 0 }}>
                    {movements.map((item) => <MovementRow key={item.key} item={item} onSelect={setSelected} />)}
                </ul>
            )}

            {selected && <EditMovementModal item={selected} onClose={() => setSelected(null)} />}
        </div>
    );
};
