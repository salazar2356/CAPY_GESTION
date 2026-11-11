import './SavingGoalItem.css'
import '../../ui/capyModal.css'

import { Progress } from '../../../components/ui/progress'
import { useContext, useState } from 'react'

import { ChangeFirebaseContext } from '../../../Contexts/changeFirebaseContext'
import {
    deleteSavingGoal,
    depositToSaving,
    editSaving,
    getActionErrorMessage,
    toggleSavingPause
} from '../../../services/Firebase/FirestoreActions'
import { showRewardToasts, showToast } from '../../../utils/toast'

export interface SavingGoalItemProps {
    goalImage: string,
    goalImageColor: string
    goalTitle: string,
    goalMonthlySaving: number,
    goalActualFee: number,
    goalTotalFee: number,
    goalPaused?: boolean,
    goalCompleted?: boolean
}

type ModalView = 'none' | 'edit' | 'confirmDelete' | 'celebrate'

export const SavingGoalItem = ({ goalImage, goalImageColor, goalTitle, goalMonthlySaving, goalActualFee, goalTotalFee, goalPaused = false, goalCompleted = false }: SavingGoalItemProps) => {
    const OnChangeFirebase = useContext(ChangeFirebaseContext)
    const uid = OnChangeFirebase.logedUserUID

    const [view, setView] = useState<ModalView>('none')
    const [name, setName] = useState(goalTitle)
    const [total, setTotal] = useState(String(goalTotalFee))
    const [monthly, setMonthly] = useState(String(goalMonthlySaving))
    const [depositAmount, setDepositAmount] = useState(String(goalMonthlySaving))
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    const progress = goalTotalFee > 0 ? Math.min(100, (100 * goalActualFee) / goalTotalFee) : 0

    const openEdit = () => {
        setName(goalTitle)
        setTotal(String(goalTotalFee))
        setMonthly(String(goalMonthlySaving))
        setDepositAmount(String(goalMonthlySaving))
        setError('')
        setView('edit')
    }

    const run = async (action: () => Promise<void>) => {
        setError('')
        setBusy(true)
        try {
            await action()
        } catch (err) {
            console.error(err)
            setError(getActionErrorMessage(err))
        } finally {
            setBusy(false)
        }
    }

    // HU34: guardar cambios de la meta
    const handleSaveChanges = () => run(async () => {
        await editSaving(uid, goalTitle, {
            savingName: name,
            savingTotalFee: Number(total),
            monthlySaving: Number(monthly)
        })
        showToast('Meta actualizada', 'success')
        setView('none')
        await OnChangeFirebase.fetchAndSetUserData()
    })

    // HU33: registrar un aporte (HU36 si la meta se cumple)
    const handleDeposit = () => run(async () => {
        const amount = Number(depositAmount)
        if (!amount || amount <= 0) {
            setError('Escribe un aporte mayor que 0.')
            return
        }
        const result = await depositToSaving(uid, goalTitle, amount)
        showRewardToasts(result.reward, `Aporte de $${amount} registrado`)
        setView(result.goalCompleted ? 'celebrate' : 'none')
        await OnChangeFirebase.fetchAndSetUserData()
    })

    // HU35: pausar / reanudar
    const handleTogglePause = () => run(async () => {
        const paused = await toggleSavingPause(uid, goalTitle)
        showToast(paused ? 'Meta pausada' : 'Meta reanudada', 'info')
        setView('none')
        await OnChangeFirebase.fetchAndSetUserData()
    })

    // HU35: eliminar
    const handleDelete = () => run(async () => {
        await deleteSavingGoal(uid, goalTitle)
        showToast('Meta eliminada', 'success')
        setView('none')
        await OnChangeFirebase.fetchAndSetUserData()
    })

    const statusLabel = goalCompleted ? '✅ Completed' : goalPaused ? '⏸ Paused' : null

    return <>
        {view === 'edit' && (
            <div className="capyModalBackdrop" onClick={(e) => { if (e.target === e.currentTarget && !busy) setView('none') }}>
                <div className="capyModal" role="dialog" aria-modal="true" aria-labelledby={`editSaving-${goalTitle}`}>
                    <h3 id={`editSaving-${goalTitle}`}>Edit saving</h3>
                    {error && <p className="capyModalError">{error}</p>}

                    {!goalCompleted && (
                        <>
                            <div className="capyModalField">
                                <label htmlFor="depositAmount">Add a deposit</label>
                                <input id="depositAmount" type="number" min="1" value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)} disabled={goalPaused} />
                            </div>
                            <div className="capyModalActions">
                                <button type="button" className="capyBtnPrimary" onClick={handleDeposit} disabled={busy || goalPaused}>
                                    {goalPaused ? 'Paused' : busy ? 'Saving...' : 'Add deposit'}
                                </button>
                            </div>
                        </>
                    )}

                    <div className="capyModalField">
                        <label htmlFor="savingName">Saving name</label>
                        <input id="savingName" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="capyModalField">
                        <label htmlFor="savingTotal">Total amount</label>
                        <input id="savingTotal" type="number" min="1" value={total} onChange={(e) => setTotal(e.target.value)} />
                    </div>
                    <div className="capyModalField">
                        <label htmlFor="savingMonthly">Monthly amount</label>
                        <input id="savingMonthly" type="number" min="1" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
                    </div>

                    <div className="capyModalActions">
                        <button type="button" className="capyBtnPrimary" onClick={handleSaveChanges} disabled={busy}>Save changes</button>
                    </div>
                    <div className="capyModalActions">
                        {!goalCompleted && (
                            <button type="button" className="capyBtnSecondary" onClick={handleTogglePause} disabled={busy}>
                                {goalPaused ? 'Resume' : 'Pause'}
                            </button>
                        )}
                        <button type="button" className="capyBtnDanger" onClick={() => { setError(''); setView('confirmDelete') }} disabled={busy}>Delete</button>
                        <button type="button" className="capyBtnSecondary" onClick={() => setView('none')} disabled={busy}>Close</button>
                    </div>
                </div>
            </div>
        )}

        {view === 'confirmDelete' && (
            <div className="capyModalBackdrop">
                <div className="capyModal" role="alertdialog" aria-modal="true">
                    <h3>Delete saving</h3>
                    {error && <p className="capyModalError">{error}</p>}
                    <p>¿Seguro que quieres eliminar la meta "{goalTitle}"? Se borrará su historial de aportes.</p>
                    <div className="capyModalActions">
                        <button type="button" className="capyBtnSecondary" onClick={() => setView('edit')} disabled={busy}>Cancel</button>
                        <button type="button" className="capyBtnDanger" onClick={handleDelete} disabled={busy}>{busy ? 'Deleting...' : 'Yes, delete'}</button>
                    </div>
                </div>
            </div>
        )}

        {view === 'celebrate' && (
            <div className="capyModalBackdrop" onClick={(e) => { if (e.target === e.currentTarget) setView('none') }}>
                <div className="capyModal" role="dialog" aria-modal="true" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '56px' }}>🎉</p>
                    <h3>¡Meta cumplida!</h3>
                    <p>Completaste tu meta "{goalTitle}". Ganaste Capypoints extra por lograrlo.</p>
                    <div className="capyModalActions">
                        <button type="button" className="capyBtnPrimary" onClick={() => setView('none')}>¡Genial!</button>
                    </div>
                </div>
            </div>
        )}

        <div className='savingGoalItemContainer' style={goalPaused ? { opacity: 0.7 } : undefined}>
            <div className='savingGoalHeader'>
                <div className='savingGoalTitle'>
                    <img src={goalImage} alt="" style={{ backgroundColor: goalImageColor }} />
                    <div className='savingGoalTitleText'>
                        <h4>{goalTitle} {statusLabel && <span style={{ fontSize: '13px', fontWeight: 600 }}>· {statusLabel}</span>}</h4>
                        <p>Savings per month: {goalMonthlySaving}</p>
                    </div>
                </div>

                <button onClick={openEdit}>Edit</button>
            </div>

            <div className='savingGoalGraphContainer'>
                <div className='savingGoalGraphLabels'>
                    <p>Actual: ${goalActualFee} cop</p>
                    <p>Goal: ${goalTotalFee} cop</p>
                </div>
                <Progress value={progress} className="w-[100%] h-[4vh]" style={{ border: '3px white solid' }}></Progress>
            </div>
        </div>
    </>
}
