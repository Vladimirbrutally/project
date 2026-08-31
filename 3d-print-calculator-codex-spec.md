# 3D Print Price Calculator — Development Specification

## 1. Project Overview

สร้างเว็บสำหรับ **คำนวณราคางาน 3D Printing อัตโนมัติ** โดยผู้ใช้สามารถอัปโหลดไฟล์โมเดล 3D เช่น `.stl` เพื่อดูโมเดล, ตรวจสอบขนาด, ประเมินปริมาตร, น้ำหนัก, เวลาในการพิมพ์ และราคาประมาณการได้

เว็บต้องสามารถ deploy บน **GitHub Pages** ได้ และใช้ **Supabase** เป็น Backend สำหรับ Database, Authentication และ File Storage

ระบบในระยะแรกต้องเน้นให้ใช้งานง่าย, responsive, โหลดเร็ว และรองรับการพัฒนาต่อไปเป็นระบบรับ Order 3D Printing เต็มรูปแบบ

---

# 2. Main Goals

ระบบต้องทำสิ่งต่อไปนี้ได้:

1. ผู้ใช้ Upload STL
2. แสดง 3D Preview
3. อ่านขนาดโมเดล X / Y / Z
4. คำนวณ Volume ของ STL
5. ประเมินน้ำหนัก
6. เลือก Material
7. เลือก Infill
8. เลือก Layer Height
9. เลือก Quantity
10. ประเมิน Print Time
11. คำนวณราคา
12. กรอกข้อมูลลูกค้า
13. Submit ขอใบเสนอราคา
14. Upload STL ไป Supabase Storage
15. บันทึกข้อมูล Order ลง Supabase Database
16. Admin Login
17. Admin ดู Order ทั้งหมด
18. Admin Download STL
19. Admin แก้ Final Price
20. Admin เปลี่ยนสถานะ Order

---

# 3. Recommended Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## 3D

- Three.js
- @react-three/fiber
- @react-three/drei
- STLLoader

## Backend

Supabase

ใช้สำหรับ:

- PostgreSQL Database
- Authentication
- Storage
- Row Level Security

## Hosting

Frontend:

- GitHub Pages

Source Code:

- GitHub Repository

---

# 4. Project Structure

ให้สร้างโครงสร้างประมาณนี้

```text
3d-print-calculator/

├── src/
│
│   ├── components/
│   │   ├── FileUploader.tsx
│   │   ├── ModelViewer.tsx
│   │   ├── ModelInformation.tsx
│   │   ├── MaterialSelector.tsx
│   │   ├── InfillSelector.tsx
│   │   ├── LayerHeightSelector.tsx
│   │   ├── QuantitySelector.tsx
│   │   ├── PriceSummary.tsx
│   │   ├── QuoteForm.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── QuoteSuccess.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── AdminOrderDetail.tsx
│
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── storage.ts
│   │   ├── orders.ts
│   │   └── settings.ts
│
│   ├── utils/
│   │   ├── calculateVolume.ts
│   │   ├── calculateWeight.ts
│   │   ├── calculatePrintTime.ts
│   │   ├── calculatePrice.ts
│   │   └── format.ts
│
│   ├── types/
│   │   ├── order.ts
│   │   ├── material.ts
│   │   └── printer.ts
│
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

# 5. Main User Flow

```text
HOME
 ↓
Upload STL
 ↓
Validate File
 ↓
Parse STL
 ↓
3D Preview
 ↓
Calculate Bounding Box
 ↓
Calculate Volume
 ↓
Select Material
 ↓
Select Infill
 ↓
Select Layer Height
 ↓
Select Quantity
 ↓
Estimate Weight
 ↓
Estimate Print Time
 ↓
Calculate Price
 ↓
Show Price
 ↓
Customer fills Quote Form
 ↓
Upload STL to Supabase Storage
 ↓
Save Order to Database
 ↓
Show Order Number
```

---

# 6. Home Page UI

ออกแบบหน้า Home แบบ clean และ modern

Layout Desktop:

```text
┌───────────────────────────────────────────────────────┐
│ LOGO                         Price Calculator   Admin │
├───────────────────────────────────────────────────────┤
│                                                       │
│       Get an Instant 3D Printing Estimate             │
│                                                       │
│   Upload your STL file and calculate your estimated  │
│   3D printing price instantly.                        │
│                                                       │
├───────────────────────────┬───────────────────────────┤
│                           │                           │
│                           │ Material                  │
│       3D MODEL            │ [ PLA                ▼ ] │
│       PREVIEW             │                           │
│                           │ Layer Height              │
│                           │ [ 0.20 mm             ▼ ] │
│                           │                           │
│                           │ Infill                    │
│                           │ [------ 20% --------]     │
│                           │                           │
│                           │ Quantity                  │
│                           │ [-]        1        [+]   │
│                           │                           │
├───────────────────────────┴───────────────────────────┤
│                                                       │
│ File      example.stl                                 │
│ Size      120 × 55 × 30 mm                            │
│ Volume    42.8 cm³                                    │
│ Weight    ~31 g                                       │
│ Time      ~4 h 30 min                                 │
│                                                       │
│ Estimated Price                                       │
│                                                       │
│                       ฿245                            │
│                                                       │
│                 [ Request Quote ]                     │
│                                                       │
└───────────────────────────────────────────────────────┘
```

Mobile ต้อง responsive

---

# 7. File Upload

รองรับเบื้องต้น:

- STL Binary
- STL ASCII

Future:

- 3MF
- OBJ

## Requirements

- Drag & Drop
- File Picker
- แสดงชื่อไฟล์
- แสดงขนาดไฟล์
- Reject file ที่ไม่รองรับ
- Reject file ใหญ่เกิน limit

Default Maximum File Size:

```text
100 MB
```

ค่า limit ต้องเปลี่ยนได้ใน config

---

# 8. STL Preview

ใช้ Three.js

Features:

- Orbit Controls
- Rotate
- Zoom
- Pan
- Auto center model
- Auto fit camera
- Grid floor
- Lighting
- Reset Camera

หลังโหลด STL:

```text
computeBoundingBox()
computeBoundingSphere()
```

จากนั้น center geometry

---

# 9. Model Dimension

คำนวณ Bounding Box

```text
X = max.x - min.x
Y = max.y - min.y
Z = max.z - min.z
```

หน่วย:

```text
millimeter
```

แสดง:

```text
120 × 55 × 30 mm
```

---

# 10. STL Volume Calculation

คำนวณ Volume จาก Triangle Mesh

สำหรับแต่ละ triangle:

```text
V += dot(v1, cross(v2, v3)) / 6
```

สุดท้าย:

```text
volume = abs(V)
```

STL coordinate assumed เป็น millimeter

ดังนั้น:

```text
mm³ → cm³

cm³ = mm³ / 1000
```

สร้าง function:

```ts
calculateMeshVolume(geometry: BufferGeometry): number
```

Return:

```text
cm³
```

---

# 11. Materials

สร้าง Material config

ตัวอย่าง:

```ts
interface Material {
  id: string
  name: string
  density: number
  pricePerGram: number
}
```

Default:

```text
PLA

density:
1.24 g/cm³

pricePerGram:
2 THB
```

```text
PETG

density:
1.27 g/cm³

pricePerGram:
2.5 THB
```

```text
ABS

density:
1.04 g/cm³

pricePerGram:
2.7 THB
```

```text
TPU

density:
1.21 g/cm³

pricePerGram:
4 THB
```

ค่าทั้งหมดต้องแก้ได้ภายหลังจาก Admin หรือ Database

---

# 12. Infill

Default options:

```text
10%
15%
20%
30%
40%
50%
75%
100%
```

Default:

```text
20%
```

---

# 13. Weight Estimation

ห้ามใช้เพียง:

```text
solidWeight × infill
```

เพราะโมเดลยังมี:

- wall
- top layer
- bottom layer

ให้ใช้ approximation

```text
solidWeight =
volume × density
```

จากนั้น:

```text
shellRatio = 0.30
```

```text
internalRatio = 0.70
```

สูตร:

```text
estimatedWeight =
solidWeight ×
(
    shellRatio
    +
    internalRatio × infill
)
```

ตัวอย่าง:

```text
solidWeight = 100 g

20% infill

100 × (0.30 + 0.70 × 0.20)

= 44 g
```

ค่าพวกนี้ควรเก็บใน pricing config

---

# 14. Layer Height

Options:

```text
0.10 mm
0.12 mm
0.16 mm
0.20 mm
0.24 mm
0.28 mm
```

Default:

```text
0.20 mm
```

---

# 15. Print Time Estimation

Version 1 ให้ใช้ approximation

Input:

- estimated weight
- layer height
- model height
- complexity factor

ตัวอย่าง base speed:

```text
8 grams/hour
```

Base time:

```text
estimatedWeight / gramsPerHour
```

Layer Height Factor:

```text
0.10 = 1.8
0.12 = 1.6
0.16 = 1.25
0.20 = 1.0
0.24 = 0.85
0.28 = 0.75
```

ตัวอย่าง:

```text
estimatedTimeHours =
estimatedWeight
/
gramsPerHour
×
layerHeightFactor
×
complexityFactor
```

Default:

```text
complexityFactor = 1
```

ในอนาคตสามารถเปลี่ยนเป็น PrusaSlicer / OrcaSlicer Backend ได้

---

# 16. Pricing Formula

ใช้สูตร:

```text
Material Cost
+
Machine Cost
+
Setup Cost
+
Electricity
+
Post Processing
+
Margin
```

## Material Cost

```text
estimatedWeight × material.pricePerGram
```

## Machine Cost

```text
estimatedPrintTimeHours × machineRatePerHour
```

Default:

```text
15 THB / hour
```

## Setup Cost

Default:

```text
30 THB
```

## Electricity

Version 1:

รวมไว้ใน machine rate ได้

หรือมีค่า:

```text
electricityRatePerHour
```

Default:

```text
0
```

## Post Processing

Default:

```text
0
```

## Subtotal

```text
subtotal =
materialCost
+
machineCost
+
setupCost
+
electricityCost
+
postProcessing
```

## Margin

Default:

```text
20%
```

```text
price =
subtotal × 1.20
```

## Minimum Price

Default:

```text
80 THB
```

สุดท้าย:

```text
finalPrice =
max(price, minimumPrice)
```

Quantity:

```text
finalTotal =
finalPrice × quantity
```

ในอนาคตสามารถทำ Quantity Discount ได้

---

# 17. Price Breakdown

หน้าเว็บควรมี option สำหรับดูรายละเอียด

ตัวอย่าง:

```text
Material          ฿106
Machine            ฿68
Setup              ฿30
----------------------
Subtotal           ฿204
Margin             ฿41
----------------------
Estimated Price    ฿245
```

---

# 18. Customer Quote Form

เมื่อกด:

```text
Request Quote
```

เปิด form

Fields:

```text
Customer Name
Email
Phone
LINE ID
Note
```

Required:

```text
Customer Name
Phone หรือ Email อย่างน้อย 1 อย่าง
```

แสดง Order Summary ก่อน submit

---

# 19. Order Number

สร้าง format:

```text
3DP-YYYYMMDD-XXXX
```

ตัวอย่าง:

```text
3DP-20260831-0001
```

Database ใช้ UUID เป็น primary key

Order Number ใช้สำหรับแสดงลูกค้า

---

# 20. Supabase Database

สร้าง table:

```sql
orders
```

Schema:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

order_number TEXT UNIQUE NOT NULL,

customer_name TEXT NOT NULL,

customer_email TEXT,
customer_phone TEXT,
customer_line_id TEXT,

file_name TEXT NOT NULL,
file_path TEXT NOT NULL,
file_size BIGINT,

material TEXT NOT NULL,

layer_height NUMERIC NOT NULL,

infill INTEGER NOT NULL,

quantity INTEGER NOT NULL DEFAULT 1,

size_x NUMERIC,
size_y NUMERIC,
size_z NUMERIC,

volume_cm3 NUMERIC,

estimated_weight_gram NUMERIC,

estimated_print_time_hour NUMERIC,

estimated_price NUMERIC,

final_price NUMERIC,

customer_note TEXT,

admin_note TEXT,

status TEXT NOT NULL DEFAULT 'NEW',

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW()
```

---

# 21. Order Status

ใช้ enum logic:

```text
NEW
REVIEWING
QUOTED
CONFIRMED
PRINTING
FINISHED
SHIPPED
CANCELLED
```

---

# 22. Pricing Settings Table

สร้าง:

```sql
pricing_settings
```

ตัวอย่าง:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

machine_rate_per_hour NUMERIC DEFAULT 15,

setup_cost NUMERIC DEFAULT 30,

minimum_price NUMERIC DEFAULT 80,

margin_percent NUMERIC DEFAULT 20,

shell_ratio NUMERIC DEFAULT 0.30,

internal_ratio NUMERIC DEFAULT 0.70,

grams_per_hour NUMERIC DEFAULT 8,

updated_at TIMESTAMPTZ DEFAULT NOW()
```

---

# 23. Materials Table

```sql
materials
```

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

density NUMERIC NOT NULL,

price_per_gram NUMERIC NOT NULL,

enabled BOOLEAN DEFAULT TRUE,

created_at TIMESTAMPTZ DEFAULT NOW(),

updated_at TIMESTAMPTZ DEFAULT NOW()
```

Initial data:

```text
PLA
density 1.24
price 2

PETG
density 1.27
price 2.5

ABS
density 1.04
price 2.7

TPU
density 1.21
price 4
```

---

# 24. Supabase Storage

สร้าง Bucket:

```text
3d-print-files
```

ต้องเป็น:

```text
PRIVATE
```

ห้าม Public

Path:

```text
YYYY/MM/{order_id}/{filename}
```

ตัวอย่าง:

```text
2026/08/0db24e.../gearbox.stl
```

หรือ

```text
orders/{order_number}/{filename}
```

---

# 25. File Security

สำคัญมาก

ไฟล์ STL เป็นทรัพย์สินของลูกค้า

ดังนั้น:

- Storage ต้อง Private
- ห้าม expose public URL
- Admin ใช้ Signed URL
- Signed URL มี expiration
- Validate MIME / Extension
- Validate file size
- Sanitize filename
- Generate unique storage filename
- ไม่ใช้ original filename เป็น path ตรง ๆ

---

# 26. Supabase Environment Variables

สร้าง `.env.example`

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

ห้าม commit secret key

ห้ามใส่:

```text
service_role_key
```

ใน frontend เด็ดขาด

---

# 27. Admin Authentication

ใช้:

```text
Supabase Auth
```

Admin routes:

```text
/admin/login
/admin
/admin/orders/:id
```

ถ้าไม่ได้ login:

redirect ไป

```text
/admin/login
```

---

# 28. Admin Dashboard

แสดง:

```text
Total Orders
New Orders
Printing
Finished
Revenue Estimate
```

Orders Table:

```text
Order Number
Date
Customer
File
Material
Quantity
Estimated Price
Final Price
Status
```

Filter:

```text
Status
Date
Material
```

Search:

```text
Order Number
Customer
Phone
Email
```

---

# 29. Admin Order Detail

แสดง:

```text
Order Number

Customer Information

STL Preview

File Information

Model Dimensions

Material

Layer Height

Infill

Quantity

Volume

Estimated Weight

Estimated Print Time

Estimated Price
```

Admin สามารถ:

```text
Download STL
```

```text
Update Final Price
```

```text
Update Status
```

```text
Add Admin Note
```

---

# 30. GitHub Pages Deployment

ใช้ GitHub Actions

สร้าง:

```text
.github/workflows/deploy.yml
```

Flow:

```text
Push main
 ↓
npm install
 ↓
npm run build
 ↓
Deploy dist
 ↓
GitHub Pages
```

ต้อง config Vite base path ให้รองรับ repository name

ตัวอย่าง:

```ts
export default defineConfig({
  base: '/3d-print-calculator/'
})
```

ถ้าใช้ custom domain สามารถเปลี่ยนเป็น:

```text
/
```

---

# 31. Routing

เพราะ GitHub Pages ไม่มี server-side routing

ให้เลือกอย่างใดอย่างหนึ่ง:

Option A:

```text
HashRouter
```

แนะนำสำหรับ MVP

URLs:

```text
/#/
/#/admin
/#/admin/orders/123
```

Option B:

ทำ SPA fallback

แต่ MVP ให้ใช้ HashRouter ก่อน

---

# 32. Responsive Design

รองรับ:

```text
Desktop
Tablet
Mobile
```

Mobile:

- 3D Viewer อยู่บน
- Settings อยู่ด้านล่าง
- Sticky Price Bar
- ปุ่ม Request Quote ใหญ่
- Touch friendly

---

# 33. UX Requirements

ตอนยังไม่ upload:

```text
Upload your STL file
```

หลัง Upload:

แสดง loading

```text
Analyzing model...
```

ถ้า error:

```text
Unable to read this STL file.
Please verify that the file is valid.
```

ถ้าโมเดลเกิน build volume:

แสดง warning

```text
Model may be too large for the selected printer.
```

---

# 34. Printer Build Volume

สร้าง config

ตัวอย่าง:

```ts
const printer = {
  name: "Default Printer",
  x: 256,
  y: 256,
  z: 256
}
```

หลังอ่าน STL ให้ตรวจ:

```text
sizeX <= printer.x
sizeY <= printer.y
sizeZ <= printer.z
```

ถ้าเกิน:

```text
MODEL TOO LARGE
```

แต่ยังให้ดู preview ได้

---

# 35. Model Validation

เบื้องต้นตรวจ:

- Geometry exists
- Triangle count > 0
- Bounding box valid
- Volume > 0

Future:

- non-manifold edge
- open mesh
- inverted normals
- thin walls
- intersecting geometry

Version 1 ยังไม่ต้อง implement advanced mesh repair

---

# 36. Loading Performance

อย่า upload STL ไป server ทันที

Flow:

```text
Customer selects STL
 ↓
Parse locally in Browser
 ↓
Calculate locally
 ↓
Customer reviews price
 ↓
Customer submits Quote
 ↓
Upload file
```

ข้อดี:

- ลด Storage bandwidth
- ลดไฟล์ขยะ
- เร็ว
- privacy ดีขึ้น

---

# 37. Privacy

ก่อน Submit ให้มี checkbox:

```text
I agree to upload this file for quotation purposes.
```

แจ้ง:

```text
Your 3D model will be stored privately and used only
for quotation and printing purposes.
```

---

# 38. Delete Policy

ควรเตรียมระบบให้ลบไฟล์ได้ในอนาคต

Default retention recommendation:

```text
90 days
```

สำหรับ Order ที่:

```text
CANCELLED
หรือ
ไม่ Confirm
```

แต่ Version 1 ยังไม่ต้องทำ scheduled deletion

ให้เก็บ field สำหรับ future:

```text
file_delete_after
```

---

# 39. Error Handling

ต้องจัดการ:

```text
Invalid STL
Upload failed
Database insert failed
Storage failed
Supabase unavailable
Network error
Unauthorized admin
```

ห้าม crash page

---

# 40. Toast Notifications

ใช้ระบบ notification

ตัวอย่าง:

```text
STL loaded successfully
```

```text
Quote submitted successfully
```

```text
Unable to upload file
```

---

# 41. Currency

Default:

```text
THB
```

Format:

```text
฿245
```

ใช้:

```ts
Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB'
})
```

---

# 42. Language

Version 1:

รองรับภาษาไทยเป็นหลัก

แต่ code structure ต้องพร้อมรองรับ i18n

Future:

```text
Thai
English
```

---

# 43. Phase 1 — MVP

Codex ให้เริ่ม Phase 1 ก่อน

Implement:

- React
- TypeScript
- Vite
- Tailwind
- Home Page
- STL Upload
- STL Parsing
- 3D Viewer
- Model Dimensions
- Volume Calculation
- Material Selector
- Infill
- Layer Height
- Quantity
- Weight Estimation
- Print Time Estimation
- Price Calculation
- Price Breakdown

Phase 1 ยังไม่ต้อง Supabase

ใช้ local config ก่อน

---

# 44. Phase 2 — Supabase

หลัง Phase 1 ผ่าน

เพิ่ม:

- Supabase client
- Database
- Storage
- Quote form
- Order creation
- File upload
- Order number
- Quote success page

---

# 45. Phase 3 — Admin

เพิ่ม:

- Supabase Auth
- Admin login
- Admin dashboard
- Order detail
- Download signed URL
- Price editing
- Status editing
- Notes

---

# 46. Phase 4 — Advanced Pricing

เพิ่ม:

- Printer profiles
- Material settings
- Pricing settings
- Quantity discount
- Support material estimation
- Complexity factor
- Rush fee

---

# 47. Phase 5 — Real Slicer

Future architecture:

```text
STL
 ↓
Backend
 ↓
PrusaSlicer / OrcaSlicer
 ↓
G-code
 ↓
Parse metadata
 ↓
Actual filament usage
 ↓
Actual print time
 ↓
Accurate price
```

ส่วนนี้ห้าม run บน GitHub Pages

ต้องมี Backend เช่น:

```text
Cloud Run
Render
Railway
VPS
Docker
```

ยังไม่ต้อง implement ใน MVP

---

# 48. Future Nameplate Generator

ระบบต้องออกแบบให้สามารถเพิ่ม feature ต่อไป:

```text
Custom Nameplate Generator
```

Flow:

```text
Customer enters text
 ↓
Select font
 ↓
Select size
 ↓
Generate geometry
 ↓
3D preview
 ↓
Generate STL
 ↓
Calculate price
 ↓
Order
```

เตรียม architecture ให้ Pricing Calculator สามารถรับ model จาก:

```text
Uploaded STL
```

หรือ

```text
Generated Model
```

ได้ในอนาคต

---

# 49. Code Quality

Codex ต้อง:

- ใช้ TypeScript strict
- หลีกเลี่ยง `any`
- แยก logic ออกจาก UI
- pricing calculation ต้องเป็น pure function
- STL volume calculation ต้องเป็น pure function
- มี reusable components
- ไม่มี hardcoded secrets
- ใช้ environment variables
- Handle loading / empty / error state
- มี comments เฉพาะจุดที่ algorithm ซับซ้อน

---

# 50. Unit Tests

เขียน test อย่างน้อยสำหรับ:

```text
calculateMeshVolume
calculateWeight
calculatePrintTime
calculatePrice
```

ตัวอย่าง price test:

```text
weight = 50 g
material = 2 THB/g

materialCost = 100

printTime = 5 h
machineRate = 15

machine = 75

setup = 30

subtotal = 205

margin = 20%

price = 246
```

Expected:

```text
246 THB
```

---

# 51. Acceptance Criteria — MVP

ถือว่า MVP ผ่านเมื่อ:

- [ ] `npm install` ผ่าน
- [ ] `npm run dev` ผ่าน
- [ ] `npm run build` ผ่าน
- [ ] เปิดเว็บได้
- [ ] Upload binary STL ได้
- [ ] Upload ASCII STL ได้
- [ ] Model แสดงใน 3D Viewer
- [ ] หมุน model ได้
- [ ] Zoom ได้
- [ ] Dimension แสดงถูกต้อง
- [ ] Volume คำนวณได้
- [ ] Material เปลี่ยนได้
- [ ] Infill เปลี่ยนได้
- [ ] Layer height เปลี่ยนได้
- [ ] Quantity เปลี่ยนได้
- [ ] Weight update อัตโนมัติ
- [ ] Print Time update อัตโนมัติ
- [ ] Price update อัตโนมัติ
- [ ] มี Price Breakdown
- [ ] Mobile responsive
- [ ] ไม่มี TypeScript error
- [ ] ไม่มี secret hardcoded
- [ ] Deploy GitHub Pages ได้

---

# 52. Implementation Priority

ให้ Codex ทำตามลำดับ:

```text
1. Project setup

2. Layout

3. File Upload

4. STL Parser

5. 3D Viewer

6. Bounding Box

7. Volume Calculation

8. Material Config

9. Weight Calculation

10. Time Calculation

11. Price Calculation

12. Price UI

13. Responsive Design

14. Unit Tests

15. GitHub Pages Deploy

16. Supabase

17. Quote System

18. Admin System
```

ห้ามเริ่ม Supabase ก่อน Core Calculator ใช้งานได้

---

# 53. Initial Pricing Configuration

ใช้ค่าเริ่มต้นนี้:

```ts
export const pricingConfig = {
  machineRatePerHour: 15,
  setupCost: 30,
  minimumPrice: 80,
  marginPercent: 20,

  shellRatio: 0.30,
  internalRatio: 0.70,

  gramsPerHour: 8
}
```

Materials:

```ts
export const materials = [
  {
    id: 'pla',
    name: 'PLA',
    density: 1.24,
    pricePerGram: 2
  },
  {
    id: 'petg',
    name: 'PETG',
    density: 1.27,
    pricePerGram: 2.5
  },
  {
    id: 'abs',
    name: 'ABS',
    density: 1.04,
    pricePerGram: 2.7
  },
  {
    id: 'tpu',
    name: 'TPU',
    density: 1.21,
    pricePerGram: 4
  }
]
```

---

# 54. Example Calculation

Input:

```text
Volume:
42.8 cm³

Material:
PLA

Density:
1.24

Infill:
20%

Layer:
0.20

Quantity:
1
```

Solid Weight:

```text
42.8 × 1.24

= 53.072 g
```

Estimated Weight:

```text
53.072 ×
(
0.30
+
0.70 × 0.20
)

= 23.35 g
```

Estimated Print Time:

```text
23.35 / 8

≈ 2.92 hours
```

Material Cost:

```text
23.35 × 2

= 46.70 THB
```

Machine:

```text
2.92 × 15

= 43.80 THB
```

Setup:

```text
30 THB
```

Subtotal:

```text
120.50 THB
```

Margin 20%:

```text
24.10 THB
```

Estimated Price:

```text
144.60 THB
```

Display rounded:

```text
฿145
```

---

# 55. Design Style

Design direction:

```text
Modern
Minimal
Engineering
3D Printing
Clean
Professional
```

อย่าใช้ UI ที่ดูเป็น admin template เกินไปในหน้า Customer

Customer page ต้อง:

- เห็นราคาเด่น
- Upload ง่าย
- Preview ใหญ่
- Options ไม่เยอะเกิน
- Mobile friendly

Admin page สามารถใช้ dashboard style

---

# 56. Important Security Rules

Codex ต้องไม่:

```text
Expose Supabase Service Role Key
```

```text
Make customer STL bucket public
```

```text
Store secret in source code
```

```text
Trust filename directly
```

```text
Allow unrestricted admin access
```

```text
Use public signed-insert policy without validation
```

---

# 57. Deliverables

Codex ต้องสร้าง:

```text
Working React project
```

```text
README.md
```

```text
.env.example
```

```text
GitHub Actions deployment
```

```text
Pricing calculator
```

```text
STL viewer
```

```text
Tests
```

และหลังจาก Phase 1 เสร็จ ให้สรุป:

```text
Implemented
Not Implemented
Known Limitations
Next Recommended Step
```

---

# 58. Instruction to Codex

ให้ทำงานแบบ incremental

อย่าสร้างระบบทั้งหมดในครั้งเดียวโดยไม่ตรวจสอบ

ลำดับแรก:

```text
Create Phase 1 MVP
```

จากนั้น:

```text
run install
run tests
run build
```

ถ้ามี error:

```text
fix errors
```

จน:

```text
npm run build
```

ผ่าน

ก่อนเริ่ม Phase 2

---

# 59. First Codex Task

เริ่มจากคำสั่งนี้:

```text
Implement Phase 1 of this specification.

Create a production-ready React + TypeScript + Vite project
for a 3D printing price calculator.

The first version must support:

- STL upload
- STL 3D preview
- bounding box dimensions
- mesh volume calculation
- material selection
- infill selection
- layer height selection
- quantity
- estimated weight
- estimated print time
- price calculation
- price breakdown
- responsive UI

Do NOT implement Supabase yet.

Use clean architecture and reusable components.

After implementation:

1. install dependencies
2. run tests
3. run TypeScript checks
4. run production build
5. fix all errors

Do not stop until the Phase 1 build succeeds.
```
