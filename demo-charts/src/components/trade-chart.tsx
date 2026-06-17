'use client';

import { useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type EChartsReact from 'echarts-for-react';

const YEARS = [
  '2543','2544','2545','2546','2547','2548','2549','2550',
  '2551','2552','2553','2554','2555','2556','2557','2558',
  '2559','2560','2561','2562','2563','2564','2565','2566',
  '2567','2568','2569',
];

// ล้านดอลลาร์สหรัฐ
const exportVal   = [69624.23,65183.23,68156.31,80039.98,96502.82,110937.66,129720.43,153864.96,177775.20,152426.53,193298.14,222579.16,229084.26,228498.54,227461.99,214309.58,215387.54,236634.68,252956.98,246268.80,231634.11,272006.08,287067.86,282919.46,300772.12,339356.14,127752.84];
const importVal   = [62180.38,61652.78,64240.35,75033.98,94034.48,118175.23,128772.33,139958.90,179223.26,133703.74,182927.12,228779.74,249114.72,250416.15,227748.59,202652.99,194198.03,221518.83,248201.03,236259.87,206156.38,266882.16,303190.67,291011.09,307758.26,346301.15,147250.72];
const balanceVal  = [7443.85,3530.45,3915.97,5006.01,2468.35,-7237.57,948.10,13906.07,-1448.06,18722.79,10371.02,-6200.58,-20030.46,-21917.61,-286.60,11656.59,21189.51,15115.85,4755.95,10008.93,25477.73,5123.93,-16122.81,-8091.63,-6986.14,-6945.02,-19497.88];

// อัตราการขยายตัว (%)
const growthTrade  = [0,-3.77,4.38,17.13,22.87,20.25,12.82,13.67,21.50,-19.85,31.49,19.97,5.95,0.15,-4.95,-8.40,-1.77,11.86,9.39,-3.72,-9.27,23.09,9.53,-2.77,6.03,12.67,-59.89];
const growthExport = [0,-6.38,4.56,17.44,20.57,14.96,16.93,18.61,15.54,-14.26,26.81,15.15,2.92,-0.26,-0.45,-5.78,0.50,9.86,6.90,-2.64,-5.94,17.43,5.54,-1.45,6.31,12.83,-62.35];
const growthImport = [0,-0.85,4.20,16.80,25.32,25.67,8.97,8.69,28.05,-25.40,36.82,25.07,8.89,0.52,-9.05,-11.02,-4.17,14.07,12.05,-4.81,-12.74,29.46,13.60,-4.02,5.75,12.52,-57.48];

/* ------------------------------------------------------------------ */
/* Chart option builder                                                  */
/* ------------------------------------------------------------------ */

function buildOption(chartType: 'bar' | 'line') {
  const maxVal = Math.max(...exportVal, ...importVal);
  const yLeftMax = Math.ceil((maxVal * 1.1) / 50000) * 50000;

  const allGrowth = [...growthTrade, ...growthExport, ...growthImport];
  const minG = Math.floor(Math.min(...allGrowth) / 10) * 10;
  const maxG = Math.ceil(Math.max(...allGrowth) / 10) * 10;

  const seriesBase = { symbol: 'circle', symbolSize: 5 };

  return {
    grid: { top: 24, right: 64, bottom: 64, left: 80 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: unknown[]) => {
        const ps = params as Array<{ seriesName: string; value: number; marker: string }>;
        let html = `<b>${YEARS[(ps[0] as { dataIndex: number }).dataIndex ?? 0] ?? ''}</b><br/>`;
        ps.forEach((p) => {
          const val = typeof p.value === 'number'
            ? p.value.toLocaleString('th-TH', { maximumFractionDigits: 2 })
            : '-';
          html += `${p.marker} ${p.seriesName}: ${val}<br/>`;
        });
        return html;
      },
    },
    xAxis: {
      type: 'category',
      data: YEARS,
      boundaryGap: true,
      axisLine: { lineStyle: { color: '#e0e0e0' } },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#777' },
    },
    yAxis: [
      {
        type: 'value',
        name: 'ล้านดอลลาร์สหรัฐ',
        nameLocation: 'end',
        nameTextStyle: { fontSize: 10, color: '#777' },
        min: 0,
        max: yLeftMax,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f0f0f0' } },
        axisLabel: {
          fontSize: 10,
          color: '#777',
          formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v),
        },
      },
      {
        type: 'value',
        name: '%',
        nameTextStyle: { fontSize: 10, color: '#777' },
        min: minG,
        max: maxG,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { fontSize: 10, color: '#777' },
      },
    ],
    dataZoom: [{
      type: 'slider',
      bottom: 8,
      startValue: 14,
      endValue: 26,
      height: 22,
      borderColor: '#ddd',
      backgroundColor: '#f5f5f5',
      fillerColor: 'rgba(30,58,95,0.12)',
      handleStyle: { color: '#1e3a5f' },
      textStyle: { color: '#999', fontSize: 10 },
      dataBackground: {
        lineStyle: { color: '#bbb', width: 1 },
        areaStyle: { color: '#e8e8e8' },
      },
    }],
    series: [
      {
        name: 'ส่งออก',
        type: chartType,
        data: exportVal,
        yAxisIndex: 0,
        itemStyle: { color: '#1e3a5f' },
        ...(chartType === 'bar'
          ? { barMaxWidth: 32 }
          : { ...seriesBase, lineStyle: { color: '#1e3a5f', width: 2 } }),
      },
      {
        name: 'นำเข้า',
        type: chartType,
        data: importVal,
        yAxisIndex: 0,
        itemStyle: { color: '#4e9ab0' },
        ...(chartType === 'bar'
          ? { barMaxWidth: 32 }
          : { ...seriesBase, lineStyle: { color: '#4e9ab0', width: 2 } }),
      },
      {
        name: '%การค้า',
        type: 'line',
        data: growthTrade,
        yAxisIndex: 1,
        lineStyle: { color: '#e67e22', width: 2 },
        itemStyle: { color: '#e67e22' },
        ...seriesBase,
      },
      {
        name: '%ส่งออก',
        type: 'line',
        data: growthExport,
        yAxisIndex: 1,
        lineStyle: { color: '#5b9bd5', width: 2 },
        itemStyle: { color: '#5b9bd5' },
        ...seriesBase,
      },
      {
        name: '%นำเข้า',
        type: 'line',
        data: growthImport,
        yAxisIndex: 1,
        lineStyle: { color: '#70ad47', width: 2 },
        itemStyle: { color: '#70ad47' },
        ...seriesBase,
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Download helpers                                                      */
/* ------------------------------------------------------------------ */

function triggerDownload(url: string, name: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildCSV() {
  const header = 'ปี,ส่งออก (ล้านดอลลาร์),นำเข้า (ล้านดอลลาร์),ดุลการค้า (ล้านดอลลาร์),%การค้า,%ส่งออก,%นำเข้า';
  const rows = YEARS.map((y, i) =>
    [y, exportVal[i], importVal[i], balanceVal[i], growthTrade[i], growthExport[i], growthImport[i]].join(',')
  );
  return '﻿' + [header, ...rows].join('\n');
}

/* ------------------------------------------------------------------ */
/* Component                                                             */
/* ------------------------------------------------------------------ */

export default function TradeChart() {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const chartRef = useRef<EChartsReact | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">สรุปข้อมูลการค้าปี 2569</h2>
        <p className="text-sm text-gray-400 mt-0.5">ล้านดอลลาร์สหรัฐ</p>
      </div>

      {/* Legend + toggle */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <LegendItem color="#1e3a5f" label="ส่งออก" shape="bar" />
          <LegendItem color="#4e9ab0" label="นำเข้า" shape="bar" />
          <LegendItem color="#e67e22" label="%การค้า" shape="line" />
          <LegendItem color="#5b9bd5" label="%ส่งออก" shape="line" />
          <LegendItem color="#70ad47" label="%นำเข้า" shape="line" />
        </div>
        <div className="flex items-center gap-1">
          <ToggleBtn active={chartType === 'line'} onClick={() => setChartType('line')} title="กราฟเส้น">
            <WaveIcon />
          </ToggleBtn>
          <ToggleBtn active={chartType === 'bar'} onClick={() => setChartType('bar')} title="กราฟแท่ง">
            <BarIcon />
          </ToggleBtn>
          <ToggleBtn
            onClick={() => chartRef.current?.getEchartsInstance().dispatchAction({ type: 'restore' })}
            title="รีเซ็ต"
          >
            <RefreshIcon />
          </ToggleBtn>
        </div>
      </div>

      {/* Chart */}
      <ReactECharts
        ref={chartRef}
        option={buildOption(chartType)}
        style={{ height: 380 }}
        notMerge
      />

      {/* Note for 2569 partial data */}
      <p className="text-xs text-gray-400 mt-1">
        * ข้อมูลปี 2569 เป็นตัวเลขเบื้องต้น (ม.ค.–พ.ค. 2569)
      </p>

      {/* Download */}
      <div className="flex items-center justify-end gap-2 mt-3 text-sm text-gray-500">
        <span>ดาวน์โหลด</span>
        <FileBtn
          label="CSV"
          bg="#21a366"
          onClick={() =>
            triggerDownload(
              URL.createObjectURL(new Blob([buildCSV()], { type: 'text/csv;charset=utf-8;' })),
              'trade-data.csv'
            )
          }
        />
        <FileBtn
          label="XLS"
          bg="#21a366"
          onClick={() =>
            triggerDownload(
              URL.createObjectURL(new Blob([buildCSV()], { type: 'application/vnd.ms-excel;charset=utf-8;' })),
              'trade-data.xls'
            )
          }
        />
        <FileBtn
          label="PNG"
          bg="#4472c4"
          onClick={() => {
            const url = chartRef.current
              ?.getEchartsInstance()
              .getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' });
            if (url) triggerDownload(url, 'trade-chart.png');
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components (shared style with PriceIndexChart)                   */
/* ------------------------------------------------------------------ */

function LegendItem({ color, label, shape }: { color: string; label: string; shape: 'bar' | 'line' }) {
  return (
    <div className="flex items-center gap-1.5">
      {shape === 'bar' ? (
        <span className="inline-block w-3 h-3 rounded-sm" style={{ background: color }} />
      ) : (
        <span className="inline-flex items-center gap-0.5">
          <span className="inline-block w-3 h-0.5 rounded" style={{ background: color }} />
          <span className="inline-block w-2 h-2 rounded-full border-2 bg-white" style={{ borderColor: color }} />
          <span className="inline-block w-3 h-0.5 rounded" style={{ background: color }} />
        </span>
      )}
      <span>{label}</span>
    </div>
  );
}

function ToggleBtn({
  children, active, onClick, title,
}: {
  children: React.ReactNode; active?: boolean; onClick: () => void; title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors text-gray-400 hover:text-gray-700 hover:bg-gray-100 ${
        active ? 'bg-gray-100 text-gray-700' : ''
      }`}
    >
      {children}
    </button>
  );
}

function FileBtn({ label, bg, onClick }: { label: string; bg: string; onClick: () => void }) {
  return (
    <button onClick={onClick} title={`Download ${label}`} className="hover:opacity-75 transition-opacity">
      <svg width="22" height="22" viewBox="0 0 22 22">
        <rect x="1" y="1" width="20" height="20" rx="3" fill={bg} />
        <text x="11" y="15" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
          {label}
        </text>
      </svg>
    </button>
  );
}

function WaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 11 Q4 4 8 8 Q12 12 15 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="9" width="3.5" height="6" rx="0.5" />
      <rect x="6.25" y="6" width="3.5" height="9" rx="0.5" />
      <rect x="11.5" y="3" width="3.5" height="12" rx="0.5" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5" />
      <path d="M13.5 2.5v3h-3" />
    </svg>
  );
}
