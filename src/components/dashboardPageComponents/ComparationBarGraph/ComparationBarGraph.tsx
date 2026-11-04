
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

const chartData = [
    { Day: "Sat", desktop: 186, mobile: 80 },
    { Day: "Sun", desktop: 305, mobile: 200 },
    { Day: "Mon", desktop: 237, mobile: 120 },
    { Day: "Tue", desktop: 73, mobile: 190 },
    { Day: "Wed", desktop: 209, mobile: 130 },
    { Day: "Thu", desktop: 214, mobile: 140 },
    { Day: "Fri", desktop: 214, mobile: 140 }
]
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

