'use client';

import { useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type EChartsReact from 'echarts-for-react';

const TABS = ['CPI', 'Core CPI', 'PPI', 'CMI', 'CCI', 'EXI', 'IMI'] as const;
type Tab = (typeof TABS)[number];

// ม.ค. 68 = Jan 2025 (BE 2568) → ธ.ค. 69 = Dec 2026 (BE 2569)
const MONTHS = [
  'ม.ค. 68', 'ก.พ. 68', 'มี.ค. 68', 'เม.ย. 68', 'พ.ค. 68', 'มิ.ย. 68',
  'ก.ค. 68', 'ส.ค. 68', 'ก.ย. 68', 'ต.ค. 68', 'พ.ย. 68', 'ธ.ค. 68',
  'ม.ค. 69', 'ก.พ. 69', 'มี.ค. 69', 'เม.ย. 69', 'พ.ค. 69',
  'มิ.ย. 69', 'ก.ค. 69', 'ส.ค. 69', 'ก.ย. 69', 'ต.ค. 69', 'พ.ย. 69', 'ธ.ค. 69',
];

type N = number | null;
type ChartData = {
  priceIndex: N[];
  yoy: N[];
  mom: N[];
  aoa: N[];
  latestMonth: string;
};

// Real data from fms.tpso.go.th/api/v2/moc-indexes/*
const CHART_DATA: Record<Tab, ChartData> = {
  CPI: {
    priceIndex: [101.08,101.25,101.12,101.28,101.47,101.43,101.4,101.51,101.46,101.5,101.64,101.62,101.69,101.82,101.7,102.12,102.4,null,null,null,null,null,null,null],
    yoy:        [0.83,0.99,0.86,0.98,1.09,1.06,0.84,0.81,0.65,0.61,0.66,0.59,0.6,0.56,0.57,0.83,0.92,null,null,null,null,null,null,null],
    mom:        [0.06,0.17,-0.13,0.16,0.19,-0.04,-0.03,0.11,-0.05,0.04,0.14,-0.02,0.07,0.13,-0.12,0.41,0.27,null,null,null,null,null,null,null],
    aoa:        [0.83,0.91,0.89,0.91,0.95,0.97,0.95,0.94,0.9,0.87,0.86,0.84,0.6,0.58,0.58,0.64,0.7,null,null,null,null,null,null,null],
    latestMonth: 'พฤษภาคม 2569',
  },
  'Core CPI': {
    priceIndex: [101.08,101.25,101.12,101.28,101.47,101.43,101.4,101.51,101.46,101.5,101.64,101.62,101.69,101.82,101.7,102.12,102.4,null,null,null,null,null,null,null],
    yoy:        [0.83,0.99,0.86,0.98,1.09,1.06,0.84,0.81,0.65,0.61,0.66,0.59,0.6,0.56,0.57,0.83,0.92,null,null,null,null,null,null,null],
    mom:        [0.06,0.17,-0.13,0.16,0.19,-0.04,-0.03,0.11,-0.05,0.04,0.14,-0.02,0.07,0.13,-0.12,0.41,0.27,null,null,null,null,null,null,null],
    aoa:        [0.83,0.91,0.89,0.91,0.95,0.97,0.95,0.94,0.9,0.87,0.86,0.84,0.6,0.58,0.58,0.64,0.7,null,null,null,null,null,null,null],
    latestMonth: 'พฤษภาคม 2569',
  },
  PPI: {
    priceIndex: [108.6,111.3,108,110.2,106.9,106.6,108.5,108.3,108.2,109.3,107,109,106.9,108.3,114.5,117.5,116,null,null,null,null,null,null,null],
    yoy:        [0.7,-0.3,-1.6,-3.2,-3.7,-4,-4.2,-3.5,-2.4,-1.4,-1.6,-1.8,-1.6,-0.5,6,9.1,8.5,null,null,null,null,null,null,null],
    mom:        [0.1,0.2,-0.6,-0.4,-0.7,-0.3,-0.5,-0.2,-0.1,1,0.1,-0.4,0.3,1.3,5.7,2.6,-1.3,null,null,null,null,null,null,null],
    aoa:        [0.7,0.2,-0.4,-1.1,-1.6,-2,-2.3,-2.5,-2.5,-2.4,-2.3,-2.3,-1.6,-1,1.3,3.2,4.3,null,null,null,null,null,null,null],
    latestMonth: 'พฤษภาคม 2569',
  },
  CMI: {
    priceIndex: [112.3,112.1,105.8,106.1,113.3,106.6,113.6,113.7,113.6,113.4,113,112.4,105.4,105.4,108.5,112.4,113.8,null,null,null,null,null,null,null],
    yoy:        [0.3,0.1,0.5,0.8,0.3,0.3,0.4,0.4,0.4,0.3,0.2,0,-0.1,0.3,2.6,5.9,7.2,null,null,null,null,null,null,null],
    mom:        [-0.1,-0.2,0.6,0.3,0.2,0.3,0,0.1,-0.1,-0.2,-0.4,-0.5,-0.1,0,2.9,3.6,1.2,null,null,null,null,null,null,null],
    aoa:        [0.3,0.2,0.3,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.1,0.2,0.9,2.2,3.2,null,null,null,null,null,null,null],
    latestMonth: 'พฤษภาคม 2569',
  },
  // CCI uses index_all as priceIndex; index_current/index_future as yoy/mom
  CCI: {
    priceIndex: [51.5,52,50.8,48.8,48.9,46.7,48.4,47.9,49.4,50.9,51.8,51.8,52.6,53,45.5,45,49.2,null,null,null,null,null,null,null],
    yoy:        [43.8,43.9,43.2,40.5,40.1,37.8,39.7,39.2,39.6,40.9,42.6,43.2,43.9,43.3,36.8,35,38.7,null,null,null,null,null,null,null],
    mom:        [56.7,57.4,55.9,54.4,54.8,52.6,54.2,53.7,56,57.6,58,57.6,58.4,59.4,51.2,51.7,56.3,null,null,null,null,null,null,null],
    aoa:        Array(24).fill(null),
    latestMonth: 'พฤษภาคม 2569',
  },
  EXI: {
    priceIndex: [110.9,110.9,111,110.9,111,111.3,111.2,111.1,111.4,111.7,111.8,112.3,112.9,113.3,114.4,114.8,null,null,null,null,null,null,null,null],
    yoy:        [1,0.8,0.6,0.3,0.4,0.7,0.5,0.4,0.5,0.6,1.1,1.4,1.8,2.2,3.1,3.5,null,null,null,null,null,null,null,null],
    mom:        [0.1,0,0.1,-0.1,0.1,0.3,-0.1,-0.1,0.3,0.3,0.1,0.4,0.5,0.4,1,0.3,null,null,null,null,null,null,null,null],
    aoa:        [1,0.9,0.8,0.6,0.5,0.6,0.5,0.5,0.6,0.5,0.6,0.7,1.8,2,2.3,2.7,null,null,null,null,null,null,null,null],
    latestMonth: 'เมษายน 2569',
  },
  IMI: {
    priceIndex: [114.4,114.7,114.3,114.2,114.1,115.4,115.7,115.8,116.4,116.6,116.8,117.3,119.2,120.3,126,128.1,null,null,null,null,null,null,null,null],
    yoy:        [3.6,4,2.8,1,1.4,2.4,2.3,2.7,3.7,3.1,3.8,3.9,4.2,4.9,10.2,12.2,null,null,null,null,null,null,null,null],
    mom:        [1.3,0.3,-0.3,-0.1,-0.1,1.1,0.3,0.1,0.5,0.2,0.2,0.4,1.6,0.9,4.7,1.7,null,null,null,null,null,null,null,null],
    aoa:        [3.6,3.8,3.5,2.8,2.5,2.5,2.5,2.5,2.7,2.7,2.8,2.9,4.2,4.5,6.4,7.9,null,null,null,null,null,null,null,null],
    latestMonth: 'เมษายน 2569',
  },
};

const TAB_TITLES: Record<Tab, string> = {
  CPI:        'ดัชนีราคาผู้บริโภค (CPI)',
  'Core CPI': 'ดัชนีราคาผู้บริโภคพื้นฐาน (Core CPI)',
  PPI:        'ดัชนีราคาผู้ผลิต (PPI)',
  CMI:        'ดัชนีราคาวัสดุก่อสร้าง (CMI)',
  CCI:        'ดัชนีความเชื่อมั่นผู้บริโภค (CCI)',
  EXI:        'ดัชนีราคาส่งออก (EXI)',
  IMI:        'ดัชนีราคานำเข้า (IMI)',
};

// CCI uses different legend labels
const CCI_LEGEND = { yoy: 'ปัจจุบัน', mom: 'อนาคต', aoa: '' };

/* ------------------------------------------------------------------ */
/* Chart option builder                                                  */
/* ------------------------------------------------------------------ */

function buildOption(tab: Tab, chartType: 'bar' | 'line') {
  const d = CHART_DATA[tab];
  const isCCI = tab === 'CCI';

  const validPI = d.priceIndex.filter((v): v is number => v !== null);
  const maxPI = validPI.length ? Math.max(...validPI) : 140;
  const yAxisMax = Math.ceil((maxPI * 1.08) / 10) * 10;

  const allSecondary = [...d.yoy, ...d.mom, ...d.aoa].filter((v): v is number => v !== null);
  const minSec = allSecondary.length ? Math.floor(Math.min(...allSecondary) / 5) * 5 : -15;
  const maxSec = allSecondary.length ? Math.ceil(Math.max(...allSecondary) / 5) * 5 : 15;

  return {
    grid: { top: 24, right: 56, bottom: 64, left: 72 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: MONTHS,
      boundaryGap: true,
      axisLine: { lineStyle: { color: '#e0e0e0' } },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#777' },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Price Index',
        nameLocation: 'end',
        nameTextStyle: { fontSize: 11, color: '#777' },
        min: 0,
        max: yAxisMax,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f0f0f0' } },
        axisLabel: { fontSize: 11, color: '#777' },
      },
      {
        type: 'value',
        min: minSec,
        max: maxSec,
        interval: 5,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { fontSize: 11, color: '#777' },
      },
    ],
    dataZoom: [{
      type: 'slider',
      bottom: 8,
      startValue: 6,
      endValue: 16,
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
        name: 'Price Index',
        type: chartType,
        data: d.priceIndex,
        yAxisIndex: 0,
        itemStyle: { color: '#1e3a5f' },
        ...(chartType === 'bar'
          ? { barMaxWidth: 48 }
          : { lineStyle: { color: '#1e3a5f', width: 2 }, symbol: 'circle', symbolSize: 6 }),
      },
      {
        name: isCCI ? CCI_LEGEND.yoy : 'YOY',
        type: 'line',
        data: d.yoy,
        yAxisIndex: isCCI ? 0 : 1,
        lineStyle: { color: '#5b9bd5', width: 2 },
        itemStyle: { color: '#5b9bd5' },
        symbol: 'circle',
        symbolSize: 6,
      },
      {
        name: isCCI ? CCI_LEGEND.mom : 'MOM',
        type: 'line',
        data: d.mom,
        yAxisIndex: isCCI ? 0 : 1,
        lineStyle: { color: '#70ad47', width: 2 },
        itemStyle: { color: '#70ad47' },
        symbol: 'circle',
        symbolSize: 6,
      },
      ...(isCCI ? [] : [{
        name: 'AOA',
        type: 'line' as const,
        data: d.aoa,
        yAxisIndex: 1,
        lineStyle: { color: '#ffc000', width: 2 },
        itemStyle: { color: '#ffc000' },
        symbol: 'circle',
        symbolSize: 6,
      }]),
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

function buildCSV(tab: Tab) {
  const d = CHART_DATA[tab];
  const isCCI = tab === 'CCI';
  const header = isCCI
    ? 'เดือน,Price Index,ปัจจุบัน,อนาคต'
    : 'เดือน,Price Index,YOY,MOM,AOA';
  const rows = MONTHS.map((m, i) =>
    isCCI
      ? [m, d.priceIndex[i] ?? '', d.yoy[i] ?? '', d.mom[i] ?? ''].join(',')
      : [m, d.priceIndex[i] ?? '', d.yoy[i] ?? '', d.mom[i] ?? '', d.aoa[i] ?? ''].join(',')
  );
  return '﻿' + [header, ...rows].join('\n');
}

/* ------------------------------------------------------------------ */
/* Component                                                             */
/* ------------------------------------------------------------------ */

export default function PriceIndexChart() {
  const [activeTab, setActiveTab] = useState<Tab>('CMI');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const chartRef = useRef<EChartsReact | null>(null);

  const isCCI = activeTab === 'CCI';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{TAB_TITLES[activeTab]}</h2>
        <p className="text-sm text-gray-400 mt-0.5">เดือน {CHART_DATA[activeTab].latestMonth}</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 pb-3 mb-4 border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[#1e3a5f] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Legend + chart type toggle */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <LegendItem color="#1e3a5f" label="Price Index" shape="bar" />
          <LegendItem color="#5b9bd5" label={isCCI ? 'ปัจจุบัน' : 'YOY'} shape="line" />
          <LegendItem color="#70ad47" label={isCCI ? 'อนาคต' : 'MOM'} shape="line" />
          {!isCCI && <LegendItem color="#ffc000" label="AOA" shape="line" />}
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
        option={buildOption(activeTab, chartType)}
        style={{ height: 360 }}
        notMerge
      />

      {/* Download */}
      <div className="flex items-center justify-end gap-2 mt-2 text-sm text-gray-500">
        <span>ดาวน์โหลด</span>
        <FileBtn
          label="CSV"
          bg="#21a366"
          onClick={() =>
            triggerDownload(
              URL.createObjectURL(new Blob([buildCSV(activeTab)], { type: 'text/csv;charset=utf-8;' })),
              `${activeTab}.csv`
            )
          }
        />
        <FileBtn
          label="XLS"
          bg="#21a366"
          onClick={() =>
            triggerDownload(
              URL.createObjectURL(new Blob([buildCSV(activeTab)], { type: 'application/vnd.ms-excel;charset=utf-8;' })),
              `${activeTab}.xls`
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
            if (url) triggerDownload(url, `${activeTab}.png`);
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                        */
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
