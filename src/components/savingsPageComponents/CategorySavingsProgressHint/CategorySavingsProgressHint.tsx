import './CategorySavingsProgressHint.css'

interface CategorySavingsProgressHintProps {
    hintBubbleColor: string,
    hintName: string,
    hintPercentage: number
}

export const CategorySavingsProgressHint = ({ hintBubbleColor, hintName, hintPercentage }: CategorySavingsProgressHintProps) => {

    return <>
        <div className='hint'>
            <div className='color' style={{ backgroundColor: hintBubbleColor }}></div>
            <p>{hintName}</p>
            <p>{hintPercentage.toFixed(2)}%</p>
        </div>
    </>
}