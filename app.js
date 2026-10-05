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
  var ADMIN_CODE = "0000"; // code required to open the admin settings

  var DEFAULTS = {
    floatPrice: 16822.43, // pre-VAT (18,000 incl. VAT)
    hdpePrice: 7009.35, // pre-VAT (7,500 incl. VAT)
    railingPrice: 4205.61, // pre-VAT (4,500 incl. VAT)
    fenderPrice: 2616.82, // pre-VAT (2,800 incl. VAT); // กันชน / เฟนเดอร์
    cleatPrice: 1168.22, // pre-VAT (1,250 incl. VAT); // คลีตสแตนเลส
    lightPrice: 4205.61, // pre-VAT (4,500 incl. VAT); // เสาไฟโซลาร์เซลล์ — single hook for unit price
    mooringPrice: 7009.35, // pre-VAT (7,500 incl. VAT); // ระบบสมอยึดโยง — THB per set
  };

  var HEADER_LOGO_DATA = "data:image/jpeg;base64,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NfLKrUFlbSOK+7bVxj+ac7SGK+7rVxj+afcYy2uF7FMmvllVoCzNpDFXd9p4x/NG0firvhafXfzRjGW1wvYpszqFVmCzdo/FPfG0+vJzRtHYp75Wn15OaMYy2uF6FNmdQqsgWbtHYp75Wn15Oac7R2KO+dp9eTmjGUtrhfcWzOoVWILO2jsUd87T68nNG0bifvnafWk5oxlLa4TFszqFViCz9o3E/fS0+tJzRtG4m762n1pOaMZSuuExbM6hVYAs/aNxN31tPrSc052jMS99rV6ZOafMZSuuExbNahVXgtDaMxL32tXpk5oXI3EvYutpXzyc0YyldcJi2a1CqvHiTXwFobRuJe+tp9MnNO7aMk7vS36jqbjcrdLSxTNkljj2eyc1F10TVNN3Q+OqcsBfhhfW0yZJuwFZ+C7P8xYDtltVqJIyFHSeW7pne1T3gClxHl7i85yrpDYGNDBmCAA8L2gACKG5oWf54y1rkYzZTUulVH42b/8AarjM5seaKOenfDK1HMe1WuavZRU0UoybIy/fKJOgXa2JFsl2CO6JrsddzXc39CwUeehwmOhxXXZbwq/WJGJFe2JCbf1qqzUGXN6+fMubfUPfspoWfJpfKZue1NF85WG0ZiTvvav8nNJ/lxg294NhrqW411HU01Q5skbYFdqx6Jou+ib6aegy1WYl5iD+B4JBWKlS8xLxvxsIBCnQAK0rKgACIAAiAAIgACIAAiAAIgACIAAiAAIgACIAAiAAL4gACBAAF9QABEAARAAEQABEAARAAEQABEAARAAEQABEAARAAEQABEAARAAEQABEAARAAEQABEAARAAEQABEAARAAEQABEAARAAEQABEAARAAEX/2Q==";

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
      "diagram.heading": "แผนผังมุมสูง ทุ่นและราวจับ",
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
      "mooring.enableHint": "ลูกค้ากรอกจำนวนชุดเอง — ราคา 7,009.35 บาท/ชุด (ก่อน VAT) (ปรับได้ในแอดมิน)",
      "mooring.qty": "จำนวนชุด",
      "mooring.qtyHint": "พิมพ์จำนวนที่ต้องการ (ไม่มีเพดานสูงสุด)",
      "mooring.priceOn": "ราคาโดยประมาณ: {0} ({1} บาท/ชุด × {2} ชุด)",
      "mooring.priceOff": "ราคาโดยประมาณ: — (ติ๊กเพื่อเพิ่มในใบเสนอราคา)",
      "quote.mooringItem": "ระบบสมอยึดโยง (ตัวเลือกเสริม)",
      "admin.mooring": "ราคาระบบสมอยึดโยง / ชุด (บาท · ก่อน VAT)",
      "admin.mooringHint": "ค่าเริ่มต้น: 7,009.35 บาท/ชุด — ตามจำนวนที่ลูกค้ากรอก",
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
      "gangway.formula": "สูตรต่อชุด: ฐาน 1.2×3 ม. = 30,000 บาท · ยาวเกิน 3 ม. เมตรละ +10,000 · กว้าง 2.4 ม. = ×2 · คูณจำนวนชุด · ราคานี้รวม VAT ระบบแสดงเป็นราคาก่อน VAT (÷1.07)",
      "gangway.priceOn": "ราคาโดยประมาณ: {0} ({1}×{2} ม. × {3} ชุด{4}{5})",
      "gangway.priceOff": "ราคาโดยประมาณ: — (ติ๊กเพื่อเพิ่มในใบเสนอราคา)",
      "gangway.secTimes": " × {0} เซกชัน",
      "gangway.secDot": " · เซกชัน {0}",
      "quote.heading": "ใบเสนอราคาโดยประมาณ",
      "quote.col.item": "รายการ",
      "quote.col.qty": "จำนวน",
      "quote.col.unit": "ราคา/หน่วย",
      "quote.col.total": "รวม",
      "quote.grandTotal": "ยอดรวมทั้งสิ้น (รวม VAT 7%)",
      "quote.disclaimer": "ราคานี้ไม่รวมค่าขนส่งและค่าติดตั้ง",
      "quote.print": "🖨️ พิมพ์ใบเสนอราคา",
      "quote.download": "⬇️ ดาวน์โหลด HTML",
      "quote.printTip": "เคล็ดลับ: ในหน้าพิมพ์ เลือก “บันทึกเป็น PDF” เพื่อได้ไฟล์ PDF",
      "quote.floatItem": "ทุ่นลอยน้ำพลาสติก HDPE ขนาด 1.2 เมตร คูณ 1.2 เมตร สูง 0.3 เมตร พร้อมอุปกรณ์",
      "quote.hdpeItem": "ชุดพื้นทางเดินสำเร็จรูป HDPE ขนาด 1.2 คูณ 1.2 เมตร",
      "quote.railItem": "ชุดเสาราวกันตก HDPE ขนาดไม่น้อยกว่า กว้าง 1.1 เมตร สูง 1.4 เมตร",
      "quote.gangwayItem": "แกงเวย์ (ตัวเลือกเสริม · {0}×{1} ม.{2})",
      "quote.sets": "{0} ชุด",
      "admin.toggle": "⚙️ ตั้งค่าราคา (แอดมิน)",
      "admin.codePrompt": "กรุณาใส่รหัสแอดมิน",
      "admin.codeWrong": "รหัสไม่ถูกต้อง",
      "admin.float": "ราคาทุ่นลอยน้ำ / ชุด (บาท · ก่อน VAT)",
      "admin.floatHint": "ค่าเริ่มต้น: 16,822.43 บาท ก่อน VAT (พร้อม Quick Lock + ตัวเชื่อม)",
      "admin.hdpe": "ราคาแผ่นพื้น HDPE / ชุด (บาท · ก่อน VAT)",
      "admin.hdpeHint": "ค่าเริ่มต้น: 7,009.35 บาท — 1 ชุดต่อ 1 ทุ่นชั้นบน",
      "admin.rail": "ราคาราวจับกันตก / ชุด 1.2 ม. (บาท · ก่อน VAT)",
      "admin.railHint": "ค่าเริ่มต้น: 4,205.61 บาท/ชุด — แสดงเทียบต่อเมตรในหน้าหลัก",
            "admin.fender": "ราคาเฟนเดอร์กันชน / ชิ้น (บาท · ก่อน VAT)",
      "admin.fenderHint": "ค่าเริ่มต้น: 2,616.82 บาท — ตามจำนวนที่คลิกบนแผนผัง",
      "admin.cleat": "ราคาคลีต / ชิ้น (บาท · ก่อน VAT)",
      "admin.cleatHint": "ค่าเริ่มต้น: 1,168.22 บาท — ตามจำนวนที่คลิกบนแผนผัง",
      "admin.light": "ราคาเสาไฟโซลาร์เซลล์ / ต้น (บาท · ก่อน VAT)",
      "admin.lightHint": "ค่าเริ่มต้น: 4,205.61 บาท — ตามจำนวนที่คลิกบนแผนผัง",
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
      "print.addr": "72 หมู่ 3 ตำบลแสนภูดาษ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
      "print.contact": "095-969-4101 · www.flotillatechnology.com",
      "print.docCode": "FTL-F-FSA-001-00",
      "print.badge": "QUOTATION",
      "print.lbl.customer": "ลูกค้า :",
      "print.lbl.org": "หน่วยงาน :",
      "print.lbl.address": "ที่อยู่ :",
      "print.lbl.tel": "โทรศัพท์ :",
      "print.lbl.taxId": "เลขประจำตัวผู้เสียภาษี :",
      "print.lbl.project": "โครงการ :",
      "print.lbl.quoteNo": "เลขที่ใบเสนอราคา :",
      "print.lbl.date": "วันที่ :",
      "print.lbl.staff": "พนักงาน :",
      "print.lbl.staffTel": "เบอร์โทร :",
      "print.lbl.email": "อีเมล :",
      "print.lbl.custEmail": "อีเมล :",
      "print.lbl.website": "เว็บไซต์ :",
      "print.col.no": "ลำดับที่",
      "print.col.desc": "รายการ",
      "print.col.qty": "จำนวน",
      "print.col.unit": "หน่วย",
      "print.col.price": "ราคา",
      "print.col.total": "รวม",
      "print.unit.sets": "ชุด",
      "print.unit.meters": "เมตร",
      "print.tbd": "TBD",
      "print.anchorTitle": "สมอ (Anchor) — ระบุภายหลัง",
      "print.ropeTitle": "เชือกยักษ์ (Giant Rope) — ตามที่ลูกค้าเลือก",
      "print.subTotal": "Sub Total :",
      "print.vat": "Vat 7 % :",
      "print.grandTotal": "Grand Total :",
      "print.discount": "ส่วนลด {0} % :",
      "print.lbl.priceValid": "กำหนดยืนราคา :",
      "print.lbl.delivery": "กำหนดส่งสินค้า :",
      "print.lbl.warranty": "การรับประกัน :",
      "print.def.staff": "ปุณรัศมี ภักดิ์ธรรมศักดิ์",
      "print.def.staffTel": "0836955694",
      "print.def.email": "kune@flotillatechnology.com",
      "print.def.website": "www.flotillatechnology.com",
      "print.def.priceValid": "30 วัน นับจากวันที่เสนอราคา",
      "print.def.delivery": "30 วันหลังจากได้รับใบสั่งซื้อ",
      "print.def.warranty": "2 ปี จากการใช้งานปกติ ไม่รวมถึงภัยธรรมชาติและการใช้งานผิดวัตถุประสงค์ กรณีที่รั่วซึมโดยไม่ได้เกิดจากการใช้ผิดประเภทบริษัทเปลี่ยนให้ตลอดอายุการใช้งาน",
      "print.def.preparerName": "ปุณรัศมี ภักดิ์ธรรมศักดิ์",
      "print.def.preparerTitle": "ผู้จัดการฝ่ายการตลาดและพัฒนาธุรกิจ",
      "print.def.approverName": "วรกร บุญลิขิตชีวะ",
      "print.def.approverTitle": "Managing Director",
      "print.payHead": "เงื่อนไขการสั่งผลิตและการชำระเงิน : ในการสั่งซื้อสินค้าแต่ละครั้ง ลูกค้าตกลงชำระเงินให้แก่บริษัทฯ ตามเงื่อนไขดังนี้",
      "print.pay1": "งวดที่ 1 (เงินมัดจำ): ชำระในอัตรา ร้อยละ 50 (50%) ของมูลค่ารวมตามใบสั่งซื้อ (Purchase Order) เพื่อเป็นการยืนยันการเริ่มสั่งผลิตสินค้า",
      "print.pay2": "งวดที่ 2 (ก่อนการส่งมอบสินค้า): ชำระในอัตรา ร้อยละ 50 (50%) ของมูลค่าสินค้า โดยต้องชำระให้เสร็จสิ้นก่อนการส่งมอบสินค้าและดำเนินการติดตั้ง",
      "print.pay3": "งวดที่ 3 (ส่วนที่เหลือ): ชำระในอัตรา ร้อยละ 45 (45%) ของมูลค่าสินค้า โดยต้องชำระให้เสร็จสิ้น ก่อน 60 วัน หลังจากการส่งมอบสินค้าและดำเนินการติดตั้ง",
      "print.pay4": "การผิดนัดชำระ: หากมีการผิดนัดชำระหนี้ บริษัทฯ จะคิดค่าปรับในอัตรา 15% ต่อปี ของจำนวนเงินที่ค้างชำระ นับจากวันที่ครบกำหนดชำระจนกว่าจะชำระเสร็จสิ้น",
      "print.pay5": "ราคาสินค้าตามสัญญานี้รวมเฉพาะค่าประกอบตัวทุ่นและอุปกรณ์เท่านั้น ทั้งนี้ไม่รวมค่าขนส่งและค่าติดตั้งหน้างานในทุกรูปแบบ",
      "print.closing": "จึงเรียนมาเพื่อพิจารณา และหวังเป็นอย่างยิ่งที่จะได้รับใช้ท่านในโอกาสอันใกล้นี้",
      "print.sigPrepared": "ผู้จัดทำใบเสนอราคา",
      "print.sigApproved": "อนุมัติราคาขายโดย",
      "print.confirmRow": "กรณีอนุมัติราคาข้างต้น กรุณาลงนามยืนยันการสั่งซื้อสินค้าด้านล่างนี้ หรือส่งใบสั่งซื้อของท่านมาที่ Email: flotilla@flotillatechnology.com",
      "print.signAuth": "ลงชื่อ ผู้มีอำนาจ",
      "print.signLine": "(……………………………………)",
      "print.stamp": "ประทับตราหน่วยงาน",
      "print.stampDate": "วันที่",
      "print.bank": "กรณียืนยันคำสั่งซื้อ โปรดชำระค่าสินค้า ตามเงื่อนไข ได้ที่ <strong>เลขที่บัญชี 048-291165-7 ชื่อบัญชี บริษัท โฟลทิลลา เทคโนโลยี จำกัด ประเภทออมทรัพย์ ธนาคารไทยพาณิชย์ สาขาหนึ่งพัน</strong> กรณีที่ท่านลงนามในใบเสนอราคาหรือออกใบสั่งซื้อให้ทางบริษัทฯ แล้ว ถือว่าท่านได้ทำการยืนยันความถูกต้องของสเปค ราคาและเงื่อนไขต่างๆรวมถึงการยืนยันการสั่งซื้อ มาด้วย และหากยกเลิกการสั่งซื้อหลังจากนี้ บริษัทฯจำเป็นต้องคิดค่าใช้จ่ายในส่วนที่ได้ดำเนินการไปแล้วและส่วนที่ทำการแก้ไขเพิ่มเติม",
      "print.docTitle": "ใบเสนอราคา - โฟลทิลลา",
      "print.plansTitle": "แผนผังประกอบใบเสนอราคา",
      "print.downloadTip": "เคล็ดลับ: กด Ctrl+P (หรือ Cmd+P) เพื่อบันทึกเป็น PDF",
      "print.filePrefix": "ใบเสนอราคา-โฟลทิลลา-",
      "quote.vatNote": "รวม VAT 7%",
      "quote.sub": "รวมก่อน VAT",
      "quote.vat": "VAT 7%",
      "quote.discount": "ส่วนลดก่อน VAT {0}%",
      "quote.manualNote": "⚠ รายการในใบเสนอราคาถูกแก้ไขเอง (ไม่ตามแผนผัง) — ตั้งค่าได้ที่แอดมิน “รายการในใบเสนอราคา”",
      "admin.qr.title": "รายการในใบเสนอราคา (แก้ไขเอง)",
      "admin.qr.intro": "ค่าเริ่มต้นเป็นรายการอัตโนมัติ (คำนวณจากแผนผังและราคาด้านบน) กด “แก้ไขรายการเอง” เพื่อคัดลอกรายการปัจจุบันมาแก้ชื่อรายการ จำนวน หน่วย และราคา ด้วยการพิมพ์เอง",
      "admin.qr.autoBadge": "โหมดอัตโนมัติ — รายการเปลี่ยนตามแผนผังและราคาด้านบน",
      "admin.qr.manualBadge": "⚠ โหมดแก้ไขเอง — รายการจะไม่เปลี่ยนตามแผนผังอีกต่อไป จนกว่าจะกด “รีเซ็ตกลับเป็นรายการอัตโนมัติ”",
      "admin.qr.btnEdit": "แก้ไขรายการเอง",
      "admin.qr.btnReset": "รีเซ็ตกลับเป็นรายการอัตโนมัติ",
      "admin.qr.btnAdd": "+ เพิ่มแถว",
      "admin.qr.confirmReset": "รีเซ็ตกลับเป็นรายการอัตโนมัติ? รายการที่แก้ไขเองจะหายไป",
      "admin.qr.col.no": "ลำดับ",
      "admin.qr.col.desc": "รายการ",
      "admin.qr.col.qty": "จำนวน",
      "admin.qr.col.unit": "หน่วย",
      "admin.qr.col.price": "ราคา/หน่วย (ก่อน VAT)",
      "admin.qr.col.total": "รวม",
      "admin.qr.up": "เลื่อนขึ้น",
      "admin.qr.down": "เลื่อนลง",
      "admin.qr.del": "ลบแถว",
      "admin.qr.empty": "ยังไม่มีรายการ — กด “+ เพิ่มแถว”",
      "admin.qr.sub": "รวมก่อน VAT",
      "admin.qr.vat": "VAT 7%",
      "admin.qr.grand": "ยอดรวมทั้งสิ้น",
      "admin.qi.title": "ข้อมูลในใบเสนอราคา (พิมพ์เอง)",
      "admin.qi.hint": "ช่องลูกค้า/หน่วยงาน/ที่อยู่/เลขที่ใบเสนอราคา ฯลฯ เว้นว่าง = พิมพ์เป็นเส้นประให้เขียนเอง · ช่องพนักงาน ผู้ลงนาม และเงื่อนไข เว้นว่าง = ใช้ค่าเริ่มต้น (แสดงเป็นตัวอย่างในช่อง)",
      "admin.qi.reset": "ล้างข้อมูลใบเสนอราคา",
      "admin.qi.f.customer": "ลูกค้า",
      "admin.qi.f.org": "หน่วยงาน",
      "admin.qi.f.address": "ที่อยู่",
      "admin.qi.f.phone": "โทรศัพท์",
      "admin.qi.f.customerEmail": "อีเมลลูกค้า",
      "admin.qi.f.taxId": "เลขประจำตัวผู้เสียภาษี",
      "admin.qi.f.project": "โครงการ",
      "admin.qi.f.quoteNo": "เลขที่ใบเสนอราคา",
      "admin.qi.f.discountPct": "ส่วนลดก่อน VAT (%)",
      "admin.qi.f.staff": "พนักงาน",
      "admin.qi.f.staffTel": "เบอร์โทร",
      "admin.qi.f.email": "อีเมลพนักงาน",
      "admin.qi.f.website": "เว็บไซต์",
      "admin.qi.f.priceValid": "กำหนดยืนราคา",
      "admin.qi.f.delivery": "กำหนดส่งสินค้า",
      "admin.qi.f.warranty": "การรับประกัน",
      "admin.qi.f.preparerName": "ผู้จัดทำใบเสนอราคา — ชื่อ",
      "admin.qi.f.preparerTitle": "ผู้จัดทำใบเสนอราคา — ตำแหน่ง",
      "admin.qi.f.approverName": "อนุมัติราคาขายโดย — ชื่อ",
      "admin.qi.f.approverTitle": "อนุมัติราคาขายโดย — ตำแหน่ง",
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
      "diagram.heading": "Top-down plan: floats and railings",
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
      "mooring.enableHint": "Customer enters quantity — 7,009.35 THB per set (excl. VAT) (editable in admin)",
      "mooring.qty": "Quantity (sets)",
      "mooring.qtyHint": "Type how many sets you need (no maximum)",
      "mooring.priceOn": "Est. price: {0} ({1} THB/set × {2} set(s))",
      "mooring.priceOff": "Est. price: — (check to add to quote)",
      "quote.mooringItem": "Anchor mooring system (optional)",
      "admin.mooring": "Anchor mooring system price / set (THB, excl. VAT)",
      "admin.mooringHint": "Default: 7,009.35 THB/set — from customer quantity",
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
      "gangway.formula": "Per set: base 1.2×3 m = 30,000 THB · over 3 m +10,000/m · width 2.4 m = ×2 · multiply by qty · incl. VAT, shown excl. VAT (÷1.07)",
      "gangway.priceOn": "Est. price: {0} ({1}×{2} m × {3} set(s){4}{5})",
      "gangway.priceOff": "Est. price: — (check to add to quote)",
      "gangway.secTimes": " × {0} section(s)",
      "gangway.secDot": " · section {0}",
      "quote.heading": "Estimated quote",
      "quote.col.item": "Item",
      "quote.col.qty": "Qty",
      "quote.col.unit": "Unit price",
      "quote.col.total": "Total",
      "quote.grandTotal": "Grand total (incl. VAT 7%)",
      "quote.disclaimer": "Price excludes delivery and installation",
      "quote.print": "🖨️ Print quote",
      "quote.download": "⬇️ Download HTML",
      "quote.printTip": "Tip: In the print dialog, choose “Save as PDF” for a PDF file",
      "quote.floatItem": "HDPE plastic floating pontoon 1.2 m x 1.2 m, height 0.3 m, with accessories",
      "quote.hdpeItem": "Prefabricated HDPE walkway deck set 1.2 x 1.2 m",
      "quote.railItem": "HDPE safety railing post set, not smaller than 1.1 m wide x 1.4 m high",
      "quote.gangwayItem": "Gangway (optional · {0}×{1} m{2})",
      "quote.sets": "{0} set(s)",
      "admin.toggle": "⚙️ Price settings (admin)",
      "admin.codePrompt": "Enter the admin code",
      "admin.codeWrong": "Incorrect code",
      "admin.float": "Float price / set (THB, excl. VAT)",
      "admin.floatHint": "Default: 16,822.43 THB excl. VAT (with Quick Lock + connectors)",
      "admin.hdpe": "HDPE deck price / set (THB, excl. VAT)",
      "admin.hdpeHint": "Default: 7,009.35 THB — 1 set per top float",
      "admin.rail": "Railing price / 1.2 m set (THB, excl. VAT)",
      "admin.railHint": "Default: 4,205.61 THB/set — shown per meter on the main page",
      "admin.fender": "Fender / bumper price / pc (THB, excl. VAT)",
      "admin.fenderHint": "Default: 2,616.82 THB — from plan clicks",
      "admin.cleat": "Cleat price / pc (THB, excl. VAT)",
      "admin.cleatHint": "Default: 1,168.22 THB — from plan clicks",
      "admin.light": "Solar light pole price / pc (THB, excl. VAT)",
      "admin.lightHint": "Default: 4,205.61 THB — from plan clicks",
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
      "print.addr": "72 Moo 3, Saen Phu Dat Sub-district, Ban Pho District, Chachoengsao 24140, Thailand",
      "print.contact": "095-969-4101 · www.flotillatechnology.com",
      "print.docCode": "FTL-F-FSA-001-00",
      "print.badge": "QUOTATION",
      "print.lbl.customer": "Customer :",
      "print.lbl.org": "Organization :",
      "print.lbl.address": "Address :",
      "print.lbl.tel": "Tel :",
      "print.lbl.taxId": "Tax ID :",
      "print.lbl.project": "Project :",
      "print.lbl.quoteNo": "Quotation No. :",
      "print.lbl.date": "Date :",
      "print.lbl.staff": "Staff :",
      "print.lbl.staffTel": "Tel :",
      "print.lbl.email": "Email :",
      "print.lbl.custEmail": "Email :",
      "print.lbl.website": "Website :",
      "print.col.no": "No.",
      "print.col.desc": "Description",
      "print.col.qty": "Q'ty",
      "print.col.unit": "Unit",
      "print.col.price": "Price",
      "print.col.total": "Total",
      "print.unit.sets": "Sets",
      "print.unit.meters": "Meters",
      "print.tbd": "TBD",
      "print.anchorTitle": "Anchor — to be specified later",
      "print.ropeTitle": "Giant Rope — per customer selection",
      "print.subTotal": "Sub Total :",
      "print.vat": "Vat 7 % :",
      "print.grandTotal": "Grand Total :",
      "print.discount": "Discount {0} % :",
      "print.lbl.priceValid": "Price validity :",
      "print.lbl.delivery": "Delivery :",
      "print.lbl.warranty": "Warranty :",
      "print.def.staff": "Punratsamee Pakdeetammasak",
      "print.def.staffTel": "0836955694",
      "print.def.email": "kune@flotillatechnology.com",
      "print.def.website": "www.flotillatechnology.com",
      "print.def.priceValid": "30 days from the quotation date",
      "print.def.delivery": "30 days after receipt of the purchase order",
      "print.def.warranty": "2 years under normal use, excluding natural disasters and misuse. Leakage not caused by misuse: the company replaces the unit for its entire service life.",
      "print.def.preparerName": "Punratsamee Pakdeetammasak",
      "print.def.preparerTitle": "Marketing & Business Development Manager",
      "print.def.approverName": "Vorakorn Boonlikitcheva",
      "print.def.approverTitle": "Managing Director",
      "print.payHead": "Production order and payment terms : For each order, the customer agrees to pay the Company as follows",
      "print.pay1": "Installment 1 (deposit): 50% of the total purchase order value, to confirm the start of production.",
      "print.pay2": "Installment 2 (before delivery): 50% of the goods value, to be paid in full before delivery and installation.",
      "print.pay3": "Installment 3 (balance): 45% of the goods value, to be paid in full within 60 days after delivery and installation.",
      "print.pay4": "Late payment: a penalty of 15% per year applies to the overdue amount from the due date until paid in full.",
      "print.pay5": "The price in this quotation covers float assembly and equipment only and excludes transport and on-site installation of any kind.",
      "print.closing": "We kindly submit this quotation for your consideration and look forward to serving you soon.",
      "print.sigPrepared": "Prepared by",
      "print.sigApproved": "Sales price approved by",
      "print.confirmRow": "If you approve the above price, please sign below to confirm the order, or send your purchase order to Email: flotilla@flotillatechnology.com",
      "print.signAuth": "Signed — authorized person",
      "print.signLine": "(……………………………………)",
      "print.stamp": "Company stamp",
      "print.stampDate": "Date",
      "print.bank": "To confirm your order, please pay according to the terms to <strong>Account No. 048-291165-7, Account name: Flotilla Technology Co., Ltd., Savings account, Siam Commercial Bank, Nueng Phan branch.</strong> By signing this quotation or issuing a purchase order, you confirm the specifications, prices and terms, including the order confirmation. If the order is cancelled afterwards, the Company must charge for work already done and any additional modifications.",
      "print.docTitle": "Quote - Flotilla",
      "print.plansTitle": "Layout plans (quotation attachment)",
      "print.downloadTip": "Tip: Press Ctrl+P (or Cmd+P) to save as PDF",
      "print.filePrefix": "flotilla-quote-",
      "quote.vatNote": "incl. VAT 7%",
      "quote.sub": "Subtotal",
      "quote.vat": "VAT 7%",
      "quote.discount": "Discount before VAT {0}%",
      "quote.manualNote": "⚠ Quote rows were edited manually (not following the plan) — manage them in Admin “Quote items”",
      "admin.qr.title": "Quote items (manual edit)",
      "admin.qr.intro": "Rows are automatic by default (from the plan and the prices above). Press “Edit items manually” to copy the current rows and type your own descriptions, quantities, units and prices.",
      "admin.qr.autoBadge": "Automatic mode — rows follow the plan and the prices above",
      "admin.qr.manualBadge": "⚠ Manual mode — rows no longer follow the plan until you press “Reset to automatic items”",
      "admin.qr.btnEdit": "Edit items manually",
      "admin.qr.btnReset": "Reset to automatic items",
      "admin.qr.btnAdd": "+ Add row",
      "admin.qr.confirmReset": "Reset to automatic items? Your manual rows will be lost.",
      "admin.qr.col.no": "No.",
      "admin.qr.col.desc": "Description",
      "admin.qr.col.qty": "Qty",
      "admin.qr.col.unit": "Unit",
      "admin.qr.col.price": "Unit price (excl. VAT)",
      "admin.qr.col.total": "Total",
      "admin.qr.up": "Move up",
      "admin.qr.down": "Move down",
      "admin.qr.del": "Delete row",
      "admin.qr.empty": "No rows yet — press “+ Add row”",
      "admin.qr.sub": "Subtotal",
      "admin.qr.vat": "VAT 7%",
      "admin.qr.grand": "Grand total",
      "admin.qi.title": "Quotation details (type in)",
      "admin.qi.hint": "Customer / organization / address / quotation no. etc.: empty = printed as a dotted line to fill in by hand · Staff, signatories and terms: empty = default (shown as placeholder)",
      "admin.qi.reset": "Clear quotation details",
      "admin.qi.f.customer": "Customer",
      "admin.qi.f.org": "Organization",
      "admin.qi.f.address": "Address",
      "admin.qi.f.phone": "Phone",
      "admin.qi.f.customerEmail": "Customer email",
      "admin.qi.f.taxId": "Tax ID",
      "admin.qi.f.project": "Project",
      "admin.qi.f.quoteNo": "Quotation No.",
      "admin.qi.f.discountPct": "Discount before VAT (%)",
      "admin.qi.f.staff": "Staff",
      "admin.qi.f.staffTel": "Staff tel",
      "admin.qi.f.email": "Staff email",
      "admin.qi.f.website": "Website",
      "admin.qi.f.priceValid": "Price validity",
      "admin.qi.f.delivery": "Delivery",
      "admin.qi.f.warranty": "Warranty",
      "admin.qi.f.preparerName": "Prepared by — name",
      "admin.qi.f.preparerTitle": "Prepared by — title",
      "admin.qi.f.approverName": "Approved by — name",
      "admin.qi.f.approverTitle": "Approved by — title",
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
    buildQuoteInfoFields();
    render();
    rebuildQuoteEditor();
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
    quoteManual: false, // true = quote rows are typed manually (state.quoteRows)
    quoteRows: [], // [{desc, qty, unit, price}] strings
    quoteInfo: {}, // admin-typed customer / staff / terms
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

  // ---- Quote rows (auto / manual), totals, baht text ----
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escNl(s) {
    return esc(s).replace(/\r?\n/g, "<br>");
  }

  function toNum(v) {
    if (v === null || v === undefined) return null;
    var s = String(v).replace(/,/g, "").trim();
    if (s === "") return null;
    var n = Number(s);
    return isFinite(n) ? n : null;
  }

  // Numbers on the quote always use 1,234.56 style
  function fmt2(n) {
    return Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatMoney(n) {
    return fmt2(n);
  }

  function vatRow(desc, qty, unit, price) {
    // Prices in the system are already pre-VAT; VAT 7% is added on the totals.
    return { desc: desc, qty: qty, unit: unit, price: price, postPrice: price };
  }

  function getAutoRows(c, includeTbd) {
    var rows = [];
    var sets = t("print.unit.sets");
    function add(desc, qty, unit, price) {
      rows.push(vatRow(desc, qty, unit, price));
    }
    add(t("quote.floatItem", c.layers), c.floats, sets, state.prices.floatPrice);
    add(t("quote.hdpeItem"), c.topFloats, sets, state.prices.hdpePrice);
    add(t("quote.railItem"), c.railSegs, sets, state.prices.railingPrice);
    if (c.gangwayEnabled) {
      var gwSec = c.gangwaySectionsLabel ? t("gangway.secDot", c.gangwaySectionsLabel) : "";
      add(
        t("quote.gangwayItem", Number(c.gangwayWidth).toFixed(1), Number(c.gangwayLength).toFixed(0), gwSec),
        c.gangwayQty * c.gangwaySecCount,
        sets,
        c.gangwayUnitCost
      );
    }
    add(t("quote.fenderItem"), c.fenderSegs, sets, state.prices.fenderPrice);
    add(t("quote.cleatItem"), c.cleatCount, sets, state.prices.cleatPrice);
    add(t("quote.lightItem"), c.lightCount, sets, state.prices.lightPrice);
    if (c.mooringEnabled) {
      add(t("quote.mooringItem"), c.mooringQty, sets, state.prices.mooringPrice);
    }
    if (includeTbd) {
      rows.push({ desc: t("print.anchorTitle"), qty: null, unit: sets, price: null, tbd: true });
      rows.push({ desc: t("print.ropeTitle"), qty: null, unit: t("print.unit.meters"), price: null, tbd: true });
    }
    return rows;
  }

  function getQuoteRows(c, includeTbd) {
    if (state.quoteManual) {
      return state.quoteRows.map(function (r) {
        var row = vatRow(r.desc, toNum(r.qty), r.unit, toNum(r.price));
        row.manual = true;
        return row;
      });
    }
    return getAutoRows(c, includeTbd);
  }

  // Discount percent typed in admin, clamped to 0-100 (blank = 0)
  function discountPct() {
    var p = toNum(state.quoteInfo && state.quoteInfo.discountPct);
    if (p == null || !(p > 0)) return 0;
    return Math.min(100, p);
  }

  function fmtPct(p) {
    return String(+Number(p).toFixed(2));
  }

  // Satang (integer) arithmetic so totals are exact: line = round(qty*price, 2dp)
  function computeQuoteTotals(rows) {
    var lines = [];
    var sub = 0;
    rows.forEach(function (r) {
      if (r.tbd || r.qty == null || r.price == null) {
        lines.push(null);
        return;
      }
      var sat = r.exactSat != null ? r.exactSat : Math.round(r.qty * r.price * 100);
      lines.push(sat);
      sub += sat;
    });
    var pct = discountPct();
    var disc = Math.min(Math.max(0, Math.round((sub * pct) / 100)), Math.max(0, sub));
    var net = sub - disc;
    var vat = Math.round((net * 7) / 100);
    return {
      lines: lines,
      sub: sub / 100,
      discount: disc / 100,
      discountPct: pct,
      net: net / 100,
      vat: vat / 100,
      grand: (net + vat) / 100,
    };
  }

  var TH_DIGITS = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  var TH_PLACES = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน"];

  function thaiGroupText(g, hasHigher) {
    g = g.replace(/^0+/, "");
    var out = "";
    var len = g.length;
    for (var i = 0; i < len; i++) {
      var d = g.charCodeAt(i) - 48;
      var pos = len - 1 - i;
      if (d === 0) continue;
      if (pos === 0) {
        out += d === 1 && (len > 1 || hasHigher) ? "เอ็ด" : TH_DIGITS[d];
      } else if (pos === 1) {
        out += d === 1 ? "สิบ" : d === 2 ? "ยี่สิบ" : TH_DIGITS[d] + "สิบ";
      } else {
        out += TH_DIGITS[d] + TH_PLACES[pos];
      }
    }
    return out;
  }

  function thaiIntText(digits) {
    digits = String(digits).replace(/^0+/, "");
    if (!digits) return TH_DIGITS[0];
    var groups = [];
    for (var end = digits.length; end > 0; end -= 6) {
      groups.unshift(digits.slice(Math.max(0, end - 6), end));
    }
    var out = "";
    for (var i = 0; i < groups.length; i++) {
      var g = groups[i];
      var isZero = /^0*$/.test(g);
      var last = i === groups.length - 1;
      if (!isZero) out += thaiGroupText(g, out !== "");
      if (!last) out += "ล้าน";
    }
    return out;
  }

  function thaiBahtText(amount) {
    var n = Number(amount);
    if (!isFinite(n)) return "";
    var neg = n < 0;
    var sat = Math.round(Math.abs(n) * 100);
    var baht = Math.floor(sat / 100);
    var st = sat % 100;
    var out = "";
    if (baht > 0 || st === 0) out += thaiIntText(String(baht)) + "บาท";
    if (st === 0) out += "ถ้วน";
    else out += thaiIntText(String(st)) + "สตางค์";
    return (neg ? "ลบ" : "") + out;
  }

  window.FlotillaQuote = { thaiBahtText: thaiBahtText, computeQuoteTotals: computeQuoteTotals };

  // ---- Quote details (admin) ----
  var QUOTE_INFO_FIELDS = [
    // [key, kind, hasDefault]
    ["customer", "text", false],
    ["org", "text", false],
    ["address", "area", false],
    ["phone", "text", false],
    ["customerEmail", "text", false],
    ["taxId", "text", false],
    ["project", "text", false],
    ["quoteNo", "text", false],
    ["discountPct", "number", false],
    ["staff", "text", true],
    ["staffTel", "text", true],
    ["email", "text", true],
    ["website", "text", true],
    ["priceValid", "text", true],
    ["delivery", "text", true],
    ["warranty", "area", true],
    ["preparerName", "text", true],
    ["preparerTitle", "text", true],
    ["approverName", "text", true],
    ["approverTitle", "text", true],
  ];

  function loadQuoteInfo() {
    var info = {};
    QUOTE_INFO_FIELDS.forEach(function (f) { info[f[0]] = ""; });
    try {
      var raw = localStorage.getItem("flotilla_pier_quote_info");
      if (raw) {
        var p = JSON.parse(raw);
        QUOTE_INFO_FIELDS.forEach(function (f) {
          if (p && typeof p[f[0]] === "string") info[f[0]] = p[f[0]];
        });
      }
    } catch (e) { /* ignore */ }
    return info;
  }

  function saveQuoteInfo() {
    try {
      localStorage.setItem("flotilla_pier_quote_info", JSON.stringify(state.quoteInfo));
    } catch (e) { /* ignore */ }
  }

  // Saved manual rows may still hold older item wording; bring known old texts up to date.
  function migrateLegacyDesc(d) {
    var x = d.trim();
    if (/^ทุ่นลอยน้ำ \(พร้อม Quick Lock/.test(x)) return "ทุ่นลอยน้ำพลาสติก HDPE ขนาด 1.2 เมตร คูณ 1.2 เมตร สูง 0.3 เมตร พร้อมอุปกรณ์";
    if (/^Floating pontoon \(with Quick Lock/.test(x)) return "HDPE plastic floating pontoon 1.2 m x 1.2 m, height 0.3 m, with accessories";
    var map = {
      "แผ่นพื้น HDPE (ชั้นบน)": "ชุดพื้นทางเดินสำเร็จรูป HDPE ขนาด 1.2 คูณ 1.2 เมตร",
      "HDPE decking (top layer)": "Prefabricated HDPE walkway deck set 1.2 x 1.2 m",
      "ราวจับกันตก (ช่วงละ 1.2 ม.)": "ชุดเสาราวกันตก HDPE ขนาดไม่น้อยกว่า กว้าง 1.1 เมตร สูง 1.4 เมตร",
      "ชุดเสาราวกันตก HDPE": "ชุดเสาราวกันตก HDPE ขนาดไม่น้อยกว่า กว้าง 1.1 เมตร สูง 1.4 เมตร",
      "Safety railing (1.2 m per set)": "HDPE safety railing post set, not smaller than 1.1 m wide x 1.4 m high",
      "HDPE safety railing post set": "HDPE safety railing post set, not smaller than 1.1 m wide x 1.4 m high"
    };
    return map.hasOwnProperty(x) ? map[x] : d;
  }

  // Old VAT-inclusive unit prices saved in manual rows -> pre-VAT
  function migrateLegacyPrice(p) {
    var map = { "18000": "16822.43", "7500": "7009.35", "4500": "4205.61", "1900": "2616.82", "1775.7": "2616.82", "1775.70": "2616.82", "1250": "1168.22" };
    var k = String(p).replace(/,/g, "").trim();
    return map.hasOwnProperty(k) ? map[k] : p;
  }

  function loadQuoteRows() {
    var out = { manual: false, rows: [] };
    try {
      var raw = localStorage.getItem("flotilla_pier_quote_rows");
      if (raw) {
        var p = JSON.parse(raw);
        // Manual rows saved before v2 were created by accident with old prices; go back to automatic rows once.
        if (p && p.manual && Array.isArray(p.rows) && p.v === 2) {
          out.manual = true;
          out.rows = p.rows.map(function (r) {
            return {
              desc: migrateLegacyDesc(String((r && r.desc) || "")),
              qty: r && r.qty != null ? String(r.qty) : "",
              unit: String((r && r.unit) || ""),
              price: migrateLegacyPrice(r && r.price != null ? String(r.price) : ""),
            };
          });
        }
      }
    } catch (e) { /* ignore */ }
    return out;
  }

  function saveQuoteRows() {
    try {
      localStorage.setItem(
        "flotilla_pier_quote_rows",
        JSON.stringify({ v: 2, manual: !!state.quoteManual, rows: state.quoteRows })
      );
    } catch (e) { /* ignore */ }
  }

  // Value used on the quote: typed value, else the default (only for fields that have one), else ""
  function quoteInfoValue(key) {
    var v = String((state.quoteInfo && state.quoteInfo[key]) || "").trim();
    if (v) return v;
    var spec = QUOTE_INFO_FIELDS.filter(function (f) { return f[0] === key; })[0];
    return spec && spec[2] ? t("print.def." + key) : "";
  }

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
        // Migrate old VAT-inclusive defaults to the new pre-VAT defaults
        var OLD_POST = { floatPrice: 18000, hdpePrice: 7500, railingPrice: 4500, fenderPrice: 1900, cleatPrice: 1250, lightPrice: 4500, mooringPrice: 7500 };
        Object.keys(OLD_POST).forEach(function (k) { if (loaded[k] === OLD_POST[k]) loaded[k] = DEFAULTS[k]; });
        // Migrate stale default: fender was 3500
        if (loaded.fenderPrice === 3500 || loaded.fenderPrice === 1775.7) loaded.fenderPrice = DEFAULTS.fenderPrice;
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
    var postVat = (w / 1.2) * baseAt12;
    return Math.round((postVat / 1.07) * 100) / 100; // pre-VAT
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
        maximumFractionDigits: 2,
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



  function buildAccessorySVG(c, forPrint) {
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
    // forPrint: static "print" mode — only installed fenders / cleats / lights, no click targets
    var mode = forPrint
      ? "print"
      : state.accessoryMode === "cleat"
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
    parts.push('<rect width="' + w + '" height="' + h + '" fill="' + (forPrint ? "#e3f2fd" : "transparent") + '"/>');

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
    var rows = getQuoteRows(c, false);
    var tot = computeQuoteTotals(rows);
    var html = "";
    rows.forEach(function (r, i) {
      var qtyTxt = r.qty == null ? "" : fmt2(r.qty) + (r.unit ? " " + esc(r.unit) : "");
      html +=
        "<tr><td>" +
        escNl(r.desc) +
        '</td><td class="qty">' +
        qtyTxt +
        "</td><td>" +
        (r.price == null ? "" : fmt2(r.price)) +
        "</td><td>" +
        (tot.lines[i] == null ? "" : fmt2(tot.lines[i] / 100)) +
        "</td></tr>";
    });
    tbody.innerHTML = html;

    var sums = $("quote-sums");
    if (sums) {
      sums.innerHTML =
        "<div><span>" + t("quote.sub") + "</span><span>" + fmt2(tot.sub) + " " + t("unit.baht") + "</span></div>" +
        (tot.discount > 0
          ? "<div><span>" + t("quote.discount", fmtPct(tot.discountPct)) + "</span><span>-" + fmt2(tot.discount) + " " + t("unit.baht") + "</span></div>"
          : "") +
        "<div><span>" + t("quote.vat") + "</span><span>" + fmt2(tot.vat) + " " + t("unit.baht") + "</span></div>";
    }
    var note = $("quote-manual-note");
    if (note) setHidden(note, !state.quoteManual);

    $("grand-total").textContent = fmt2(tot.grand) + " " + t("unit.baht");
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

  var QUOTE_CSS_RULES = [
      ".pq-sheet{font-family:Sarabun,'Noto Sans Thai',sans-serif;color:#000;font-size:9pt;line-height:1.28;background:#fff}",
      ".pq-doccode{text-align:right;font-size:6.5pt;margin:0 0 1mm}",
      ".pq-head{display:flex;align-items:center;gap:7mm;margin:0 0 1mm}",
      ".pq-head-logo{flex:0 0 76mm}",
      ".pq-logo{width:100%;height:auto;display:block}",
      ".pq-head-co{flex:1;color:#1f3a93}",
      ".pq-co-name{font-size:14.5pt;font-weight:700;line-height:1.2}",
      ".pq-co-addr,.pq-co-contact{font-size:7.5pt;margin-top:1.2mm}",
      ".pq-badge-row{text-align:right;margin:2mm 0 3mm}",
      ".pq-badge{display:inline-block;border:1px solid #7fb0e6;padding:0 2mm;font-family:'Times New Roman',Times,serif;font-size:11pt;letter-spacing:.02em}",
      ".pq-info{width:100%;border-collapse:collapse;table-layout:fixed;margin:0 0 2mm}",
      ".pq-info td{padding:.5mm 1mm;vertical-align:bottom;border:0;word-wrap:break-word}",
      ".pq-info td.pq-l{font-weight:700}",
      ".pq-info td.pq-r{font-weight:700;text-align:right}",
      ".pq-line{border-bottom:1px dotted #444;height:1.1em}",
      ".pq-boq{width:100%;border-collapse:collapse;table-layout:fixed}",
      ".pq-boq th{border:1px solid #000;background:#f2f2f2;font-weight:700;text-align:center;padding:1.2mm 1mm}",
      ".pq-boq td{border-left:1px solid #000;border-right:1px solid #000;padding:.9mm 1.5mm;vertical-align:top;word-wrap:break-word}",
      ".pq-boq .c{text-align:center}",
      ".pq-boq .r{text-align:right}",
      ".pq-boq tr.pq-sum td{border-top:1px solid #000;border-bottom:1px solid #000}",
      ".pq-boq td.pq-words{font-weight:700;text-align:center;vertical-align:middle}",
      ".pq-boq td.pq-sl{text-align:right;vertical-align:middle}",
      ".pq-boq td.pq-sv{text-align:right;vertical-align:middle}",
      ".pq-boq tr.pq-grand td.pq-sv{font-weight:700}",
      ".pq-boq td.pq-sl,.pq-boq td.pq-sv{border-bottom:1px solid #000}",
      ".pq-boq td.pq-term{border:0;padding:1.4mm 0 .8mm 1mm;vertical-align:middle}",
      ".pq-boq td.pq-term .pq-tl{display:inline-block;min-width:31mm}",
      ".pq-pay{margin:2mm 0 0}",
      ".pq-boq .pq-wrow{display:flex;align-items:flex-start}",
      ".pq-boq .pq-wv{flex:1}",
      ".pq-boq td.pq-warr{font-size:8pt;line-height:1.2;padding:.5mm 0 .5mm 1mm}",
      ".pq-pay-head{margin:0 0 .8mm}",
      ".pq-pay ul{list-style:none;margin:0;padding:0 0 0 12mm;font-size:8pt}",
      ".pq-pay li{margin:.4mm 0;position:relative;padding-left:2.5mm}",
      ".pq-pay li:before{content:'\\2022';position:absolute;left:0}",
      ".pq-pay li.pq-pay-sub{margin-left:8mm}",
      ".pq-closing{margin:1.5mm 0 1mm}",
      ".pq-sig{width:100%;border-collapse:collapse;table-layout:fixed}",
      ".pq-sig td,.pq-sig th{border:1px solid #000;padding:.8mm 1.5mm}",
      ".pq-sig th{font-weight:700;text-align:center}",
      ".pq-sig td.pq-sbox{text-align:center;vertical-align:bottom}",
      ".pq-sig-space{height:14mm}",
      ".pq-sig td.pq-sc{text-align:center}",
      ".pq-sig td.pq-sl2{text-align:left;vertical-align:top}",
      ".pq-sig td.pq-bank{font-size:8pt;line-height:1.25;padding:1.5mm}",
      ".pq-boq tr,.pq-sig tr{page-break-inside:avoid}",
      ".pq-plans{page-break-before:always;break-before:page;-webkit-print-color-adjust:exact;print-color-adjust:exact}",
      ".pq-head-sm .pq-head-logo{flex:0 0 52mm}",
      ".pq-head-sm .pq-co-name{font-size:12pt}",
      ".pq-plans-title{text-align:center;font-size:13pt;font-weight:700;margin:3mm 0 1mm}",
      ".pq-plans-ref{text-align:center;font-size:8pt;color:#333;margin:0 0 2mm}",
      ".pq-plan{margin:0 0 2.5mm;page-break-inside:avoid;break-inside:avoid}",
      ".pq-plan-h{font-size:10pt;font-weight:700;color:#1f3a93;border-bottom:1px solid #1f3a93;padding:0 0 .6mm;margin:0 0 1.5mm}",
      ".pq-plan-svg{text-align:center;line-height:0}",
      ".pq-plan-svg svg{display:block;margin:0 auto;width:100%;height:auto;max-width:150mm;max-height:98mm}",
      ".pq-plan-legend{display:flex;flex-wrap:wrap;justify-content:center;gap:1.5mm 5mm;font-size:8pt;margin:1.2mm 0 0}",
      ".pq-plan-legend span{display:inline-flex;align-items:center;gap:1.2mm}",
      ".pq-sw{width:3.2mm;height:3.2mm;display:inline-block}"
  ];

  function getDownloadPrintCSS() {
    return [
      "@page{size:A4;margin:8mm 10mm}",
      "html{background:#e8e8e8}",
      "body{margin:0 auto;padding:8mm 10mm;max-width:190mm;background:#fff;color:#000;font-family:Sarabun,'Noto Sans Thai',sans-serif}",
      "@media print{html{background:#fff}body{padding:0;max-width:none}.no-print{display:none!important}}"
    ].concat(QUOTE_CSS_RULES).join("\n");
  }

  function formatQuoteDate(d) {
    var dd = String(d.getDate()).padStart(2, "0");
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var yyyy = d.getFullYear();
    return dd + "/" + mm + "/" + (currentLang === "en" ? yyyy : yyyy + 543);
  }

  // ---- Quote page 2: top-view plans (static SVG of the current layout) ----
  function planSwatch(kind) {
    var svg = '<svg class="pq-sw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12">';
    if (kind === "float") svg += '<rect x="0.5" y="0.5" width="11" height="11" rx="2" fill="#26a69a" stroke="#00695c"/>';
    else if (kind === "rail") svg += '<rect x="0" y="3.5" width="12" height="5" rx="1.5" fill="#ff8f00"/>';
    else if (kind === "fender") svg += '<rect x="0" y="3.5" width="12" height="5" rx="1.5" fill="#c62828"/>';
    else if (kind === "cleat") svg += '<ellipse cx="6" cy="6" rx="5.5" ry="2.4" fill="#cfd8dc" stroke="#546e7a"/><rect x="4.8" y="2" width="2.4" height="8" rx="1" fill="#90a4ae" stroke="#455a64" stroke-width="0.6"/>';
    else if (kind === "light") svg += '<rect x="5.2" y="5" width="1.6" height="7" fill="#f9a825"/><circle cx="6" cy="4" r="3.4" fill="#ffe082" stroke="#ff8f00" stroke-width="1.2"/>';
    return svg + "</svg>";
  }

  function planLegend(kinds) {
    return (
      '<div class="pq-plan-legend">' +
      kinds
        .map(function (k) {
          return "<span>" + planSwatch(k) + " " + t("legend." + k) + "</span>";
        })
        .join("") +
      "</div>"
    );
  }

  function buildPrintPlansHTML(c) {
    var mainSVG = "";
    var accSVG = "";
    try {
      mainSVG = buildSVG(c, true);
    } catch (e) {
      mainSVG = "";
    }
    try {
      accSVG = buildAccessorySVG(c, true);
    } catch (e2) {
      accSVG = "";
    }
    var qn = quoteInfoValue("quoteNo");
    return (
      '<div class="pq-sheet pq-plans">' +
      '<div class="pq-doccode">' + t("print.docCode") + "</div>" +
      '<div class="pq-head pq-head-sm"><div class="pq-head-logo"><img class="pq-logo" src="' + HEADER_LOGO_DATA + '" alt="Flotilla"></div>' +
      '<div class="pq-head-co"><div class="pq-co-name">' + t("print.company") + "</div>" +
      '<div class="pq-co-contact">' + t("print.contact") + "</div></div></div>" +
      '<div class="pq-plans-title">' + t("print.plansTitle") + "</div>" +
      '<div class="pq-plans-ref">' +
      (qn ? t("print.lbl.quoteNo") + " " + escNl(qn) + " &nbsp;·&nbsp; " : "") +
      t("print.lbl.date") + " " + esc(formatQuoteDate(new Date())) +
      " &nbsp;·&nbsp; " + esc(shapeLabel(c.shape)) + " " + c.bboxW + " × " + c.bboxH + " m" +
      "</div>" +
      '<div class="pq-plan"><div class="pq-plan-h">' + t("diagram.heading") + "</div>" +
      '<div class="pq-plan-svg">' + mainSVG + "</div>" +
      planLegend(["float", "rail"]) + "</div>" +
      '<div class="pq-plan"><div class="pq-plan-h">' + t("accessory.heading") + "</div>" +
      '<div class="pq-plan-svg">' + accSVG + "</div>" +
      planLegend(["float", "fender", "cleat", "light"]) + "</div>" +
      "</div>"
    );
  }

  function buildPrintHTML(c) {
    var rows = getQuoteRows(c, true);
    var tot = computeQuoteTotals(rows);
    var tbd = t("print.tbd");

    function val(key) {
      var v = quoteInfoValue(key);
      return v ? escNl(v) : '<div class="pq-line"></div>';
    }
    function infoRow(l1, k1, l2, v2) {
      return (
        '<tr><td class="pq-l">' + t(l1) + "</td><td>" + val(k1) + '</td><td class="pq-r">' + (l2 ? t(l2) : "") + "</td><td>" + (v2 || "") + "</td></tr>"
      );
    }

    var body = "";
    rows.forEach(function (r, i) {
      var isTbd = !!r.tbd;
      body +=
        "<tr><td class=\"c\">" + (i + 1) + "</td><td>" + escNl(r.desc) + "</td>" +
        '<td class="c">' + (isTbd ? tbd : r.qty == null ? "" : fmt2(r.qty)) + "</td>" +
        '<td class="c">' + esc(r.unit || "") + "</td>" +
        '<td class="r">' + (isTbd ? tbd : r.price == null ? "" : fmt2(r.price)) + "</td>" +
        '<td class="r">' + (isTbd ? tbd : tot.lines[i] == null ? "" : fmt2(tot.lines[i] / 100)) + "</td></tr>";
    });
    if (!rows.length) body = '<tr><td class="c">&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>';

    function termRow(labelKey, valueHtml, lab, num, cls) {
      return (
        '<tr class="' + (cls || "") + '"><td colspan="4" class="pq-term"><span class="pq-tl">' + t(labelKey) + "</span>" + valueHtml +
        '</td><td class="pq-sl">' + lab + '</td><td class="pq-sv">' + num + "</td></tr>"
      );
    }

    var dateStr = formatQuoteDate(new Date());

    return (
      '<div class="pq-sheet">' +
      '<div class="pq-doccode">' + t("print.docCode") + "</div>" +
      '<div class="pq-head"><div class="pq-head-logo"><img class="pq-logo" src="' + HEADER_LOGO_DATA + '" alt="Flotilla"></div>' +
      '<div class="pq-head-co"><div class="pq-co-name">' + t("print.company") + "</div>" +
      '<div class="pq-co-addr">' + t("print.addr") + "</div>" +
      '<div class="pq-co-contact">' + t("print.contact") + "</div></div></div>" +
      '<div class="pq-badge-row"><span class="pq-badge">' + t("print.badge") + "</span></div>" +
      '<table class="pq-info"><colgroup><col style="width:22%"><col style="width:30%"><col style="width:17%"><col style="width:31%"></colgroup><tbody>' +
      infoRow("print.lbl.customer", "customer", "print.lbl.quoteNo", val("quoteNo")) +
      infoRow("print.lbl.org", "org", "print.lbl.date", esc(dateStr)) +
      infoRow("print.lbl.address", "address", "print.lbl.staff", val("staff")) +
      infoRow("print.lbl.tel", "phone", "print.lbl.staffTel", val("staffTel")) +
      infoRow("print.lbl.custEmail", "customerEmail", "print.lbl.email", val("email")) +
      infoRow("print.lbl.taxId", "taxId", "print.lbl.website", val("website")) +
      infoRow("print.lbl.project", "project", "", "") +
      "</tbody></table>" +
      '<table class="pq-boq"><colgroup><col style="width:9%"><col><col style="width:11%"><col style="width:9%"><col style="width:15%"><col style="width:15%"></colgroup>' +
      "<thead><tr><th>" + t("print.col.no") + "</th><th>" + t("print.col.desc") + "</th><th>" + t("print.col.qty") +
      "</th><th>" + t("print.col.unit") + "</th><th>" + t("print.col.price") + "</th><th>" + t("print.col.total") + "</th></tr></thead><tbody>" +
      body +
      '<tr class="pq-sum"><td colspan="4" class="pq-words">' + thaiBahtText(tot.grand) + '</td><td class="pq-sl">' + t("print.subTotal") +
      '</td><td class="pq-sv">' + fmt2(tot.sub) + "</td></tr>" +
      (tot.discount > 0
        ? termRow("print.lbl.priceValid", val("priceValid"), t("print.discount", fmtPct(tot.discountPct)), "-" + fmt2(tot.discount), "pq-discrow") +
          termRow("print.lbl.delivery", val("delivery"), t("print.vat"), fmt2(tot.vat), "pq-vatrow") +
          '<tr class="pq-grand"><td colspan="4" class="pq-term">&nbsp;</td><td class="pq-sl">' + t("print.grandTotal") + '</td><td class="pq-sv">' + fmt2(tot.grand) + "</td></tr>"
        : termRow("print.lbl.priceValid", val("priceValid"), t("print.vat"), fmt2(tot.vat), "pq-vatrow") +
          termRow("print.lbl.delivery", val("delivery"), t("print.grandTotal"), fmt2(tot.grand), "pq-grand")) +
      '<tr><td colspan="6" class="pq-term pq-warr"><div class="pq-wrow"><span class="pq-tl">' + t("print.lbl.warranty") + '</span><span class="pq-wv">' + val("warranty") + "</span></div></td></tr>" +
      "</tbody></table>" +
      '<div class="pq-pay"><div class="pq-pay-head">' + t("print.payHead") + "</div><ul>" +
      "<li>" + t("print.pay1") + "</li><li>" + t("print.pay2") + "</li><li class=\"pq-pay-sub\">" + t("print.pay4") + "</li><li>" + t("print.pay5") + "</li></ul></div>" +
      '<div class="pq-closing">' + t("print.closing") + "</div>" +
      '<table class="pq-sig"><colgroup><col style="width:50%"><col style="width:50%"></colgroup><tbody>' +
      "<tr><th>" + t("print.sigPrepared") + "</th><th>" + t("print.sigApproved") + "</th></tr>" +
      '<tr><td class="pq-sbox"><div class="pq-sig-space"></div><div>' + escNl(quoteInfoValue("preparerName")) + "</div><div>" + escNl(quoteInfoValue("preparerTitle")) + "</div></td>" +
      '<td class="pq-sbox"><div class="pq-sig-space"></div><div>' + escNl(quoteInfoValue("approverName")) + "</div><div>" + escNl(quoteInfoValue("approverTitle")) + "</div></td></tr>" +
      '<tr><td colspan="2">' + t("print.confirmRow") + "</td></tr>" +
      '<tr><td class="pq-sc">' + t("print.signAuth") + "<br>" + t("print.signLine") + '</td><td class="pq-sl2">' + t("print.stamp") + "<br>" + t("print.stampDate") + "</td></tr>" +
      '<tr><td colspan="2" class="pq-bank">' + t("print.bank") + "</td></tr>" +
      "</tbody></table></div>" +
      buildPrintPlansHTML(c)
    );
  }

  // ---- Admin: quote details + item editor ----
  var lastComputed = null;

  function buildQuoteInfoFields() {
    var host = $("qi-fields");
    if (!host) return;
    var html = "";
    QUOTE_INFO_FIELDS.forEach(function (f) {
      var key = f[0];
      var id = "qi-" + key;
      var ph = f[2] ? t("print.def." + key) : "";
      html += '<div class="admin-field qi-field"><label for="' + id + '">' + esc(t("admin.qi.f." + key)) + "</label>";
      if (f[1] === "number") {
        html += '<input type="number" min="0" max="100" step="0.01" id="' + id + '" data-qi="' + key + '" placeholder="0" value="' + esc(state.quoteInfo[key]) + '" />';
      } else if (f[1] === "area") {
        html += '<textarea id="' + id + '" data-qi="' + key + '" rows="2" placeholder="' + esc(ph) + '">' + esc(state.quoteInfo[key]) + "</textarea>";
      } else {
        html += '<input type="text" id="' + id + '" data-qi="' + key + '" placeholder="' + esc(ph) + '" value="' + esc(state.quoteInfo[key]) + '" />';
      }
      html += "</div>";
    });
    host.innerHTML = html;
  }

  function currentRowsForEditor() {
    var c = lastComputed || compute();
    if (state.quoteManual) return state.quoteRows;
    return getAutoRows(c, true).map(function (r) {
      var pp = r.postPrice != null ? r.postPrice : r.price;
      return { desc: r.desc, qty: r.qty == null ? "" : String(r.qty), unit: r.unit, price: pp == null ? "" : String(pp) };
    });
  }

  function updateEditorTotals() {
    var host = $("qr-editor");
    if (!host) return;
    var c = lastComputed || compute();
    var rows = getQuoteRows(c, true);
    var tot = computeQuoteTotals(rows);
    host.querySelectorAll("tr[data-i]").forEach(function (tr) {
      var i = Number(tr.getAttribute("data-i"));
      var cell = tr.querySelector(".qr-total");
      if (cell) cell.textContent = tot.lines[i] == null ? "" : fmt2(tot.lines[i] / 100);
    });
    var s = $("qr-sums");
    if (s) {
      s.textContent =
        t("admin.qr.sub") + ": " + fmt2(tot.sub) + "   ·   " +
        (tot.discount > 0 ? t("quote.discount", fmtPct(tot.discountPct)) + ": -" + fmt2(tot.discount) + "   ·   " : "") +
        t("admin.qr.vat") + ": " + fmt2(tot.vat) +
        "   ·   " + t("admin.qr.grand") + ": " + fmt2(tot.grand);
    }
  }

  function rebuildQuoteEditor(focusIdx) {
    var host = $("qr-editor");
    if (!host) return;
    var manual = !!state.quoteManual;
    var rows = currentRowsForEditor();
    var dis = manual ? "" : " disabled";
    var html =
      '<div class="qr-badge ' + (manual ? "manual" : "auto") + '">' +
      esc(t(manual ? "admin.qr.manualBadge" : "admin.qr.autoBadge")) + "</div>";
    html += '<div class="qr-buttons">';
    if (!manual) {
      html += '<button type="button" class="btn btn-primary" data-qr-act="edit">' + esc(t("admin.qr.btnEdit")) + "</button>";
    } else {
      html += '<button type="button" class="btn btn-secondary" data-qr-act="add">' + esc(t("admin.qr.btnAdd")) + "</button>";
      html += '<button type="button" class="btn btn-secondary" data-qr-act="reset">' + esc(t("admin.qr.btnReset")) + "</button>";
    }
    html += "</div>";
    html += '<div class="qr-scroll"><table class="qr-table"><thead><tr>' +
      "<th>" + t("admin.qr.col.no") + "</th><th>" + t("admin.qr.col.desc") + "</th><th>" + t("admin.qr.col.qty") +
      "</th><th>" + t("admin.qr.col.unit") + "</th><th>" + t("admin.qr.col.price") + "</th><th>" + t("admin.qr.col.total") +
      "</th><th></th></tr></thead><tbody>";
    rows.forEach(function (r, i) {
      html +=
        '<tr data-i="' + i + '"><td class="qr-no">' + (i + 1) + "</td>" +
        '<td><textarea class="qr-in qr-desc" data-k="desc" rows="2"' + dis + ">" + esc(r.desc) + "</textarea></td>" +
        '<td><input class="qr-in qr-qty" data-k="qty" type="number" step="any" value="' + esc(r.qty) + '"' + dis + " /></td>" +
        '<td><input class="qr-in qr-unit" data-k="unit" type="text" value="' + esc(r.unit) + '"' + dis + " /></td>" +
        '<td><input class="qr-in qr-price" data-k="price" type="number" step="any" value="' + esc(r.price) + '"' + dis + " /></td>" +
        '<td class="qr-total"></td><td class="qr-act">' +
        (manual
          ? '<button type="button" data-qr-act="up" data-i="' + i + '" title="' + esc(t("admin.qr.up")) + '"' + (i === 0 ? " disabled" : "") + ">↑</button>" +
            '<button type="button" data-qr-act="down" data-i="' + i + '" title="' + esc(t("admin.qr.down")) + '"' + (i === rows.length - 1 ? " disabled" : "") + ">↓</button>" +
            '<button type="button" data-qr-act="del" data-i="' + i + '" title="' + esc(t("admin.qr.del")) + '">✕</button>'
          : "") +
        "</td></tr>";
    });
    if (!rows.length) html += '<tr><td colspan="7" class="qr-empty">' + esc(t("admin.qr.empty")) + "</td></tr>";
    html += '</tbody></table></div><div class="qr-sums" id="qr-sums"></div>';
    host.innerHTML = html;
    updateEditorTotals();
    if (focusIdx != null) {
      var tr = host.querySelector('tr[data-i="' + focusIdx + '"] .qr-desc');
      if (tr) tr.focus();
    }
  }

  // Called from render(): never rebuilds the editor in manual mode (keeps focus while typing)
  function syncQuoteEditor() {
    if (!$("qr-editor")) return;
    if (state.quoteManual) updateEditorTotals();
    else rebuildQuoteEditor();
  }

  function bindQuoteAdmin() {
    var info = $("qi-fields");
    if (info) {
      info.addEventListener("input", function (e) {
        var key = e.target && e.target.getAttribute && e.target.getAttribute("data-qi");
        if (!key) return;
        state.quoteInfo[key] = e.target.value;
        saveQuoteInfo();
        if (key === "discountPct") render();
        else updatePrintArea(lastComputed || compute());
      });
    }
    var rst = $("btn-reset-quote-info");
    if (rst) {
      rst.addEventListener("click", function () {
        QUOTE_INFO_FIELDS.forEach(function (f) { state.quoteInfo[f[0]] = ""; });
        saveQuoteInfo();
        buildQuoteInfoFields();
        render();
      });
    }

    var host = $("qr-editor");
    if (!host) return;
    host.addEventListener("input", function (e) {
      if (!state.quoteManual) return;
      var el = e.target;
      var k = el.getAttribute && el.getAttribute("data-k");
      var tr = el.closest && el.closest("tr[data-i]");
      if (!k || !tr) return;
      var i = Number(tr.getAttribute("data-i"));
      if (!state.quoteRows[i]) return;
      state.quoteRows[i][k] = el.value;
      saveQuoteRows();
      render(); // updates quote table, totals, print area; editor itself is only touched via updateEditorTotals
    });
    host.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-qr-act]");
      if (!btn || btn.disabled) return;
      var act = btn.getAttribute("data-qr-act");
      var i = Number(btn.getAttribute("data-i"));
      if (act === "edit") {
        var c = lastComputed || compute();
        state.quoteRows = getAutoRows(c, true).map(function (r) {
          var pp = r.postPrice != null ? r.postPrice : r.price;
      return { desc: r.desc, qty: r.qty == null ? "" : String(r.qty), unit: r.unit, price: pp == null ? "" : String(pp) };
        });
        state.quoteManual = true;
        saveQuoteRows();
        rebuildQuoteEditor();
        render();
      } else if (act === "reset") {
        if (!window.confirm(t("admin.qr.confirmReset"))) return;
        state.quoteManual = false;
        state.quoteRows = [];
        saveQuoteRows();
        rebuildQuoteEditor();
        render();
      } else if (act === "add") {
        state.quoteRows.push({ desc: "", qty: "1", unit: t("print.unit.sets"), price: "" });
        saveQuoteRows();
        rebuildQuoteEditor(state.quoteRows.length - 1);
        render();
      } else if (act === "del") {
        state.quoteRows.splice(i, 1);
        saveQuoteRows();
        rebuildQuoteEditor();
        render();
      } else if (act === "up" || act === "down") {
        var j = act === "up" ? i - 1 : i + 1;
        if (j < 0 || j >= state.quoteRows.length) return;
        var tmp = state.quoteRows[i];
        state.quoteRows[i] = state.quoteRows[j];
        state.quoteRows[j] = tmp;
        saveQuoteRows();
        rebuildQuoteEditor();
        render();
      }
    });
  }

  function updatePrintArea(c) {
    $("print-quote").innerHTML = buildPrintHTML(c);
  }

  function render() {
    var c = compute();
    lastComputed = c;
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
    syncQuoteEditor();
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

    var adminUnlocked = false; // ask for the code once per page load
    $("admin-toggle").addEventListener("click", function () {
      var panel = $("admin-panel");
      if (!panel.classList.contains("open") && !adminUnlocked) {
        var code = window.prompt(t("admin.codePrompt"));
        if (code === null) return;
        if (String(code).trim() !== ADMIN_CODE) {
          window.alert(t("admin.codeWrong"));
          return;
        }
        adminUnlocked = true;
      }
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
        "<link href=\"https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap\" rel=\"stylesheet\">\n" +
        "<style>\n" +
        getDownloadPrintCSS() +
        "\n</style>\n</head>\n<body>\n" +
        body +
        "\n<p class=\"no-print\" style=\"font-size:.85rem;color:#666;margin-top:1.5rem;text-align:center\">" +
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
    var qr = loadQuoteRows();
    state.quoteManual = qr.manual;
    state.quoteRows = qr.rows;
    state.quoteInfo = loadQuoteInfo();
    bind();
    bindQuoteAdmin();
    applyLanguage();
    buildQuoteInfoFields();
    renderAdmin();
    syncSliders();
    render();
    rebuildQuoteEditor();
  });
})();
