'use client';

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ComposedChart,
  Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { compactUSD, formatUSD } from '@/lib/format';

type Row = {
  month: number;
  total: number;
  cumulative: number;
  childcare: number;
  feeding: number;
  diapers: number;
  medical: number;
  gear: number;
  misc: number;
};

// Warm palette aligned with the rebrand. Each color is a distinct, accessible
// hue in the terracotta/honey/sienna family so the stack reads cleanly.
const COLORS = {
  childcare: '#c75f3e', // terracotta-500
  feeding:   '#e08515', // honey-500
  diapers:   '#efbb9d', // terracotta-200
  medical:   '#b6371a', // sienna-600
  gear:      '#6b563b', // ink-500 (warm coffee)
  misc:      '#fcdb7a', // honey-200
  cumulative:'#171008', // ink-900 (espresso)
};

const WARM_GRID = '#ede1cd';   // ink-100
const WARM_AXIS = '#917450';   // ink-400

export function MonthlyChart({ data }: { data: Row[] }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-ink-900">Month-by-month spending</h3>
        <p className="text-xs text-ink-500">Mid estimate · cumulative shown as line</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
            <CartesianGrid stroke={WARM_GRID} vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={(m) => `M${m}`}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke={WARM_AXIS}
            />
            <YAxis
              tickFormatter={(n) => compactUSD(n)}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke={WARM_AXIS}
            />
            <Tooltip
              cursor={{ fill: 'rgba(199,95,62,0.08)' }}
              contentStyle={{ borderRadius: 12, border: '1px solid #ead4b8', background: '#fffaf2', fontSize: 13 }}
              formatter={(v: number, name: string) => [formatUSD(v), labelFor(name)]}
              labelFormatter={(m) => `Month ${m}`}
            />
            <Bar dataKey="childcare" stackId="a" fill={COLORS.childcare} radius={[0,0,0,0]} />
            <Bar dataKey="feeding"   stackId="a" fill={COLORS.feeding} />
            <Bar dataKey="diapers"   stackId="a" fill={COLORS.diapers} />
            <Bar dataKey="gear"      stackId="a" fill={COLORS.gear} />
            <Bar dataKey="medical"   stackId="a" fill={COLORS.medical} />
            <Bar dataKey="misc"      stackId="a" fill={COLORS.misc} radius={[6,6,0,0]}/>
            <Line
              dataKey="cumulative"
              stroke={COLORS.cumulative}
              strokeWidth={2.2}
              dot={false}
              type="monotone"
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="square"
              formatter={(v) => labelFor(v)}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function labelFor(name: string) {
  switch (name) {
    case 'childcare': return 'Childcare';
    case 'feeding':   return 'Feeding';
    case 'diapers':   return 'Diapers & wipes';
    case 'medical':   return 'Medical';
    case 'gear':      return 'Gear & clothing';
    case 'misc':      return 'Misc.';
    case 'cumulative':return 'Cumulative';
    default: return name;
  }
}
