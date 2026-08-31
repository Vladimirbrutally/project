# 3D Print Price Calculator

Phase 1 MVP สำหรับคำนวณราคางานพิมพ์ 3D จากไฟล์ STL

## Features

- Upload STL แบบ binary และ ASCII
- Preview โมเดล 3D ด้วย Three.js
- คำนวณ bounding box, volume, น้ำหนัก, เวลาพิมพ์ และราคา
- เลือก material, infill, layer height และ quantity
- แสดง price breakdown
- Responsive UI สำหรับ desktop, tablet และ mobile
- Unit tests สำหรับ calculation functions

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run test
npm run typecheck
npm run build
```

## GitHub Pages

ไฟล์ workflow อยู่ที่ `.github/workflows/deploy.yml`

ค่า base path ถูกตั้งผ่าน `VITE_BASE_PATH` ใน GitHub Actions เป็นชื่อ repository อัตโนมัติ เช่น:

```text
/3d-print-calculator/
```

ถ้าใช้ custom domain ให้ตั้งค่า environment เป็น:

```text
VITE_BASE_PATH=/
```

## Phase Status

Implemented:
- Phase 1 calculator, STL parser, 3D viewer, responsive UI, tests, GitHub Pages workflow

Not Implemented:
- Supabase, quote submission, admin login, admin dashboard

Known Limitations:
- Print time เป็นค่าประมาณ ไม่ใช่ผลจาก slicer จริง
- Volume ถูกต้องเมื่อ STL เป็น mesh ปิดและ scale เป็น millimeter

Next Recommended Step:
- เพิ่ม Phase 2 ด้วย Supabase Storage และ order database หลังจากยืนยันสูตรราคา Phase 1
