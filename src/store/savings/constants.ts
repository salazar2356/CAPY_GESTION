import { savingSliceType } from './types'

export const SAVINGS_SLICE_NAME = "savings"

// Empieza vacío: los ahorros reales se cargan desde Firestore
export const DEFAULT_STATE_SAVINGS: savingSliceType = {
    savingsData: []
}
