# Floating Pier Configurator / ระบบกำหนดค่าท่าเทียบเรือลอยน้ำ

**บริษัท โฟลทิลลา เทคโนโลยี จำกัด (Flotilla Technology Co., Ltd.)**

Web app สำหรับเลือกรูปทรงและขนาดท่าเทียบเรือลอยน้ำ คำนวณจำนวนทุ่น ความสามารถรับน้ำหนัก ราวจับกันตก และสร้างใบเสนอราคาโดยประมาณ

A self-contained vanilla JS web app to size a floating pier (straight / L / T), estimate buoyancy capacity, configure railings, and generate a printable quote. Open `index.html` or serve statically.

---

## How to run / วิธีรัน

### Option A — เปิดไฟล์โดยตรง

เปิด `/workspace/floating-pier-configurator/index.html` ในเบราว์เซอร์

### Option B — HTTP server

```bash
cd /workspace/floating-pier-configurator && python3 -m http.server 8080
```

แล้วเปิด: <http://localhost:8080/>

ไม่ต้อง `npm install` — ไม่มี build step

---

## Shapes / รูปทรง

| ปุ่ม | Geometry (โมดูลทุ่น 1.2×1.2 ม.) |
|------|--------------------------------|
| **ตรง** | หนึ่งเซกชั่น `cols × rows` (`rows ≥ 1`) — สไลเดอร์/พรีเซ็ตเดิม + คลิกวางราวบน SVG |
| **รูปตัวแอล** | เซกชั่น A (แขนหลัก): `aCols × aRows` ที่ `[0..aCols)×[0..aRows)` ; เซกชั่น B (แขนตั้ง): `bCols` ยาวตาม +Y × `bRows` กว้าง ที่ `[0..bRows)×[aRows..aRows+bCols)` — **ต่อเกินมุม ไม่ซ้อน** → `topFloats = aCols·aRows + bCols·bRows` (ค่าเริ่มต้น A 6×2, B 4×2) |
| **รูปตัวที** | คาน `barCols × barRows` ที่ y=0..barRows−1 ; ก้าน `stemCols × stemRows` ต่อด้านล่างตรงกลาง `stemStart = ⌊(barCols−stemCols)/2⌋` → `topFloats = bar + stem` (ค่าเริ่มต้น คาน 8×2, ก้าน 2×4) |

ความกว้างทุกเซกชั่นสี่เหลี่ยม **อย่างน้อย 1 แถว** (`MIN_ROWS = 1`) — อนุญาตแถวเดียว

---

## Product specs / คุณลักษณะผลิตภัณฑ์

| Item | Spec |
|------|------|
| Float module | **1.20 m × 1.20 m × 0.30 m** |
| Layers | 1–3 (สูงชั้นละ 0.3 ม.) |
| Float price (default) | **18,000 THB**/ชุด |
| HDPE decking | **7,500 THB**/ชุด — 1 ชุดต่อ 1 ทุ่นชั้นบน |
| Railing | **4,500 THB**/ช่วง 1.2 ม. |
| Buoyancy (วว.) | **≥ 375 kg/m²** ต่อชั้น |

---

## Capacity & pricing

```
area_m2        = topFloats × 1.2 × 1.2
capacity_kg    = area_m2 × 375 × layers
capacity_per_m2 = 375 × layers
float_units    = topFloats × layers     → × floatPrice
HDPE           = topFloats              → × hdpePrice
rails          = total segments         → × railingPrice
```

Straight: `railSegs` = จำนวนช่วงที่เปิดบน SVG (คลิกได้)  
L/T: `railSegs` = ผลรวมจำนวนราวจับแต่ละเซกชั่น (สเต็ปเปอร์)

**Disclaimer:** ราคานี้ไม่รวมค่าขนส่งและค่าติดตั้ง

---


---

## Language / ภาษา

UI supports **ไทย (TH)** and **English (EN)** via the header language control.

- Preference stored in `localStorage` key `flotilla_lang` (`th` | `en`)
- Default: `th`
- Switching updates visible copy immediately and sets `<html lang>` + document title

## Files

```
floating-pier-configurator/
├── index.html
├── styles.css
├── app.js
└── README.md
```

---

## Customer flow

1. เลือกรูปทรง: ตรง / รูปตัวแอล / รูปตัวที  
2. ปรับขนาด (สไลเดอร์ หรือสเต็ปเปอร์ต่อเซกชั่น) + จำนวนชั้น  
3. ตรง: คลิกวางราวบนแผนผัง · แอล/ที: ปรับจำนวนช่วงราวต่อเซกชั่น  
4. ดูความสามารถรับน้ำหนัก + ใบเสนอราคา → พิมพ์ / ดาวน์โหลด  

## Print / Download quotation

Print quote (`btn-print`) and Download HTML (`btn-download`) use the **Flotilla formal quotation letterhead**:
embedded logo from `assets/flotilla-header.jpg` (base64 in `assets/header-b64.txt`), doc code `FTL-F-PSA-001-00`, BOQ table, terms, bank details, and signature blocks.
Accessory lines (Fenders / Anchor / Giant Rope เชือกยายักษ์) show **TBD** qty/price and are excluded from Sub Total / VAT / Grand Total.

---

© Flotilla Technology Co., Ltd. / บริษัท โฟลทิลลา เทคโนโลยี จำกัด
