// HU48 (detalle de la recompensa), HU50 (saber cuándo no puedo canjear) y canje guardado en Firestore
import './RewardCard.css';
import '../../ui/capyModal.css';

import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { exchangeNameEnum } from '../../../store/rewards/types';
import { ChangeFirebaseContext } from '../../../Contexts/changeFirebaseContext';
import { getActionErrorMessage, redeemReward } from '../../../services/Firebase/FirestoreActions';
import { showToast } from '../../../utils/toast';

//Import images
import logoMoneyWhite from '../../../assets/desktop/svg/logo/logoCapyMoneyWhite.svg'
import logoMoneyBlack from '../../../assets/desktop/svg/logo/logoCapyMoneyBlack.svg'

import amazonImage from '../../../assets/desktop/png/Amazon.png'
import netflixImage from '../../../assets/desktop/png/Netflix.png'
import farmatodoImage from '../../../assets/desktop/png/Farmatodo.png'

interface RewardCardProps {
    service: string;
    price: number;
    points: number;
    backgroundColor: string;
    id: number;
    darkText: boolean,
}

const SERVICE_IMAGES: Record<string, string> = {
    [exchangeNameEnum.amazon]: amazonImage,
    [exchangeNameEnum.netflix]: netflixImage,
    [exchangeNameEnum.farmatodo]: farmatodoImage,
};

const RewardCard: React.FC<RewardCardProps> = ({ service, price, points, backgroundColor, id, darkText }) => {
    const userCapypoints = useSelector((state: RootState) => state.rewards.summary.accumulatedCapypoints);
    const OnChangeFirebase = useContext(ChangeFirebaseContext)

    const [showDetail, setShowDetail] = useState(false)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')

    const missingPoints = Math.max(0, points - userCapypoints)
    const canRedeem = missingPoints === 0
    const image = SERVICE_IMAGES[service]

    const handleRedeem = async () => {
        setError('')
        setBusy(true)
        try {
            await redeemReward(OnChangeFirebase.logedUserUID, id)
            showToast(`¡Canjeaste ${service}!`, 'celebration')
            setShowDetail(false)
            await OnChangeFirebase.fetchAndSetUserData()
        } catch (err) {
            console.error(err)
            setError(getActionErrorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    if (!image) return null

    return <>
        <div
            className="reward-card"
            style={{ backgroundColor, opacity: canRedeem ? 1 : 0.75, cursor: 'pointer' }}
            onClick={() => { setError(''); setShowDetail(true) }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setShowDetail(true) }}
            title={canRedeem ? 'See reward details' : `You need ${missingPoints} more Capypoints`}
        >
            <img src={image} alt={service} className="reward-card-image" />
            <div className="reward-card-content">
                <h2 className={darkText ? 'darkText' : ''}>{service}</h2>
                <div className="price-and-points">
                    <h3 className={darkText ? 'darkText' : ''}>${price}</h3>
                    <p className={`text-with-image ${darkText ? 'darkText' : ''}`}>
                        <img id="white" src={darkText ? logoMoneyBlack : logoMoneyWhite} alt="" />
                        {points}
                    </p>
                </div>
                {!canRedeem && (
                    <p className={darkText ? 'darkText' : ''} style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 700 }}>
                        🔒 {missingPoints} points missing
                    </p>
                )}
            </div>
        </div>

        {showDetail && (
            <div className="capyModalBackdrop" onClick={(e) => { if (e.target === e.currentTarget && !busy) setShowDetail(false) }}>
                <div className="capyModal" role="dialog" aria-modal="true" aria-labelledby={`reward-${id}`}>
                    <img src={image} alt={service} style={{ width: '100%', maxHeight: '160px', objectFit: 'contain', borderRadius: '12px', background: backgroundColor }} />
                    <h3 id={`reward-${id}`}>{service}</h3>
                    <p>Value: <strong>${price}</strong></p>
                    <p>Cost: <strong>{points} Capypoints</strong></p>
                    <p>Your Capypoints: <strong>{userCapypoints}</strong></p>

                    {!canRedeem && (
                        <p className="capyModalError">
                            Te faltan {missingPoints} Capypoints. Gana más registrando movimientos, ahorrando y completando misiones.
                        </p>
                    )}
                    {error && <p className="capyModalError">{error}</p>}

                    <div className="capyModalActions">
                        <button type="button" className="capyBtnSecondary" onClick={() => setShowDetail(false)} disabled={busy}>Close</button>
                        <button type="button" className="capyBtnPrimary" onClick={handleRedeem} disabled={busy || !canRedeem}>
                            {busy ? 'Redeeming...' : 'Redeem'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
}

export default RewardCard;
