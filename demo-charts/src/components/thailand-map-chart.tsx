'use client';

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

type ProvinceRow = {
  id: string;
  provincE_NAME_EN: string;
  provincE_NAME_TH: string;
  regioN_ID: number;
  regioN_NAME: string;
  total: number;
};

const RAW_DATA: ProvinceRow[] = [
  { id:'TH-10', provincE_NAME_EN:'Bangkok Metropolis',         provincE_NAME_TH:'กรุงเทพมหานคร',       regioN_ID:1,  regioN_NAME:'สำนักงาน คปภ. (สำนักงานใหญ่)', total:866 },
  { id:'TH-11', provincE_NAME_EN:'Samut Prakan',               provincE_NAME_TH:'สมุทรปราการ',          regioN_ID:7,  regioN_NAME:'ภาค 6 (ชลบุรี)',                total:173 },
  { id:'TH-12', provincE_NAME_EN:'Nonthaburi',                 provincE_NAME_TH:'นนทบุรี',              regioN_ID:8,  regioN_NAME:'ภาค 7 (นครปฐม)',               total:226 },
  { id:'TH-13', provincE_NAME_EN:'Pathum Thani',               provincE_NAME_TH:'ปทุมธานี',             regioN_ID:7,  regioN_NAME:'ภาค 6 (ชลบุรี)',                total:181 },
  { id:'TH-14', provincE_NAME_EN:'Phra Nakhon Si Ayutthaya',  provincE_NAME_TH:'พระนครศรีอยุธยา',     regioN_ID:8,  regioN_NAME:'ภาค 7 (นครปฐม)',               total:79  },
  { id:'TH-15', provincE_NAME_EN:'Ang Thong',                  provincE_NAME_TH:'อ่างทอง',              regioN_ID:3,  regioN_NAME:'ภาค 2 (นครสวรรค์)',            total:16  },
  { id:'TH-16', provincE_NAME_EN:'Lop Buri',                   provincE_NAME_TH:'ลพบุรี',               regioN_ID:5,  regioN_NAME:'ภาค 4 (นครราชสีมา)',           total:31  },
  { id:'TH-17', provincE_NAME_EN:'Sing Buri',                  provincE_NAME_TH:'สิงห์บุรี',            regioN_ID:3,  regioN_NAME:'ภาค 2 (นครสวรรค์)',            total:13  },
  { id:'TH-18', provincE_NAME_EN:'Chai Nat',                   provincE_NAME_TH:'ชัยนาท',               regioN_ID:3,  regioN_NAME:'ภาค 2 (นครสวรรค์)',            total:14  },
  { id:'TH-19', provincE_NAME_EN:'Saraburi',                   provincE_NAME_TH:'สระบุรี',              regioN_ID:5,  regioN_NAME:'ภาค 4 (นครราชสีมา)',           total:43  },
  { id:'TH-20', provincE_NAME_EN:'Chon Buri',                  provincE_NAME_TH:'ชลบุรี',               regioN_ID:7,  regioN_NAME:'ภาค 6 (ชลบุรี)',                total:183 },
  { id:'TH-21', provincE_NAME_EN:'Rayong',                     provincE_NAME_TH:'ระยอง',                regioN_ID:7,  regioN_NAME:'ภาค 6 (ชลบุรี)',                total:68  },
  { id:'TH-22', provincE_NAME_EN:'Chanthaburi',                provincE_NAME_TH:'จันทบุรี',             regioN_ID:7,  regioN_NAME:'ภาค 6 (ชลบุรี)',                total:39  },
  { id:'TH-23', provincE_NAME_EN:'Trat',                       provincE_NAME_TH:'ตราด',                 regioN_ID:7,  regioN_NAME:'ภาค 6 (ชลบุรี)',                total:5   },
  { id:'TH-24', provincE_NAME_EN:'Chachoengsao',               provincE_NAME_TH:'ฉะเชิงเทรา',          regioN_ID:7,  regioN_NAME:'ภาค 6 (ชลบุรี)',                total:32  },
  { id:'TH-25', provincE_NAME_EN:'Prachin Buri',               provincE_NAME_TH:'ปราจีนบุรี',          regioN_ID:0,  regioN_NAME:'-',                             total:23  },
  { id:'TH-26', provincE_NAME_EN:'Nakhon Nayok',               provincE_NAME_TH:'นครนายก',              regioN_ID:5,  regioN_NAME:'ภาค 4 (นครราชสีมา)',           total:11  },
  { id:'TH-27', provincE_NAME_EN:'Sa Kaeo',                    provincE_NAME_TH:'สระแก้ว',              regioN_ID:7,  regioN_NAME:'ภาค 6 (ชลบุรี)',                total:11  },
  { id:'TH-30', provincE_NAME_EN:'Nakhon Ratchasima',          provincE_NAME_TH:'นครราชสีมา',          regioN_ID:5,  regioN_NAME:'ภาค 4 (นครราชสีมา)',           total:134 },
  { id:'TH-31', provincE_NAME_EN:'Buri Ram',                   provincE_NAME_TH:'บุรีรัมย์',            regioN_ID:5,  regioN_NAME:'ภาค 4 (นครราชสีมา)',           total:53  },
  { id:'TH-32', provincE_NAME_EN:'Surin',                      provincE_NAME_TH:'สุรินทร์',             regioN_ID:6,  regioN_NAME:'ภาค 5 (อุบลราชธานี)',          total:32  },
  { id:'TH-33', provincE_NAME_EN:'Si Sa Ket',                  provincE_NAME_TH:'ศรีสะเกษ',             regioN_ID:6,  regioN_NAME:'ภาค 5 (อุบลราชธานี)',          total:59  },
  { id:'TH-34', provincE_NAME_EN:'Ubon Ratchathani',           provincE_NAME_TH:'อุบลราชธานี',         regioN_ID:6,  regioN_NAME:'ภาค 5 (อุบลราชธานี)',          total:75  },
  { id:'TH-35', provincE_NAME_EN:'Yasothon',                   provincE_NAME_TH:'ยโสธร',                regioN_ID:6,  regioN_NAME:'ภาค 5 (อุบลราชธานี)',          total:25  },
  { id:'TH-36', provincE_NAME_EN:'Chaiyaphum',                 provincE_NAME_TH:'ชัยภูมิ',             regioN_ID:4,  regioN_NAME:'ภาค 3 (ขอนแก่น)',              total:35  },
  { id:'TH-37', provincE_NAME_EN:'Amnat Charoen',              provincE_NAME_TH:'อำนาจเจริญ',          regioN_ID:6,  regioN_NAME:'ภาค 5 (อุบลราชธานี)',          total:6   },
  { id:'TH-38', provincE_NAME_EN:'Bueng Kan',                  provincE_NAME_TH:'บึงกาฬ',               regioN_ID:0,  regioN_NAME:'-',                             total:15  },
  { id:'TH-39', provincE_NAME_EN:'Nong Bua Lam Phu',           provincE_NAME_TH:'หนองบัวลำภู',         regioN_ID:0,  regioN_NAME:'-',                             total:24  },
  { id:'TH-40', provincE_NAME_EN:'Khon Kaen',                  provincE_NAME_TH:'ขอนแก่น',              regioN_ID:4,  regioN_NAME:'ภาค 3 (ขอนแก่น)',              total:82  },
  { id:'TH-41', provincE_NAME_EN:'Udon Thani',                 provincE_NAME_TH:'อุดรธานี',            regioN_ID:4,  regioN_NAME:'ภาค 3 (ขอนแก่น)',              total:72  },
  { id:'TH-42', provincE_NAME_EN:'Loei',                       provincE_NAME_TH:'เลย',                  regioN_ID:4,  regioN_NAME:'ภาค 3 (ขอนแก่น)',              total:19  },
  { id:'TH-43', provincE_NAME_EN:'Nong Khai',                  provincE_NAME_TH:'หนองคาย',              regioN_ID:4,  regioN_NAME:'ภาค 3 (ขอนแก่น)',              total:24  },
  { id:'TH-44', provincE_NAME_EN:'Maha Sarakham',              provincE_NAME_TH:'มหาสารคาม',           regioN_ID:0,  regioN_NAME:'-',                             total:41  },
  { id:'TH-45', provincE_NAME_EN:'Roi Et',                     provincE_NAME_TH:'ร้อยเอ็ด',             regioN_ID:6,  regioN_NAME:'ภาค 5 (อุบลราชธานี)',          total:48  },
  { id:'TH-46', provincE_NAME_EN:'Kalasin',                    provincE_NAME_TH:'กาฬสินธุ์',            regioN_ID:4,  regioN_NAME:'ภาค 3 (ขอนแก่น)',              total:37  },
  { id:'TH-47', provincE_NAME_EN:'Sakon Nakhon',               provincE_NAME_TH:'สกลนคร',               regioN_ID:4,  regioN_NAME:'ภาค 3 (ขอนแก่น)',              total:41  },
  { id:'TH-48', provincE_NAME_EN:'Nakhon Phanom',              provincE_NAME_TH:'นครพนม',               regioN_ID:0,  regioN_NAME:'-',                             total:27  },
  { id:'TH-49', provincE_NAME_EN:'Mukdahan',                   provincE_NAME_TH:'มุกดาหาร',             regioN_ID:6,  regioN_NAME:'ภาค 5 (อุบลราชธานี)',          total:15  },
  { id:'TH-50', provincE_NAME_EN:'Chiang Mai',                 provincE_NAME_TH:'เชียงใหม่',            regioN_ID:2,  regioN_NAME:'ภาค 1 (เชียงใหม่)',            total:116 },
  { id:'TH-51', provincE_NAME_EN:'Lamphun',                    provincE_NAME_TH:'ลำพูน',                regioN_ID:0,  regioN_NAME:'-',                             total:23  },
  { id:'TH-52', provincE_NAME_EN:'Lampang',                    provincE_NAME_TH:'ลำปาง',                regioN_ID:2,  regioN_NAME:'ภาค 1 (เชียงใหม่)',            total:47  },
  { id:'TH-53', provincE_NAME_EN:'Uttaradit',                  provincE_NAME_TH:'อุตรดิตถ์',           regioN_ID:2,  regioN_NAME:'ภาค 1 (เชียงใหม่)',            total:14  },
  { id:'TH-54', provincE_NAME_EN:'Phrae',                      provincE_NAME_TH:'แพร่',                 regioN_ID:2,  regioN_NAME:'ภาค 1 (เชียงใหม่)',            total:29  },
  { id:'TH-55', provincE_NAME_EN:'Nan',                        provincE_NAME_TH:'น่าน',                 regioN_ID:2,  regioN_NAME:'ภาค 1 (เชียงใหม่)',            total:21  },
  { id:'TH-56', provincE_NAME_EN:'Phayao',                     provincE_NAME_TH:'พะเยา',                regioN_ID:2,  regioN_NAME:'ภาค 1 (เชียงใหม่)',            total:44  },
  { id:'TH-57', provincE_NAME_EN:'Chiang Rai',                 provincE_NAME_TH:'เชียงราย',             regioN_ID:2,  regioN_NAME:'ภาค 1 (เชียงใหม่)',            total:71  },
  { id:'TH-58', provincE_NAME_EN:'Mae Hong Son',               provincE_NAME_TH:'แม่ฮ่องสอน',          regioN_ID:2,  regioN_NAME:'ภาค 1 (เชียงใหม่)',            total:6   },
  { id:'TH-60', provincE_NAME_EN:'Nakhon Sawan',               provincE_NAME_TH:'นครสวรรค์',           regioN_ID:3,  regioN_NAME:'ภาค 2 (นครสวรรค์)',            total:59  },
  { id:'TH-61', provincE_NAME_EN:'Uthai Thani',                provincE_NAME_TH:'อุทัยธานี',           regioN_ID:3,  regioN_NAME:'ภาค 2 (นครสวรรค์)',            total:16  },
  { id:'TH-62', provincE_NAME_EN:'Kamphaeng Phet',             provincE_NAME_TH:'กำแพงเพชร',           regioN_ID:3,  regioN_NAME:'ภาค 2 (นครสวรรค์)',            total:34  },
  { id:'TH-63', provincE_NAME_EN:'Tak',                        provincE_NAME_TH:'ตาก',                  regioN_ID:2,  regioN_NAME:'ภาค 1 (เชียงใหม่)',            total:23  },
  { id:'TH-64', provincE_NAME_EN:'Sukhothai',                  provincE_NAME_TH:'สุโขทัย',             regioN_ID:2,  regioN_NAME:'ภาค 1 (เชียงใหม่)',            total:29  },
  { id:'TH-65', provincE_NAME_EN:'Phitsanulok',                provincE_NAME_TH:'พิษณุโลก',            regioN_ID:3,  regioN_NAME:'ภาค 2 (นครสวรรค์)',            total:45  },
  { id:'TH-66', provincE_NAME_EN:'Phichit',                    provincE_NAME_TH:'พิจิตร',              regioN_ID:3,  regioN_NAME:'ภาค 2 (นครสวรรค์)',            total:27  },
  { id:'TH-67', provincE_NAME_EN:'Phetchabun',                 provincE_NAME_TH:'เพชรบูรณ์',           regioN_ID:3,  regioN_NAME:'ภาค 2 (นครสวรรค์)',            total:44  },
  { id:'TH-70', provincE_NAME_EN:'Ratchaburi',                 provincE_NAME_TH:'ราชบุรี',             regioN_ID:8,  regioN_NAME:'ภาค 7 (นครปฐม)',               total:37  },
  { id:'TH-71', provincE_NAME_EN:'Kanchanaburi',               provincE_NAME_TH:'กาญจนบุรี',           regioN_ID:8,  regioN_NAME:'ภาค 7 (นครปฐม)',               total:40  },
  { id:'TH-72', provincE_NAME_EN:'Suphan Buri',                provincE_NAME_TH:'สุพรรณบุรี',          regioN_ID:8,  regioN_NAME:'ภาค 7 (นครปฐม)',               total:42  },
  { id:'TH-73', provincE_NAME_EN:'Nakhon Pathom',              provincE_NAME_TH:'นครปฐม',               regioN_ID:8,  regioN_NAME:'ภาค 7 (นครปฐม)',               total:86  },
  { id:'TH-74', provincE_NAME_EN:'Samut Sakhon',               provincE_NAME_TH:'สมุทรสาคร',           regioN_ID:8,  regioN_NAME:'ภาค 7 (นครปฐม)',               total:41  },
  { id:'TH-75', provincE_NAME_EN:'Samut Songkhram',            provincE_NAME_TH:'สมุทรสงคราม',         regioN_ID:0,  regioN_NAME:'-',                             total:10  },
  { id:'TH-76', provincE_NAME_EN:'Phetchaburi',                provincE_NAME_TH:'เพชรบุรี',            regioN_ID:8,  regioN_NAME:'ภาค 7 (นครปฐม)',               total:17  },
  { id:'TH-77', provincE_NAME_EN:'Prachuap Khiri Khan',        provincE_NAME_TH:'ประจวบคีรีขันธ์',    regioN_ID:8,  regioN_NAME:'ภาค 7 (นครปฐม)',               total:20  },
  { id:'TH-80', provincE_NAME_EN:'Nakhon Si Thammarat',        provincE_NAME_TH:'นครศรีธรรมราช',       regioN_ID:10, regioN_NAME:'ภาค 9 (สงขลา)',                total:88  },
  { id:'TH-81', provincE_NAME_EN:'Krabi',                      provincE_NAME_TH:'กระบี่',               regioN_ID:9,  regioN_NAME:'ภาค 8 (สุราษฎร์ธานี)',         total:23  },
  { id:'TH-82', provincE_NAME_EN:'Phangnga',                   provincE_NAME_TH:'พังงา',                regioN_ID:9,  regioN_NAME:'ภาค 8 (สุราษฎร์ธานี)',         total:16  },
  { id:'TH-83', provincE_NAME_EN:'Phuket',                     provincE_NAME_TH:'ภูเก็ต',               regioN_ID:9,  regioN_NAME:'ภาค 8 (สุราษฎร์ธานี)',         total:64  },
  { id:'TH-84', provincE_NAME_EN:'Surat Thani',                provincE_NAME_TH:'สุราษฎร์ธานี',        regioN_ID:9,  regioN_NAME:'ภาค 8 (สุราษฎร์ธานี)',         total:63  },
  { id:'TH-85', provincE_NAME_EN:'Ranong',                     provincE_NAME_TH:'ระนอง',                regioN_ID:9,  regioN_NAME:'ภาค 8 (สุราษฎร์ธานี)',         total:3   },
  { id:'TH-86', provincE_NAME_EN:'Chumphon',                   provincE_NAME_TH:'ชุมพร',                regioN_ID:9,  regioN_NAME:'ภาค 8 (สุราษฎร์ธานี)',         total:23  },
  { id:'TH-90', provincE_NAME_EN:'Songkhla',                   provincE_NAME_TH:'สงขลา',                regioN_ID:10, regioN_NAME:'ภาค 9 (สงขลา)',                total:96  },
  { id:'TH-91', provincE_NAME_EN:'Satun',                      provincE_NAME_TH:'สตูล',                 regioN_ID:10, regioN_NAME:'ภาค 9 (สงขลา)',                total:11  },
  { id:'TH-92', provincE_NAME_EN:'Trang',                      provincE_NAME_TH:'ตรัง',                 regioN_ID:10, regioN_NAME:'ภาค 9 (สงขลา)',                total:34  },
  { id:'TH-93', provincE_NAME_EN:'Phatthalung',                provincE_NAME_TH:'พัทลุง',               regioN_ID:10, regioN_NAME:'ภาค 9 (สงขลา)',                total:30  },
  { id:'TH-94', provincE_NAME_EN:'Pattani',                    provincE_NAME_TH:'ปัตตานี',              regioN_ID:10, regioN_NAME:'ภาค 9 (สงขลา)',                total:6   },
  { id:'TH-95', provincE_NAME_EN:'Yala',                       provincE_NAME_TH:'ยะลา',                 regioN_ID:10, regioN_NAME:'ภาค 9 (สงขลา)',                total:7   },
  { id:'TH-96', provincE_NAME_EN:'Narathiwat',                 provincE_NAME_TH:'นราธิวาส',            regioN_ID:10, regioN_NAME:'ภาค 9 (สงขลา)',                total:16  },
];

const REGION_COLORS: Record<number, string> = {
  1:  '#e53935', // คปภ. กลาง        - red
  2:  '#fb8c00', // ภาค 1 เชียงใหม่  - orange
  3:  '#fdd835', // ภาค 2 นครสวรรค์  - yellow
  4:  '#e91e63', // ภาค 3 ขอนแก่น   - hot pink
  5:  '#6d4c41', // ภาค 4 นครราชสีมา - brown
  6:  '#8e24aa', // ภาค 5 อุบลราชธานี - purple
  7:  '#1e88e5', // ภาค 6 ชลบุรี     - blue
  8:  '#2e7d32', // ภาค 7 นครปฐม     - dark green
  9:  '#00897b', // ภาค 8 สุราษฎร์ธานี - teal
  10: '#00acc1', // ภาค 9 สงขลา      - cyan
  0:  '#b0bec5', // ไม่ระบุ           - gray
};

const REGIONS = [
  { id: 1,  name: 'สำนักงาน คปภ. (สำนักงานใหญ่)' },
  { id: 2,  name: 'ภาค 1 (เชียงใหม่)' },
  { id: 3,  name: 'ภาค 2 (นครสวรรค์)' },
  { id: 4,  name: 'ภาค 3 (ขอนแก่น)' },
  { id: 5,  name: 'ภาค 4 (นครราชสีมา)' },
  { id: 6,  name: 'ภาค 5 (อุบลราชธานี)' },
  { id: 7,  name: 'ภาค 6 (ชลบุรี)' },
  { id: 8,  name: 'ภาค 7 (นครปฐม)' },
  { id: 9,  name: 'ภาค 8 (สุราษฎร์ธานี)' },
  { id: 10, name: 'ภาค 9 (สงขลา)' },
];

const regionSummary = REGIONS.map((r) => {
  const provs = RAW_DATA.filter((p) => p.regioN_ID === r.id);
  const total = provs.reduce((s, p) => s + p.total, 0);
  return { ...r, total };
});
const grandTotal = RAW_DATA.reduce((s, p) => s + p.total, 0);

export default function ThailandMapChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState<ProvinceRow | null>(null);

  useEffect(() => {
    let chart: echarts.ECharts | null = null;

    fetch('/thailand.json')
      .then((r) => r.json())
      .then((geo) => {
        echarts.registerMap('Thailand', geo);
        setReady(true);

        if (!chartRef.current) return;
        chart = echarts.init(chartRef.current);

        const seriesData = RAW_DATA.map((p) => ({
          name: p.provincE_NAME_EN,
          value: p.regioN_ID,
          itemStyle: { areaColor: REGION_COLORS[p.regioN_ID] ?? REGION_COLORS[0] },
          provinceTH: p.provincE_NAME_TH,
          regionName: p.regioN_NAME,
          total: p.total,
          pct: ((p.total / grandTotal) * 100).toFixed(1),
        }));

        chart.setOption({
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15,23,42,0.9)',
            borderColor: 'transparent',
            textStyle: { color: '#f1f5f9', fontSize: 12 },
            formatter: (params: { data?: { provinceTH?: string; regionName?: string; total?: number; pct?: string } }) => {
              const d = params.data;
              if (!d?.provinceTH) return '';
              return `
                <div style="font-weight:600;margin-bottom:4px">${d.provinceTH} ${d.regionName ? `<span style="color:#94a3b8;font-size:11px;font-weight:400">${d.regionName}</span>` : ''}</div>
                <div style="margin-top:4px">จำนวน: <b>${(d.total ?? 0).toLocaleString()}</b> คน</div>
                <div>สัดส่วน: <b>${d.pct ?? '0.0'}%</b></div>
              `;
            },
          },
          series: [{
            type: 'map',
            map: 'Thailand',
            roam: true,
            scaleLimit: { min: 1, max: 6 },
            zoom: 1.1,
            aspectScale: 0.85,
            layoutCenter: ['45%', '50%'],
            layoutSize: '90%',
            itemStyle: { borderColor: '#fff', borderWidth: 2 },
            label: { show: false },
            emphasis: {
              label: { show: false },
              itemStyle: { borderColor: '#fff', borderWidth: 2.5, shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.35)', opacity: 0.85 },
            },
            select: { disabled: true },
            data: seriesData,
          }],
        });

        chart.on('mouseover', (params: { data?: { provinceTH: string; regionName: string; total: number; name: string } }) => {
          const row = RAW_DATA.find((p) => p.provincE_NAME_EN === params.data?.name);
          setHovered(row ?? null);
        });
        chart.on('mouseout', () => setHovered(null));

        const resize = () => chart?.resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
      });

    return () => { chart?.dispose(); };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">จำนวนผู้สมัครใช้งานระบบ IIQE</h2>
        <p className="text-sm text-gray-400 mt-0.5">1 มกราคม 2569 – 20 เมษายน 2569 · รวมทั้งสิ้น {grandTotal.toLocaleString()} คน</p>
      </div>

      <div className="flex">
        {/* Map */}
        <div className="flex-1 relative">
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">กำลังโหลดแผนที่...</div>
          )}
          <div ref={chartRef} style={{ height: 720 }} />
        </div>

        {/* Legend table */}
        <div className="w-80 border-l border-gray-100 flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-gray-100 grid grid-cols-3 text-xs font-semibold text-[#1e3a5f] uppercase tracking-wide">
            <span className="col-span-1">คปภาค</span>
            <span className="text-right">รวม (คน)</span>
            <span className="text-right">สัดส่วน (%)</span>
          </div>
          <div className="flex-1 overflow-auto divide-y divide-gray-50">
            {regionSummary.map((r) => (
              <div
                key={r.id}
                className="px-4 py-2.5 grid grid-cols-3 items-center text-sm hover:bg-slate-50 transition-colors"
              >
                <div className="col-span-1 flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: REGION_COLORS[r.id] }} />
                  <span className="text-gray-700 text-xs leading-tight">{r.name}</span>
                </div>
                <span className="text-right text-gray-800 font-medium">{r.total.toLocaleString()}</span>
                <span className="text-right text-gray-500">{((r.total / grandTotal) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          {hovered && (
            <div className="border-t border-gray-100 px-4 py-3 bg-slate-50 text-sm">
              <div className="font-semibold text-gray-800">{hovered.provincE_NAME_TH}</div>
              <div className="text-xs text-gray-500 mt-0.5">{hovered.regioN_NAME || '-'}</div>
              <div className="mt-1 text-gray-700">ผู้สมัคร: <span className="font-semibold text-[#1e3a5f]">{hovered.total.toLocaleString()}</span> คน</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
