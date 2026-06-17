# DTN Website Redesign
**กรมเจรจาการค้าระหว่างประเทศ**
Target: https://www.dtn.go.th/

---

## Site References

| หน่วยงาน | URL |
|---|---|
| OECD | https://www.oecd.org/ |
| สำนักงานนโยบายและยุทธศาสตร์การค้า | https://tpso.go.th/home |
| Ministry of Trade and Industry (Singapore) | https://www.mti.gov.sg/ |
| USTR (US Trade Representative) | https://ustr.gov/ |
| กระทรวงพาณิชย์ | https://www.moc.go.th/th/page/item/index/id/1 |
| DTN - รายงานสินค้า | https://www.dtn.go.th/th/trading/product/report |
| EU Access to Markets | https://trade.ec.europa.eu/access-to-markets/en/home |
| EU Trade Agreements | https://trade.ec.europa.eu/access-to-markets/en/content/trade-agreements-3 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Styling | Tailwind CSS |
| Backend / API | .NET Core 10 |

> ไม่ใช้ MVC + Razor (.cshtml) อีกต่อไป — แยก frontend/backend ชัดเจน

---

## UI Libraries

### Carousel / Slider

| Library | ความเห็น |
|---|---|
| **Embla Carousel** | แนะนำ — headless, lightweight, Tailwind-friendly, tuning ง่าย (`embla-carousel-react`) |
| **Swiper** | v11+ กับ React ดีขึ้น แต่ยัง opinionated เรื่อง CSS, เหมาะถ้าต้องการ effect พิเศษ (3D, coverflow) |
| **Keen Slider** | เบากว่า Swiper, API ง่ายกว่า แต่ community เล็กกว่า Embla |

### Chart

| Library | ความเห็น |
|---|---|
| **ECharts** (`echarts-for-react`) | แนะนำ — committee อ้างอิง tpso.go.th, open-source, สวยกว่า amCharts — ดู prototype ที่ `demo-charts/` |
