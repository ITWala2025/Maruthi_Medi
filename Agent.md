# Agent Guidelines & Operational Manual (`Agent.md`)
## Maruthi Medical — Next.js & Supabase Pharmacy Platform

---

### 1. Purpose of this Document
This file serves as the operational guide and technical contract for any AI Agent or developer working on the **Maruthi Medical** codebase. It outlines the architectural boundaries, coding standards, design requirements, and development workflows.

---

### 2. Core Architecture & Tech Stack
- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables (Apothecary & Clinical Design Tokens)
- **Icons**: Lucide React (`lucide-react`)
- **State Management**:
  - Global Cart & Client Session: Zustand (`useCartStore`) with LocalStorage hydration
  - Server / Mock Database: Centralized mock data layer in `lib/mock/` adhering strictly to the PostgreSQL schema defined in `Design.md`
- **Future Database Integration**: Supabase (PostgreSQL, Supabase Auth, Storage, Realtime). All mock data abstractions must match Supabase table names, columns, and data types 1:1 to enable seamless zero-friction drop-in replacement.
- **Routing Structure**:
  - `/(public)`: Customer-facing storefront, catalog, cart, prescription upload, WhatsApp order generation, checkout, tracking.
  - `/admin`: Role-gated Pharmacy Operations & ERP (Dashboard, Inventory FEFO, Products, Orders, Rx Verification, Invoices, Abandoned Carts, Customers, Suppliers, Reports, Users).

---

### 3. Key Design & Aesthetic Rules (Strict Requirement)
- **Do not build plain or generic interfaces**. Maruthi Medical has a distinct, established brand identity:
  - **Color Palette**:
    - Primary: Deep Forest Emerald (`#0D3B2E`)
    - Secondary: Muted Bottle Green (`#1F5A46`)
    - Background Surface: Warm Antique Parchment (`#FBF9F5`)
    - Cards: Crisp White (`#FFFFFF`) with subtle linen borders (`#E8E5DF`)
    - Accents: Warm Brass / Amber Ochre (`#C6923B`)
    - Rx Badges: Deep Terracotta Red (`#7C2D12`) on Rose (`#FEE2E2`)
    - Expiry Badges: Red (<30 days), Amber (31-90 days), Emerald (>90 days)
  - **Typography**:
    - Serif headings (`Playfair Display` or `font-serif`) for brand marks and editorial section titles.
    - Sans-serif (`Plus Jakarta Sans` or `Inter`) for clean, legible product lists, dosages, and data tables.
    - Monospace (`font-mono`) for Order IDs (`#MM-XXXX`), Batch numbers, HSN codes, and GSTINs.
  - **Micro-interactions**: Hover effects, smooth transitions, toast alerts, modal transitions, and interactive badges.

---

### 4. Zero-Cost WhatsApp Integration Standard
- Never introduce dependencies on paid WhatsApp Business Cloud APIs or third-party paid aggregators.
- All WhatsApp workflows must use standard deep links (`https://wa.me/917676222727?text=<ENCODED_MESSAGE>`).
- Use the utility in `lib/whatsapp/encoder.ts` for consistent formatting.
- Cart manifests must be human-readable, itemized, and include customer name, address, line items, and prescription status.

---

### 5. Regulatory Compliance & Pharmacy Rules (India)
- **Prescription Gate (Schedule H/H1)**: If any cart item has `prescriptionRequired: true`, checkout cannot proceed without prescription attachment.
- **Rule 65 Compliance**: All invoices and thermal receipts must show:
  1. Store Address: Shop no.7, #197/7 & 8, Koppa Village, Hulimangala Post, Jigani Hobli, Bengaluru 560105
  2. Phone: +91 76762 22727
  3. Drug License: `KA-B2-019842` & `KA-B21-019843`
  4. GSTIN: `29AAGCM1978E1Z4`
  5. Line-item Batch Number, Expiry Date, HSN Code, and CGST/SGST split.
- **FEFO Allocation**: When fulfilling orders, batches with the earliest expiration date must be prioritized.

---

### 6. Mock Data to Supabase Migration Strategy
- All data access in the UI should go through mock services or server functions in `lib/mock/`.
- Mock entities must strictly mirror Supabase tables:
  - `products`
  - `batches`
  - `orders` & `order_items`
  - `prescriptions`
  - `abandoned_carts`
  - `suppliers` & `purchase_orders` & `goods_receipt_notes`
  - `customers` / `profiles`
  - `users`
- When Supabase is connected in the next phase, the data layer functions (`getProducts()`, `createOrder()`, `updateBatch()`, etc.) will swap their internal array operations for `@supabase/ssr` / `@supabase/supabase-js` calls without requiring changes to page components.

---

### 7. Development & Verification Commands
- `npm run dev`: Start Next.js development server on port 3000
- `npm run build`: Validate TypeScript types and build production bundle
- `npm run lint`: ESLint check

---
*End of Agent.md*
