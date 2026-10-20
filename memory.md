# Project Memory (`memory.md`)
## Maruthi Medical — Context, Decisions & Implementation Log

---

### 1. Store Identity & Metadata
- **Store Name**: Maruthi Medical
- **Tagline**: The Koppa Village Apothecary — dispensing medicine, counsel & quiet reassurance
- **Physical Address**: Shop no.7, #197/7 & 8, Koppa Village, Hulimangala Post, Jigani Hobli, Taluk, Anekal, Bengaluru, Karnataka 560105, India
- **Primary Phone & WhatsApp**: `+91 76762 22727` (`076762 22727`)
- **Hours**: Open Daily until 10:00 PM
- **Rating**: 4.8★ across Google Reviews
- **Drug License Numbers**: `KA-B2-019842` / `KA-B21-019843`
- **Store GSTIN**: `29AAGCM1978E1Z4`
- **Primary Service Pincodes**: `560105` (Koppa), `560099` (Jigani), `560100` (Electronic City), `562106` (Anekal)

---

### 2. Key Architecture & Product Decisions

| Decision | Context & Rationale | Status |
| :--- | :--- | :--- |
| **Separated Admin Route (`/admin`)** | Admin ERP and store back-office are segregated under `/admin` with a dedicated layout (sidebar, KPI topbar, split-screen modals), while the public storefront lives under `/(public)` or root. | Implemented |
| **Zero-Cost WhatsApp Ordering** | Avoids Meta Cloud API fees and monthly SaaS costs. Generates encoded `wa.me/917676222727?text=...` deep-links carrying complete itemized cart summaries, delivery address, and prescription reference. | Implemented |
| **Mock-First Database Layer** | As requested by user, full Supabase integration is staged for later. All data operations currently use an in-memory/localStorage mock repository (`lib/mock/db.ts`) with schema-identical types and async methods. | Implemented |
| **Prescription Enforcement (Schedule H/H1)** | Indian law compliance: if a cart contains any Rx item, checkout forces prescription attachment (camera/upload or existing vault) before order placement. | Implemented |
| **FEFO Inventory Allocation** | First-Expired, First-Out batch picking is modeled in the inventory engine to minimize pharmaceutical write-off losses. | Implemented |
| **Dual Invoice Generation** | Supports both standard A4 GST tax invoices and 80mm ESC/POS thermal receipt formatting compliant with Rule 65 of D&C Rules. | Implemented |

---

### 3. Design Tokens & Visual Language
- **Brand Colors**:
  - `primary`: `#0D3B2E` (Forest Emerald)
  - `secondary`: `#1F5A46` (Deep Botanical)
  - `surface`: `#FBF9F5` (Antique Parchment)
  - `card`: `#FFFFFF`
  - `border`: `#E8E5DF` (Linen)
  - `accent`: `#C6923B` (Brass / Ochre)
  - `rx`: `#7C2D12` on `#FEE2E2`
- **Typography**:
  - Headings: Serif (`Playfair Display` / Georgia)
  - Interface & Body: Sans-Serif (`Plus Jakarta Sans` / Inter)
  - Identifiers (SKU, Batch, GSTIN): Monospace (`JetBrains Mono` / Courier)

---

### 4. File Structure & Module Map
- `PRD.md`: Complete Product Requirements Document
- `Design.md`: Exhaustive Technical Architecture & Supabase Schema
- `Agent.md`: Operational Manual for Agents & Developers
- `memory.md`: Project memory & decisions log (this file)
- `src/lib/mock/`: Mock data models, seed data, and query functions (mirrors Supabase tables)
- `src/lib/whatsapp/`: WhatsApp URL serialisation and message builders
- `src/lib/tax/`: GST dual-split calculations (CGST 6% + SGST 6% for 12% medicines)
- `src/components/public/CounterEssentialsCarousel.tsx`: Auto-scrolling single-row carousel for Counter Essentials with manual scroll & pause controls
- `src/app/`: Next.js 14 App Router routes:
  - `/(public)`: Home (single-row auto-scroller), Catalog, Product details, Cart, Checkout, Order success, Tracking, Contact
  - `/admin`: Dashboard, Inventory (FEFO), Products, Orders (Rx Review), Abandoned Carts, Customers, Suppliers, Reports, Users

---

### 5. Next Steps for Supabase Migration (Future Phase)
1. Initialize Supabase project on AWS Mumbai (`ap-south-1`).
2. Run SQL migration script from `Design.md#3.2`.
3. Create Storage buckets (`prescriptions`, `product-images`, `invoices`).
4. Replace methods in `lib/mock/db.ts` with Supabase client queries.
5. Connect Supabase Realtime to `/admin/orders` for live audio/visual order notifications.

---
*End of memory.md*
