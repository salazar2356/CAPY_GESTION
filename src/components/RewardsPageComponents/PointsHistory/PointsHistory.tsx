// HU44 (racha), HU46 (historial de puntos) y HU51 (recompensas canjeadas)
import './PointsHistory.css';

import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { dayKey } from '../../../services/Firebase/FirestoreActions';

// La racha solo sigue activa si hubo actividad hoy o ayer
export const useActiveStreak = () => {
    const streak = useSelector((state: RootState) => state.rewards.streak);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isActive = streak.lastActiveDate === dayKey() || streak.lastActiveDate === dayKey(yesterday);
    return { current: isActive ? streak.current : 0, best: streak.best, activeToday: streak.lastActiveDate === dayKey() };
};

export const PointsHistory = () => {
    const pointsHistory = useSelector((state: RootState) => state.rewards.pointsHistory);
    const exchangeData = useSelector((state: RootState) => state.rewards.exchangeData);
    const streak = useActiveStreak();

    const redeemed = exchangeData
        .filter((reward) => reward.isRedeemed)
        .sort((a, b) => (b.redeemedAt ?? '').localeCompare(a.redeemedAt ?? ''));

    return (
        <section className="pointsHistory">
            <h2>Activity</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="pointsHistoryCard">
                    <h3>🔥 Streak</h3>
                    <p className="streakValue">{streak.current} {streak.current === 1 ? 'day' : 'days'}</p>
                    <p className="streakHint">Best streak: {streak.best} {streak.best === 1 ? 'day' : 'days'}</p>
                    <p className="streakHint">
                        {streak.activeToday
                            ? 'You already kept your streak today!'
                            : 'Register an income, expense or saving today to keep your streak.'}
                    </p>
                </div>

                <div className="pointsHistoryCard">
                    <h3>Redeemed rewards</h3>
                    {redeemed.length === 0 ? (
                        <p className="streakHint">You haven't redeemed rewards yet.</p>
                    ) : (
                        <ul className="redeemedList">
                            {redeemed.map((reward) => (
                                <li key={reward.exchangeId} className="pointsHistoryItem">
                                    <div>
                                        <p>{reward.name}</p>
                                        {reward.redeemedAt && <p className="date">{new Date(reward.redeemedAt).toLocaleDateString()}</p>}
                                    </div>
                                    <p className="amount negative">-{reward.redemptionCapypointsAmount}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="pointsHistoryCard">
                <h3>Points history</h3>
                {pointsHistory.length === 0 ? (
                    <p className="streakHint">Your Capypoints will appear here when you register incomes, expenses, savings or complete missions.</p>
                ) : (
                    <ul className="pointsHistoryList">
                        {pointsHistory.map((entry) => (
                            <li key={entry.id} className="pointsHistoryItem">
                                <div>
                                    <p>{entry.reason}</p>
                                    <p className="date">{new Date(entry.date).toLocaleString()}</p>
                                </div>
                                <p className={`amount ${entry.points >= 0 ? 'positive' : 'negative'}`}>
                                    {entry.points >= 0 ? '+' : ''}{entry.points}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};
