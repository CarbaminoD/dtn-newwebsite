'use client';

import { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

type Row = {
  montH_NAME: string;
  totaL_APPLICANT: number;
  mvA_APPLICANT: number;
  percenT_CHANGE: number;
  mvA_PERCENT_CHANGE: number;
};

const DATA_2569: Row[] = [
  { montH_NAME: 'ม.ค. 69', totaL_APPLICANT: 9466,  mvA_APPLICANT: 15365.33, percenT_CHANGE: -42.27,  mvA_PERCENT_CHANGE: -20.41 },
  { montH_NAME: 'ก.พ. 69', totaL_APPLICANT: 8566,  mvA_APPLICANT: 11476,    percenT_CHANGE: -9.51,   mvA_PERCENT_CHANGE: -23.58 },
  { montH_NAME: 'มี.ค. 69', totaL_APPLICANT: 280,   mvA_APPLICANT: 6104,     percenT_CHANGE: -96.73,  mvA_PERCENT_CHANGE: -49.50 },
  { montH_NAME: 'เม.ย. 69', totaL_APPLICANT: 0,     mvA_APPLICANT: 2948.67,  percenT_CHANGE: -100,    mvA_PERCENT_CHANGE: -68.75 },
  { montH_NAME: 'พ.ค. 69', totaL_APPLICANT: 54,    mvA_APPLICANT: 111.33,   percenT_CHANGE: 0,       mvA_PERCENT_CHANGE: -65.58 },
  { montH_NAME: 'มิ.ย. 69', totaL_APPLICANT: 1,     mvA_APPLICANT: 18.33,    percenT_CHANGE: -98.15,  mvA_PERCENT_CHANGE: -66.05 },
];

const DATA_2568: Row[] = [
  { montH_NAME: 'ม.ค. 68',  totaL_APPLICANT: 9590,  mvA_APPLICANT: 7911.67,  percenT_CHANGE: 238.63,  mvA_PERCENT_CHANGE: 54.55  },
  { montH_NAME: 'ก.พ. 68',  totaL_APPLICANT: 19854, mvA_APPLICANT: 10758.67, percenT_CHANGE: 107.03,  mvA_PERCENT_CHANGE: 90.23  },
  { montH_NAME: 'มี.ค. 68', totaL_APPLICANT: 25422, mvA_APPLICANT: 18288.67, percenT_CHANGE: 28.04,   mvA_PERCENT_CHANGE: 124.57 },
  { montH_NAME: 'เม.ย. 68', totaL_APPLICANT: 22798, mvA_APPLICANT: 22691.33, percenT_CHANGE: -10.32,  mvA_PERCENT_CHANGE: 41.58  },
  { montH_NAME: 'พ.ค. 68',  totaL_APPLICANT: 19810, mvA_APPLICANT: 22676.67, percenT_CHANGE: -13.11,  mvA_PERCENT_CHANGE: 1.54   },
  { montH_NAME: 'มิ.ย. 68', totaL_APPLICANT: 24355, mvA_APPLICANT: 22321,    percenT_CHANGE: 22.94,   mvA_PERCENT_CHANGE: -0.16  },
  { montH_NAME: 'ก.ค. 68',  totaL_APPLICANT: 24286, mvA_APPLICANT: 22817,    percenT_CHANGE: -0.28,   mvA_PERCENT_CHANGE: 3.18   },
  { montH_NAME: 'ส.ค. 68',  totaL_APPLICANT: 23477, mvA_APPLICANT: 24039.33, percenT_CHANGE: -3.33,   mvA_PERCENT_CHANGE: 6.44   },
  { montH_NAME: 'ก.ย. 68',  totaL_APPLICANT: 22211, mvA_APPLICANT: 23324.67, percenT_CHANGE: -5.39,   mvA_PERCENT_CHANGE: -3.00  },
  { montH_NAME: 'ต.ค. 68',  totaL_APPLICANT: 20020, mvA_APPLICANT: 21902.67, percenT_CHANGE: -9.86,   mvA_PERCENT_CHANGE: -6.20  },
  { montH_NAME: 'พ.ย. 68',  totaL_APPLICANT: 20234, mvA_APPLICANT: 20821.67, percenT_CHANGE: 1.07,    mvA_PERCENT_CHANGE: -4.73  },
  { montH_NAME: 'ธ.ค. 68',  totaL_APPLICANT: 16396, mvA_APPLICANT: 18883.33, percenT_CHANGE: -18.97,  mvA_PERCENT_CHANGE: -9.25  },
];

const ALL_DATA: Record<number, Row[]> = {
  2569: DATA_2569,
  2568: DATA_2568,
};

const MONTH_NAMES = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
];

/* ------------------------------------------------------------------ */
/* Option builders                                                       */
/* ------------------------------------------------------------------ */

function buildCountOption(rows: Row[]) {
  const months = rows.map((r) => r.montH_NAME);
  const maxVal = Math.max(...rows.map((r) => Math.max(r.totaL_APPLICANT, r.mvA_APPLICANT)));
  const yMax = Math.ceil((maxVal * 1.15) / 5000) * 5000;

  return {
    grid: { top: 32, right: 24, bottom: 48, left: 72 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15,23,42,0.85)',
      borderColor: 'transparent',
      textStyle: { color: '#f1f5f9', fontSize: 12 },
      formatter: (params: { seriesName: string; value: number; marker: string }[]) => {
        let html = `<div style="font-weight:600;margin-bottom:4px">${months[params[0]?.dataIndex ?? 0]}</div>`;
        params.forEach((p) => {
          const val = p.value?.toLocaleString('th-TH', { maximumFractionDigits: 2 }) ?? '-';
          html += `<div>${p.marker} ${p.seriesName}: <b>${val}</b></div>`;
        });
        return html;
      },
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#64748b' },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: yMax,
      axisLabel: {
        fontSize: 11,
        color: '#64748b',
        formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v),
      },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: 'จำนวนผู้สมัครทั้งหมด',
        type: 'line',
        data: rows.map((r) => r.totaL_APPLICANT),
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: '#3b82f6', width: 2.5 },
        itemStyle: { color: '#3b82f6', borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59,130,246,0.18)' },
              { offset: 1, color: 'rgba(59,130,246,0)' },
            ],
          },
        },
      },
      {
        name: 'MVA (เฉลี่ย 3 เดือน)',
        type: 'line',
        data: rows.map((r) => r.mvA_APPLICANT),
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#f43f5e', width: 2.5, type: 'dashed' },
        itemStyle: { color: '#f43f5e', borderColor: '#fff', borderWidth: 2 },
      },
    ],
  };
}

function buildPctOption(rows: Row[]) {
  const months = rows.map((r) => r.montH_NAME);
  const allVals = [...rows.map((r) => r.percenT_CHANGE), ...rows.map((r) => r.mvA_PERCENT_CHANGE)];
  const minV = Math.floor(Math.min(...allVals) / 20) * 20;
  const maxV = Math.ceil(Math.max(...allVals) / 20) * 20;

  return {
    grid: { top: 32, right: 24, bottom: 48, left: 64 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15,23,42,0.85)',
      borderColor: 'transparent',
      textStyle: { color: '#f1f5f9', fontSize: 12 },
      formatter: (params: { seriesName: string; value: number; marker: string }[]) => {
        let html = `<div style="font-weight:600;margin-bottom:4px">${months[params[0]?.dataIndex ?? 0]}</div>`;
        params.forEach((p) => {
          const val = p.value != null ? `${p.value.toFixed(2)}%` : '-';
          html += `<div>${p.marker} ${p.seriesName}: <b>${val}</b></div>`;
        });
        return html;
      },
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#64748b' },
    },
    yAxis: {
      type: 'value',
      min: minV,
      max: maxV,
      axisLabel: { fontSize: 11, color: '#64748b', formatter: (v: number) => `${v}%` },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: 'ร้อยละการเปลี่ยนแปลง (%)',
        type: 'line',
        data: rows.map((r) => r.percenT_CHANGE),
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: '#10b981', width: 2.5 },
        itemStyle: { color: '#10b981', borderColor: '#fff', borderWidth: 2 },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: '#94a3b8', type: 'solid', width: 1 },
          data: [{ yAxis: 0 }],
          label: { show: false },
        },
      },
      {
        name: 'MVA (เฉลี่ย 3 เดือน)',
        type: 'line',
        data: rows.map((r) => r.mvA_PERCENT_CHANGE),
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#f97316', width: 2.5, type: 'dashed' },
        itemStyle: { color: '#f97316', borderColor: '#fff', borderWidth: 2 },
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Component                                                             */
/* ------------------------------------------------------------------ */

export default function MvaChart() {
  const years = Object.keys(ALL_DATA).map(Number).sort((a, b) => b - a);

  const [year, setYear]         = useState<number>(2569);
  const [fromMonth, setFrom]    = useState<number>(1);
  const [toMonth, setTo]        = useState<number>(ALL_DATA[2569].length);
  const [applied, setApplied]   = useState({ year: 2569, from: 1, to: ALL_DATA[2569].length });

  const maxMonth = ALL_DATA[year]?.length ?? 12;

  function handleYearChange(y: number) {
    const max = ALL_DATA[y]?.length ?? 12;
    setYear(y);
    setFrom(1);
    setTo(max);
  }

  function handleSearch() {
    setApplied({ year, from: fromMonth, to: toMonth });
  }

  const rows = useMemo(
    () => ALL_DATA[applied.year]?.slice(applied.from - 1, applied.to) ?? [],
    [applied],
  );

  const periodLabel = (() => {
    const data = ALL_DATA[applied.year];
    if (!data) return '';
    const from = MONTH_NAMES[(applied.from - 1)] + ' ' + applied.year;
    const to   = MONTH_NAMES[(applied.to - 1)]   + ' ' + applied.year;
    return from === to ? from : `${from} – ${to}`;
  })();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">MVA จำนวนผู้สมัครสอบ</h2>
        <p className="text-sm text-gray-400 mt-0.5">{periodLabel}</p>
      </div>

      {/* Search criteria */}
      <div className="px-6 py-4 bg-slate-50 border-b border-gray-100 flex flex-wrap items-end gap-4">
        {/* Year */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">ปี</label>
          <div className="flex gap-1.5">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => handleYearChange(y)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  year === y
                    ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#1e3a5f] hover:text-[#1e3a5f]'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* From month */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">เดือนเริ่มต้น</label>
          <select
            value={fromMonth}
            onChange={(e) => {
              const v = Number(e.target.value);
              setFrom(v);
              if (v > toMonth) setTo(v);
            }}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f]"
          >
            {Array.from({ length: maxMonth }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{MONTH_NAMES[m - 1]}</option>
            ))}
          </select>
        </div>

        {/* To month */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">เดือนสิ้นสุด</label>
          <select
            value={toMonth}
            onChange={(e) => setTo(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f]"
          >
            {Array.from({ length: maxMonth }, (_, i) => i + 1)
              .filter((m) => m >= fromMonth)
              .map((m) => (
                <option key={m} value={m}>{MONTH_NAMES[m - 1]}</option>
              ))}
          </select>
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="px-5 py-1.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#16304f] transition-colors"
        >
          ค้นหา
        </button>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        {/* Left: count chart */}
        <div className="p-4">
          <div className="bg-[#1e3a5f] rounded-lg px-4 py-2 mb-3 flex items-center gap-2">
            <span className="text-white text-sm font-medium">MVA จำนวนผู้สมัครสอบ</span>
            <span className="text-slate-300 text-xs">(คน)</span>
          </div>
          <Legend items={[
            { color: '#3b82f6', label: 'จำนวนผู้สมัครทั้งหมด', dashed: false },
            { color: '#f43f5e', label: 'MVA (เฉลี่ย 3 เดือน)', dashed: true },
          ]} />
          <ReactECharts option={buildCountOption(rows)} style={{ height: 300 }} notMerge />
        </div>

        {/* Right: pct chart */}
        <div className="p-4">
          <div className="bg-[#1e3a5f] rounded-lg px-4 py-2 mb-3 flex items-center gap-2">
            <span className="text-white text-sm font-medium">MVA อัตราการเปลี่ยนแปลงจำนวนผู้สมัครสอบ</span>
            <span className="text-slate-300 text-xs">(%)</span>
          </div>
          <Legend items={[
            { color: '#10b981', label: 'ร้อยละการเปลี่ยนแปลง (%)', dashed: false },
            { color: '#f97316', label: 'MVA (เฉลี่ย 3 เดือน)', dashed: true },
          ]} />
          <ReactECharts option={buildPctOption(rows)} style={{ height: 300 }} notMerge />
        </div>
      </div>
    </div>
  );
}

function Legend({ items }: { items: { color: string; label: string; dashed: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-1 px-1">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-0.5">
            <span className="inline-block w-4 h-0.5 rounded" style={{
              background: item.dashed
                ? `repeating-linear-gradient(90deg,${item.color} 0,${item.color} 4px,transparent 4px,transparent 7px)`
                : item.color,
            }} />
            <span className="inline-block w-2 h-2 rounded-full border-2 bg-white" style={{ borderColor: item.color }} />
            <span className="inline-block w-4 h-0.5 rounded" style={{
              background: item.dashed
                ? `repeating-linear-gradient(90deg,${item.color} 0,${item.color} 4px,transparent 4px,transparent 7px)`
                : item.color,
            }} />
          </span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
