import React, { useMemo } from 'react';
import Card from '../components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Sector } from 'recharts';
import type { Transaction } from '../types';
import { mockCategories } from '../constants';

interface ReportsPageProps {
  transactions: Transaction[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const COLORS = ['#D69E2E', '#63B3ED', '#A0AEC0', '#F6E05E', '#B794F4', '#F56565'];

const ReportsPage: React.FC<ReportsPageProps> = ({ transactions }) => {
  const monthlyData = useMemo(() => {
    const dataByMonth: { [key: string]: { month: string; Receitas: number; Despesas: number } } = {};

    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
      if (!dataByMonth[month]) {
        dataByMonth[month] = { month, Receitas: 0, Despesas: 0 };
      }
      if (t.type === 'credit') {
        dataByMonth[month].Receitas += t.amount;
      } else {
        dataByMonth[month].Despesas += t.amount;
      }
    });

    return Object.values(dataByMonth);
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const data: { [key: string]: number } = {};
    transactions.filter(t => t.type === 'debit').forEach(t => {
      const paymentMethod = t.paymentMethod;
      if (!data[paymentMethod]) {
        data[paymentMethod] = 0;
      }
      data[paymentMethod] += t.amount;
    });

    return Object.keys(data).map(name => ({ name, value: data[name] }));
  }, [transactions]);
  
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="dark:fill-white font-bold text-lg">{payload.name}</text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill}/>
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill}/>
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#EAEAEA" className="dark:fill-text-main-dark">{`${formatCurrency(value)}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#A0A0A0" className="dark:fill-text-secondary-dark">
          {`(Taxa ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  
  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };


  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Relatórios</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Receitas vs. Despesas</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-border-dark" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis tickFormatter={(value) => formatCurrency(value as number)} className="text-xs" />
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)} 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #2C2C2C', borderRadius: '0.5rem' }} 
                  labelStyle={{ color: '#A0A0A0' }}
                  itemStyle={{ color: '#EAEAEA' }}
                 />
                <Legend />
                <Bar dataKey="Receitas" fill="#2ECC71" />
                <Bar dataKey="Despesas" fill="#e53e3e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Distribuição de Despesas</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={expenseByCategory} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60}
                  outerRadius={80} 
                  fill="#D69E2E"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
