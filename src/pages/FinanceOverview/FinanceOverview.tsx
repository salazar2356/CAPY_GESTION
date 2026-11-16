import { useSelector } from 'react-redux';
import { GlobalAppNav } from '../../components/Nav/Nav';
import type { RootState } from '../../store/store';
import './FinanceOverview.css';

export function FinanceOverview({ kind }: { kind: 'savings' | 'rewards' }) {
    const savings = useSelector((state: RootState) => state.savings.savingsData);
    const rewards = useSelector((state: RootState) => state.rewards);
    return <main className="page finance-overview">
        <GlobalAppNav />
        <section className="finance-content">
            <h1>{kind === 'savings' ? 'Savings' : 'Rewards'}</h1>
            {kind === 'savings' ? <>
                <p>Your saved goals</p>
                {savings.length === 0 && <p>You don't have savings goals yet.</p>}
                {savings.map(saving => <article key={saving.savingName} className="finance-item">
                    <h2>{saving.savingName}</h2>
                    <p>${saving.savingActualFee.toLocaleString()} / ${saving.savingTotalFee.toLocaleString()}</p>
                    <progress aria-label={saving.savingName} value={saving.savingActualFee} max={Math.max(1, saving.savingTotalFee)} />
                    <p>Monthly saving: ${saving.monthlySaving.toLocaleString()}</p>
                </article>)}
            </> : <>
                <p>{rewards.summary.saverLevel} · {rewards.summary.accumulatedCapypoints} Capypoints</p>
                <h2>Missions</h2>
                {rewards.missions.length === 0 && <p>You don't have missions yet.</p>}
                {rewards.missions.map(mission => <article key={mission.missionId} className="finance-item">
                    <h3>{mission.missionName}</h3><p>{mission.missionDescription}</p>
                    <p>{mission.completed ? 'Completed' : 'In progress'} · {mission.missionCapypoints} Capypoints</p>
                </article>)}
                <h2>Rewards history</h2>
                {rewards.exchangeData.length === 0 && <p>You don't have rewards yet.</p>}
                {rewards.exchangeData.map(reward => <article key={reward.exchangeId} className="finance-item">
                    <h3>{reward.name}</h3><p>{reward.redemptionCapypointsAmount} Capypoints · {reward.isRedeemed ? 'Redeemed' : 'Not redeemed'}</p>
                </article>)}
            </>}
        </section>
    </main>;
}
