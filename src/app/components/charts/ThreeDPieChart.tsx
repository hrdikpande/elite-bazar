import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ThreeDPieChartProps {
    title: string;
    icon?: LucideIcon;
    data: any[];
    dataKey: string;
    nameKey: string;
    colors?: string[];
    height?: number;
    className?: string;
}

export function ThreeDPieChart({
    title,
    icon: Icon,
    data,
    dataKey,
    nameKey,
    colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'],
    height = 350,
    className
}: ThreeDPieChartProps) {

    return (
        <Card className={`shadow-lg border-primary/20 bg-gradient-to-tr from-card to-secondary/30 ${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-primary" />}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ height: height, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey={dataKey}
                                nameKey={nameKey}
                                startAngle={90}
                                endAngle={-270}
                                animationDuration={1500}
                                animationBegin={200}
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[index % colors.length]}
                                        style={{ filter: 'drop-shadow(3px 5px 4px rgba(0,0,0,0.3))' }} // Depth Shadow
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
