import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LucideIcon } from 'lucide-react';

// Custom 3D Cylinder Shape
const CylinderBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    const radius = width / 2;

    return (
        <g>
            <path
                d={`M${x},${y + radius} v${height - radius} a${radius},${radius * 0.5} 0 0 0 ${width},0 v-${height - radius} a${radius},${radius * 0.5} 0 0 1 -${width},0 z`}
                fill={fill}
                fillOpacity={0.8}
            />
            <ellipse
                cx={x + radius}
                cy={y + radius / 2}
                rx={radius}
                ry={radius * 0.5}
                fill={fill}
                fillOpacity={0.6}
            />
            <path
                d={`M${x},${y + radius} a${radius},${radius * 0.5} 0 0 1 ${width},0`}
                fill="none"
                stroke={fill}
                strokeWidth={1}
                strokeOpacity={0.3}
            />
        </g>
    );
};

interface ThreeDBarChartProps {
    title: string;
    icon?: LucideIcon;
    data: any[];
    xKey: string;
    yKey: string;
    color?: string;
    colors?: string[];
    height?: number;
    barSize?: number;
    className?: string;
}

export function ThreeDBarChart({
    title,
    icon: Icon,
    data,
    xKey,
    yKey,
    color = "#3b82f6",
    colors,
    height = 350,
    barSize = 40,
    className
}: ThreeDBarChartProps) {
    const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];
    const chartColors = colors || DEFAULT_COLORS;

    return (
        <Card className={`shadow-lg border-primary/20 bg-gradient-to-br from-card to-secondary/30 ${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-primary" />}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ height: height, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey={xKey} axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                            />
                            <Bar
                                dataKey={yKey}
                                shape={<CylinderBar />}
                                fill={color}
                                barSize={barSize}
                                animationBegin={0}
                                animationDuration={1500}
                                animationEasing="ease-out"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
