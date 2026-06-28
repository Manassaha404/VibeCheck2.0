"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] p-3 shadow-hard-sm">
        <p className="font-display text-headline-sm uppercase mb-1">{label}</p>
        <p className="font-body text-label-md font-bold">
          Signatures: <span className="text-[var(--color-ink-charcoal)]">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function GrowthChart({ data }: { data: { day: string; signatures: number }[] }) {
  const chartData = data.map((item) => ({
    ...item,
    fill: 'var(--color-leaf-green)',
  }));

  return (
    <section className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] p-6 md:p-8 shadow-hard h-96 flex flex-col">
      <h3 className="font-display text-headline-sm mb-6 uppercase border-b-2 border-[var(--color-ink-charcoal)] pb-2 inline-block self-start">
        7-Day Signature Surge
      </h3>
      <div className="flex-grow w-full h-full pt-4 font-body">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={{ stroke: 'var(--color-ink-charcoal)', strokeWidth: 2 }}
              tickLine={{ stroke: 'var(--color-ink-charcoal)', strokeWidth: 2 }}
              tick={{ fill: 'var(--color-ink-charcoal)', fontWeight: 'bold' }}
              dy={10}
            />
            <YAxis 
              axisLine={{ stroke: 'var(--color-ink-charcoal)', strokeWidth: 2 }}
              tickLine={{ stroke: 'var(--color-ink-charcoal)', strokeWidth: 2 }}
              tick={{ fill: 'var(--color-ink-charcoal)', fontWeight: 'bold' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(44,46,42,0.05)' }} />
            <Bar dataKey="signatures" stroke="var(--color-ink-charcoal)" strokeWidth={2}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
