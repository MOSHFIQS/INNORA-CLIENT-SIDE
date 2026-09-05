'use client';

import React, { useState } from 'react';

export interface ChartCardProps {
     title: string;
     subtitle?: string;
     children: React.ReactNode;
     action?: React.ReactNode;
     className?: string;
}

export function ChartCard({ title, subtitle, children, action, className = '' }: ChartCardProps) {
     return (
          <div className={`bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 p-5 shadow-xs flex flex-col justify-between ${className}`}>
               <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-800/80 mb-4">
                    <div>
                         <h4 className="text-sm font-bold font-serif uppercase tracking-wider text-gray-900 dark:text-white">
                              {title}
                         </h4>
                         {subtitle && (
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                                   {subtitle}
                              </p>
                         )}
                    </div>
                    {action && <div>{action}</div>}
               </div>
               <div className="flex-1 min-h-[220px] flex items-center justify-center">
                    {children}
               </div>
          </div>
     );
}

export interface AreaChartProps {
     data?: Array<{ revenue?: number; value?: number; month?: string; label?: string; [key: string]: any }>;
     height?: number;
}

export function AreaChart({ data = [], height = 220 }: AreaChartProps) {
     const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

     if (!data.length) {
          return <div className="text-xs text-gray-400 italic">No revenue trends data available</div>;
     }

     const values = data.map((d) => d.revenue || d.value || 0);
     const maxVal = Math.max(...values, 100);
     const minVal = 0;
     const range = maxVal - minVal || 1;

     const width = 600;
     const padding = { top: 20, right: 30, bottom: 40, left: 60 };
     const chartW = width - padding.left - padding.right;
     const chartH = height - padding.top - padding.bottom;

     const points = data.map((d, i) => {
          const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartW;
          const val = d.revenue || d.value || 0;
          const y = padding.top + chartH - ((val - minVal) / range) * chartH;
          return { x, y, ...d, val };
     });

     const pathD = points.reduce((acc, p, i) => {
          return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
     }, '');

     const areaD = points.length
          ? `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`
          : '';

     return (
          <div className="w-full relative select-none">
               <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                    <defs>
                         <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#b99d75" stopOpacity="0.45" />
                              <stop offset="100%" stopColor="#b99d75" stopOpacity="0.0" />
                         </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                         const y = padding.top + chartH * (1 - ratio);
                         const val = Math.round(minVal + ratio * range);
                         return (
                              <g key={idx} className="opacity-30">
                                   <line
                                        x1={padding.left}
                                        y1={y}
                                        x2={width - padding.right}
                                        y2={y}
                                        stroke="currentColor"
                                        strokeDasharray="4 4"
                                        className="text-gray-300 dark:text-gray-700"
                                   />
                                   <text
                                        x={padding.left - 10}
                                        y={y + 3}
                                        textAnchor="end"
                                        className="text-[10px] font-bold fill-gray-400"
                                   >
                                        ${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                                   </text>
                              </g>
                         );
                    })}

                    {/* Gradient Area */}
                    <path d={areaD} fill="url(#areaGradient)" />

                    {/* Stroke Line */}
                    <path d={pathD} fill="none" stroke="#b99d75" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Data Points */}
                    {points.map((p, i) => (
                         <g key={i}>
                              <circle
                                   cx={p.x}
                                   cy={p.y}
                                   r={hoveredIdx === i ? 6 : 4}
                                   className={`transition-all duration-200 cursor-pointer ${
                                        hoveredIdx === i
                                             ? 'fill-[#b99d75] stroke-white dark:stroke-black stroke-2'
                                             : 'fill-white dark:fill-gray-900 stroke-[#b99d75] stroke-2'
                                   }`}
                                   onMouseEnter={() => setHoveredIdx(i)}
                                   onMouseLeave={() => setHoveredIdx(null)}
                              />
                              {/* X Axis Label */}
                              <text
                                   x={p.x}
                                   y={padding.top + chartH + 20}
                                   textAnchor="middle"
                                   className="text-[11px] font-bold fill-gray-500 uppercase tracking-wider"
                              >
                                   {p.month || p.label || `M${i + 1}`}
                              </text>
                         </g>
                    ))}
               </svg>

               {/* Floating Tooltip */}
               {hoveredIdx !== null && points[hoveredIdx] && (
                    <div
                         className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white dark:bg-black px-3 py-1.5 rounded-none border border-[#b99d75]/50 text-xs shadow-xl pointer-events-none"
                    >
                         <span className="font-serif uppercase font-bold text-[#b99d75] mr-1.5">
                              {points[hoveredIdx].month || points[hoveredIdx].label}:
                         </span>
                         <span className="font-bold">${points[hoveredIdx].val.toLocaleString()}</span>
                    </div>
               )}
          </div>
     );
}

export interface DonutChartItem {
     label: string;
     value?: number;
     color?: string;
}

export interface DonutChartProps {
     data?: DonutChartItem[];
     size?: number;
     strokeWidth?: number;
}

export function DonutChart({ data = [], size = 200, strokeWidth = 24 }: DonutChartProps) {
     const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

     if (total === 0) {
          return <div className="text-xs text-gray-400 italic">No room status metrics available</div>;
     }

     const radius = (size - strokeWidth) / 2;
     const circumference = 2 * Math.PI * radius;
     let accumulatedRatio = 0;

     return (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
               <div className="relative" style={{ width: size, height: size }}>
                    <svg width={size} height={size} className="transform -rotate-90">
                         {data.map((item, index) => {
                              const ratio = (item.value || 0) / total;
                              const strokeDasharray = `${ratio * circumference} ${circumference}`;
                              const strokeDashoffset = -accumulatedRatio * circumference;
                              accumulatedRatio += ratio;

                              return (
                                   <circle
                                        key={index}
                                        cx={size / 2}
                                        cy={size / 2}
                                        r={radius}
                                        fill="transparent"
                                        stroke={item.color || '#b99d75'}
                                        strokeWidth={strokeWidth}
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={strokeDashoffset}
                                        className="transition-all duration-500 hover:opacity-80"
                                   />
                              );
                         })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                         <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                              {total}
                         </span>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                              Rooms
                         </span>
                    </div>
               </div>

               {/* Legend */}
               <div className="space-y-2 text-xs">
                    {data.map((item, index) => (
                         <div key={index} className="flex items-center justify-between gap-4 min-w-[140px]">
                              <div className="flex items-center gap-2">
                                   <span className="w-2.5 h-2.5 rounded-none" style={{ backgroundColor: item.color }} />
                                   <span className="text-gray-600 dark:text-gray-300 font-medium">{item.label}</span>
                              </div>
                              <span className="font-bold text-gray-900 dark:text-white">
                                   {item.value} <span className="text-gray-400 text-[10px]">({Math.round(((item.value || 0) / total) * 100)}%)</span>
                              </span>
                         </div>
                    ))}
               </div>
          </div>
     );
}

export interface RadialGaugeProps {
     value?: number;
     label?: string;
     size?: number;
     color?: string;
}

export function RadialGauge({ value = 0, label = 'Occupancy Rate', size = 180, color = '#b99d75' }: RadialGaugeProps) {
     const clamped = Math.min(Math.max(value, 0), 100);
     const strokeWidth = 16;
     const radius = (size - strokeWidth) / 2;
     const circumference = Math.PI * radius; // half circle gauge
     const strokeDashoffset = circumference - (clamped / 100) * circumference;

     return (
          <div className="flex flex-col items-center justify-center select-none">
               <div className="relative" style={{ width: size, height: size / 2 + 30 }}>
                    <svg width={size} height={size / 2 + 20} className="overflow-visible">
                         {/* Track background */}
                         <path
                              d={`M ${strokeWidth / 2},${size / 2} A ${radius},${radius} 0 0,1 ${size - strokeWidth / 2},${size / 2}`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={strokeWidth}
                              className="text-gray-200 dark:text-gray-800"
                              strokeLinecap="round"
                         />
                         {/* Progress bar */}
                         <path
                              d={`M ${strokeWidth / 2},${size / 2} A ${radius},${radius} 0 0,1 ${size - strokeWidth / 2},${size / 2}`}
                              fill="none"
                              stroke={color}
                              strokeWidth={strokeWidth}
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              className="transition-all duration-700 ease-out"
                         />
                    </svg>
                    <div className="absolute inset-0 top-6 flex flex-col items-center justify-center text-center">
                         <span className="text-3xl font-black text-gray-900 dark:text-white font-sans">
                              {clamped}%
                         </span>
                         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                              {label}
                         </span>
                    </div>
               </div>
          </div>
     );
}
