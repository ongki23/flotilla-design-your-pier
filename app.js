/**
 * Floating Pier Configurator — Flotilla
 * Shapes: straight (I), L, T — vanilla JS, Thai/English i18n
 * All shapes: click-to-toggle rail segments on SVG plan
 * L/T: per-section float steppers; rails via diagram clicks
 */
(function () {
  "use strict";

  var MODULE = 1.2; // meters per float edge
  var CAPACITY_PER_M2 = 375; // kg/m² (TISTR / วว.)
  var LAYER_HEIGHT = 0.3;
  var MIN_ROWS = 1;
  var MAX_MODULE = 30;

  var DEFAULTS = {
    floatPrice: 18000,
    hdpePrice: 7500,
    railingPrice: 4500,
    fenderPrice: 1900, // กันชน / เฟนเดอร์
    cleatPrice: 1250, // คลีตสแตนเลส
    lightPrice: 4500, // เสาไฟโซลาร์เซลล์ — single hook for unit price
    mooringPrice: 7500, // ระบบสมอยึดโยง — THB per set
  };

  var HEADER_LOGO_DATA = "data:image/jpeg;base64,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";

  // ---- i18n ----
  var LANG = {
    th: {
      "docTitle": "ออกแบบท่าเทียบเรือลอยน้ำของคุณ | โฟลทิลลา",
      "metaDescription": "ระบบกำหนดค่าท่าเทียบเรือลอยน้ำ — โฟลทิลลา เทคโนโลยี",
      "header.title": "ออกแบบท่าเทียบเรือลอยน้ำของคุณ",
      "header.subtitle": "โฟลทิลลา เทคโนโลยี · ทุ่น 1.20×1.20×0.30 ม.",
      "shape.heading": "เลือกรูปทรงท่าเทียบเรือ",
      "shape.aria": "รูปทรง",
      "shape.straight.title": "รูปตัวไอ",
      "shape.straight.sub": "รูปตัวไอ (I)",
      "shape.L.title": "รูปตัวแอล",
      "shape.L.sub": "สองแขนเชื่อมมุม",
      "shape.T.title": "รูปตัวที",
      "shape.T.sub": "เซกชัน A + B",
      "shape.U.title": "รูปตัวยู",
      "shape.U.sub": "เซกชัน A + B + C",
      "shapeLabel.U": "รูปตัวยู",
      "size.title.U": "เซกชัน A / B / C · รูปตัวยูเท่านั้น",
      "size.U.hint": "เฉพาะรูปตัวยู — เซกชัน A (แขนซ้าย) B (คานล่าง) C (แขนขวา) · วางราวจับจากแผนผังมุมสูง",
      "size.U.secA": "เซกชัน A · แขนซ้าย",
      "size.U.secB": "เซกชัน B · คานล่าง",
      "size.U.secC": "เซกชัน C · แขนขวา",
      "size.U.armLen": "ความยาวแขน (ทุ่น)",
      "size.detailU": "A {0}×{1} + B {2}×{3} + C {4}×{5} = {6} ทุ่น",
      "gangway.secLabelU": "เลือกเซกชันของรูปตัวยู (A / B / C)",
      "gangway.secC": "เซกชัน C",
      "shapeLabel.straight": "รูปตัวไอ",
      "shapeLabel.L": "รูปตัวแอล",
      "shapeLabel.T": "รูปตัวที",
      "size.title.straight": "ขนาดเซกชันหลัก · รูปตัวไอ",
      "size.title.L": "เซกชัน A / B · รูปตัวแอลเท่านั้น",
      "size.title.T": "เซกชัน A / B · รูปตัวทีเท่านั้น",
      "size.straight.section": "เซกชันหลัก",
            "size.straight.hint2": "ทุ่นแต่ละลูกเป็นสี่เหลี่ยมจัตุรัส <strong>1.2×1.2 ม.</strong> ขนาดจริง = (จำนวนตามยาว)×1.2 × (จำนวนแถว)×1.2 เช่น 6×2 ทุ่น = <strong>7.2×2.4 ม.</strong>",
      "size.presetsAria": "ขนาดยอดนิยม",
      "size.lengthM": "ความยาว (ม.)",
      "size.widthM": "ความกว้าง (ม.)",
      "size.lengthFloats": "ความยาว (ทุ่น)",
      "size.widthFloats": "ความกว้าง (ทุ่น)",
      "size.railCount": "จำนวนราวจับ (ช่วง 1.2 ม.)",
      "size.L.hint": "เฉพาะรูปตัวแอล — เซกชัน A และ B ของรูปนี้เท่านั้น",
      "size.L.secA": "เซกชัน A · รูปตัวแอล",
      "size.L.secB": "เซกชัน B · รูปตัวแอล",
      "size.T.hint": "เฉพาะรูปตัวที — เซกชัน A และ B ของรูปนี้เท่านั้น",
      "size.T.secA": "เซกชัน A · รูปตัวที",
      "size.T.secB": "เซกชัน B · รูปตัวที",
      "size.T.stemWidth": "ความกว้างตามเซกชัน A (ทุ่น)",
      "size.T.stemLen": "ความยาวเซกชัน B (ทุ่น)",
      "size.actual": "ขนาดจริง: {0} ม. × {1} ม. ({2}×{3} ทุ่น)",
      "size.requested": "ขนาดที่ขอ: {0} ม. × {1} ม. → ปัดขึ้นเป็นพหุคูณของ 1.20 ม.",
      "size.topFloatsBox": "ทุ่นชั้นบน {0} ลูก · กรอบ {1}×{2} ม.",
      "size.detailL": "A {0}×{1} + B {2}×{3} (ต่อเกินมุม ไม่ซ้อน) = {4} ทุ่น",
      "size.detailT": "A {0}×{1} + B {2}×{3} (เริ่มคอลัมน์ {4}) = {5} ทุ่น",
      "layers.heading": "จำนวนชั้นทุ่น",
      "layers.hint": "ชั้นละ <strong>0.3 ม.</strong> สูง — ซ้อนชั้นเพิ่มแรงพยุงและจำนวนทุ่นในใบเสนอราคา",
      "layers.aria": "จำนวนชั้นทุ่น",
      "layers.1": "ทุ่นหนึ่งชั้น<br /><small>สูง 0.3 ม.</small>",
      "layers.2": "ทุ่นสองชั้น<br /><small>สูง 0.6 ม.</small>",
      "layers.3": "ทุ่นสามชั้น<br /><small>สูง 0.9 ม.</small>",
      "layers.hintDyn": "เลือก {0} ชั้น · ความสูงโครงสร้างทุ่น {1} ม. · รับน้ำหนัก {2} กก./ตร.ม.",
      "diagram.heading": "แผนผังมุมสูง",
      "diagram.prompt": "กรุณาเลือกตำแหน่งราวจับของคุณ",
      "diagram.clickHint": "คลิกเพื่อเลือกตำแหน่งราวจับของคุณได้",
      "stats.floats": "ทุ่นลอยน้ำ",
      "stats.size": "ขนาดจริง",
      "stats.rails": "ราว (ชุด)",
      "legend.float": "ทุ่น 1.20×1.20 ม.",



      "legend.rail": "ราวจับกันตก",
      "legend.fender": "กันชน / เฟนเดอร์",
      "legend.cleat": "คลีตสแตนเลส",
      "legend.light": "เสาไฟโซลาร์เซลล์",
      "accessory.heading": "แผนผังมุมสูง · กันชน คลีต และเสาไฟโซลาร์เซลล์",
      "accessory.fenderPrompt": "กรุณาเลือกตำแหน่งกันชน",
      "accessory.cleatPrompt": "กรุณาเลือกตำแหน่งคลีต (สแตนเลส)",
      "accessory.lightPrompt": "ตัวเสาไฟกับคลีตจะติดตั้งด้านมุมของตัวทุ่น",
      "accessory.clickHint": "เลือกโหมดด้านล่าง แล้วคลิกขอบนอกเพื่อวางกันชน หรือคลิกทุ่นเพื่อวางคลีต/เสาไฟโซลาร์เซลล์ — คลิกอีกครั้งเพื่อเอาออก",
      "accessory.modeAria": "โหมดวางอุปกรณ์",
      "accessory.modeFender": "กันชน / เฟนเดอร์",
      "accessory.modeCleat": "คลีต",
      "accessory.modeLight": "เสาไฟโซลาร์เซลล์",
      "accessory.helpersAria": "ทางลัดกันชน คลีต และเสาไฟโซลาร์เซลล์",
      "accessory.clearFenders": "ล้างกันชน",
      "accessory.clearCleats": "ล้างคลีต",
      "accessory.clearLights": "ล้างเสาไฟโซลาร์เซลล์",
      "stats.fenders": "กันชน (ชุด)",
      "stats.cleats": "คลีต (ชุด)",
      "stats.lights": "เสาไฟโซลาร์เซลล์",
      "quote.fenderItem": "เฟนเดอร์ / กันชน",
      "quote.cleatItem": "คลีตสแตนเลส",
      "quote.lightItem": "เสาไฟโซลาร์เซลล์",
      "cap.label": "ความสามารถรับน้ำหนักโดยประมาณ",
      "cap.total": "รวม",
      "cap.perM2": "{0} กก./ตร.ม.  ({1} ÷ {2} ตร.ม. · {3} ชั้น)",
      "cap.assumption": "สูตรรวม: <code>capacity_kg = พื้นที่(ตร.ม.) × 375 × จำนวนชั้น</code><br />ต่อตร.ม.: <code>capacity_kg_per_m2 = 375 × จำนวนชั้น</code> (= รวม ÷ พื้นที่)<br />อ้างอิงค่าแรงพยุงตัวไม่น้อยกว่า 375 กก./ตร.ม. ต่อชั้น ตามคุณลักษณะผลิตภัณฑ์ (วว.) — ยังไม่หักน้ำหนักโครงสร้าง/พื้น",
      "rail.heading": "ราวจับกันตก",
      "rail.help1": "ใช้แผนผังมุมสูงด้านบน — กดที่เส้นเพื่อวาง/เอาออกราวจับทีละช่วง (วางระหว่างทุ่นได้)",
      "rail.help2": "แต่ละช่วง = 1.2 ม. ตามขอบหนึ่งด้านของทุ่นหนึ่งลูก — รวมขอบนอกและเส้นระหว่างทุ่น",
      "rail.helpersAria": "ทางลัดราวจับ",
      "rail.allPerimeter": "ขอบนอกทั้งหมด",
      "rail.nsOnly": "เฉพาะขอบนอกบน-ล่าง",
      "rail.ewOnly": "เฉพาะขอบนอกซ้าย-ขวา",
      "rail.clear": "ล้างราว",
      "rail.perM": "ราวจับ ≈ {0}/ม. (คิดเป็นชุดละ 1.2 ม. · {1} ช่วง)",
      "gangway.heading": "แกงเวย์ (ตัวเลือกเสริม)",
      "mooring.heading": "ระบบสมอยึดโยง (ตัวเลือกเสริม)",
      "mooring.enable": "เพิ่มระบบสมอยึดโยงในใบเสนอราคา",
      "mooring.enableHint": "ลูกค้ากรอกจำนวนชุดเอง — ราคา 7,500 บาท/ชุด (ปรับได้ในแอดมิน)",
      "mooring.qty": "จำนวนชุด",
      "mooring.qtyHint": "พิมพ์จำนวนที่ต้องการ (ไม่มีเพดานสูงสุด)",
      "mooring.priceOn": "ราคาโดยประมาณ: {0} ({1} บาท/ชุด × {2} ชุด)",
      "mooring.priceOff": "ราคาโดยประมาณ: — (ติ๊กเพื่อเพิ่มในใบเสนอราคา)",
      "quote.mooringItem": "ระบบสมอยึดโยง (ตัวเลือกเสริม)",
      "admin.mooring": "ราคาระบบสมอยึดโยง / ชุด (บาท)",
      "admin.mooringHint": "ค่าเริ่มต้น: 7,500 บาท/ชุด — ตามจำนวนที่ลูกค้ากรอก",
      "print.mooringTitle": "ระบบสมอยึดโยง",
      "print.mooringDesc": "ระบบสมอยึดโยง (ตัวเลือกเสริม) · ตามจำนวนชุดที่เลือกในระบบ",

      "gangway.enable": "เพิ่มแกงเวย์ในใบเสนอราคา",
      "gangway.enableHint": "ไม่แสดงบนแผนผังมุมสูง — คิดราคาเป็นรายการแยกในใบเสนอราคาเท่านั้น",
      "gangway.secLabel": "เลือกเซกชันของรูปที่เลือกอยู่",
      "gangway.secLabelL": "เลือกเซกชันของรูปตัวแอล (A / B)",
      "gangway.secLabelT": "เลือกเซกชันของรูปตัวที (A / B)",
      "gangway.secAria": "เซกชันแกงเวย์",
      "gangway.secA": "เซกชัน A",
      "gangway.secB": "เซกชัน B",
      "gangway.secMin": "เลือกได้อย่างน้อย 1 เซกชัน (หรือทั้งสอง)",
      "gangway.width": "ความกว้าง",
      "gangway.widthAria": "ความกว้างแกงเวย์",
      "gangway.length": "ความยาว (เมตรเต็มเท่านั้น)",
      "gangway.lengthAria": "ความยาวแกงเวย์",
      "gangway.qty": "จำนวนชุด",
      "gangway.formula": "สูตรต่อชุด: ฐาน 1.2×3 ม. = 30,000 บาท · ยาวเกิน 3 ม. เมตรละ +10,000 · กว้าง 2.4 ม. = ×2 · คูณจำนวนชุด",
      "gangway.priceOn": "ราคาโดยประมาณ: {0} ({1}×{2} ม. × {3} ชุด{4}{5})",
      "gangway.priceOff": "ราคาโดยประมาณ: — (ติ๊กเพื่อเพิ่มในใบเสนอราคา)",
      "gangway.secTimes": " × {0} เซกชัน",
      "gangway.secDot": " · เซกชัน {0}",
      "quote.heading": "ใบเสนอราคาโดยประมาณ",
      "quote.col.item": "รายการ",
      "quote.col.qty": "จำนวน",
      "quote.col.unit": "ราคา/หน่วย",
      "quote.col.total": "รวม",
      "quote.grandTotal": "ยอดรวมทั้งสิ้น",
      "quote.disclaimer": "ราคานี้ไม่รวมค่าขนส่งและค่าติดตั้ง",
      "quote.print": "🖨️ พิมพ์ใบเสนอราคา",
      "quote.download": "⬇️ ดาวน์โหลด HTML",
      "quote.printTip": "เคล็ดลับ: ในหน้าพิมพ์ เลือก “บันทึกเป็น PDF” เพื่อได้ไฟล์ PDF",
      "quote.floatItem": "ทุ่นลอยน้ำ (พร้อม Quick Lock + ตัวเชื่อม · {0} ชั้น)",
      "quote.hdpeItem": "แผ่นพื้น HDPE (ชั้นบน)",
      "quote.railItem": "ราวจับกันตก (ช่วงละ 1.2 ม.)",
      "quote.gangwayItem": "แกงเวย์ (ตัวเลือกเสริม · {0}×{1} ม.{2})",
      "quote.sets": "{0} ชุด",
      "admin.toggle": "⚙️ ตั้งค่าราคา (แอดมิน)",
      "admin.float": "ราคาทุ่นลอยน้ำ / ชุด (บาท)",
      "admin.floatHint": "ค่าเริ่มต้นตามทะเบียน: 18,000 บาท (พร้อม Quick Lock + ตัวเชื่อม)",
      "admin.hdpe": "ราคาแผ่นพื้น HDPE / ชุด (บาท)",
      "admin.hdpeHint": "ค่าเริ่มต้น: 7,500 บาท — 1 ชุดต่อ 1 ทุ่นชั้นบน",
      "admin.rail": "ราคาราวจับกันตก / ชุด 1.2 ม. (บาท)",
      "admin.railHint": "ค่าเริ่มต้น: 4,500 บาท/ชุด — แสดงเทียบต่อเมตรในหน้าหลัก",
            "admin.fender": "ราคาเฟนเดอร์กันชน / ชิ้น (บาท)",
      "admin.fenderHint": "ค่าเริ่มต้น: 1,900 บาท — ตามจำนวนที่คลิกบนแผนผัง",
      "admin.cleat": "ราคาคลีต / ชิ้น (บาท)",
      "admin.cleatHint": "ค่าเริ่มต้น: 1,250 บาท — ตามจำนวนที่คลิกบนแผนผัง",
      "admin.light": "ราคาเสาไฟโซลาร์เซลล์ / ต้น (บาท)",
      "admin.lightHint": "ค่าเริ่มต้น: 4,500 บาท — ตามจำนวนที่คลิกบนแผนผัง",
      "admin.reset": "รีเซ็ตราคาเริ่มต้น",
      "admin.saved": "ราคาถูกบันทึกในเบราว์เซอร์ (localStorage) อัตโนมัติ",
      "footer": "บริษัท โฟลทิลลา เทคโนโลยี จำกัด · Floating Pier Configurator",
      "unit.m": "ม.",
      "unit.floats": "ทุ่น",
      "unit.spans": "ช่วง",
      "unit.sets": "ชุด",
      "unit.baht": "บาท",
      "unit.kg": "กก.",
      "unit.m2": "ตร.ม.",
      "section.main": "หลัก",
      "preset.sub": "{0} ทุ่น · {1}×{2}",
      "summary.straight": "{0} × {1} ม. ({2} × {3} ทุ่น)",
      "summary.L": "รูปตัวแอล · A {0}×{1} + B {2}×{3} = {4} ทุ่น · กรอบ {5}×{6} ม.",
      "summary.T": "รูปตัวที · A {0}×{1} + B {2}×{3} = {4} ทุ่น · กรอบ {5}×{6} ม.",
      "print.company": "บริษัท โฟลทิลลา เทคโนโลยี จำกัด",
      "print.companyEn": "Flotilla Technology Co., Ltd.",
      "print.docCode": "FTL-F-PSA-001-00",
      "print.badge": "QUOTATION",
      "print.contactPerson": "Contact Person",
      "print.organization": "Organization",
      "print.address": "Address",
      "print.tel": "Tel",
      "print.taxId": "Tax Id",
      "print.project": "Project",
      "print.quotationNo": "เลขที่ใบเสนอราคา / Quotation No.",
      "print.dateLabel": "วันที่ / Date",
      "print.staff": "พนักงาน / Staff",
      "print.staffTel": "เบอร์โทร / Tel",
      "print.email": "อีเมล / Email",
      "print.website": "เว็บไซต์ / Website",
      "print.websiteVal": "www.flotillatechnology.com",
      "print.tbd": "TBD",
      "print.blank": "________________________",
      "print.summaryH2": "สรุปการกำหนดค่าท่าเทียบเรือลอยน้ำ",
      "print.shape": "รูปทรง",
      "print.size": "ขนาด",
      "print.layers": "จำนวนชั้น",
      "print.layersVal": "{0} ชั้น (สูง {1} ม.)",
      "print.floats": "จำนวนทุ่นลอยน้ำ",
      "print.floatsVal": "{0} ชุด (ชั้นบน {1})",
      "print.capacity": "ความสามารถรับน้ำหนัก",
      "print.capacityVal": "{0} ({1} กก./ตร.ม.)",
      "print.rails": "ราวจับกันตก",
      "print.railsVal": "{0} ชุด (ช่วงละ 1.2 ม.)",
      "print.pricesH2": "รายการราคา / Bill of Quantities",
      "print.col.item": "Item",
      "print.col.desc": "Description",
      "print.col.qty": "Q'ty",
      "print.col.unit": "Unit",
      "print.col.unitPrice": "Unit Price (THB)",
      "print.col.total": "Total (THB)",
      "print.unit.sets": "Sets",
      "print.unit.pieces": "Pieces",
      "print.unit.meters": "Meters",
      "print.floatDesc": "ทุ่นลอยน้ำพร้อม Quick Lock และตัวเชื่อม ตามจำนวนชั้นที่เลือก",
      "print.hdpeDesc": "แผ่นพื้น HDPE สำหรับชั้นบนของท่าเทียบเรือ",
      "print.railDesc": "ราวจับกันตก ช่วงละ 1.2 ม. ตามแผนผังที่เลือก",
      "print.gangwayDesc": "แกงเวย์เสริมตามขนาดและความยาวที่กำหนดในระบบ",
      "print.fenderTitle": "Fenders / เฟนเดอร์ (กันชน)",
      "print.fenderDesc": "กันชนตามขอบนอกที่เลือกบนแผนผัง · 1,900 บาท/ชุด",
      "print.cleatTitle": "Stainless cleats / คลีตสแตนเลส",
      "print.cleatDesc": "คลีตสแตนเลสวางบนทุ่นตามแผนผัง · 1,250 บาท/ชุด",
      "print.lightTitle": "Solar light poles / เสาไฟโซลาร์เซลล์",
      "print.lightDesc": "เสาไฟโซลาร์เซลล์วางบนทุ่นตามแผนผัง · 4,500 บาท/ชุด",
      "print.fenders": "กันชน / เฟนเดอร์",
      "print.fendersVal": "{0} ชุด",
      "print.cleats": "คลีตสแตนเลส",
      "print.cleatsVal": "{0} ชุด",
      "print.lights": "เสาไฟโซลาร์เซลล์",
      "print.lightsVal": "{0} ชุด",
      "print.anchorTitle": "Anchor / Mooring Anchor (สมอ)",
      "print.anchorDesc": "Anchor format / type to be specified later. Specification pending customer confirmation.",
      "print.ropeTitle": "Giant Rope (เชือกยายักษ์)",
      "print.ropeDesc": "Customer to choose length. Length and quantity subject to customer selection.",
      "print.termsH2": "Terms & Conditions",
      "print.priceValid": "Price Valid : 30 Days after quoted date.",
      "print.delivery": "Delivery : 60 Days after confirm order.",
      "print.warranty": "Warranty : 2 Years for the whole system; lifetime for buoy leak replacement (change a new one).",
      "print.payment": "Term of Payment : 50% on confirmation of order and 50% before delivery.",
      "print.subTotal": "Sub Total",
      "print.vat": "VAT 7%",
      "print.grandTotalLabel": "Grand Total",
      "print.tbdNote": "หมายเหตุ: รายการ Anchor / Giant Rope (TBD) ไม่รวมในยอดรวมด้านบน",
      "print.amountWords": "Amount in words: To be advised (TBD)",
      "print.bankH2": "Bank Account Details",
      "print.bankName": "Account Name : Flotilla Technology Co., Ltd.",
      "print.bankNo": "Account No. : 048-291165-7",
      "print.bankType": "Account Type : Savings Account",
      "print.bankBank": "Bank : Siam Commercial Bank (SCB) — Nueng Phan Branch",
      "print.proposal": "Proposal",
      "print.approval": "Approval",
      "print.signature": "(Signature)",
      "print.titleTbd": "Title / Position: TBD",
      "print.mdName": "Vorakorn Boonlikitcheva",
      "print.mdTitle": "Managing Director",
      "print.customerConfirm": "Customer Confirmation / Order Confirmation",
      "print.sign": "Sign",
      "print.seal": "Seal",
      "print.dateBlank": "Date",
      "print.customerNote": "Please sign to confirm this quotation and return a copy. For inquiries, contact Flotilla Technology Co., Ltd.",
      "print.legalDisclaimer": "This quotation is valid subject to the terms stated herein. Signing this quotation or issuing a purchase order constitutes acceptance of all terms and conditions. Cancellation after order confirmation may be subject to cancellation fees and recovery of costs incurred. Prices marked TBD are to be advised upon final specification of materials and quantities. Flotilla Technology Co., Ltd. reserves the right to revise pricing if specifications change.",
      "print.disclaimer": "⚠ ราคานี้ไม่รวมค่าขนส่งและค่าติดตั้ง — รายการ TBD ไม่รวมในยอดรวม",
      "print.assumption": "<strong>หมายเหตุความสามารถรับน้ำหนัก:</strong> capacity_kg = พื้นที่ × 375 × จำนวนชั้น ; ต่อตร.ม. = 375 × จำนวนชั้น — อ้างอิงค่าแรงพยุงตัวไม่น้อยกว่า 375 กก./ตร.ม. ตามคุณลักษณะผลิตภัณฑ์ (วว.) — ยังไม่หักน้ำหนักโครงสร้าง/พื้น",
      "print.footer": "Flotilla Technology Co., Ltd. | www.flotillatechnology.com | FTL-F-PSA-001-00",
      "print.docTitle": "ใบเสนอราคา - โฟลทิลลา",
      "print.downloadTip": "เคล็ดลับ: กด Ctrl+P (หรือ Cmd+P) เพื่อบันทึกเป็น PDF",
      "print.filePrefix": "ใบเสนอราคา-โฟลทิลลา-"
    },
    en: {
      "docTitle": "Design Your Floating Pier | Flotilla",
      "metaDescription": "Floating pier configurator — Flotilla Technology",
      "header.title": "Design Your Floating Pier",
      "header.subtitle": "Flotilla Technology · Floats 1.20×1.20×0.30 m",
      "shape.heading": "Choose pier shape",
      "shape.aria": "Shape",
      "shape.straight.title": "I-shape",
      "shape.straight.sub": "Straight (I)",
      "shape.L.title": "L-shape",
      "shape.L.sub": "Two arms joined at a corner",
      "shape.T.title": "T-shape",
      "shape.T.sub": "Sections A + B",
      "shape.U.title": "U-shape",
      "shape.U.sub": "Sections A + B + C",
      "shapeLabel.U": "U-shape",
      "size.title.U": "Sections A / B / C · U-shape only",
      "size.U.hint": "U-shape only — sections A (left arm), B (bottom bar), C (right arm) · place railings on the top-view plan",
      "size.U.secA": "Section A · left arm",
      "size.U.secB": "Section B · bottom bar",
      "size.U.secC": "Section C · right arm",
      "size.U.armLen": "Arm length (floats)",
      "size.detailU": "A {0}×{1} + B {2}×{3} + C {4}×{5} = {6} floats",
      "gangway.secLabelU": "Choose U-shape sections (A / B / C)",
      "gangway.secC": "Section C",
      "shapeLabel.straight": "I-shape",
      "shapeLabel.L": "L-shape",
      "shapeLabel.T": "T-shape",
      "size.title.straight": "Main section size · I-shape",
      "size.title.L": "Sections A / B · L-shape only",
      "size.title.T": "Sections A / B · T-shape only",
      "size.straight.section": "Main section",
            "size.straight.hint2": "Each float is a <strong>1.2×1.2 m</strong> square. Actual size = (length count)×1.2 × (row count)×1.2 e.g. 6×2 floats = <strong>7.2×2.4 m</strong>",
      "size.presetsAria": "Popular sizes",
      "size.lengthM": "Length (m)",
      "size.widthM": "Width (m)",
      "size.lengthFloats": "Length (floats)",
      "size.widthFloats": "Width (floats)",
      "size.railCount": "Railing count (1.2 m spans)",
      "size.L.hint": "L-shape only — sections A and B for this shape",
      "size.L.secA": "Section A · L-shape",
      "size.L.secB": "Section B · L-shape",
      "size.T.hint": "T-shape only — sections A and B for this shape",
      "size.T.secA": "Section A · T-shape",
      "size.T.secB": "Section B · T-shape",
      "size.T.stemWidth": "Width along section A (floats)",
      "size.T.stemLen": "Section B length (floats)",
      "size.actual": "Actual size: {0} m × {1} m ({2}×{3} floats)",
      "size.requested": "Requested: {0} m × {1} m → rounded up to multiples of 1.20 m",
      "size.topFloatsBox": "Top floats {0} · bbox {1}×{2} m",
      "size.detailL": "A {0}×{1} + B {2}×{3} (joined beyond corner, no overlap) = {4} floats",
      "size.detailT": "A {0}×{1} + B {2}×{3} (starts at column {4}) = {5} floats",
      "layers.heading": "Float layers",
      "layers.hint": "Each layer is <strong>0.3 m</strong> high — more layers increase buoyancy and float count on the quote",
      "layers.aria": "Float layers",
      "layers.1": "1 layer<br /><small>0.3 m high</small>",
      "layers.2": "2 layers<br /><small>0.6 m high</small>",
      "layers.3": "3 layers<br /><small>0.9 m high</small>",
      "layers.hintDyn": "Selected {0} layer(s) · float stack height {1} m · capacity {2} kg/m²",
      "diagram.heading": "Top-down plan",
      "diagram.prompt": "Please select your railing positions",
      "diagram.clickHint": "Click to choose railing positions",
      "stats.floats": "Floats",
      "stats.size": "Actual size",
      "stats.rails": "Rails (sets)",
      "legend.float": "Float 1.20×1.20 m",



      "legend.rail": "Safety railing",
      "legend.fender": "Fender / bumper",
      "legend.cleat": "Stainless cleat",
      "legend.light": "Solar cell light pole",
      "accessory.heading": "Top plan · fenders, cleats & solar lights",
      "accessory.fenderPrompt": "Please select fender / bumper positions",
      "accessory.cleatPrompt": "Please select stainless cleat positions",
      "accessory.lightPrompt": "Light poles and cleats are installed at the float corners",
      "accessory.clickHint": "Choose a mode below, then click outer edges for fenders or floats for cleats/solar lights — click again to remove",
      "accessory.modeAria": "Accessory placement mode",
      "accessory.modeFender": "Fender / bumper",
      "accessory.modeCleat": "Cleat",
      "accessory.modeLight": "Solar cell light pole",
      "accessory.helpersAria": "Fender, cleat & solar light shortcuts",
      "accessory.clearFenders": "Clear fenders",
      "accessory.clearCleats": "Clear cleats",
      "accessory.clearLights": "Clear solar lights",
      "stats.fenders": "Fenders (sets)",
      "stats.cleats": "Cleats (sets)",
      "stats.lights": "Solar light poles",
      "quote.fenderItem": "Fender / bumper",
      "quote.cleatItem": "Stainless cleat",
      "quote.lightItem": "Solar cell light pole",
      "cap.label": "Estimated load capacity",
      "cap.total": "total",
      "cap.perM2": "{0} kg/m²  ({1} ÷ {2} m² · {3} layer(s))",
      "cap.assumption": "Total: <code>capacity_kg = area(m²) × 375 × layers</code><br />Per m²: <code>capacity_kg_per_m2 = 375 × layers</code> (= total ÷ area)<br />Based on buoyancy ≥ 375 kg/m² per layer (TISTR product spec) — structure/deck weight not deducted",
      "rail.heading": "Safety railing",
      "rail.help1": "Use the plan above — tap edge lines to place/remove railing spans (including between floats)",
      "rail.help2": "Each span = 1.2 m along one edge of one float — includes outer edges and between-float lines",
      "rail.helpersAria": "Railing shortcuts",
      "rail.allPerimeter": "All outer edges",
      "rail.ewOnly": "Outer left-right edges only",
      "rail.nsOnly": "Outer top & bottom only",
      "rail.clear": "Clear rails",
      "rail.perM": "Railing ≈ {0}/m (priced per 1.2 m set · {1} spans)",
      "gangway.heading": "Gangway (optional add-on)",
      "mooring.heading": "Anchor mooring system (optional add-on)",
      "mooring.enable": "Add anchor mooring system to quote",
      "mooring.enableHint": "Customer enters quantity — 7,500 THB per set (editable in admin)",
      "mooring.qty": "Quantity (sets)",
      "mooring.qtyHint": "Type how many sets you need (no maximum)",
      "mooring.priceOn": "Est. price: {0} ({1} THB/set × {2} set(s))",
      "mooring.priceOff": "Est. price: — (check to add to quote)",
      "quote.mooringItem": "Anchor mooring system (optional)",
      "admin.mooring": "Anchor mooring system price / set (THB)",
      "admin.mooringHint": "Default: 7,500 THB/set — from customer quantity",
      "print.mooringTitle": "Anchor mooring system",
      "print.mooringDesc": "Optional anchor mooring system · per quantity selected in the configurator",

      "gangway.enable": "Add gangway to quote",
      "gangway.enableHint": "Not shown on the plan — priced as a separate quote line only",
      "gangway.secLabel": "Choose sections for the selected shape",
      "gangway.secLabelL": "Choose L-shape sections (A / B)",
      "gangway.secLabelT": "Choose T-shape sections (A / B)",
      "gangway.secAria": "Gangway sections",
      "gangway.secA": "Section A",
      "gangway.secB": "Section B",
      "gangway.secMin": "Select at least 1 section (or both)",
      "gangway.width": "Width",
      "gangway.widthAria": "Gangway width",
      "gangway.length": "Length (whole meters only)",
      "gangway.lengthAria": "Gangway length",
      "gangway.qty": "Quantity (sets)",
      "gangway.formula": "Per set: base 1.2×3 m = 30,000 THB · over 3 m +10,000/m · width 2.4 m = ×2 · multiply by qty",
      "gangway.priceOn": "Est. price: {0} ({1}×{2} m × {3} set(s){4}{5})",
      "gangway.priceOff": "Est. price: — (check to add to quote)",
      "gangway.secTimes": " × {0} section(s)",
      "gangway.secDot": " · section {0}",
      "quote.heading": "Estimated quote",
      "quote.col.item": "Item",
      "quote.col.qty": "Qty",
      "quote.col.unit": "Unit price",
      "quote.col.total": "Total",
      "quote.grandTotal": "Grand total",
      "quote.disclaimer": "Price excludes delivery and installation",
      "quote.print": "🖨️ Print quote",
      "quote.download": "⬇️ Download HTML",
      "quote.printTip": "Tip: In the print dialog, choose “Save as PDF” for a PDF file",
      "quote.floatItem": "Floating pontoon (with Quick Lock + connectors · {0} layer(s))",
      "quote.hdpeItem": "HDPE decking (top layer)",
      "quote.railItem": "Safety railing (1.2 m per set)",
      "quote.gangwayItem": "Gangway (optional · {0}×{1} m{2})",
      "quote.sets": "{0} set(s)",
      "admin.toggle": "⚙️ Price settings (admin)",
      "admin.float": "Float price / set (THB)",
      "admin.floatHint": "Registry default: 18,000 THB (with Quick Lock + connectors)",
      "admin.hdpe": "HDPE deck price / set (THB)",
      "admin.hdpeHint": "Default: 7,500 THB — 1 set per top float",
      "admin.rail": "Railing price / 1.2 m set (THB)",
      "admin.railHint": "Default: 4,500 THB/set — shown per meter on the main page",
      "admin.fender": "Fender / bumper price / pc (THB)",
      "admin.fenderHint": "Default: 1,900 THB — from plan clicks",
      "admin.cleat": "Cleat price / pc (THB)",
      "admin.cleatHint": "Default: 1,250 THB — from plan clicks",
      "admin.light": "Solar light pole price / pc (THB)",
      "admin.lightHint": "Default: 4,500 THB — from plan clicks",
      "admin.reset": "Reset to defaults",
      "admin.saved": "Prices are saved in the browser (localStorage) automatically",
      "footer": "Flotilla Technology Co., Ltd. · Floating Pier Configurator",
      "unit.m": "m",
      "unit.floats": "floats",
      "unit.spans": "spans",
      "unit.sets": "sets",
      "unit.baht": "THB",
      "unit.kg": "kg",
      "unit.m2": "m²",
      "section.main": "Main",
      "preset.sub": "{0} floats · {1}×{2}",
      "summary.straight": "{0} × {1} m ({2} × {3} floats)",
      "summary.L": "L-shape · A {0}×{1} + B {2}×{3} = {4} floats · bbox {5}×{6} m",
      "summary.T": "T-shape · A {0}×{1} + B {2}×{3} = {4} floats · bbox {5}×{6} m",
      "print.company": "Flotilla Technology Co., Ltd.",
      "print.companyEn": "Flotilla Technology Co., Ltd.",
      "print.docCode": "FTL-F-PSA-001-00",
      "print.badge": "QUOTATION",
      "print.contactPerson": "Contact Person",
      "print.organization": "Organization",
      "print.address": "Address",
      "print.tel": "Tel",
      "print.taxId": "Tax Id",
      "print.project": "Project",
      "print.quotationNo": "Quotation No.",
      "print.dateLabel": "Date",
      "print.staff": "Staff",
      "print.staffTel": "Tel",
      "print.email": "Email",
      "print.website": "Website",
      "print.websiteVal": "www.flotillatechnology.com",
      "print.tbd": "TBD",
      "print.blank": "________________________",
      "print.summaryH2": "Floating pier configuration summary",
      "print.shape": "Shape",
      "print.size": "Size",
      "print.layers": "Layers",
      "print.layersVal": "{0} layer(s) ({1} m high)",
      "print.floats": "Float count",
      "print.floatsVal": "{0} set(s) (top layer {1})",
      "print.capacity": "Load capacity",
      "print.capacityVal": "{0} ({1} kg/m²)",
      "print.rails": "Safety railing",
      "print.railsVal": "{0} set(s) (1.2 m each)",
      "print.pricesH2": "Bill of Quantities",
      "print.col.item": "Item",
      "print.col.desc": "Description",
      "print.col.qty": "Q'ty",
      "print.col.unit": "Unit",
      "print.col.unitPrice": "Unit Price (THB)",
      "print.col.total": "Total (THB)",
      "print.unit.sets": "Sets",
      "print.unit.pieces": "Pieces",
      "print.unit.meters": "Meters",
      "print.floatDesc": "Floating pontoon with Quick Lock and connectors for the selected layer count",
      "print.hdpeDesc": "HDPE decking for the top layer of the pier",
      "print.railDesc": "Safety railing in 1.2 m spans as selected on the plan",
      "print.gangwayDesc": "Optional gangway sized per the configurator selection",
      "print.fenderTitle": "Fenders (กันชน)",
      "print.fenderDesc": "Outer-edge fenders as selected on the accessory plan · 1,900 THB each",
      "print.cleatTitle": "Stainless cleats (คลีตสแตนเลส)",
      "print.cleatDesc": "Stainless cleats placed on floats per the accessory plan · 1,250 THB each",
      "print.lightTitle": "Solar cell light poles (เสาไฟโซลาร์เซลล์)",
      "print.lightDesc": "Solar cell light poles placed on floats per the accessory plan · 4,500 THB each",
      "print.fenders": "Fenders",
      "print.fendersVal": "{0} set(s)",
      "print.cleats": "Stainless cleats",
      "print.cleatsVal": "{0} set(s)",
      "print.lights": "Solar cell light poles",
      "print.lightsVal": "{0} set(s)",
      "print.anchorTitle": "Anchor / Mooring Anchor (สมอ)",
      "print.anchorDesc": "Anchor format / type to be specified later. Specification pending customer confirmation.",
      "print.ropeTitle": "Giant Rope (เชือกยายักษ์)",
      "print.ropeDesc": "Customer to choose length. Length and quantity subject to customer selection.",
      "print.termsH2": "Terms & Conditions",
      "print.priceValid": "Price Valid : 30 Days after quoted date.",
      "print.delivery": "Delivery : 60 Days after confirm order.",
      "print.warranty": "Warranty : 2 Years for the whole system; lifetime for buoy leak replacement (change a new one).",
      "print.payment": "Term of Payment : 50% on confirmation of order and 50% before delivery.",
      "print.subTotal": "Sub Total",
      "print.vat": "VAT 7%",
      "print.grandTotalLabel": "Grand Total",
      "print.tbdNote": "Note: Anchor / Giant Rope (TBD) are not included in the totals above",
      "print.amountWords": "Amount in words: To be advised (TBD)",
      "print.bankH2": "Bank Account Details",
      "print.bankName": "Account Name : Flotilla Technology Co., Ltd.",
      "print.bankNo": "Account No. : 048-291165-7",
      "print.bankType": "Account Type : Savings Account",
      "print.bankBank": "Bank : Siam Commercial Bank (SCB) — Nueng Phan Branch",
      "print.proposal": "Proposal",
      "print.approval": "Approval",
      "print.signature": "(Signature)",
      "print.titleTbd": "Title / Position: TBD",
      "print.mdName": "Vorakorn Boonlikitcheva",
      "print.mdTitle": "Managing Director",
      "print.customerConfirm": "Customer Confirmation / Order Confirmation",
      "print.sign": "Sign",
      "print.seal": "Seal",
      "print.dateBlank": "Date",
      "print.customerNote": "Please sign to confirm this quotation and return a copy. For inquiries, contact Flotilla Technology Co., Ltd.",
      "print.legalDisclaimer": "This quotation is valid subject to the terms stated herein. Signing this quotation or issuing a purchase order constitutes acceptance of all terms and conditions. Cancellation after order confirmation may be subject to cancellation fees and recovery of costs incurred. Prices marked TBD are to be advised upon final specification of materials and quantities. Flotilla Technology Co., Ltd. reserves the right to revise pricing if specifications change.",
      "print.disclaimer": "⚠ Price excludes delivery and installation — TBD accessory lines not included in totals",
      "print.assumption": "<strong>Capacity note:</strong> capacity_kg = area × 375 × layers ; per m² = 375 × layers — buoyancy ≥ 375 kg/m² per TISTR product spec — structure/deck weight not deducted",
      "print.footer": "Flotilla Technology Co., Ltd. | www.flotillatechnology.com | FTL-F-PSA-001-00",
      "print.docTitle": "Quote - Flotilla",
      "print.downloadTip": "Tip: Press Ctrl+P (or Cmd+P) to save as PDF",
      "print.filePrefix": "flotilla-quote-"
    }
  };

  var currentLang = loadLang();

  function loadLang() {
    try {
      var v = localStorage.getItem("flotilla_lang");
      if (v === "en" || v === "th") return v;
    } catch (e) { /* ignore */ }
    return "th";
  }

  function saveLang(lang) {
    try {
      localStorage.setItem("flotilla_lang", lang);
    } catch (e) { /* ignore */ }
  }

  function t(key) {
    var dict = LANG[currentLang] || LANG.th;
    var s = dict[key];
    if (s == null) s = LANG.th[key];
    if (s == null) s = key;
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < args.length; i++) {
      s = String(s).split("{" + i + "}").join(String(args[i]));
    }
    return s;
  }

  function applyLanguage() {
    document.documentElement.lang = currentLang === "en" ? "en" : "th";
    document.title = t("docTitle");
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("metaDescription"));

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (!key) return;
      el.innerHTML = t(key);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      el.setAttribute("aria-label", t(key));
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var on = btn.getAttribute("data-lang") === currentLang;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function setLanguage(lang) {
    if (lang !== "en" && lang !== "th") lang = "th";
    currentLang = lang;
    saveLang(lang);
    applyLanguage();
    render();
  }


  var PRESETS = [
    { id: "3x2", label: "3.6×2.4 ม.", sub: "6 ทุ่น · 3×2", L: 3.6, W: 2.4 },
    { id: "5x2", label: "6.0×2.4 ม.", sub: "10 ทุ่น · 5×2", L: 6.0, W: 2.4 },
    { id: "6x2", label: "7.2×2.4 ม.", sub: "12 ทุ่น · 6×2", L: 7.2, W: 2.4 },
    { id: "8x2", label: "9.6×2.4 ม.", sub: "16 ทุ่น · 8×2", L: 9.6, W: 2.4 },
  ];

  var state = {
    shape: "straight", // straight | L | T | U
    reqL: 7.2,
    reqW: 2.4,
    layers: 1,
    railSegs: {},
    fenderSegs: {},
    cleatCells: {},
    lightCells: {}, // เสาไฟโซลาร์เซลล์ on float cells ("x,y")
    accessoryMode: "fender", // fender | cleat | light
    prices: loadPrices(),
    activePreset: "6x2",
    _railCols: 0,
    _railRows: 0,
    _accessoryShape: null,
    // L: A horizontal along +X; B vertical along +Y beyond A (no shared cells)
    // A: x=0..aCols-1, y=0..aRows-1
    // B: x=0..bRows-1, y=aRows..aRows+bCols-1  (bRows=width, bCols=length of stem)
    l: { aCols: 6, aRows: 2, bCols: 4, bRows: 2 },
    // T: bar on top; stem centered below
    t: { barCols: 8, barRows: 2, stemCols: 2, stemRows: 4 },
    u: { aCols: 2, aRows: 4, bCols: 8, bRows: 2, cCols: 2, cRows: 4 },
    // Gangway add-on (quote only — never drawn on plan)
    gangway: { enabled: false, width: 1.2, length: 3, qty: 1, sectionA: true, sectionB: false, sectionC: false },
    mooring: { enabled: false, qty: 1 },
  };

  function loadPrices() {
    try {
      var raw = localStorage.getItem("flotilla_pier_prices");
      if (raw) {
        var p = JSON.parse(raw);
        var loaded = {
          floatPrice: num(p.floatPrice, DEFAULTS.floatPrice),
          hdpePrice: num(p.hdpePrice, DEFAULTS.hdpePrice),
          railingPrice: num(p.railingPrice, DEFAULTS.railingPrice),
          fenderPrice: num(p.fenderPrice, DEFAULTS.fenderPrice),
          cleatPrice: num(p.cleatPrice, DEFAULTS.cleatPrice),
          lightPrice: num(p.lightPrice, DEFAULTS.lightPrice),
          mooringPrice: num(p.mooringPrice, DEFAULTS.mooringPrice),
        };
        // Migrate stale default: fender was 3500, now 1900
        if (loaded.fenderPrice === 3500) loaded.fenderPrice = DEFAULTS.fenderPrice;
        if (loaded.lightPrice == null || loaded.lightPrice === 0) loaded.lightPrice = DEFAULTS.lightPrice;
        return loaded;
      }
    } catch (e) { /* ignore */ }
    return Object.assign({}, DEFAULTS);
  }

  function savePrices() {
    try {
      localStorage.setItem("flotilla_pier_prices", JSON.stringify(state.prices));
    } catch (e) { /* ignore */ }
  }

  function num(v, fallback) {
    var n = Number(v);
    return isFinite(n) && n >= 0 ? n : fallback;
  }

  function clampInt(v, min, max) {
    var n = parseInt(v, 10);
    if (!isFinite(n)) n = min;
    return Math.max(min, Math.min(max, n));
  }

  function ceilModules(meters) {
    return Math.max(1, Math.ceil(meters / MODULE - 1e-9));
  }

  // ---- Geometry: occupied cells ----
  /**
   * Returns { cells: [{x,y,section}], width, height, sections }
   * L clean model (no overlap):
   *   A: [0..aCols)×[0..aRows)
   *   B: [0..bRows)×[aRows..aRows+bCols)   // attach beyond A on +Y from left
   *   topFloats = aCols*aRows + bCols*bRows
   * T:
   *   bar: [0..barCols)×[0..barRows)
   *   stem: [stemStart..stemStart+stemCols)×[barRows..barRows+stemRows)
   *   stemStart = floor((barCols-stemCols)/2)
   */
  function buildGeometry() {
    var cells = [];
    var width = 0;
    var height = 0;
    var shape = state.shape;

    if (shape === "straight") {
      var cols = ceilModules(state.reqL);
      var rows = Math.max(MIN_ROWS, ceilModules(state.reqW));
      var r, c;
      for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
          cells.push({ x: c, y: r, section: "main" });
        }
      }
      width = cols;
      height = rows;
      return {
        shape: shape,
        cells: cells,
        width: width,
        height: height,
        cols: cols,
        rows: rows,
        topFloats: cols * rows,
        sections: [{ id: "main", label: t("section.main"), x0: 0, y0: 0, w: cols, h: rows }],
      };
    }

    if (shape === "L") {
      var aCols = clampInt(state.l.aCols, 1, MAX_MODULE);
      var aRows = clampInt(state.l.aRows, MIN_ROWS, MAX_MODULE);
      var bCols = clampInt(state.l.bCols, 1, MAX_MODULE); // length of vertical arm
      var bRows = clampInt(state.l.bRows, MIN_ROWS, MAX_MODULE); // width of vertical arm
      state.l.aCols = aCols;
      state.l.aRows = aRows;
      state.l.bCols = bCols;
      state.l.bRows = bRows;

      // Section A (แขนหลัก)
      for (r = 0; r < aRows; r++) {
        for (c = 0; c < aCols; c++) {
          cells.push({ x: c, y: r, section: "A" });
        }
      }
      // Section B (แขนตั้ง) — beyond A along +Y, from left; no overlap
      for (r = 0; r < bCols; r++) {
        for (c = 0; c < bRows; c++) {
          cells.push({ x: c, y: aRows + r, section: "B" });
        }
      }
      width = Math.max(aCols, bRows);
      height = aRows + bCols;
      return {
        shape: shape,
        cells: cells,
        width: width,
        height: height,
        aCols: aCols,
        aRows: aRows,
        bCols: bCols,
        bRows: bRows,
        topFloats: aCols * aRows + bCols * bRows,
        sections: [
          { id: "A", label: "A", x0: 0, y0: 0, w: aCols, h: aRows },
          { id: "B", label: "B", x0: 0, y0: aRows, w: bRows, h: bCols },
        ],
      };
    }


    if (shape === "U") {
      var uaCols = clampInt(state.u.aCols, MIN_ROWS, MAX_MODULE);
      var uaRows = clampInt(state.u.aRows, 1, MAX_MODULE);
      var ubCols = clampInt(state.u.bCols, MIN_ROWS, MAX_MODULE);
      var ubRows = clampInt(state.u.bRows, MIN_ROWS, MAX_MODULE);
      var ucCols = clampInt(state.u.cCols, MIN_ROWS, MAX_MODULE);
      var ucRows = clampInt(state.u.cRows, 1, MAX_MODULE);
      // Arms A/C lengths are independent; both meet the bottom bar (bottom-aligned).
      var armH = Math.max(uaRows, ucRows);
      var aY0 = armH - uaRows;
      var cY0 = armH - ucRows;
      var minBar = uaCols + ucCols;
      if (ubCols < minBar) ubCols = minBar;
      state.u.aCols = uaCols;
      state.u.aRows = uaRows;
      state.u.bCols = ubCols;
      state.u.bRows = ubRows;
      state.u.cCols = ucCols;
      state.u.cRows = ucRows;

      for (r = 0; r < uaRows; r++) {
        for (c = 0; c < uaCols; c++) {
          cells.push({ x: c, y: aY0 + r, section: "A" });
        }
      }
      for (r = 0; r < ucRows; r++) {
        for (c = 0; c < ucCols; c++) {
          cells.push({ x: ubCols - ucCols + c, y: cY0 + r, section: "C" });
        }
      }
      for (r = 0; r < ubRows; r++) {
        for (c = 0; c < ubCols; c++) {
          cells.push({ x: c, y: armH + r, section: "B" });
        }
      }
      width = ubCols;
      height = armH + ubRows;
      return {
        shape: shape,
        cells: cells,
        width: width,
        height: height,
        aCols: uaCols,
        aRows: uaRows,
        bCols: ubCols,
        bRows: ubRows,
        cCols: ucCols,
        cRows: ucRows,
        topFloats: uaCols * uaRows + ubCols * ubRows + ucCols * ucRows,
        sections: [
          { id: "A", label: "A", x0: 0, y0: aY0, w: uaCols, h: uaRows },
          { id: "B", label: "B", x0: 0, y0: armH, w: ubCols, h: ubRows },
          { id: "C", label: "C", x0: ubCols - ucCols, y0: cY0, w: ucCols, h: ucRows },
        ],
      };
    }

    // T-shape
    var barCols = clampInt(state.t.barCols, MIN_ROWS, MAX_MODULE);
    var barRows = clampInt(state.t.barRows, MIN_ROWS, MAX_MODULE);
    var stemCols = clampInt(state.t.stemCols, MIN_ROWS, MAX_MODULE);
    var stemRows = clampInt(state.t.stemRows, MIN_ROWS, MAX_MODULE);
    if (stemCols > barCols) stemCols = barCols;
    state.t.barCols = barCols;
    state.t.barRows = barRows;
    state.t.stemCols = stemCols;
    state.t.stemRows = stemRows;

    var stemStart = Math.floor((barCols - stemCols) / 2);

    for (r = 0; r < barRows; r++) {
      for (c = 0; c < barCols; c++) {
        cells.push({ x: c, y: r, section: "A" });
      }
    }
    for (r = 0; r < stemRows; r++) {
      for (c = 0; c < stemCols; c++) {
        cells.push({ x: stemStart + c, y: barRows + r, section: "B" });
      }
    }
    width = barCols;
    height = barRows + stemRows;
    return {
      shape: shape,
      cells: cells,
      width: width,
      height: height,
      barCols: barCols,
      barRows: barRows,
      stemCols: stemCols,
      stemRows: stemRows,
      stemStart: stemStart,
      topFloats: barCols * barRows + stemCols * stemRows,
      sections: [
        { id: "A", label: "A", x0: 0, y0: 0, w: barCols, h: barRows },
        {
          id: "B",
          label: "B",
          x0: stemStart,
          y0: barRows,
          w: stemCols,
          h: stemRows,
        },
      ],
    };
  }

  /** All cell-edge keys (including shared edges between floats): h:y:x and v:y:x */
  function edgeKeysFromCells(cells) {
    var keys = {};
    var i;
    for (i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var x = cell.x;
      var y = cell.y;
      keys["h:" + y + ":" + x] = true;
      keys["h:" + (y + 1) + ":" + x] = true;
      keys["v:" + y + ":" + x] = true;
      keys["v:" + y + ":" + (x + 1)] = true;
    }
    return keys;
  }

  function cellOccupancy(cells) {
    var set = {};
    var i;
    for (i = 0; i < cells.length; i++) {
      set[cells[i].x + "," + cells[i].y] = true;
    }
    return set;
  }

  function hasCellAt(occ, x, y) {
    return !!(occ && occ[x + "," + y]);
  }

  /** Outer perimeter only (edges touched by exactly one cell) */
  function allPerimeterFromCells(cells) {
    var counts = {};
    var i, edges, e;
    for (i = 0; i < cells.length; i++) {
      var cell = cells[i];
      edges = [
        "h:" + cell.y + ":" + cell.x,
        "h:" + (cell.y + 1) + ":" + cell.x,
        "v:" + cell.y + ":" + cell.x,
        "v:" + cell.y + ":" + (cell.x + 1),
      ];
      for (e = 0; e < edges.length; e++) {
        counts[edges[e]] = (counts[edges[e]] || 0) + 1;
      }
    }
    var segs = {};
    Object.keys(counts).forEach(function (k) {
      if (counts[k] === 1) segs[k] = true;
    });
    return segs;
  }

  function defaultNorthSouth(cols, rows) {
    var segs = {};
    var x;
    for (x = 0; x < cols; x++) {
      segs["h:0:" + x] = true;
      segs["h:" + rows + ":" + x] = true;
    }
    return segs;
  }

  /** Outer horizontal edges only (บน-ล่าง / any outer H edge on composed shapes) */
  function defaultNorthSouthFromCells(cells) {
    var peri = allPerimeterFromCells(cells);
    var segs = {};
    Object.keys(peri).forEach(function (k) {
      if (k.indexOf("h:") === 0) segs[k] = true;
    });
    return segs;
  }

  function defaultEastWest(cols, rows) {
    var segs = {};
    var i;
    for (i = 0; i < rows; i++) {
      segs["v:" + i + ":0"] = true;
      segs["v:" + i + ":" + cols] = true;
    }
    return segs;
  }

  /** Outer vertical edges only (ซ้าย-ขวา) */
  function defaultEastWestFromCells(cells) {
    var peri = allPerimeterFromCells(cells);
    var segs = {};
    Object.keys(peri).forEach(function (k) {
      if (k.indexOf("v:") === 0) segs[k] = true;
    });
    return segs;
  }

  function allPerimeter(cols, rows) {
    var segs = {};
    var i;
    for (i = 0; i < cols; i++) {
      segs["h:0:" + i] = true;
      segs["h:" + rows + ":" + i] = true;
    }
    for (i = 0; i < rows; i++) {
      segs["v:" + i + ":0"] = true;
      segs["v:" + i + ":" + cols] = true;
    }
    return segs;
  }

  function countOnSegs(segs) {
    var n = 0;
    if (!segs) return 0;
    Object.keys(segs).forEach(function (k) {
      if (segs[k]) n++;
    });
    return n;
  }

  /**
   * Keep selected rails valid for current geometry.
   * Never auto-select north+south (or any) rails on init / size change.
   */
  function syncRailSegs(geo) {
    var valid = edgeKeysFromCells(geo.cells);
    var cols = geo.width;
    var rows = geo.height;

    if (state.railSegs == null) {
      state.railSegs = {};
    }

    if (state._railShape && state._railShape !== state.shape) {
      state.railSegs = {};
    } else {
      var next = {};
      Object.keys(state.railSegs).forEach(function (k) {
        if (state.railSegs[k] && valid[k]) next[k] = true;
      });
      state.railSegs = next;
    }

    state._railCols = cols;
    state._railRows = rows;
    state._railShape = state.shape;
  }

  function toggleRailKey(key) {
    if (!state.railSegs) state.railSegs = {};
    if (state.railSegs[key]) delete state.railSegs[key];
    else state.railSegs[key] = true;
  }

  function syncFenderSegs(geo) {
    var valid = allPerimeterFromCells(geo.cells);
    if (state.fenderSegs == null) state.fenderSegs = {};
    if (state._accessoryShape && state._accessoryShape !== state.shape) {
      state.fenderSegs = {};
      state.cleatCells = {};
      state.lightCells = {};
    } else {
      var nextF = {};
      Object.keys(state.fenderSegs).forEach(function (k) {
        if (state.fenderSegs[k] && valid[k]) nextF[k] = true;
      });
      state.fenderSegs = nextF;
    }
    state._accessoryShape = state.shape;
  }

  function syncCleatCells(geo) {
    var occ = cellOccupancy(geo.cells);
    if (state.cleatCells == null) state.cleatCells = {};
    if (state._accessoryShape && state._accessoryShape !== state.shape) {
      // shape clear handled in syncFenderSegs
      state.cleatCells = {};
    } else {
      var nextC = {};
      Object.keys(state.cleatCells).forEach(function (k) {
        if (state.cleatCells[k] && occ[k]) nextC[k] = true;
      });
      state.cleatCells = nextC;
    }
  }

  function syncLightCells(geo) {
    var occ = cellOccupancy(geo.cells);
    if (state.lightCells == null) state.lightCells = {};
    if (state._accessoryShape && state._accessoryShape !== state.shape) {
      // shape clear handled in syncFenderSegs / shape click
      state.lightCells = {};
    } else {
      var nextL = {};
      Object.keys(state.lightCells).forEach(function (k) {
        if (state.lightCells[k] && occ[k]) nextL[k] = true;
      });
      state.lightCells = nextL;
    }
  }

  function toggleFenderKey(key) {
    if (!state.fenderSegs) state.fenderSegs = {};
    if (state.fenderSegs[key]) delete state.fenderSegs[key];
    else state.fenderSegs[key] = true;
  }

  function toggleCleatKey(key) {
    if (!state.cleatCells) state.cleatCells = {};
    if (state.cleatCells[key]) delete state.cleatCells[key];
    else state.cleatCells[key] = true;
  }

  function toggleLightKey(key) {
    if (!state.lightCells) state.lightCells = {};
    if (state.lightCells[key]) delete state.lightCells[key];
    else state.lightCells[key] = true;
  }


  function clampRailCounts() {
    // Section A/B no longer hold railing quantities.
  }

  /**
   * Gangway quote price (THB).
   * Base at 1.2×3 m = 30,000. Each m of length beyond 3 m adds 10,000
   * at the 1.2 m width base, then scale by (width / 1.2).
   * Examples: 1.2×3=30k, 2.4×3=60k, 1.2×6=60k; 2.2×6 ≈ 110k under this rule
   * (stated 2.2×6=60k would match 1.2×6 — we follow proportional-width rule).
   */
  function gangwayPrice(width, length) {
    var w = Number(width) >= 2.4 ? 2.4 : 1.2;
    var L = Math.round(Number(length) || 3);
    if (L < 3) L = 3;
    if (L > 10) L = 10;
    var baseAt12 = 30000 + Math.max(0, L - 3) * 10000;
    return Math.round((w / 1.2) * baseAt12);
  }

  function compute() {
    var g = buildGeometry();
    var layers = Math.min(3, Math.max(1, state.layers | 0));
    var topFloats = g.topFloats;
    var floats = topFloats * layers;
    var areaM2 = topFloats * MODULE * MODULE;
    var capacityPerM2 = CAPACITY_PER_M2 * layers;
    // Round to avoid IEEE noise (1.2*1.2*375 = 540 kg/float)
    var capacity = Math.round(areaM2 * capacityPerM2);

    syncRailSegs(g);
    syncFenderSegs(g);
    syncCleatCells(g);
    syncLightCells(g);
    var railSegs = countOnSegs(state.railSegs);
    var fenderSegs = countOnSegs(state.fenderSegs);
    var cleatCount = countOnSegs(state.cleatCells);
    var lightCount = countOnSegs(state.lightCells);

    var floatCost = floats * state.prices.floatPrice;
    var hdpeCost = topFloats * state.prices.hdpePrice;
    var railCost = railSegs * state.prices.railingPrice;
    var fenderCost = fenderSegs * state.prices.fenderPrice;
    var cleatCost = cleatCount * state.prices.cleatPrice;
    var lightCost = lightCount * state.prices.lightPrice;

    var gwEnabled = !!state.gangway.enabled;
    var gwW = Number(state.gangway.width) >= 2.4 ? 2.4 : 1.2; // only 1.2 or 2.4
    var gwL = Math.round(Number(state.gangway.length) || 3);
    if (gwL < 3) gwL = 3;
    if (gwL > 10) gwL = 10;
    var gwQty = Math.round(Number(state.gangway.qty) || 1);
    if (gwQty < 1) gwQty = 1;
    if (gwQty > 99) gwQty = 99;
    state.gangway.width = gwW;
    state.gangway.length = gwL;
    state.gangway.qty = gwQty;

    // I/L/T/U: no gangway section picker — width/length/qty only; system places.
    var needsSections = false; // I/L/T/U: no section picker — width/length/qty only; system places
    var secA = needsSections ? !!state.gangway.sectionA : false;
    var secB = needsSections ? !!state.gangway.sectionB : false;
    var secC = needsSections && state.shape === "U" ? !!state.gangway.sectionC : false;
    if (needsSections && !secA && !secB && !secC) {
      secA = true;
      state.gangway.sectionA = true;
    }
    if (state.shape !== "U") {
      secC = false;
      state.gangway.sectionC = false;
    }
    state.gangway.sectionA = secA;
    state.gangway.sectionB = secB;
    state.gangway.sectionC = secC;
    var secCount = needsSections ? (secA ? 1 : 0) + (secB ? 1 : 0) + (secC ? 1 : 0) : 1;
    if (secCount < 1) secCount = 1;

    var gwUnit = gangwayPrice(gwW, gwL);
    var gwCost = gwEnabled ? gwUnit * gwQty * secCount : 0;
    var gwSectionsLabel = !needsSections
      ? ""
      : [secA ? "A" : null, secB ? "B" : null, secC ? "C" : null].filter(Boolean).join(", ");

    
    var moEnabled = !!(state.mooring && state.mooring.enabled);
    var moQty = Math.max(0, Math.floor(num(state.mooring && state.mooring.qty, 0)));
    if (state.mooring) state.mooring.qty = moQty;
    var moUnit = state.prices.mooringPrice;
    var moCost = moEnabled ? moQty * moUnit : 0;
    var total = floatCost + hdpeCost + railCost + gwCost + fenderCost + cleatCost + lightCost + moCost;
    var railPerMeter = state.prices.railingPrice / MODULE;

    var finalL = +(g.width * MODULE).toFixed(2);
    var finalH = +(g.height * MODULE).toFixed(2);

    return {
      geo: g,
      cols: g.cols || g.width,
      rows: g.rows || g.height,
      layers: layers,
      layerHeight: +(layers * LAYER_HEIGHT).toFixed(1),
      finalL: finalL,
      finalW: finalH,
      bboxW: finalL,
      bboxH: finalH,
      topFloats: topFloats,
      floats: floats,
      areaM2: +areaM2.toFixed(2),
      capacityPerM2: capacityPerM2,
      capacity: capacity,
      railSegs: railSegs,
      fenderSegs: fenderSegs,
      cleatCount: cleatCount,
      lightCount: lightCount,
      floatCost: floatCost,
      hdpeCost: hdpeCost,
      railCost: railCost,
      fenderCost: fenderCost,
      cleatCost: cleatCost,
      lightCost: lightCost,
      gangwayEnabled: gwEnabled,
      gangwayWidth: gwW,
      gangwayLength: gwL,
      gangwayQty: gwQty,
      gangwaySectionA: secA,
      gangwaySectionB: secB,
      gangwaySectionC: secC,
      gangwaySectionsLabel: gwSectionsLabel,
      gangwayUnitCost: gwUnit,
      gangwaySecCount: secCount,
      gangwayCost: gwCost,
      mooringEnabled: moEnabled,
      mooringQty: moQty,
      mooringUnitCost: moUnit,
      mooringCost: moCost,
      total: total,
      railPerMeter: railPerMeter,
      shape: g.shape,
    };
  }

  function localeTag() {
    return currentLang === "en" ? "en-US" : "th-TH";
  }

  function formatTHB(n) {
    return (
      Number(n).toLocaleString(localeTag(), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }) +
      " " +
      t("unit.baht")
    );
  }

  function formatNum(n) {
    return Number(n).toLocaleString(localeTag());
  }

  function formatKg(n) {
    return formatNum(n) + " " + t("unit.kg");
  }

  function shapeLabel(shape) {
    if (shape === "L") return t("shapeLabel.L");
    if (shape === "T") return t("shapeLabel.T");
    if (shape === "U") return t("shapeLabel.U");
    return t("shapeLabel.straight");
  }

  function $(id) {
    return document.getElementById(id);
  }

  function setHidden(el, hidden) {
    if (!el) return;
    if (hidden) {
      el.setAttribute("hidden", "");
      // important: beats .section-controls { display: grid }
      el.style.setProperty("display", "none", "important");
      el.setAttribute("aria-hidden", "true");
    } else {
      el.removeAttribute("hidden");
      el.style.removeProperty("display");
      el.setAttribute("aria-hidden", "false");
    }
  }

  function renderShapeSelector() {
    document.querySelectorAll(".shape-card").forEach(function (btn) {
      var on = btn.getAttribute("data-shape") === state.shape;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    // Strict isolation: only the selected shape's size/section panel is visible
    setHidden($("controls-straight"), state.shape !== "straight");
    setHidden($("controls-L"), state.shape !== "L");
    setHidden($("controls-T"), state.shape !== "T");
    setHidden($("controls-U"), state.shape !== "U");
    // Click-to-select prompts + helpers for every shape
    setHidden($("rail-prompts-straight"), false);
    setHidden($("rail-prompts-shaped"), true);
    setHidden($("rail-helpers-block"), false);
    setHidden($("rail-shaped-note"), true);
    var title = $("size-card-title");
    if (title) {
      if (state.shape === "straight") {
        title.textContent = t("size.title.straight");
      } else if (state.shape === "L") {
        title.textContent = t("size.title.L");
      } else if (state.shape === "T") {
        title.textContent = t("size.title.T");
      } else if (state.shape === "U") {
        title.textContent = t("size.title.U");
      } else {
        title.textContent = t("size.title.T");
      }
    }
    var gwSecLabel = $("gangway-sections-label");
    if (gwSecLabel) {
      if (state.shape === "L") {
        gwSecLabel.textContent = t("gangway.secLabelL");
      } else if (state.shape === "T") {
        gwSecLabel.textContent = t("gangway.secLabelT");
      } else if (state.shape === "U") {
        gwSecLabel.textContent = t("gangway.secLabelU");
      } else {
        gwSecLabel.textContent = t("gangway.secLabel");
      }
    }
  }

  function renderPresets() {
    var el = $("presets");
    if (!el) return;
    el.innerHTML = "";
    PRESETS.forEach(function (p) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preset-btn" + (state.activePreset === p.id ? " active" : "");
      var cols = Math.round(p.L / MODULE);
      var rows = Math.round(p.W / MODULE);
      var floats = cols * rows;
      var label = p.L.toFixed(1) + "×" + p.W.toFixed(1) + " " + t("unit.m");
      var sub = t("preset.sub", floats, cols, rows);
      btn.innerHTML = label + "<small>" + sub + "</small>";
      btn.addEventListener("click", function () {
        state.reqL = p.L;
        state.reqW = p.W;
        state.activePreset = p.id;
        syncSliders();
        render();
      });
      el.appendChild(btn);
    });
  }

  function syncSliders() {
    if (!$("slider-L")) return;
    $("slider-L").value = state.reqL;
    $("slider-W").value = state.reqW;
    $("val-L").textContent = state.reqL.toFixed(1);
    $("val-W").textContent = state.reqW.toFixed(1);
  }

  function syncSectionDisplays() {
    function set(id, v) {
      var el = $(id);
      if (el) el.textContent = String(v);
    }
    set("val-l-aCols", state.l.aCols);
    set("val-l-aRows", state.l.aRows);
    set("val-l-bCols", state.l.bCols);
    set("val-l-bRows", state.l.bRows);
    set("val-t-barCols", state.t.barCols);
    set("val-t-barRows", state.t.barRows);
    set("val-t-stemCols", state.t.stemCols);
    set("val-t-stemRows", state.t.stemRows);
    set("val-u-aCols", state.u.aCols);
    set("val-u-aRows", state.u.aRows);
    set("val-u-bCols", state.u.bCols);
    set("val-u-bRows", state.u.bRows);
    set("val-u-cCols", state.u.cCols);
    set("val-u-cRows", state.u.cRows);
  }

  function renderDiagram(c) {
    $("diagram").innerHTML = buildSVG(c, false);
    var nodes = $("diagram").querySelectorAll("[data-rail-key]");
    for (var i = 0; i < nodes.length; i++) {
      (function (el) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var key = el.getAttribute("data-rail-key");
          if (!key) return;
          toggleRailKey(key);
          render();
        });
      })(nodes[i]);
    }
  }

  function buildSVG(c, forPrint) {
    if (c.shape === "straight") return buildStraightSVG(c, forPrint);
    return buildComposedSVG(c, forPrint);
  }

  function buildStraightSVG(c, forPrint) {
    var cols = c.geo.cols;
    var rows = c.geo.rows;
    var cell = forPrint ? 28 : Math.min(48, Math.floor(320 / Math.max(cols, rows)));
    cell = Math.max(18, cell);
    var railW = Math.max(4, Math.round(cell * 0.18));
    var hit = Math.max(12, railW + 4);
    var pad = hit + 16;
    var w = cols * cell + pad * 2;
    var h = rows * cell + pad * 2;
    var parts = [];
    parts.push(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
        w +
        " " +
        h +
        '" width="' +
        w +
        '" height="' +
        h +
        '" role="img" aria-label="แผนผังทุ่นลอยน้ำ">'
    );
    parts.push(
      '<rect width="' +
        w +
        '" height="' +
        h +
        '" fill="' +
        (forPrint ? "#e3f2fd" : "transparent") +
        '"/>'
    );

    var r, col;
    for (r = 0; r < rows; r++) {
      for (col = 0; col < cols; col++) {
        var x = pad + col * cell;
        var y = pad + r * cell;
        var gap = 2;
        parts.push(
          '<rect x="' +
            (x + gap / 2) +
            '" y="' +
            (y + gap / 2) +
            '" width="' +
            (cell - gap) +
            '" height="' +
            (cell - gap) +
            '" rx="3" fill="#26a69a" stroke="#00695c" stroke-width="1.5"/>'
        );
        parts.push(
          '<circle cx="' +
            (x + cell / 2) +
            '" cy="' +
            (y + cell / 2) +
            '" r="' +
            Math.max(2, cell * 0.08) +
            '" fill="#80cbc4" opacity="0.7"/>'
        );
      }
    }

    var railColor = "#ff8f00";
    var offFill = "rgba(255,143,0,0.22)";
    var offStroke = "rgba(255,143,0,0.55)";

    function isOn(key) {
      return !!(state.railSegs && state.railSegs[key]);
    }

    function emitSeg(key, rx, ry, rw, rh, horizontal) {
      var on = isOn(key);
      if (forPrint && !on) return;
      var cls = "rail-seg" + (on ? " on" : " off");
      var title = on ? "ราวเปิด — กดเพื่อปิด" : "ราวปิด — กดเพื่อเปิด";
      if (forPrint) {
        parts.push(
          '<rect x="' +
            rx +
            '" y="' +
            ry +
            '" width="' +
            rw +
            '" height="' +
            rh +
            '" rx="2" fill="' +
            railColor +
            '"/>'
        );
        return;
      }
      parts.push('<g class="' + cls + '" data-rail-key="' + key + '" style="cursor:pointer">');
      parts.push(
        '<rect class="rail-hit" x="' +
          rx +
          '" y="' +
          ry +
          '" width="' +
          rw +
          '" height="' +
          rh +
          '" rx="2" fill="' +
          (on ? railColor : offFill) +
          '" stroke="' +
          (on ? railColor : offStroke) +
          '" stroke-width="' +
          (on ? "0" : "1.25") +
          '"' +
          (on ? "" : ' stroke-dasharray="4 3"') +
          "><title>" +
          title +
          "</title></rect>"
      );
      if (on) {
        var inset = horizontal ? Math.max(0, (rh - railW) / 2) : Math.max(0, (rw - railW) / 2);
        var vx = horizontal ? rx : rx + inset;
        var vy = horizontal ? ry + inset : ry;
        var vw = horizontal ? rw : Math.min(railW, rw);
        var vh = horizontal ? Math.min(railW, rh) : rh;
        parts.push(
          '<rect x="' +
            vx +
            '" y="' +
            vy +
            '" width="' +
            vw +
            '" height="' +
            vh +
            '" rx="2" fill="' +
            railColor +
            '" pointer-events="none"/>'
        );
      }
      parts.push("</g>");
    }

    var hy, hx;
    for (hy = 0; hy <= rows; hy++) {
      for (hx = 0; hx < cols; hx++) {
        var hKey = "h:" + hy + ":" + hx;
        var hx0 = pad + hx * cell;
        var hyCenter;
        if (hy === 0) hyCenter = pad - hit / 2 - 1;
        else if (hy === rows) hyCenter = pad + rows * cell + hit / 2 + 1;
        else hyCenter = pad + hy * cell;
        emitSeg(hKey, hx0, hyCenter - hit / 2, cell, hit, true);
      }
    }
    var vx, vy;
    for (vx = 0; vx <= cols; vx++) {
      for (vy = 0; vy < rows; vy++) {
        var vKey = "v:" + vy + ":" + vx;
        var vy0 = pad + vy * cell;
        var vxCenter;
        if (vx === 0) vxCenter = pad - hit / 2 - 1;
        else if (vx === cols) vxCenter = pad + cols * cell + hit / 2 + 1;
        else vxCenter = pad + vx * cell;
        emitSeg(vKey, vxCenter - hit / 2, vy0, hit, cell, false);
      }
    }

    parts.push("</svg>");
    return parts.join("");
  }

  function buildComposedSVG(c, forPrint) {
    var g = c.geo;
    var maxDim = Math.max(g.width, g.height, 1);
    var cell = forPrint ? 26 : Math.min(44, Math.floor(340 / maxDim));
    cell = Math.max(16, cell);
    var railW = Math.max(3, Math.round(cell * 0.16));
    var hitPad = Math.max(12, railW + 4);
    var pad = hitPad + 16;
    var w = g.width * cell + pad * 2;
    var h = g.height * cell + pad * 2;
    var parts = [];
    parts.push(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
        w +
        " " +
        h +
        '" width="' +
        w +
        '" height="' +
        h +
        '" role="img" aria-label="แผนผังทุ่นลอยน้ำ ' +
        shapeLabel(g.shape) +
        '">'
    );
    parts.push(
      '<rect width="' +
        w +
        '" height="' +
        h +
        '" fill="' +
        (forPrint ? "#e3f2fd" : "transparent") +
        '"/>'
    );

    // Distinct section colors so A / B / C read clearly on the top-view plan
    var fillBySection = {
      A: "#26c6da",
      B: "#5c6bc0",
      C: "#66bb6a",
      bar: "#26c6da",
      stem: "#5c6bc0",
      main: "#26a69a",
    };
    var strokeBySection = {
      A: "#00838f",
      B: "#3949ab",
      C: "#2e7d32",
      bar: "#00838f",
      stem: "#3949ab",
      main: "#00695c",
    };
    var labelBgBySection = {
      A: "rgba(0,131,143,0.88)",
      B: "rgba(57,73,171,0.88)",
      C: "rgba(46,125,50,0.88)",
      bar: "rgba(0,131,143,0.88)",
      stem: "rgba(57,73,171,0.88)",
      main: "rgba(0,105,92,0.88)",
    };

    g.cells.forEach(function (cellObj) {
      var x = pad + cellObj.x * cell;
      var y = pad + cellObj.y * cell;
      var gap = 2;
      var fill = fillBySection[cellObj.section] || "#26a69a";
      var stroke = strokeBySection[cellObj.section] || "#00695c";
      parts.push(
        '<rect x="' +
          (x + gap / 2) +
          '" y="' +
          (y + gap / 2) +
          '" width="' +
          (cell - gap) +
          '" height="' +
          (cell - gap) +
          '" rx="3" fill="' +
          fill +
          '" stroke="' +
          stroke +
          '" stroke-width="2"/>'
      );
      parts.push(
        '<circle cx="' +
          (x + cell / 2) +
          '" cy="' +
          (y + cell / 2) +
          '" r="' +
          Math.max(2, cell * 0.08) +
          '" fill="rgba(255,255,255,0.45)" opacity="0.85"/>'
      );
    });

    // Strong section outline + badge label (A / B / C stand out on U and L/T)
    g.sections.forEach(function (sec) {
      if (!sec.label || sec.id === "main") return;
      var sx = pad + sec.x0 * cell;
      var sy = pad + sec.y0 * cell;
      var sw = sec.w * cell;
      var sh = sec.h * cell;
      var stroke = strokeBySection[sec.id] || "#00695c";
      var bg = labelBgBySection[sec.id] || "rgba(0,105,92,0.88)";
      parts.push(
        '<rect x="' +
          sx +
          '" y="' +
          sy +
          '" width="' +
          sw +
          '" height="' +
          sh +
          '" fill="none" stroke="' +
          stroke +
          '" stroke-width="3" stroke-dasharray="6 3" rx="4" pointer-events="none"/>'
      );
      var cx = sx + sw / 2;
      var cy = sy + sh / 2;
      var fontSize = Math.max(14, Math.min(28, cell * 0.55));
      var badgeW = Math.max(28, fontSize * 1.35);
      var badgeH = Math.max(22, fontSize * 1.05);
      parts.push(
        '<rect x="' +
          (cx - badgeW / 2) +
          '" y="' +
          (cy - badgeH / 2) +
          '" width="' +
          badgeW +
          '" height="' +
          badgeH +
          '" rx="6" fill="' +
          bg +
          '" stroke="#fff" stroke-width="1.5" pointer-events="none"/>'
      );
      parts.push(
        '<text x="' +
          cx +
          '" y="' +
          cy +
          '" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="' +
          fontSize +
          '" font-weight="800" font-family="Sarabun,sans-serif" pointer-events="none">' +
          sec.label +
          "</text>"
      );
    });

    // Clickable rail segments on every cell edge (same keys as straight)
    var railColor = "#ff8f00";
    var offFill = "rgba(255,143,0,0.22)";
    var offStroke = "rgba(255,143,0,0.55)";
    var hit = Math.max(12, railW + 4);
    var occ = cellOccupancy(g.cells);
    var edgeKeys = edgeKeysFromCells(g.cells);

    function isOn(key) {
      return !!(state.railSegs && state.railSegs[key]);
    }

    function emitSeg(key, rx, ry, rw, rh, horizontal) {
      var on = isOn(key);
      if (forPrint && !on) return;
      var cls = "rail-seg" + (on ? " on" : " off");
      var title = on ? "ราวเปิด — กดเพื่อปิด" : "ราวปิด — กดเพื่อเปิด";
      if (forPrint) {
        parts.push(
          '<rect x="' +
            rx +
            '" y="' +
            ry +
            '" width="' +
            rw +
            '" height="' +
            rh +
            '" rx="2" fill="' +
            railColor +
            '"/>'
        );
        return;
      }
      parts.push('<g class="' + cls + '" data-rail-key="' + key + '" style="cursor:pointer">');
      parts.push(
        '<rect class="rail-hit" x="' +
          rx +
          '" y="' +
          ry +
          '" width="' +
          rw +
          '" height="' +
          rh +
          '" rx="2" fill="' +
          (on ? railColor : offFill) +
          '" stroke="' +
          (on ? railColor : offStroke) +
          '" stroke-width="' +
          (on ? "0" : "1.25") +
          '"' +
          (on ? "" : ' stroke-dasharray="4 3"') +
          "><title>" +
          title +
          "</title></rect>"
      );
      if (on) {
        var inset = horizontal ? Math.max(0, (rh - railW) / 2) : Math.max(0, (rw - railW) / 2);
        var vx = horizontal ? rx : rx + inset;
        var vy = horizontal ? ry + inset : ry;
        var vw = horizontal ? rw : Math.min(railW, rw);
        var vh = horizontal ? Math.min(railW, rh) : rh;
        parts.push(
          '<rect x="' +
            vx +
            '" y="' +
            vy +
            '" width="' +
            vw +
            '" height="' +
            vh +
            '" rx="2" fill="' +
            railColor +
            '" pointer-events="none"/>'
        );
      }
      parts.push("</g>");
    }

    Object.keys(edgeKeys).forEach(function (key) {
      var partsK = key.split(":");
      var orient = partsK[0];
      var a = parseInt(partsK[1], 10);
      var b = parseInt(partsK[2], 10);
      if (orient === "h") {
        // h:y:x — horizontal along grid line y, cell column x
        var hy = a;
        var hx = b;
        var hx0 = pad + hx * cell;
        var above = hasCellAt(occ, hx, hy - 1);
        var below = hasCellAt(occ, hx, hy);
        var hyCenter;
        if (below && !above) hyCenter = pad + hy * cell - hit / 2 - 1;
        else if (above && !below) hyCenter = pad + hy * cell + hit / 2 + 1;
        else hyCenter = pad + hy * cell;
        emitSeg(key, hx0, hyCenter - hit / 2, cell, hit, true);
      } else if (orient === "v") {
        // v:y:x — vertical along grid line x, cell row y
        var vy = a;
        var vx = b;
        var vy0 = pad + vy * cell;
        var left = hasCellAt(occ, vx - 1, vy);
        var right = hasCellAt(occ, vx, vy);
        var vxCenter;
        if (right && !left) vxCenter = pad + vx * cell - hit / 2 - 1;
        else if (left && !right) vxCenter = pad + vx * cell + hit / 2 + 1;
        else vxCenter = pad + vx * cell;
        emitSeg(key, vxCenter - hit / 2, vy0, hit, cell, false);
      }
    });

    parts.push("</svg>");
    return parts.join("");
  }



  function buildAccessorySVG(c) {
    var g = c.geo;
    var cells = g.cells || [];
    var width = g.width;
    var height = g.height;
    var maxDim = Math.max(width, height, 1);
    var cell = Math.min(44, Math.floor(340 / maxDim));
    cell = Math.max(16, cell);
    var fenderW = Math.max(3, Math.round(cell * 0.16));
    var hit = Math.max(12, fenderW + 4);
    var pad = hit + 16;
    var w = width * cell + pad * 2;
    var h = height * cell + pad * 2;
    var mode =
      state.accessoryMode === "cleat"
        ? "cleat"
        : state.accessoryMode === "light"
          ? "light"
          : "fender";
    var parts = [];
    parts.push(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
        w +
        " " +
        h +
        '" width="' +
        w +
        '" height="' +
        h +
        '" role="img" aria-label="' +
        t("accessory.heading") +
        '">'
    );
    parts.push('<rect width="' + w + '" height="' + h + '" fill="transparent"/>');

    var fillBySection = {
      A: "#26c6da",
      B: "#5c6bc0",
      C: "#66bb6a",
      bar: "#26c6da",
      stem: "#5c6bc0",
      main: "#26a69a",
    };
    var strokeBySection = {
      A: "#00838f",
      B: "#3949ab",
      C: "#2e7d32",
      bar: "#00838f",
      stem: "#3949ab",
      main: "#00695c",
    };

    var occ = cellOccupancy(cells);
    var peri = allPerimeterFromCells(cells);
    var fenderColor = "#c62828";
    var offFill = "rgba(198,40,40,0.22)";
    var offStroke = "rgba(198,40,40,0.55)";

    function emitCleatMarker(cx, cy, s) {
      parts.push(
        '<g pointer-events="none">' +
          '<ellipse cx="' +
          cx +
          '" cy="' +
          cy +
          '" rx="' +
          s * 0.85 +
          '" ry="' +
          s * 0.35 +
          '" fill="#cfd8dc" stroke="#546e7a" stroke-width="1.5"/>' +
          '<rect x="' +
          (cx - s * 0.18) +
          '" y="' +
          (cy - s * 0.55) +
          '" width="' +
          s * 0.36 +
          '" height="' +
          s * 1.1 +
          '" rx="2" fill="#90a4ae" stroke="#455a64" stroke-width="1"/>' +
          '<circle cx="' +
          (cx - s * 0.45) +
          '" cy="' +
          cy +
          '" r="' +
          Math.max(1.5, s * 0.12) +
          '" fill="#eceff1" stroke="#607d8b" stroke-width="0.75"/>' +
          '<circle cx="' +
          (cx + s * 0.45) +
          '" cy="' +
          cy +
          '" r="' +
          Math.max(1.5, s * 0.12) +
          '" fill="#eceff1" stroke="#607d8b" stroke-width="0.75"/>' +
          "</g>"
      );
    }

    function emitLightMarker(cx, cy, s) {
      // Amber solar lamp-post icon (distinct from stainless cleat)
      var poleH = s * 1.15;
      var poleW = Math.max(1.5, s * 0.14);
      parts.push(
        '<g pointer-events="none">' +
          '<rect x="' +
          (cx - poleW / 2) +
          '" y="' +
          (cy - poleH * 0.15) +
          '" width="' +
          poleW +
          '" height="' +
          poleH +
          '" rx="1" fill="#f9a825" stroke="#f57f17" stroke-width="0.75"/>' +
          '<circle cx="' +
          cx +
          '" cy="' +
          (cy - poleH * 0.35) +
          '" r="' +
          Math.max(3, s * 0.38) +
          '" fill="#ffe082" stroke="#ff8f00" stroke-width="1.5"/>' +
          '<circle cx="' +
          cx +
          '" cy="' +
          (cy - poleH * 0.35) +
          '" r="' +
          Math.max(1.2, s * 0.14) +
          '" fill="#fff8e1"/>' +
          "</g>"
      );
    }

    cells.forEach(function (cellObj) {
      var x = pad + cellObj.x * cell;
      var y = pad + cellObj.y * cell;
      var gap = 2;
      var fill = fillBySection[cellObj.section] || "#26a69a";
      var stroke = strokeBySection[cellObj.section] || "#00695c";
      var ck = cellObj.x + "," + cellObj.y;
      var hasCleat = !!(state.cleatCells && state.cleatCells[ck]);
      var hasLight = !!(state.lightCells && state.lightCells[ck]);
      var cx = x + cell / 2;
      var cy = y + cell / 2;
      var s = Math.max(6, cell * 0.28);

      parts.push(
        '<rect x="' +
          (x + gap / 2) +
          '" y="' +
          (y + gap / 2) +
          '" width="' +
          (cell - gap) +
          '" height="' +
          (cell - gap) +
          '" rx="3" fill="' +
          fill +
          '" stroke="' +
          stroke +
          '" stroke-width="2"/>'
      );


      if (mode === "cleat") {
        var hitFill = hasCleat ? "rgba(96,125,139,0.12)" : "rgba(255,255,255,0.01)";
        parts.push(
          '<g class="cleat-cell' +
            (hasCleat ? " on" : " off") +
            '" data-cleat-key="' +
            ck +
            '" style="cursor:pointer">'
        );
        parts.push(
          '<rect class="cleat-hit" x="' +
            (x + gap / 2) +
            '" y="' +
            (y + gap / 2) +
            '" width="' +
            (cell - gap) +
            '" height="' +
            (cell - gap) +
            '" rx="3" fill="' +
            hitFill +
            '" stroke="' +
            (hasCleat ? "#607d8b" : "rgba(96,125,139,0.35)") +
            '" stroke-width="' +
            (hasCleat ? "2" : "1") +
            '"' +
            (hasCleat ? "" : ' stroke-dasharray="4 3"') +
            "><title>" +
            (hasCleat ? "คลีตเปิด — กดเพื่อปิด" : "คลีตปิด — กดเพื่อเปิด") +
            "</title></rect>"
        );
        if (hasCleat) emitCleatMarker(cx, cy, s);
        parts.push("</g>");
        if (hasLight) emitLightMarker(cx, cy - s * 0.55, s * 0.85);
      } else if (mode === "light") {
        var lHitFill = hasLight ? "rgba(255,193,7,0.18)" : "rgba(255,255,255,0.01)";
        parts.push(
          '<g class="light-cell' +
            (hasLight ? " on" : " off") +
            '" data-light-key="' +
            ck +
            '" style="cursor:pointer">'
        );
        parts.push(
          '<rect class="light-hit" x="' +
            (x + gap / 2) +
            '" y="' +
            (y + gap / 2) +
            '" width="' +
            (cell - gap) +
            '" height="' +
            (cell - gap) +
            '" rx="3" fill="' +
            lHitFill +
            '" stroke="' +
            (hasLight ? "#ff8f00" : "rgba(255,143,0,0.4)") +
            '" stroke-width="' +
            (hasLight ? "2" : "1") +
            '"' +
            (hasLight ? "" : ' stroke-dasharray="4 3"') +
            "><title>" +
            (hasLight
              ? "เสาไฟโซลาร์เซลล์เปิด — กดเพื่อปิด"
              : "เสาไฟโซลาร์เซลล์ปิด — กดเพื่อเปิด") +
            "</title></rect>"
        );
        if (hasLight) emitLightMarker(cx, cy, s);
        parts.push("</g>");
        if (hasCleat) emitCleatMarker(cx, cy + s * 0.35, s * 0.75);
      } else {
        // Fender mode: show installed markers non-interactive
        if (hasCleat) emitCleatMarker(cx, cy - (hasLight ? s * 0.35 : 0), s * (hasLight ? 0.75 : 1));
        if (hasLight) emitLightMarker(cx, cy + (hasCleat ? s * 0.35 : 0), s * (hasCleat ? 0.85 : 1));
        if (!hasCleat && !hasLight) {
          parts.push(
            '<circle cx="' +
              cx +
              '" cy="' +
              cy +
              '" r="' +
              Math.max(2, cell * 0.08) +
              '" fill="rgba(255,255,255,0.45)" opacity="0.85"/>'
          );
        }
      }
    });

    function isFenderOn(key) {
      return !!(state.fenderSegs && state.fenderSegs[key]);
    }

    function emitFender(key, rx, ry, rw, rh, horizontal) {
      var on = isFenderOn(key);
      var cls = "fender-seg" + (on ? " on" : " off");
      var title = on ? "กันชนเปิด — กดเพื่อปิด" : "กันชนปิด — กดเพื่อเปิด";
      if (mode !== "fender") {
        // show installed fenders only
        if (!on) return;
        parts.push(
          '<rect x="' +
            rx +
            '" y="' +
            ry +
            '" width="' +
            rw +
            '" height="' +
            rh +
            '" rx="2" fill="' +
            fenderColor +
            '" pointer-events="none"/>'
        );
        return;
      }
      parts.push('<g class="' + cls + '" data-fender-key="' + key + '" style="cursor:pointer">');
      parts.push(
        '<rect class="fender-hit" x="' +
          rx +
          '" y="' +
          ry +
          '" width="' +
          rw +
          '" height="' +
          rh +
          '" rx="2" fill="' +
          (on ? fenderColor : offFill) +
          '" stroke="' +
          (on ? fenderColor : offStroke) +
          '" stroke-width="' +
          (on ? "0" : "1.25") +
          '"' +
          (on ? "" : ' stroke-dasharray="4 3"') +
          "><title>" +
          title +
          "</title></rect>"
      );
      if (on) {
        var inset = horizontal ? Math.max(0, (rh - fenderW) / 2) : Math.max(0, (rw - fenderW) / 2);
        var vx = horizontal ? rx : rx + inset;
        var vy = horizontal ? ry + inset : ry;
        var vw = horizontal ? rw : Math.min(fenderW, rw);
        var vh = horizontal ? Math.min(fenderW, rh) : rh;
        parts.push(
          '<rect x="' +
            vx +
            '" y="' +
            vy +
            '" width="' +
            vw +
            '" height="' +
            vh +
            '" rx="2" fill="' +
            fenderColor +
            '" pointer-events="none"/>'
        );
      }
      parts.push("</g>");
    }

    Object.keys(peri).forEach(function (key) {
      var partsK = key.split(":");
      var orient = partsK[0];
      var a = parseInt(partsK[1], 10);
      var b = parseInt(partsK[2], 10);
      if (orient === "h") {
        var hy = a;
        var hx = b;
        var hx0 = pad + hx * cell;
        var above = hasCellAt(occ, hx, hy - 1);
        var below = hasCellAt(occ, hx, hy);
        var hyCenter;
        if (below && !above) hyCenter = pad + hy * cell - hit / 2 - 1;
        else if (above && !below) hyCenter = pad + hy * cell + hit / 2 + 1;
        else hyCenter = pad + hy * cell;
        emitFender(key, hx0, hyCenter - hit / 2, cell, hit, true);
      } else if (orient === "v") {
        var vy = a;
        var vx = b;
        var vy0 = pad + vy * cell;
        var left = hasCellAt(occ, vx - 1, vy);
        var right = hasCellAt(occ, vx, vy);
        var vxCenter;
        if (right && !left) vxCenter = pad + vx * cell - hit / 2 - 1;
        else if (left && !right) vxCenter = pad + vx * cell + hit / 2 + 1;
        else vxCenter = pad + vx * cell;
        emitFender(key, vxCenter - hit / 2, vy0, hit, cell, false);
      }
    });

    parts.push("</svg>");
    return parts.join("");
  }

  function renderAccessoryDiagram(c) {
    var wrap = $("accessory-diagram");
    if (!wrap) return;
    wrap.innerHTML = buildAccessorySVG(c);
    wrap.classList.toggle("accessory-mode-fender", state.accessoryMode === "fender");
    wrap.classList.toggle("accessory-mode-cleat", state.accessoryMode === "cleat");
    wrap.classList.toggle("accessory-mode-light", state.accessoryMode === "light");

    var modeF = $("accessory-mode-fender");
    var modeC = $("accessory-mode-cleat");
    var modeL = $("accessory-mode-light");
    if (modeF) modeF.setAttribute("aria-pressed", state.accessoryMode === "fender" ? "true" : "false");
    if (modeC) modeC.setAttribute("aria-pressed", state.accessoryMode === "cleat" ? "true" : "false");
    if (modeL) modeL.setAttribute("aria-pressed", state.accessoryMode === "light" ? "true" : "false");

    var sf = $("stat-fenders");
    var sc = $("stat-cleats");
    var sl = $("stat-lights");
    if (sf) sf.textContent = formatNum(c.fenderSegs);
    if (sc) sc.textContent = formatNum(c.cleatCount);
    if (sl) sl.textContent = formatNum(c.lightCount);

    var fNodes = wrap.querySelectorAll("[data-fender-key]");
    for (var i = 0; i < fNodes.length; i++) {
      (function (el) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (state.accessoryMode !== "fender") return;
          var key = el.getAttribute("data-fender-key");
          if (!key) return;
          toggleFenderKey(key);
          render();
        });
      })(fNodes[i]);
    }
    var cNodes = wrap.querySelectorAll("[data-cleat-key]");
    for (var j = 0; j < cNodes.length; j++) {
      (function (el) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (state.accessoryMode !== "cleat") return;
          var key = el.getAttribute("data-cleat-key");
          if (!key) return;
          toggleCleatKey(key);
          render();
        });
      })(cNodes[j]);
    }
    var lNodes = wrap.querySelectorAll("[data-light-key]");
    for (var k = 0; k < lNodes.length; k++) {
      (function (el) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (state.accessoryMode !== "light") return;
          var key = el.getAttribute("data-light-key");
          if (!key) return;
          toggleLightKey(key);
          render();
        });
      })(lNodes[k]);
    }
  }


  function renderMooringUI(c) {
    var en = $("mooring-enabled");
    var box = $("mooring-controls");
    if (en) en.checked = !!(state.mooring && state.mooring.enabled);
    if (box) setHidden(box, !(state.mooring && state.mooring.enabled));
    var q = $("mooring-qty");
    if (q && document.activeElement !== q) {
      q.value = String((state.mooring && state.mooring.qty) || 0);
    }
    var hint = $("mooring-price-hint");
    if (hint) {
      if (state.mooring && state.mooring.enabled) {
        hint.textContent = t(
          "mooring.priceOn",
          formatTHB(c.mooringCost),
          formatNum(state.prices.mooringPrice),
          formatNum(c.mooringQty)
        );
      } else {
        hint.textContent = t("mooring.priceOff");
      }
    }
  }

  function renderGangwayUI(c) {
    var en = $("gangway-enabled");
    var box = $("gangway-controls");
    var secBox = $("gangway-sections");
    if (en) en.checked = !!state.gangway.enabled;
    if (box) setHidden(box, !state.gangway.enabled);

    var needsSections = false; // I/L/T/U: no section picker — width/length/qty only; system places
    if (secBox) setHidden(secBox, !needsSections);

    var btnA = $("gangway-sec-A");
    var btnB = $("gangway-sec-B");
    var btnC = $("gangway-sec-C");
    if (btnA) btnA.setAttribute("aria-pressed", state.gangway.sectionA ? "true" : "false");
    if (btnB) btnB.setAttribute("aria-pressed", state.gangway.sectionB ? "true" : "false");
    if (btnC) {
      setHidden(btnC, state.shape !== "U");
      btnC.setAttribute("aria-pressed", state.gangway.sectionC ? "true" : "false");
    }

    document.querySelectorAll("[data-gangway-width]").forEach(function (btn) {
      var on = Number(btn.getAttribute("data-gangway-width")) === Number(state.gangway.width);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.querySelectorAll("[data-gangway-length]").forEach(function (btn) {
      var on = Number(btn.getAttribute("data-gangway-length")) === Number(state.gangway.length);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    var qv = $("gangway-qty-val");
    if (qv) qv.textContent = String(state.gangway.qty || 1);

    var hint = $("gangway-price-hint");
    if (hint) {
      if (state.gangway.enabled) {
        var secTimes = c.gangwaySecCount > 1 ? t("gangway.secTimes", c.gangwaySecCount) : "";
        var secTxt = c.gangwaySectionsLabel ? t("gangway.secDot", c.gangwaySectionsLabel) : "";
        hint.textContent = t(
          "gangway.priceOn",
          formatTHB(c.gangwayCost),
          Number(c.gangwayWidth).toFixed(1),
          Number(c.gangwayLength).toFixed(0),
          c.gangwayQty,
          secTimes,
          secTxt
        );
      } else {
        hint.textContent = t("gangway.priceOff");
      }
    }
  }

  function renderQuote(c) {
    var tbody = $("quote-body");
    tbody.innerHTML =
      "<tr>" +
      "<td>" +
      t("quote.floatItem", c.layers) +
      "</td>" +
      '<td class="qty">' +
      t("quote.sets", formatNum(c.floats)) +
      "</td>" +
      "<td>" +
      formatTHB(state.prices.floatPrice) +
      "</td>" +
      "<td>" +
      formatTHB(c.floatCost) +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>" +
      t("quote.hdpeItem") +
      "</td>" +
      '<td class="qty">' +
      t("quote.sets", formatNum(c.topFloats)) +
      "</td>" +
      "<td>" +
      formatTHB(state.prices.hdpePrice) +
      "</td>" +
      "<td>" +
      formatTHB(c.hdpeCost) +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>" +
      t("quote.railItem") +
      "</td>" +
      '<td class="qty">' +
      t("quote.sets", formatNum(c.railSegs)) +
      "</td>" +
      "<td>" +
      formatTHB(state.prices.railingPrice) +
      "</td>" +
      "<td>" +
      formatTHB(c.railCost) +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>" +
      t("quote.fenderItem") +
      "</td>" +
      '<td class="qty">' +
      t("quote.sets", formatNum(c.fenderSegs)) +
      "</td>" +
      "<td>" +
      formatTHB(state.prices.fenderPrice) +
      "</td>" +
      "<td>" +
      formatTHB(c.fenderCost) +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>" +
      t("quote.cleatItem") +
      "</td>" +
      '<td class="qty">' +
      t("quote.sets", formatNum(c.cleatCount)) +
      "</td>" +
      "<td>" +
      formatTHB(state.prices.cleatPrice) +
      "</td>" +
      "<td>" +
      formatTHB(c.cleatCost) +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>" +
      t("quote.lightItem") +
      "</td>" +
      '<td class="qty">' +
      t("quote.sets", formatNum(c.lightCount)) +
      "</td>" +
      "<td>" +
      formatTHB(state.prices.lightPrice) +
      "</td>" +
      "<td>" +
      formatTHB(c.lightCost) +
      "</td>" +
      "</tr>" +
      "";

    if (c.gangwayEnabled) {
      var gwSec = c.gangwaySectionsLabel ? t("gangway.secDot", c.gangwaySectionsLabel) : "";
      tbody.innerHTML +=
        "<tr>" +
        "<td>" +
        t(
          "quote.gangwayItem",
          Number(c.gangwayWidth).toFixed(1),
          Number(c.gangwayLength).toFixed(0),
          gwSec
        ) +
        "</td>" +
        '<td class="qty">' +
        t("quote.sets", formatNum(c.gangwayQty * c.gangwaySecCount)) +
        "</td>" +
        "<td>" +
        formatTHB(c.gangwayUnitCost) +
        "</td>" +
        "<td>" +
        formatTHB(c.gangwayCost) +
        "</td>" +
        "</tr>";
    }

    if (c.mooringEnabled) {
      tbody.innerHTML +=
        "<tr>" +
        "<td>" +
        t("quote.mooringItem") +
        "</td>" +
        '<td class="qty">' +
        t("quote.sets", formatNum(c.mooringQty)) +
        "</td>" +
        "<td>" +
        formatTHB(state.prices.mooringPrice) +
        "</td>" +
        "<td>" +
        formatTHB(c.mooringCost) +
        "</td>" +
        "</tr>";
    }

    $("grand-total").textContent = formatTHB(c.total);
    $("rail-per-m").textContent = t(
      "rail.perM",
      formatTHB(Math.round(c.railPerMeter)),
      formatNum(c.railSegs)
    );
  }

  function renderStats(c) {
    $("stat-floats").textContent = formatNum(c.floats);
    $("stat-size").textContent = c.bboxW + "×" + c.bboxH + " " + t("unit.m");
    $("stat-rails").textContent = formatNum(c.railSegs);
    $("cap-value").textContent = formatKg(c.capacity) + " " + t("cap.total");
    var capM2 = $("cap-per-m2");
    if (capM2) {
      capM2.textContent = t(
        "cap.perM2",
        formatNum(c.capacityPerM2),
        formatNum(c.capacity),
        formatNum(c.areaM2),
        c.layers
      );
    }
    var layerHint = $("layer-hint");
    if (layerHint) {
      layerHint.textContent = t(
        "layers.hintDyn",
        c.layers,
        c.layerHeight,
        formatNum(c.capacityPerM2)
      );
    }
    document.querySelectorAll(".layer-btn").forEach(function (btn) {
      var on = String(c.layers) === btn.getAttribute("data-layers");
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    if (c.shape === "straight") {
      $("size-rounded").textContent = t(
        "size.actual",
        c.finalL,
        c.finalW,
        c.geo.cols,
        c.geo.rows
      );
      $("size-requested").textContent = t(
        "size.requested",
        state.reqL.toFixed(1),
        state.reqW.toFixed(1)
      );
    } else if (c.shape === "L") {
      var g = c.geo;
      var elR = $("size-rounded-L");
      var elD = $("size-detail-L");
      if (elR) {
        elR.textContent = t(
          "size.topFloatsBox",
          formatNum(c.topFloats),
          c.bboxW,
          c.bboxH
        );
      }
      if (elD) {
        elD.textContent = t(
          "size.detailL",
          g.aCols,
          g.aRows,
          g.bCols,
          g.bRows,
          c.topFloats
        );
      }
    } else if (c.shape === "T") {
      var gt = c.geo;
      var elRT = $("size-rounded-T");
      var elDT = $("size-detail-T");
      if (elRT) {
        elRT.textContent = t(
          "size.topFloatsBox",
          formatNum(c.topFloats),
          c.bboxW,
          c.bboxH
        );
      }
      if (elDT) {
        elDT.textContent = t(
          "size.detailT",
          gt.barCols,
          gt.barRows,
          gt.stemCols,
          gt.stemRows,
          gt.stemStart,
          c.topFloats
        );
      }
    } else if (c.shape === "U") {
      var gu = c.geo;
      var elRU = $("size-rounded-U");
      var elDU = $("size-detail-U");
      if (elRU) {
        elRU.textContent = t(
          "size.topFloatsBox",
          formatNum(c.topFloats),
          c.bboxW,
          c.bboxH
        );
      }
      if (elDU) {
        elDU.textContent = t(
          "size.detailU",
          gu.aCols,
          gu.aRows,
          gu.bCols,
          gu.bRows,
          gu.cCols,
          gu.cRows,
          c.topFloats
        );
      }
    }
  }

  function renderAdmin() {
    $("price-float").value = state.prices.floatPrice;
    $("price-hdpe").value = state.prices.hdpePrice;
    $("price-rail").value = state.prices.railingPrice;
    if ($("price-fender")) $("price-fender").value = state.prices.fenderPrice;
    if ($("price-cleat")) $("price-cleat").value = state.prices.cleatPrice;
    if ($("price-light")) $("price-light").value = state.prices.lightPrice;
    if ($("price-mooring")) $("price-mooring").value = state.prices.mooringPrice;
  }

  function sizeSummaryText(c) {
    if (c.shape === "straight") {
      return t(
        "summary.straight",
        c.finalL,
        c.finalW,
        c.geo.cols,
        c.geo.rows
      );
    }
    if (c.shape === "L") {
      return t(
        "summary.L",
        c.geo.aCols,
        c.geo.aRows,
        c.geo.bCols,
        c.geo.bRows,
        c.topFloats,
        c.bboxW,
        c.bboxH
      );
    }
    if (c.shape === "U") {
      return t(
        "size.detailU",
        c.geo.aCols,
        c.geo.aRows,
        c.geo.bCols,
        c.geo.bRows,
        c.geo.cCols,
        c.geo.cRows,
        c.topFloats
      );
    }
    return t(
      "summary.T",
      c.geo.barCols,
      c.geo.barRows,
      c.geo.stemCols,
      c.geo.stemRows,
      c.topFloats,
      c.bboxW,
      c.bboxH
    );
  }

  function getDownloadPrintCSS() {
    return [
      "body{font-family:Sarabun,'Noto Sans Thai',sans-serif;max-width:900px;margin:1.5rem auto;padding:1rem;color:#111;font-size:11pt;line-height:1.45;}",
      ".pq-letterhead{margin-bottom:.75rem;}",
      ".pq-logo{width:100%;max-width:100%;height:auto;display:block;}",
      ".pq-docbar{display:flex;justify-content:space-between;align-items:center;margin-top:.35rem;}",
      ".pq-doccode{font-size:.8rem;color:#555;letter-spacing:.02em;}",
      ".pq-badge{display:inline-block;background:#2B7DE9;color:#fff;font-weight:800;letter-spacing:.08em;padding:.35rem .85rem;border-radius:4px;font-size:.95rem;}",
      ".pq-company-line{font-weight:700;color:#0a4d5c;margin:.35rem 0 .75rem;font-size:.95rem;}",
      ".pq-meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem 1.5rem;margin-bottom:1rem;font-size:.9rem;}",
      ".pq-meta-row{display:flex;gap:.5rem;margin:.2rem 0;}",
      ".pq-meta-label{min-width:9.5rem;color:#333;flex-shrink:0;}",
      ".pq-meta-value{flex:1;border-bottom:1px dotted #999;min-height:1.1em;}",
      "h2{font-size:1.05rem;margin:1rem 0 .5rem;color:#2B7DE9;border-bottom:2px solid #2B7DE9;padding-bottom:.25rem;}",
      "h3{font-size:.95rem;margin:.5rem 0 .35rem;color:#0a4d5c;}",
      "table{width:100%;border-collapse:collapse;margin:.4rem 0 .8rem;}",
      "th,td{border:1px solid #b0bec5;padding:.4rem .5rem;text-align:left;vertical-align:top;}",
      "th{background:#E3F2FD;color:#0d47a1;font-weight:700;}",
      "td.num,th.num{text-align:right;}",
      ".pq-num{width:2.2rem;text-align:center;}",
      ".pq-desc-sub{font-size:.8rem;color:#555;}",
      ".pq-tbd-row td{background:#fffde7;}",
      ".pq-diagram{text-align:center;margin:.75rem 0;}",
      ".pq-diagram svg{max-width:100%;height:auto;}",
      ".pq-terms-totals{display:grid;grid-template-columns:1.2fr .8fr;gap:1rem;margin:1rem 0;}",
      ".pq-terms p{margin:.25rem 0;font-size:.85rem;}",
      ".pq-total-row{display:flex;justify-content:space-between;padding:.35rem .5rem;border-bottom:1px solid #ddd;}",
      ".pq-grand{background:#2B7DE9;color:#fff;font-weight:800;border:none;margin-top:.25rem;}",
      ".pq-tbd-note{font-size:.75rem;color:#c62828;margin:.4rem 0 0;}",
      ".pq-amount-words{font-size:.85rem;margin:.5rem 0;}",
      ".pq-bank{margin:1rem 0;padding:.75rem;background:#f5f9fc;border-left:4px solid #2B7DE9;font-size:.85rem;}",
      ".pq-bank p{margin:.2rem 0;}",
      ".pq-signatures{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin:1.5rem 0 1rem;text-align:center;}",
      ".pq-sig-title{font-weight:800;color:#2B7DE9;margin-bottom:.5rem;}",
      ".pq-sig-space{min-height:3.5rem;color:#888;font-size:.85rem;padding-top:1.5rem;}",
      ".pq-customer{border:1px solid #b0bec5;padding:.75rem;margin:1rem 0;}",
      ".pq-customer-row{display:flex;flex-wrap:wrap;gap:1rem;margin:.5rem 0;font-size:.85rem;}",
      ".pq-disclaimer{margin-top:.75rem;padding:.65rem;border:2px solid #ffb300;background:#fff8e1;color:#e65100;font-weight:700;text-align:center;font-size:.9rem;}",
      ".pq-assumption{margin-top:.75rem;font-size:.75rem;color:#555;line-height:1.45;padding:.55rem;background:#f5f5f5;}",
      ".pq-legal{margin-top:.75rem;font-size:.7rem;color:#666;line-height:1.4;}",
      ".pq-footer{margin-top:1.25rem;font-size:.75rem;color:#666;border-top:1px solid #ddd;padding-top:.5rem;text-align:center;}",
      "@media print{body{margin:0;}}"
    ].join("");
  }

  function formatQuoteDate(d) {
    var dd = String(d.getDate()).padStart(2, "0");
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var yyyy = d.getFullYear();
    var be = yyyy + 543;
    return dd + "/" + mm + "/" + be + " (" + dd + "/" + mm + "/" + yyyy + ")";
  }

  function formatMoney(n) {
    return Number(n).toLocaleString(localeTag(), {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  function buildPrintHTML(c) {
    var today = new Date();
    var dateStr = formatQuoteDate(today);
    var blank = t("print.blank");
    var tbd = t("print.tbd");
    var gwSec = c.gangwaySectionsLabel ? t("gangway.secDot", c.gangwaySectionsLabel) : "";

    var subTotal = Number(c.total) || 0;
    var vat = Math.round(subTotal * 0.07);
    var grand = subTotal + vat;

    function metaRow(label, value) {
      return (
        '<div class="pq-meta-row"><span class="pq-meta-label">' +
        label +
        '</span><span class="pq-meta-value">' +
        value +
        "</span></div>"
      );
    }

    function boqRow(num, title, desc, qty, unit, unitPrice, total, isTbd) {
      var cls = isTbd ? ' class="pq-tbd-row"' : "";
      return (
        "<tr" +
        cls +
        '><td class="pq-num">' +
        num +
        '</td><td class="pq-desc"><strong>' +
        title +
        '</strong><br><span class="pq-desc-sub">' +
        desc +
        '</span></td><td class="num">' +
        qty +
        '</td><td class="num">' +
        unit +
        '</td><td class="num">' +
        unitPrice +
        '</td><td class="num">' +
        total +
        "</td></tr>"
      );
    }

    var itemNo = 1;
    var rows = "";
    rows += boqRow(
      itemNo++,
      t("quote.floatItem", c.layers),
      t("print.floatDesc"),
      formatNum(c.floats),
      t("print.unit.sets"),
      formatMoney(state.prices.floatPrice),
      formatMoney(c.floatCost),
      false
    );
    rows += boqRow(
      itemNo++,
      t("quote.hdpeItem"),
      t("print.hdpeDesc"),
      formatNum(c.topFloats),
      t("print.unit.sets"),
      formatMoney(state.prices.hdpePrice),
      formatMoney(c.hdpeCost),
      false
    );
    rows += boqRow(
      itemNo++,
      t("quote.railItem"),
      t("print.railDesc"),
      formatNum(c.railSegs),
      t("print.unit.sets"),
      formatMoney(state.prices.railingPrice),
      formatMoney(c.railCost),
      false
    );
    if (c.gangwayEnabled) {
      rows += boqRow(
        itemNo++,
        t(
          "quote.gangwayItem",
          Number(c.gangwayWidth).toFixed(1),
          Number(c.gangwayLength).toFixed(0),
          gwSec
        ),
        t("print.gangwayDesc"),
        formatNum(c.gangwayQty * c.gangwaySecCount),
        t("print.unit.sets"),
        formatMoney(c.gangwayUnitCost),
        formatMoney(c.gangwayCost),
        false
      );
    }
    rows += boqRow(
      itemNo++,
      t("print.fenderTitle"),
      t("print.fenderDesc"),
      formatNum(c.fenderSegs),
      t("print.unit.sets"),
      formatMoney(state.prices.fenderPrice),
      formatMoney(c.fenderCost),
      false
    );
    rows += boqRow(
      itemNo++,
      t("print.cleatTitle"),
      t("print.cleatDesc"),
      formatNum(c.cleatCount),
      t("print.unit.sets"),
      formatMoney(state.prices.cleatPrice),
      formatMoney(c.cleatCost),
      false
    );
    rows += boqRow(
      itemNo++,
      t("print.lightTitle"),
      t("print.lightDesc"),
      formatNum(c.lightCount),
      t("print.unit.sets"),
      formatMoney(state.prices.lightPrice),
      formatMoney(c.lightCost),
      false
    );
    if (c.mooringEnabled) {
      rows += boqRow(
        itemNo++,
        t("print.mooringTitle"),
        t("print.mooringDesc"),
        formatNum(c.mooringQty),
        t("print.unit.sets"),
        formatMoney(state.prices.mooringPrice),
        formatMoney(c.mooringCost),
        false
      );
    }
    rows += boqRow(
      itemNo++,
      t("print.anchorTitle"),
      t("print.anchorDesc"),
      tbd,
      t("print.unit.sets"),
      tbd,
      tbd,
      true
    );
    rows += boqRow(
      itemNo++,
      t("print.ropeTitle"),
      t("print.ropeDesc"),
      tbd,
      t("print.unit.meters"),
      tbd,
      tbd,
      true
    );

    return (
      '<div class="pq-letterhead">' +
      '<img class="pq-logo" src="' +
      HEADER_LOGO_DATA +
      '" alt="' +
      t("print.company") +
      '">' +
      '<div class="pq-docbar">' +
      '<span class="pq-doccode">' +
      t("print.docCode") +
      "</span>" +
      '<span class="pq-badge">' +
      t("print.badge") +
      "</span>" +
      "</div>" +
      "</div>" +
      '<div class="pq-company-line">' +
      t("print.company") +
      " / " +
      t("print.companyEn") +
      "</div>" +
      '<div class="pq-meta-grid">' +
      '<div class="pq-meta-left">' +
      metaRow(t("print.contactPerson") + " :", blank) +
      metaRow(t("print.organization") + " :", blank) +
      metaRow(t("print.address") + " :", blank) +
      metaRow(t("print.tel") + " :", blank) +
      metaRow(t("print.taxId") + " :", blank) +
      metaRow(t("print.project") + " :", blank) +
      "</div>" +
      '<div class="pq-meta-right">' +
      metaRow(t("print.quotationNo"), tbd) +
      metaRow(t("print.dateLabel"), dateStr) +
      metaRow(t("print.staff"), tbd) +
      metaRow(t("print.staffTel"), tbd) +
      metaRow(t("print.email"), tbd) +
      metaRow(t("print.website"), t("print.websiteVal")) +
      "</div>" +
      "</div>" +
      "<h2>" +
      t("print.summaryH2") +
      "</h2>" +
      '<table class="pq-summary"><tbody>' +
      "<tr><th>" +
      t("print.shape") +
      "</th><td>" +
      shapeLabel(c.shape) +
      "</td></tr>" +
      "<tr><th>" +
      t("print.size") +
      "</th><td>" +
      sizeSummaryText(c) +
      "</td></tr>" +
      "<tr><th>" +
      t("print.layers") +
      "</th><td>" +
      t("print.layersVal", c.layers, c.layerHeight) +
      "</td></tr>" +
      "<tr><th>" +
      t("print.floats") +
      "</th><td>" +
      t("print.floatsVal", formatNum(c.floats), formatNum(c.topFloats)) +
      "</td></tr>" +
      "<tr><th>" +
      t("print.capacity") +
      "</th><td>" +
      t("print.capacityVal", formatKg(c.capacity), formatNum(c.capacityPerM2)) +
      "</td></tr>" +
      "<tr><th>" +
      t("print.rails") +
      "</th><td>" +
      t("print.railsVal", formatNum(c.railSegs)) +
      "</td></tr>" +
      "<tr><th>" +
      t("print.fenders") +
      "</th><td>" +
      t("print.fendersVal", formatNum(c.fenderSegs)) +
      "</td></tr>" +
      "<tr><th>" +
      t("print.cleats") +
      "</th><td>" +
      t("print.cleatsVal", formatNum(c.cleatCount)) +
      "</td></tr>" +
      "<tr><th>" +
      t("print.lights") +
      "</th><td>" +
      t("print.lightsVal", formatNum(c.lightCount)) +
      "</td></tr>" +
      "</tbody></table>" +
      '<div class="pq-diagram">' +
      buildSVG(c, true) +
      "</div>" +
      "<h2>" +
      t("print.pricesH2") +
      "</h2>" +
      '<table class="pq-boq"><thead><tr>' +
      "<th>" +
      t("print.col.item") +
      "</th><th>" +
      t("print.col.desc") +
      '</th><th class="num">' +
      t("print.col.qty") +
      '</th><th class="num">' +
      t("print.col.unit") +
      '</th><th class="num">' +
      t("print.col.unitPrice") +
      '</th><th class="num">' +
      t("print.col.total") +
      "</th></tr></thead><tbody>" +
      rows +
      "</tbody></table>" +
      '<div class="pq-terms-totals">' +
      '<div class="pq-terms">' +
      "<h3>" +
      t("print.termsH2") +
      "</h3>" +
      "<p>" +
      t("print.priceValid") +
      "</p>" +
      "<p>" +
      t("print.delivery") +
      "</p>" +
      "<p>" +
      t("print.warranty") +
      "</p>" +
      "<p>" +
      t("print.payment") +
      "</p>" +
      "</div>" +
      '<div class="pq-totals">' +
      '<div class="pq-total-row"><span>' +
      t("print.subTotal") +
      "</span><span>" +
      formatMoney(subTotal) +
      "</span></div>" +
      '<div class="pq-total-row"><span>' +
      t("print.vat") +
      "</span><span>" +
      formatMoney(vat) +
      "</span></div>" +
      '<div class="pq-total-row pq-grand"><span>' +
      t("print.grandTotalLabel") +
      "</span><span>" +
      formatMoney(grand) +
      "</span></div>" +
      '<p class="pq-tbd-note">' +
      t("print.tbdNote") +
      "</p>" +
      "</div>" +
      "</div>" +
      '<p class="pq-amount-words">' +
      t("print.amountWords") +
      "</p>" +
      '<div class="pq-bank">' +
      "<h3>" +
      t("print.bankH2") +
      "</h3>" +
      "<p>" +
      t("print.bankName") +
      "</p>" +
      "<p>" +
      t("print.bankNo") +
      "</p>" +
      "<p>" +
      t("print.bankType") +
      "</p>" +
      "<p>" +
      t("print.bankBank") +
      "</p>" +
      "</div>" +
      '<div class="pq-signatures">' +
      '<div class="pq-sig-block">' +
      '<div class="pq-sig-title">' +
      t("print.proposal") +
      "</div>" +
      '<div class="pq-sig-space">' +
      t("print.signature") +
      "</div>" +
      "<div><strong>" +
      tbd +
      "</strong></div>" +
      "<div>" +
      blank +
      "</div>" +
      "<div>" +
      t("print.titleTbd") +
      "</div>" +
      "</div>" +
      '<div class="pq-sig-block">' +
      '<div class="pq-sig-title">' +
      t("print.approval") +
      "</div>" +
      '<div class="pq-sig-space">' +
      t("print.signature") +
      "</div>" +
      "<div><strong>" +
      t("print.mdName") +
      "</strong></div>" +
      "<div>" +
      t("print.mdTitle") +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="pq-customer">' +
      '<div class="pq-sig-title">' +
      t("print.customerConfirm") +
      "</div>" +
      '<div class="pq-customer-row">' +
      "<span>" +
      t("print.sign") +
      " : " +
      blank +
      " ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</span>" +
      "<span>" +
      t("print.seal") +
      " : ________________</span>" +
      "<span>" +
      t("print.dateBlank") +
      " : ____________</span>" +
      "</div>" +
      "<p>" +
      t("print.customerNote") +
      "</p>" +
      "</div>" +
      '<div class="pq-disclaimer">' +
      t("print.disclaimer") +
      "</div>" +
      '<div class="pq-assumption">' +
      t("print.assumption") +
      "</div>" +
      '<div class="pq-legal">' +
      t("print.legalDisclaimer") +
      "</div>" +
      '<div class="pq-footer">' +
      t("print.footer") +
      "</div>"
    );
  }

  function updatePrintArea(c) {
    $("print-quote").innerHTML = buildPrintHTML(c);
  }

  function render() {
    var c = compute();
    renderShapeSelector();
    renderPresets();
    syncSectionDisplays();
    renderStats(c);
    renderDiagram(c);
    renderAccessoryDiagram(c);
    renderQuote(c);
    renderGangwayUI(c);
    renderMooringUI(c);
    updatePrintArea(c);
  }

  function applyFieldDelta(field, delta) {
    var parts = field.split(".");
    if (parts.length !== 2) return;
    var group = parts[0];
    var key = parts[1];
    if (group !== "l" && group !== "t" && group !== "u") return;
    var cur = state[group][key];
    var next = cur + delta;
    // widths / stem must stay >= MIN_ROWS (1); lengths (aCols, bCols) >= 1
    if (group === "u") {
      if (key === "aRows" || key === "cRows") {
        next = clampInt(next, 1, MAX_MODULE);
        state.u[key] = next; // A and C arm lengths are independent
      } else if (key === "aCols" || key === "cCols" || key === "bRows") {
        next = clampInt(next, MIN_ROWS, MAX_MODULE);
        state.u[key] = next;
      } else if (key === "bCols") {
        next = clampInt(next, MIN_ROWS, MAX_MODULE);
        state.u.bCols = next;
      } else {
        next = clampInt(next, MIN_ROWS, MAX_MODULE);
        state.u[key] = next;
      }
      var minBar = state.u.aCols + state.u.cCols;
      if (state.u.bCols < minBar) state.u.bCols = minBar;
      render();
      return;
    }
    if (key === "aCols" || key === "bCols") {
      next = clampInt(next, 1, MAX_MODULE);
    } else if (key === "stemCols") {
      next = clampInt(next, MIN_ROWS, Math.min(MAX_MODULE, state.t.barCols));
    } else {
      next = clampInt(next, MIN_ROWS, MAX_MODULE);
    }
    // ensure stemCols doesn't exceed barCols after bar shrink
    state[group][key] = next;
    if (group === "t" && state.t.stemCols > state.t.barCols) {
      state.t.stemCols = state.t.barCols;
    }
    render();
  }

  function bind() {
    document.querySelectorAll(".shape-card").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var s = btn.getAttribute("data-shape");
        if (!s || s === state.shape) return;
        state.shape = s;
        state.railSegs = {};
        state.fenderSegs = {};
        state.cleatCells = {};
        state.lightCells = {};
        state._railShape = s;
        state._accessoryShape = s;
        render();
      });
    });

    document.querySelectorAll(".layer-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.layers = parseInt(btn.getAttribute("data-layers"), 10) || 1;
        render();
      });
    });

    // Section steppers (L/T/U)
    document.querySelectorAll("[data-field]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var field = btn.getAttribute("data-field");
        var delta = parseInt(btn.getAttribute("data-delta"), 10) || 0;
        applyFieldDelta(field, delta);
      });
    });

    $("slider-L").addEventListener("input", function () {
      state.reqL = parseFloat(this.value);
      state.activePreset = null;
      $("val-L").textContent = state.reqL.toFixed(1);
      render();
    });
    $("slider-W").addEventListener("input", function () {
      state.reqW = parseFloat(this.value);
      state.activePreset = null;
      $("val-W").textContent = state.reqW.toFixed(1);
      render();
    });

    $("dec-L").addEventListener("click", function () {
      state.reqL = Math.max(1.2, +(state.reqL - 1.2).toFixed(1));
      state.activePreset = null;
      syncSliders();
      render();
    });
    $("inc-L").addEventListener("click", function () {
      state.reqL = Math.min(30, +(state.reqL + 1.2).toFixed(1));
      state.activePreset = null;
      syncSliders();
      render();
    });
    $("dec-W").addEventListener("click", function () {
      state.reqW = Math.max(1.2, +(state.reqW - 1.2).toFixed(1));
      state.activePreset = null;
      syncSliders();
      render();
    });
    $("inc-W").addEventListener("click", function () {
      state.reqW = Math.min(15, +(state.reqW + 1.2).toFixed(1));
      state.activePreset = null;
      syncSliders();
      render();
    });

    var btnAll = $("rail-all-perimeter");
    if (btnAll) {
      btnAll.addEventListener("click", function () {
        var g = buildGeometry();
        state.railSegs = allPerimeterFromCells(g.cells);
        state._railCols = g.width;
        state._railRows = g.height;
        state._railShape = state.shape;
        render();
      });
    }
    var btnClear = $("rail-clear");
    if (btnClear) {
      btnClear.addEventListener("click", function () {
        var g = buildGeometry();
        state.railSegs = {};
        state._railCols = g.width;
        state._railRows = g.height;
        state._railShape = state.shape;
        render();
      });
    }
    var btnNS = $("rail-ns-only");
    if (btnNS) {
      btnNS.addEventListener("click", function () {
        var g = buildGeometry();
        state.railSegs =
          g.shape === "straight"
            ? defaultNorthSouth(g.cols, g.rows)
            : defaultNorthSouthFromCells(g.cells);
        state._railCols = g.width;
        state._railRows = g.height;
        state._railShape = state.shape;
        render();
      });
    }
    var btnEW = $("rail-ew-only");
    if (btnEW) {
      btnEW.addEventListener("click", function () {
        var g = buildGeometry();
        state.railSegs =
          g.shape === "straight"
            ? defaultEastWest(g.cols, g.rows)
            : defaultEastWestFromCells(g.cells);
        state._railCols = g.width;
        state._railRows = g.height;
        state._railShape = state.shape;
        render();
      });
    }

    var modeFenderBtn = $("accessory-mode-fender");
    if (modeFenderBtn) {
      modeFenderBtn.addEventListener("click", function () {
        state.accessoryMode = "fender";
        render();
      });
    }
    var modeCleatBtn = $("accessory-mode-cleat");
    if (modeCleatBtn) {
      modeCleatBtn.addEventListener("click", function () {
        state.accessoryMode = "cleat";
        render();
      });
    }
    var modeLightBtn = $("accessory-mode-light");
    if (modeLightBtn) {
      modeLightBtn.addEventListener("click", function () {
        state.accessoryMode = "light";
        render();
      });
    }
    var clearFendersBtn = $("accessory-clear-fenders");
    if (clearFendersBtn) {
      clearFendersBtn.addEventListener("click", function () {
        state.fenderSegs = {};
        render();
      });
    }
    var clearCleatsBtn = $("accessory-clear-cleats");
    if (clearCleatsBtn) {
      clearCleatsBtn.addEventListener("click", function () {
        state.cleatCells = {};
        render();
      });
    }
    var clearLightsBtn = $("accessory-clear-lights");
    if (clearLightsBtn) {
      clearLightsBtn.addEventListener("click", function () {
        state.lightCells = {};
        render();
      });
    }

    $("admin-toggle").addEventListener("click", function () {
      $("admin-panel").classList.toggle("open");
    });

    function onPriceChange() {
      state.prices.floatPrice = num($("price-float").value, DEFAULTS.floatPrice);
      state.prices.hdpePrice = num($("price-hdpe").value, DEFAULTS.hdpePrice);
      state.prices.railingPrice = num($("price-rail").value, DEFAULTS.railingPrice);
      if ($("price-fender")) state.prices.fenderPrice = num($("price-fender").value, DEFAULTS.fenderPrice);
      if ($("price-cleat")) state.prices.cleatPrice = num($("price-cleat").value, DEFAULTS.cleatPrice);
      if ($("price-light")) state.prices.lightPrice = num($("price-light").value, DEFAULTS.lightPrice);
      if ($("price-mooring")) state.prices.mooringPrice = num($("price-mooring").value, DEFAULTS.mooringPrice);
      savePrices();
      render();
    }
    ["price-float", "price-hdpe", "price-rail", "price-fender", "price-cleat", "price-light", "price-mooring"].forEach(function (id) {
      $(id).addEventListener("change", onPriceChange);
      $(id).addEventListener("input", onPriceChange);
    });

    $("btn-reset-prices").addEventListener("click", function () {
      state.prices = Object.assign({}, DEFAULTS);
      savePrices();
      renderAdmin();
      render();
    });


    // Mooring system add-on (quote only)
    (function bindMooring() {
      var en = $("mooring-enabled");
      if (en) {
        en.addEventListener("change", function () {
          if (!state.mooring) state.mooring = { enabled: false, qty: 1 };
          state.mooring.enabled = !!en.checked;
          if (state.mooring.enabled && !(state.mooring.qty > 0)) state.mooring.qty = 1;
          render();
        });
      }
      var q = $("mooring-qty");
      if (q) {
        function syncQty() {
          if (!state.mooring) state.mooring = { enabled: false, qty: 0 };
          var n = Math.floor(Number(q.value));
          if (!isFinite(n) || n < 0) n = 0;
          state.mooring.qty = n;
          render();
        }
        q.addEventListener("change", syncQty);
        q.addEventListener("input", syncQty);
      }
    })();

    // Gangway add-on (quote only)
    (function bindGangway() {
      var en = $("gangway-enabled");
      if (en) {
        en.addEventListener("change", function () {
          state.gangway.enabled = !!en.checked;
          render();
        });
      }
      function toggleSec(which) {
        return; // section picker removed for L/T/U — auto-place
        if (which === "A") state.gangway.sectionA = !state.gangway.sectionA;
        if (which === "B") state.gangway.sectionB = !state.gangway.sectionB;
        if (which === "C") {
          if (state.shape !== "U") return;
          state.gangway.sectionC = !state.gangway.sectionC;
        }
        if (!state.gangway.sectionA && !state.gangway.sectionB && !state.gangway.sectionC) {
          // keep at least one
          if (which === "A") state.gangway.sectionB = true;
          else state.gangway.sectionA = true;
        }
        render();
      }
      var btnA = $("gangway-sec-A");
      var btnB = $("gangway-sec-B");
      var btnC = $("gangway-sec-C");
      if (btnA) btnA.addEventListener("click", function () { toggleSec("A"); });
      if (btnB) btnB.addEventListener("click", function () { toggleSec("B"); });
      if (btnC) btnC.addEventListener("click", function () { toggleSec("C"); });
      document.querySelectorAll("[data-gangway-width]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.gangway.width = Number(btn.getAttribute("data-gangway-width")) >= 2.4 ? 2.4 : 1.2;
          render();
        });
      });
      document.querySelectorAll("[data-gangway-length]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var L = Math.round(Number(btn.getAttribute("data-gangway-length")) || 3);
          if (L < 3) L = 3;
          if (L > 10) L = 10;
          state.gangway.length = L;
          render();
        });
      });
      var qd = $("gangway-qty-dec");
      var qi = $("gangway-qty-inc");
      if (qd) {
        qd.addEventListener("click", function () {
          state.gangway.qty = Math.max(1, (state.gangway.qty || 1) - 1);
          render();
        });
      }
      if (qi) {
        qi.addEventListener("click", function () {
          state.gangway.qty = Math.min(99, (state.gangway.qty || 1) + 1);
          render();
        });
      }
    })();

    $("btn-print").addEventListener("click", function () {
      updatePrintArea(compute());
      window.print();
    });

    $("btn-download").addEventListener("click", function () {
      var c = compute();
      var body = buildPrintHTML(c);
      var html =
        "<!DOCTYPE html>\n<html lang=\"" +
        (currentLang === "en" ? "en" : "th") +
        "\">\n<head>\n<meta charset=\"UTF-8\">\n" +
        "<title>" +
        t("print.docTitle") +
        "</title>\n" +
        "<style>\n" +
        getDownloadPrintCSS() +
        "\n</style>\n</head>\n<body>\n" +
        body +
        "\n<p style=\"font-size:.85rem;color:#666;margin-top:1.5rem;\">" +
        t("print.downloadTip") +
        "</p>\n" +
        "</body>\n</html>";

      var blob = new Blob([html], { type: "text/html;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download =
        t("print.filePrefix") +
        shapeLabel(c.shape) +
        "-" +
        c.bboxW +
        "x" +
        c.bboxH +
        "m.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        if (!lang || lang === currentLang) return;
        setLanguage(lang);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bind();
    applyLanguage();
    renderAdmin();
    syncSliders();
    render();
  });
})();
