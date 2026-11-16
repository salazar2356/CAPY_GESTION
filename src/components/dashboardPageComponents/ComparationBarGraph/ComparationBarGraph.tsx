
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

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
export const description = "A multiple bar chart"

const chartConfig = {
    desktop: {
        label: "Expenses",
        color: "#CCFC56",
    },
    mobile: {
        label: "Incomes",
        color: "#F2622E",
    },
} satisfies ChartConfig

export const ComparationBarGraph = () => {
    const incomes = useSelector((state: RootState) => state.incomes.realIncomes);
    const expenses = useSelector((state: RootState) => state.expenses.realExpenses);
    const chartData = Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - 6 + index);
        const sameDay = (value: string) => new Date(value).toDateString() === date.toDateString();
        return {
            Day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            desktop: expenses.filter(item => sameDay(item.expenseDate)).reduce((sum, item) => sum + item.expenseAmount, 0),
            mobile: incomes.filter(item => sameDay(item.incomeDate)).reduce((sum, item) => sum + item.incomeAmount, 0),
        };
    });
    return <>
        <Card style={{ backgroundColor: 'transparent', border: 'none', marginTop: '20px' }} className="w-[60%]">
            <CardContent >
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="Day"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} spacing={"2"}/>
                        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} spacing={"2"}/>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </>
}

