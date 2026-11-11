// HU27: evolución de ingresos y gastos en el tiempo (con los datos reales de Firestore)
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useSelector } from "react-redux"
import { RootState } from "../../../store/store"

import {
    Card,
    CardContent,
} from '../../ui/card'

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '../../ui/chart'

export type ComparationPeriod = 'daily' | 'weekly' | 'monthly'

const chartConfig = {
    expenses: {
        label: "Expenses",
        color: "#CCFC56",
    },
    incomes: {
        label: "Incomes",
        color: "#F2622E",
    },
} satisfies ChartConfig

interface Bucket {
    label: string,
    start: Date,
    end: Date
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

// Los últimos 7 días, las últimas 8 semanas o los últimos 6 meses
const buildBuckets = (period: ComparationPeriod): Array<Bucket> => {
    const today = startOfDay(new Date())
    const buckets: Array<Bucket> = []

    if (period === 'daily') {
        for (let i = 6; i >= 0; i--) {
            const start = new Date(today)
            start.setDate(today.getDate() - i)
            const end = new Date(start)
            end.setDate(start.getDate() + 1)
            buckets.push({ label: start.toLocaleDateString('en-US', { weekday: 'short' }), start, end })
        }
    } else if (period === 'weekly') {
        for (let i = 7; i >= 0; i--) {
            const end = new Date(today)
            end.setDate(today.getDate() + 1 - i * 7)
            const start = new Date(end)
            start.setDate(end.getDate() - 7)
            buckets.push({ label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), start, end })
        }
    } else {
        for (let i = 5; i >= 0; i--) {
            const start = new Date(today.getFullYear(), today.getMonth() - i, 1)
            const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 1)
            buckets.push({ label: start.toLocaleDateString('en-US', { month: 'short' }), start, end })
        }
    }
    return buckets
}

export const ComparationBarGraph = ({ period = 'daily' }: { period?: ComparationPeriod }) => {
    const incomes = useSelector((state: RootState) => state.incomes.realIncomes)
    const expenses = useSelector((state: RootState) => state.expenses.realExpenses)

    const chartData = buildBuckets(period).map((bucket) => {
        const inBucket = (iso: string) => {
            const d = new Date(iso)
            return d >= bucket.start && d < bucket.end
        }
        return {
            label: bucket.label,
            expenses: expenses.filter((e) => inBucket(e.expenseDate)).reduce((acc, e) => acc + e.expenseAmount, 0),
            incomes: incomes.filter((i) => inBucket(i.incomeDate)).reduce((acc, i) => acc + i.incomeAmount, 0),
        }
    })

    const hasData = chartData.some((d) => d.expenses > 0 || d.incomes > 0)

    return <>
        <Card style={{ backgroundColor: 'transparent', border: 'none', marginTop: '20px' }} className="w-[60%]">
            <CardContent >
                {!hasData && (
                    <p style={{ color: '#F9F9F9', fontFamily: '"Space Grotesk"', fontSize: '14px', textAlign: 'center', margin: '0 0 8px 0' }}>
                        No movements in this period yet.
                    </p>
                )}
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                        <Bar dataKey="incomes" fill="var(--color-incomes)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </>
}
