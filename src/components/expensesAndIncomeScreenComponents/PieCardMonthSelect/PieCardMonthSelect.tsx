import './PieCardMonthSelect.css'

interface PieCardMonthSelectProps {
    monthsArray: Array<string>,
    handleMonthSelectorChannge: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export const PieCardMonthSelect = ({ monthsArray, handleMonthSelectorChannge }: PieCardMonthSelectProps) => {
    return <>
        <select className="select-expenses-pie" name="" id="" onChange={handleMonthSelectorChannge}>
            <option value="Total">Total</option>
            {monthsArray.map((month) => {
                return <option value={month} key={month}>{month}</option>
            })}
        </select>
    </>
}
