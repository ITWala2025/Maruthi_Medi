// src/lib/mock/db.ts
// In-memory mock database layer strictly mirroring the Supabase schema from Design.md

import {
  Category,
  Product,
  Batch,
  Prescription,
  Order,
  OrderItem,
  AbandonedCart,
  Supplier,
  PurchaseOrder,
  GoodsReceiptNote,
  Customer,
  UserProfile
} from './types';
import { calculateItemTax } from '../tax/gstCalculator';

// -----------------------------------------------------------------------------
// SEED DATA
// -----------------------------------------------------------------------------

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Prescription Medicines (Rx)',
    slug: 'prescription-medicines',
    description: 'Schedule H & H1 medications verified by our registered pharmacist.',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-2',
    name: 'Pain, Fever & Cold',
    slug: 'pain-fever-cold',
    description: 'Analgesics, antipyretics, and fast relief cold remedies.',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-3',
    name: 'Chronic Care (Cardiac & Diabetes)',
    slug: 'chronic-care',
    description: 'Daily maintenance therapies for hypertension, blood sugar, and cardiac health.',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-4',
    name: 'First Aid & Antiseptics',
    slug: 'first-aid-antiseptics',
    description: 'Wound care, antiseptic creams, sterile dressings, and pain relief sprays.',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-5',
    name: 'Medical Devices & Diagnostic Kits',
    slug: 'medical-devices',
    description: 'Digital BP monitors, glucometers, nebulizers, and infrared thermometers.',
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 'cat-6',
    name: 'Mother & Baby Care',
    slug: 'mother-and-baby',
    description: 'Gentle dermatological washes, diapers, feeding essentials, and pediatric drops.',
    sortOrder: 6,
    isActive: true,
  },
  {
    id: 'cat-7',
    name: 'Hygiene & Skin Care',
    slug: 'hygiene-skin-care',
    description: 'Dermatological moisturizers, clinical antiseptics, medicated soaps, and daily hygiene.',
    sortOrder: 7,
    isActive: true,
  },
];

export const MOCK_BATCHES: Batch[] = [
  {
    id: 'batch-101',
    productId: 'prod-1',
    batchNumber: 'DL65-24J09',
    manufacturingDate: '2025-10-01',
    expiryDate: '2027-09-30', // Safe (>90d)
    purchasePrice: 24.50,
    mrp: 34.00,
    salePrice: 32.00,
    stockQuantity: 180,
    reservedQuantity: 4,
    rackLocation: 'Rack-A1-Shelf2',
    isQuarantined: false,
    createdAt: '2025-10-15T10:00:00Z',
  },
  {
    id: 'batch-102',
    productId: 'prod-2',
    batchNumber: 'SH50-24L12',
    manufacturingDate: '2025-11-01',
    expiryDate: '2027-10-31', // Safe
    purchasePrice: 88.00,
    mrp: 125.00,
    salePrice: 119.50,
    stockQuantity: 95,
    reservedQuantity: 2,
    rackLocation: 'Rack-A2-Shelf1',
    isQuarantined: false,
    createdAt: '2025-11-10T10:00:00Z',
  },
  {
    id: 'batch-103',
    productId: 'prod-3', // Augmentin 625 Duo (Rx)
    batchNumber: 'AUG-24K88',
    manufacturingDate: '2026-01-01',
    expiryDate: '2026-11-15', // Warning: ~25 days from current date (Critical alert test)
    purchasePrice: 155.00,
    mrp: 220.00,
    salePrice: 205.00,
    stockQuantity: 28,
    reservedQuantity: 3,
    rackLocation: 'ColdStorage-B1',
    isQuarantined: false,
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'batch-104',
    productId: 'prod-3',
    batchNumber: 'AUG-25A14',
    manufacturingDate: '2026-03-01',
    expiryDate: '2027-08-31', // Safe
    purchasePrice: 158.00,
    mrp: 220.00,
    salePrice: 205.00,
    stockQuantity: 80,
    reservedQuantity: 0,
    rackLocation: 'ColdStorage-B1',
    isQuarantined: false,
    createdAt: '2026-03-12T10:00:00Z',
  },
  {
    id: 'batch-105',
    productId: 'prod-4', // Telma 40mg
    batchNumber: 'TL40-25C02',
    manufacturingDate: '2026-02-15',
    expiryDate: '2028-01-31', // Safe
    purchasePrice: 190.00,
    mrp: 275.00,
    salePrice: 248.00,
    stockQuantity: 110,
    reservedQuantity: 5,
    rackLocation: 'Rack-C1-Shelf3',
    isQuarantined: false,
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'batch-106',
    productId: 'prod-5', // Glycomet GP 1
    batchNumber: 'GLY-24M09',
    manufacturingDate: '2025-12-01',
    expiryDate: '2026-12-10', // Warning (31-60 days)
    purchasePrice: 110.00,
    mrp: 168.00,
    salePrice: 152.00,
    stockQuantity: 42,
    reservedQuantity: 1,
    rackLocation: 'Rack-C2-Shelf1',
    isQuarantined: false,
    createdAt: '2025-12-15T10:00:00Z',
  },
  {
    id: 'batch-107',
    productId: 'prod-6', // Volini Gel 30g
    batchNumber: 'VOL-25B08',
    manufacturingDate: '2026-02-01',
    expiryDate: '2028-01-31',
    purchasePrice: 92.00,
    mrp: 135.00,
    salePrice: 125.00,
    stockQuantity: 65,
    reservedQuantity: 0,
    rackLocation: 'Rack-D1-Shelf1',
    isQuarantined: false,
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'batch-108',
    productId: 'prod-7', // Betadine Ointment 20g
    batchNumber: 'BET-25A05',
    manufacturingDate: '2026-01-10',
    expiryDate: '2027-12-31',
    purchasePrice: 72.00,
    mrp: 105.00,
    salePrice: 98.00,
    stockQuantity: 8, // Low Stock Warning (< 10 threshold)
    reservedQuantity: 0,
    rackLocation: 'Rack-D2-Shelf2',
    isQuarantined: false,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'batch-109',
    productId: 'prod-8', // Omron BP Monitor
    batchNumber: 'OMR-25X91',
    manufacturingDate: '2026-01-01',
    expiryDate: '2031-12-31',
    purchasePrice: 1450.00,
    mrp: 2390.00,
    salePrice: 1999.00,
    stockQuantity: 14,
    reservedQuantity: 1,
    rackLocation: 'DeviceCase-01',
    isQuarantined: false,
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'batch-110',
    productId: 'prod-9', // Sebamed Baby Wash 200ml
    batchNumber: 'SEB-25C19',
    manufacturingDate: '2026-03-01',
    expiryDate: '2028-02-28',
    purchasePrice: 380.00,
    mrp: 520.00,
    salePrice: 475.00,
    stockQuantity: 22,
    reservedQuantity: 0,
    rackLocation: 'Rack-E1-Shelf1',
    isQuarantined: false,
    createdAt: '2026-03-10T10:00:00Z',
  },
  {
    id: 'batch-111',
    productId: 'prod-10', // Cetaphil Moisturizing Cream
    batchNumber: 'CET-25D08',
    manufacturingDate: '2026-02-15',
    expiryDate: '2028-01-31',
    purchasePrice: 340.00,
    mrp: 485.00,
    salePrice: 435.00,
    stockQuantity: 40,
    reservedQuantity: 0,
    rackLocation: 'Rack-F1-Shelf2',
    isQuarantined: false,
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'batch-112',
    productId: 'prod-11', // Dettol Antiseptic Liquid
    batchNumber: 'DET-25B22',
    manufacturingDate: '2026-01-10',
    expiryDate: '2029-12-31',
    purchasePrice: 160.00,
    mrp: 230.00,
    salePrice: 205.00,
    stockQuantity: 65,
    reservedQuantity: 2,
    rackLocation: 'Rack-F1-Shelf1',
    isQuarantined: false,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'batch-113',
    productId: 'prod-12', // Candid Dusting Powder
    batchNumber: 'CND-25K03',
    manufacturingDate: '2026-03-01',
    expiryDate: '2028-02-28',
    purchasePrice: 110.00,
    mrp: 175.00,
    salePrice: 155.00,
    stockQuantity: 50,
    reservedQuantity: 0,
    rackLocation: 'Rack-F2-Shelf1',
    isQuarantined: false,
    createdAt: '2026-03-05T10:00:00Z',
  },
  {
    id: 'batch-114',
    productId: 'prod-13', // Himalaya Baby Lotion
    batchNumber: 'HIM-25L14',
    manufacturingDate: '2026-02-01',
    expiryDate: '2028-01-31',
    purchasePrice: 125.00,
    mrp: 195.00,
    salePrice: 175.00,
    stockQuantity: 35,
    reservedQuantity: 0,
    rackLocation: 'Rack-E1-Shelf2',
    isQuarantined: false,
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'batch-115',
    productId: 'prod-14', // Savlon Handwash Refill
    batchNumber: 'SAV-25P88',
    manufacturingDate: '2026-03-10',
    expiryDate: '2028-02-28',
    purchasePrice: 80.00,
    mrp: 140.00,
    salePrice: 119.00,
    stockQuantity: 70,
    reservedQuantity: 0,
    rackLocation: 'Rack-F2-Shelf3',
    isQuarantined: false,
    createdAt: '2026-03-15T10:00:00Z',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Dolo 650mg Tablet',
    slug: 'dolo-650mg-tablet',
    brandManufacturer: 'Micro Labs Ltd.',
    genericSalt: 'Paracetamol (650mg)',
    categoryId: 'cat-2',
    categoryName: 'Pain, Fever & Cold',
    drugSchedule: 'otc',
    dosageForm: 'tablet',
    packSize: 'Strip of 15 Tablets',
    hsnCode: '3004',
    gstPercentage: 12.00,
    prescriptionRequired: false,
    description: 'Trusted fever and moderate body ache relief medicine formulated with micro-ionized paracetamol.',
    sideEffects: 'Rare when taken within recommended dosage. Avoid exceeding 4g daily.',
    storageInstructions: 'Store below 30°C in a dry place protected from direct sunlight.',
    safetyStockThreshold: 30,
    isFeatured: true,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    mrp: 34.00,
    salePrice: 32.00,
    stockQuantity: 180,
  },
  {
    id: 'prod-2',
    name: 'Shelcal 500mg Tablet',
    slug: 'shelcal-500mg-tablet',
    brandManufacturer: 'Torrent Pharmaceuticals',
    genericSalt: 'Calcium Carbonate (1250mg eq. to Elemental Calcium 500mg) + Vitamin D3 (250 IU)',
    categoryId: 'cat-3',
    categoryName: 'Chronic Care (Cardiac & Diabetes)',
    drugSchedule: 'otc',
    dosageForm: 'tablet',
    packSize: 'Strip of 15 Tablets',
    hsnCode: '3004',
    gstPercentage: 12.00,
    prescriptionRequired: false,
    description: 'Daily bone health supplement replenishing elemental calcium and vitamin D3 for optimal calcium absorption.',
    sideEffects: 'Mild constipation or gas in sensitive individuals.',
    storageInstructions: 'Keep strip tightly closed in a cool, dry area away from moisture.',
    safetyStockThreshold: 20,
    isFeatured: true,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    mrp: 125.00,
    salePrice: 119.50,
    stockQuantity: 95,
  },
  {
    id: 'prod-3',
    name: 'Augmentin 625 Duo Tablet',
    slug: 'augmentin-625-duo-tablet',
    brandManufacturer: 'GlaxoSmithKline (GSK)',
    genericSalt: 'Amoxycillin (500mg) + Potassium Clavulanate (125mg)',
    categoryId: 'cat-1',
    categoryName: 'Prescription Medicines (Rx)',
    drugSchedule: 'schedule_h',
    dosageForm: 'tablet',
    packSize: 'Strip of 10 Tablets',
    hsnCode: '3004',
    gstPercentage: 12.00,
    prescriptionRequired: true,
    description: 'Potent broad-spectrum antibiotic indicated for bacterial infections of the respiratory tract, ENT, skin, and urinary tract.',
    sideEffects: 'Nausea, mild diarrhea, abdominal discomfort. Take with a meal.',
    storageInstructions: 'Store in moisture-proof foil packaging below 25°C.',
    safetyStockThreshold: 15,
    isFeatured: true,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&auto=format&fit=crop&q=80',
    mrp: 220.00,
    salePrice: 205.00,
    stockQuantity: 108,
  },
  {
    id: 'prod-4',
    name: 'Telma 40mg Tablet',
    slug: 'telma-40mg-tablet',
    brandManufacturer: 'Glenmark Pharmaceuticals',
    genericSalt: 'Telmisartan (40mg)',
    categoryId: 'cat-3',
    categoryName: 'Chronic Care (Cardiac & Diabetes)',
    drugSchedule: 'schedule_h',
    dosageForm: 'tablet',
    packSize: 'Strip of 30 Tablets',
    hsnCode: '3004',
    gstPercentage: 12.00,
    prescriptionRequired: true,
    description: 'Angiotensin receptor blocker (ARB) widely prescribed for long-term management of essential hypertension and cardiovascular protection.',
    sideEffects: 'Occasional dizziness or sinus congestion upon starting therapy.',
    storageInstructions: 'Store below 30°C in blister pack.',
    safetyStockThreshold: 25,
    isFeatured: true,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
    mrp: 275.00,
    salePrice: 248.00,
    stockQuantity: 110,
  },
  {
    id: 'prod-5',
    name: 'Glycomet GP 1 Tablet',
    slug: 'glycomet-gp-1-tablet',
    brandManufacturer: 'USV Pvt. Ltd.',
    genericSalt: 'Glimepiride (1mg) + Metformin Hydrochloride (500mg PR)',
    categoryId: 'cat-3',
    categoryName: 'Chronic Care (Cardiac & Diabetes)',
    drugSchedule: 'schedule_h',
    dosageForm: 'tablet',
    packSize: 'Strip of 15 Tablets',
    hsnCode: '3004',
    gstPercentage: 12.00,
    prescriptionRequired: true,
    description: 'Dual anti-diabetic medication combining sustained release metformin with sulfonylurea glimepiride for Type-2 Diabetes.',
    sideEffects: 'Hypoglycemia risk if meals are missed. Gastrointestinal fullness.',
    storageInstructions: 'Store in dry surroundings protected from sunlight.',
    safetyStockThreshold: 20,
    isFeatured: false,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&auto=format&fit=crop&q=80',
    mrp: 168.00,
    salePrice: 152.00,
    stockQuantity: 42,
  },
  {
    id: 'prod-6',
    name: 'Volini Pain Relief Gel (30g)',
    slug: 'volini-pain-relief-gel',
    brandManufacturer: 'Sun Pharmaceutical Industries',
    genericSalt: 'Diclofenac Diethylamine (1.16% w/w) + Linseed Oil + Methyl Salicylate + Menthol',
    categoryId: 'cat-2',
    categoryName: 'Pain, Fever & Cold',
    drugSchedule: 'otc',
    dosageForm: 'ointment',
    packSize: '30g Tube',
    hsnCode: '3004',
    gstPercentage: 12.00,
    prescriptionRequired: false,
    description: 'Fast-penetrating scientific pain relief gel for backache, joint stiffness, neck strain, and sports sprains.',
    sideEffects: 'Mild temporary skin irritation or tingling sensation at application site.',
    storageInstructions: 'Do not freeze. Keep tube cap tightly secured after use.',
    safetyStockThreshold: 15,
    isFeatured: true,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80',
    mrp: 135.00,
    salePrice: 125.00,
    stockQuantity: 65,
  },
  {
    id: 'prod-7',
    name: 'Betadine 10% Antiseptic Ointment',
    slug: 'betadine-10-percent-ointment',
    brandManufacturer: 'Win-Medicare Pvt. Ltd.',
    genericSalt: 'Povidone Iodine (10% w/w)',
    categoryId: 'cat-4',
    categoryName: 'First Aid & Antiseptics',
    drugSchedule: 'otc',
    dosageForm: 'ointment',
    packSize: '20g Tube',
    hsnCode: '3004',
    gstPercentage: 12.00,
    prescriptionRequired: false,
    description: 'Gold-standard microbicidal topical ointment preventing infection in cuts, abrasions, minor burns, and surgical wounds.',
    sideEffects: 'Rare iodine sensitivity or skin rash.',
    storageInstructions: 'Store below 25°C. For external application only.',
    safetyStockThreshold: 10,
    isFeatured: false,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    mrp: 105.00,
    salePrice: 98.00,
    stockQuantity: 8, // Low Stock Warning
  },
  {
    id: 'prod-8',
    name: 'Omron HEM 7120 Digital BP Monitor',
    slug: 'omron-hem-7120-bp-monitor',
    brandManufacturer: 'Omron Healthcare',
    genericSalt: 'Oscillometric Digital Pressure Sensor',
    categoryId: 'cat-5',
    categoryName: 'Medical Devices & Diagnostic Kits',
    drugSchedule: 'otc',
    dosageForm: 'device',
    packSize: 'Box of 1 Unit + Cuff + 4 AA Batteries',
    hsnCode: '9018',
    gstPercentage: 18.00,
    prescriptionRequired: false,
    description: 'Clinically validated automatic upper-arm blood pressure monitor featuring IntelliSense technology for painless inflation.',
    storageInstructions: 'Keep in supplied carry pouch. Remove batteries if not in use for extended periods.',
    safetyStockThreshold: 5,
    isFeatured: true,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    mrp: 2390.00,
    salePrice: 1999.00,
    stockQuantity: 14,
  },
  {
    id: 'prod-9',
    name: 'Sebamed Baby Gentle Wash (200ml)',
    slug: 'sebamed-baby-gentle-wash',
    brandManufacturer: 'Sebapharma GmbH',
    genericSalt: 'Sugar-based surfactant formula with Allantoin (pH 5.5)',
    categoryId: 'cat-6',
    categoryName: 'Mother & Baby Care',
    drugSchedule: 'otc',
    dosageForm: 'syrup',
    packSize: '200ml Dispenser Bottle',
    hsnCode: '3307',
    gstPercentage: 18.00,
    prescriptionRequired: false,
    description: '100% soap and alkali free gentle wash protecting baby skin natural acid mantle at optimal pH 5.5.',
    storageInstructions: 'Store at room temperature away from direct sunlight.',
    safetyStockThreshold: 10,
    isFeatured: false,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&auto=format&fit=crop&q=80',
    mrp: 520.00,
    salePrice: 475.00,
    stockQuantity: 22,
  },
  {
    id: 'prod-10',
    name: 'Cetaphil Moisturizing Cream (100g)',
    slug: 'cetaphil-moisturizing-cream',
    brandManufacturer: 'Galderma India Pvt. Ltd.',
    genericSalt: 'Sweet Almond Oil + Vitamin E & B3 + Pro-Vitamin B5',
    categoryId: 'cat-7',
    categoryName: 'Hygiene & Skin Care',
    drugSchedule: 'otc',
    dosageForm: 'ointment',
    packSize: '100g Jar',
    hsnCode: '3304',
    gstPercentage: 18.00,
    prescriptionRequired: false,
    description: 'Dermatologist recommended non-greasy rich daily moisturizer for sensitive and dry skin with 48h moisture lock.',
    storageInstructions: 'Store below 25°C in a dry place. Keep container tightly closed.',
    safetyStockThreshold: 12,
    isFeatured: true,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    mrp: 485.00,
    salePrice: 435.00,
    stockQuantity: 40,
  },
  {
    id: 'prod-11',
    name: 'Dettol Antiseptic Liquid (550ml)',
    slug: 'dettol-antiseptic-liquid',
    brandManufacturer: 'Reckitt Benckiser India',
    genericSalt: 'Chloroxylenol (4.8% w/v) Terpineol & Alcohol Solution',
    categoryId: 'cat-7',
    categoryName: 'Hygiene & Skin Care',
    drugSchedule: 'otc',
    dosageForm: 'syrup',
    packSize: '550ml Bottle',
    hsnCode: '3808',
    gstPercentage: 18.00,
    prescriptionRequired: false,
    description: 'Legendary hospital-grade antiseptic disinfectant for first aid cuts, personal bathing hygiene, and surface disinfection.',
    storageInstructions: 'Keep out of reach of children. Store in dark cool place.',
    safetyStockThreshold: 20,
    isFeatured: false,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80',
    mrp: 230.00,
    salePrice: 205.00,
    stockQuantity: 65,
  },
  {
    id: 'prod-12',
    name: 'Candid Dusting Powder (120g)',
    slug: 'candid-dusting-powder',
    brandManufacturer: 'Glenmark Pharmaceuticals',
    genericSalt: 'Clotrimazole (1% w/w) in Absorbent Starch Base',
    categoryId: 'cat-7',
    categoryName: 'Hygiene & Skin Care',
    drugSchedule: 'otc',
    dosageForm: 'ointment',
    packSize: '120g Dispenser Bottle',
    hsnCode: '3004',
    gstPercentage: 12.00,
    prescriptionRequired: false,
    description: 'Proven anti-fungal medicated dusting powder preventing sweat rash, fungal itch, and prickly heat irritation.',
    storageInstructions: 'Store in dry place away from heat. Close cap tightly after use.',
    safetyStockThreshold: 15,
    isFeatured: true,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80',
    mrp: 175.00,
    salePrice: 155.00,
    stockQuantity: 50,
  },
  {
    id: 'prod-13',
    name: 'Himalaya Baby Daily Lotion (200ml)',
    slug: 'himalaya-baby-daily-lotion',
    brandManufacturer: 'Himalaya Wellness Company',
    genericSalt: 'Olive Oil + Almond Oil + Licorice Herbal Blend',
    categoryId: 'cat-6',
    categoryName: 'Mother & Baby Care',
    drugSchedule: 'otc',
    dosageForm: 'syrup',
    packSize: '200ml Bottle',
    hsnCode: '3304',
    gstPercentage: 18.00,
    prescriptionRequired: false,
    description: 'Natural herbal baby lotion enriched with almond and olive oil for tender, supple, and hydrated infant skin.',
    storageInstructions: 'Keep in cool dry place. For external application.',
    safetyStockThreshold: 10,
    isFeatured: false,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    mrp: 195.00,
    salePrice: 175.00,
    stockQuantity: 35,
  },
  {
    id: 'prod-14',
    name: 'Savlon Moisture Shield Handwash (750ml Refill)',
    slug: 'savlon-moisture-shield-handwash',
    brandManufacturer: 'ITC Limited',
    genericSalt: 'Silver Protection + Active Anti-Bacterial Moisturizing Formula',
    categoryId: 'cat-7',
    categoryName: 'Hygiene & Skin Care',
    drugSchedule: 'otc',
    dosageForm: 'syrup',
    packSize: '750ml Eco Refill Pouch',
    hsnCode: '3401',
    gstPercentage: 18.00,
    prescriptionRequired: false,
    description: '99.9% germ protection liquid handwash formulated with skin moisturizers to prevent dry hands from frequent washing.',
    storageInstructions: 'Store away from direct heat and sunlight.',
    safetyStockThreshold: 20,
    isFeatured: false,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80',
    mrp: 140.00,
    salePrice: 119.00,
    stockQuantity: 70,
  },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-501',
    userId: 'cust-1',
    filePath: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    fileType: 'image/jpeg',
    patientName: 'Ramesh Kumar',
    doctorName: 'Dr. Srinivas Murthy, MD (Internal Medicine)',
    notes: 'Prescribed Augmentin 625 Duo 1 tab BD for 5 days post dental procedure.',
    status: 'approved',
    verifiedBy: 'user-staff-1',
    verifiedAt: '2026-10-18T14:30:00Z',
    createdAt: '2026-10-18T14:10:00Z',
  },
  {
    id: 'rx-502',
    userId: 'cust-2',
    filePath: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
    fileType: 'image/jpeg',
    patientName: 'Sumathi Devi',
    doctorName: 'Dr. Ananya Rao, Cardiologist',
    notes: 'Regular monthly refill for Telma 40mg and Glycomet GP 1.',
    status: 'pending',
    createdAt: '2026-10-20T09:15:00Z',
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'MM-202610-0089',
    userId: 'cust-1',
    customerName: 'Ramesh Kumar',
    customerPhone: '+91 98450 11223',
    deliveryType: 'delivery',
    deliveryAddress: {
      recipientName: 'Ramesh Kumar',
      phone: '+91 98450 11223',
      addressLine1: 'Flat 402, Green Meadows Apartment',
      addressLine2: 'Koppa Gate, Near Govt School',
      landmark: 'Next to Koppa Post Office',
      pincode: '560105',
      city: 'Bengaluru',
      state: 'Karnataka',
    },
    prescriptionId: 'rx-501',
    prescriptionUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    subtotal: 442.00,
    discountAmount: 0.00,
    deliveryFee: 0.00,
    taxAmount: 47.36,
    totalAmount: 442.00,
    paymentStatus: 'paid',
    paymentMethod: 'upi_on_delivery',
    orderStatus: 'completed',
    placedVia: 'web',
    customerNotes: 'Please ring bell twice, infant sleeping.',
    adminNotes: 'Rx verified by Pharmacist K. Venkatesh (KA-PH-019842). Dispatched via rider Raju.',
    createdAt: '2026-10-18T14:20:00Z',
    updatedAt: '2026-10-18T16:45:00Z',
    items: [
      {
        id: 'item-1',
        orderId: 'ord-1001',
        productId: 'prod-3',
        batchId: 'batch-103',
        productName: 'Augmentin 625 Duo Tablet',
        batchNumber: 'AUG-24K88',
        expiryDate: '2026-11-15',
        hsnCode: '3004',
        quantity: 2,
        unitPrice: 205.00,
        gstPercentage: 12.00,
        cgstAmount: 21.96,
        sgstAmount: 21.96,
        totalAmount: 410.00,
      },
      {
        id: 'item-2',
        orderId: 'ord-1001',
        productId: 'prod-1',
        batchId: 'batch-101',
        productName: 'Dolo 650mg Tablet',
        batchNumber: 'DL65-24J09',
        expiryDate: '2027-09-30',
        hsnCode: '3004',
        quantity: 1,
        unitPrice: 32.00,
        gstPercentage: 12.00,
        cgstAmount: 1.71,
        sgstAmount: 1.71,
        totalAmount: 32.00,
      },
    ],
  },
  {
    id: 'ord-1002',
    orderNumber: 'MM-202610-0090',
    userId: 'cust-2',
    customerName: 'Sumathi Devi',
    customerPhone: '+91 97401 88234',
    deliveryType: 'delivery',
    deliveryAddress: {
      recipientName: 'Sumathi Devi',
      phone: '+91 97401 88234',
      addressLine1: 'House #45, Near Anjaneya Temple',
      addressLine2: 'Hulimangala Main Road',
      landmark: 'Behind Hulimangala Lake',
      pincode: '560105',
      city: 'Bengaluru',
      state: 'Karnataka',
    },
    prescriptionId: 'rx-502',
    prescriptionUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
    subtotal: 400.00,
    discountAmount: 0.00,
    deliveryFee: 0.00,
    taxAmount: 42.86,
    totalAmount: 400.00,
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    orderStatus: 'pending_review',
    placedVia: 'web',
    customerNotes: 'Deliver around 5 PM please.',
    createdAt: '2026-10-20T09:20:00Z',
    updatedAt: '2026-10-20T09:20:00Z',
    items: [
      {
        id: 'item-3',
        orderId: 'ord-1002',
        productId: 'prod-4',
        batchId: 'batch-105',
        productName: 'Telma 40mg Tablet',
        batchNumber: 'TL40-25C02',
        expiryDate: '2028-01-31',
        hsnCode: '3004',
        quantity: 1,
        unitPrice: 248.00,
        gstPercentage: 12.00,
        cgstAmount: 13.29,
        sgstAmount: 13.29,
        totalAmount: 248.00,
      },
      {
        id: 'item-4',
        orderId: 'ord-1002',
        productId: 'prod-5',
        batchId: 'batch-106',
        productName: 'Glycomet GP 1 Tablet',
        batchNumber: 'GLY-24M09',
        expiryDate: '2026-12-10',
        hsnCode: '3004',
        quantity: 1,
        unitPrice: 152.00,
        gstPercentage: 12.00,
        cgstAmount: 8.14,
        sgstAmount: 8.14,
        totalAmount: 152.00,
      },
    ],
  },
  {
    id: 'ord-1003',
    orderNumber: 'MM-202610-0091',
    customerName: 'Anil Gowda',
    customerPhone: '+91 94480 33441',
    deliveryType: 'pickup',
    subtotal: 125.00,
    discountAmount: 0.00,
    deliveryFee: 0.00,
    taxAmount: 13.39,
    totalAmount: 125.00,
    paymentStatus: 'pending',
    paymentMethod: 'cash_counter',
    orderStatus: 'packing',
    placedVia: 'whatsapp',
    customerNotes: 'Will collect at counter in 20 minutes.',
    createdAt: '2026-10-20T10:45:00Z',
    updatedAt: '2026-10-20T11:00:00Z',
    items: [
      {
        id: 'item-5',
        orderId: 'ord-1003',
        productId: 'prod-6',
        batchId: 'batch-107',
        productName: 'Volini Pain Relief Gel (30g)',
        batchNumber: 'VOL-25B08',
        expiryDate: '2028-01-31',
        hsnCode: '3004',
        quantity: 1,
        unitPrice: 125.00,
        gstPercentage: 12.00,
        cgstAmount: 6.70,
        sgstAmount: 6.70,
        totalAmount: 125.00,
      },
    ],
  },
];

export const MOCK_ABANDONED_CARTS: AbandonedCart[] = [
  {
    id: 'cart-ab-1',
    sessionId: 'sess_99a8b1',
    customerName: 'Mahesh Reddy',
    customerPhone: '+91 99002 44331',
    cartItems: [
      { productId: 'prod-8', name: 'Omron HEM 7120 Digital BP Monitor', packSize: 'Box of 1 Unit', quantity: 1, price: 1999.00 },
      { productId: 'prod-2', name: 'Shelcal 500mg Tablet', packSize: 'Strip of 15', quantity: 2, price: 119.50 },
    ],
    totalValue: 2238.00,
    lastActivity: '2026-10-20T10:15:00Z',
    whatsappReminderSent: false,
  },
  {
    id: 'cart-ab-2',
    sessionId: 'sess_77c2d9',
    customerName: 'Kavitha S.',
    customerPhone: '+91 88610 99821',
    cartItems: [
      { productId: 'prod-9', name: 'Sebamed Baby Gentle Wash', packSize: '200ml Bottle', quantity: 2, price: 475.00 },
      { productId: 'prod-7', name: 'Betadine 10% Ointment', packSize: '20g Tube', quantity: 1, price: 98.00 },
    ],
    totalValue: 1048.00,
    lastActivity: '2026-10-20T08:30:00Z',
    whatsappReminderSent: true,
    reminderSentAt: '2026-10-20T09:05:00Z',
  },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Balaji Pharma Agencies',
    companyName: 'Sri Balaji Pharmaceuticals Pvt Ltd',
    gstin: '29AABCS1234F1Z8',
    drugLicenseNumbers: 'KA-B2-004521 / KA-B21-004522',
    phone: '+91 80 2670 1199',
    email: 'orders@balajipharma.co.in',
    address: '#45, 3rd Main, Chamarajpet, Bengaluru, Karnataka 560018',
    paymentTermsDays: 21,
    isActive: true,
  },
  {
    id: 'sup-2',
    name: 'Jigani MediDistributors',
    companyName: 'South Bengaluru Medical Hub LLP',
    gstin: '29AAECS9876K1Z3',
    drugLicenseNumbers: 'KA-B2-009988 / KA-B21-009989',
    phone: '+91 80 2783 5500',
    email: 'supply@jiganimedi.com',
    address: 'Plot 12-A, Jigani Industrial Area Phase 1, Anekal Taluk, Bengaluru 560105',
    paymentTermsDays: 15,
    isActive: true,
  },
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-101',
    poNumber: 'PO-202610-0014',
    supplierId: 'sup-1',
    supplierName: 'Balaji Pharma Agencies',
    status: 'received',
    totalEstimatedAmount: 18500.00,
    notes: 'Urgent restocking for Dolo 650, Shelcal 500, and Augmentin 625.',
    createdBy: 'user-admin-1',
    createdAt: '2026-10-10T11:00:00Z',
    items: [
      { id: 'poi-1', productId: 'prod-1', productName: 'Dolo 650mg Tablet', quantityOrdered: 200, estimatedUnitCost: 24.50 },
      { id: 'poi-2', productId: 'prod-2', productName: 'Shelcal 500mg Tablet', quantityOrdered: 100, estimatedUnitCost: 88.00 },
      { id: 'poi-3', productId: 'prod-3', productName: 'Augmentin 625 Duo Tablet', quantityOrdered: 30, estimatedUnitCost: 158.00 },
    ],
  },
  {
    id: 'po-102',
    poNumber: 'PO-202610-0015',
    supplierId: 'sup-2',
    supplierName: 'Jigani MediDistributors',
    status: 'submitted',
    totalEstimatedAmount: 12200.00,
    notes: 'Diagnostic devices and Betadine stock replenishment.',
    createdBy: 'user-admin-1',
    createdAt: '2026-10-19T15:30:00Z',
    items: [
      { id: 'poi-4', productId: 'prod-7', productName: 'Betadine 10% Ointment', quantityOrdered: 50, estimatedUnitCost: 72.00 },
      { id: 'poi-5', productId: 'prod-8', productName: 'Omron HEM 7120 BP Monitor', quantityOrdered: 6, estimatedUnitCost: 1450.00 },
    ],
  },
];

export const MOCK_GOODS_RECEIPT_NOTES: GoodsReceiptNote[] = [
  {
    id: 'grn-501',
    grnNumber: 'GRN-202610-0008',
    poId: 'po-101',
    supplierId: 'sup-1',
    supplierName: 'Balaji Pharma Agencies',
    supplierInvoiceNo: 'INV-BLJ-88192',
    supplierInvoiceDate: '2026-10-15',
    totalTaxable: 16517.85,
    totalTax: 1982.15,
    grandTotal: 18500.00,
    receivedBy: 'Pharmacist K. Venkatesh',
    createdAt: '2026-10-15T16:00:00Z',
    items: [
      {
        id: 'grni-1',
        productId: 'prod-1',
        productName: 'Dolo 650mg Tablet',
        batchNumber: 'DL65-24J09',
        manufacturingDate: '2025-10-01',
        expiryDate: '2027-09-30',
        receivedQuantity: 200,
        freeQuantity: 10,
        purchaseRate: 24.50,
        mrp: 34.00,
        salePrice: 32.00,
        gstPercentage: 12.00,
        totalAmount: 4900.00,
      },
    ],
  },
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Ramesh Kumar',
    phone: '+91 98450 11223',
    email: 'ramesh.k@gmail.com',
    totalOrders: 6,
    lifetimeSpend: 2840.00,
    chronicCareRefillTag: 'Monthly Dental & First Aid',
    addresses: [
      {
        recipientName: 'Ramesh Kumar',
        phone: '+91 98450 11223',
        addressLine1: 'Flat 402, Green Meadows Apartment',
        addressLine2: 'Koppa Gate, Near Govt School',
        landmark: 'Next to Koppa Post Office',
        pincode: '560105',
        city: 'Bengaluru',
        state: 'Karnataka',
      },
    ],
    prescriptions: [MOCK_PRESCRIPTIONS[0]],
    createdAt: '2026-06-12T10:00:00Z',
  },
  {
    id: 'cust-2',
    name: 'Sumathi Devi',
    phone: '+91 97401 88234',
    email: 'sumathi.d@outlook.com',
    totalOrders: 14,
    lifetimeSpend: 6200.00,
    chronicCareRefillTag: 'Monthly BP & Diabetic (Due on 5th)',
    addresses: [
      {
        recipientName: 'Sumathi Devi',
        phone: '+91 97401 88234',
        addressLine1: 'House #45, Near Anjaneya Temple',
        addressLine2: 'Hulimangala Main Road',
        pincode: '560105',
        city: 'Bengaluru',
        state: 'Karnataka',
      },
    ],
    prescriptions: [MOCK_PRESCRIPTIONS[1]],
    createdAt: '2026-03-01T10:00:00Z',
  },
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user-super-1',
    fullName: 'Prashant Maruthi (Owner)',
    email: 'owner@maruthimedical.in',
    phone: '+91 76762 22727',
    role: 'super_admin',
    pharmacistLicenseNo: 'KA-PH-019842',
    lastLogin: '2026-10-20T11:30:00Z',
  },
  {
    id: 'user-admin-1',
    fullName: 'Rajesh Sharma',
    email: 'storemanager@maruthimedical.in',
    phone: '+91 98860 12345',
    role: 'admin',
    lastLogin: '2026-10-20T10:15:00Z',
  },
  {
    id: 'user-staff-1',
    fullName: 'K. Venkatesh (Registered Pharmacist)',
    email: 'pharmacist@maruthimedical.in',
    phone: '+91 99011 54321',
    role: 'staff',
    pharmacistLicenseNo: 'KA-PH-028419',
    lastLogin: '2026-10-20T08:00:00Z',
  },
];

// -----------------------------------------------------------------------------
// ASYNC SERVICE METHODS (Drop-in Supabase replacement layer)
// -----------------------------------------------------------------------------

// In-memory mutable states
let productsData = [...MOCK_PRODUCTS];
let batchesData = [...MOCK_BATCHES];
let ordersData = [...MOCK_ORDERS];
let prescriptionsData = [...MOCK_PRESCRIPTIONS];
let abandonedCartsData = [...MOCK_ABANDONED_CARTS];
let suppliersData = [...MOCK_SUPPLIERS];
let purchaseOrdersData = [...MOCK_PURCHASE_ORDERS];
let goodsReceiptNotesData = [...MOCK_GOODS_RECEIPT_NOTES];

export const mockDb = {
  // Categories
  async getCategories(): Promise<Category[]> {
    return [...MOCK_CATEGORIES].sort((a, b) => a.sortOrder - b.sortOrder);
  },

  // Products
  async getProducts(): Promise<Product[]> {
    return [...productsData];
  },

  async getFeaturedProducts(): Promise<Product[]> {
    return productsData.filter((p) => p.isFeatured && p.isActive);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const product = productsData.find((p) => p.slug === slug);
    return product ? { ...product } : null;
  },

  async searchProducts(query: string = '', categoryId?: string, rxOnly?: boolean): Promise<Product[]> {
    return productsData.filter((p) => {
      if (!p.isActive) return false;
      if (categoryId && p.categoryId !== categoryId) return false;
      if (rxOnly !== undefined && p.prescriptionRequired !== rxOnly) return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.genericSalt.toLowerCase().includes(q) ||
        p.brandManufacturer.toLowerCase().includes(q)
      );
    });
  },

  async addProduct(newProduct: Omit<Product, 'id' | 'slug' | 'stockQuantity' | 'mrp' | 'salePrice'> & { mrp: number; salePrice: number; initialStock: number; batchNumber: string; expiryDate: string }): Promise<Product> {
    const id = `prod-${Date.now()}`;
    const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const product: Product = {
      ...newProduct,
      id,
      slug,
      mrp: newProduct.mrp,
      salePrice: newProduct.salePrice,
      stockQuantity: newProduct.initialStock,
    };

    productsData.unshift(product);

    // Create initial batch
    const batch: Batch = {
      id: `batch-${Date.now()}`,
      productId: id,
      batchNumber: newProduct.batchNumber || `BAT-${Date.now().toString().slice(-4)}`,
      manufacturingDate: new Date().toISOString().split('T')[0],
      expiryDate: newProduct.expiryDate || '2028-12-31',
      purchasePrice: Number((newProduct.salePrice * 0.75).toFixed(2)),
      mrp: newProduct.mrp,
      salePrice: newProduct.salePrice,
      stockQuantity: newProduct.initialStock,
      reservedQuantity: 0,
      rackLocation: 'Counter-Rack-1',
      isQuarantined: false,
      createdAt: new Date().toISOString(),
    };

    batchesData.unshift(batch);
    return product;
  },

  // Batches & FEFO Inventory
  async getBatches(): Promise<Array<Batch & { productName: string; genericSalt: string; hsnCode: string }>> {
    return batchesData.map((b) => {
      const prod = productsData.find((p) => p.id === b.productId);
      return {
        ...b,
        productName: prod ? prod.name : 'Unknown Product',
        genericSalt: prod ? prod.genericSalt : '',
        hsnCode: prod ? prod.hsnCode : '3004',
      };
    }).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  },

  async adjustBatchStock(batchId: string, quantityDelta: number, reason: string): Promise<Batch | null> {
    const batch = batchesData.find((b) => b.id === batchId);
    if (!batch) return null;

    batch.stockQuantity = Math.max(0, batch.stockQuantity + quantityDelta);
    // Update product stock aggregate
    const totalProdStock = batchesData
      .filter((b) => b.productId === batch.productId && !b.isQuarantined)
      .reduce((sum, b) => sum + b.stockQuantity, 0);

    const prod = productsData.find((p) => p.id === batch.productId);
    if (prod) {
      prod.stockQuantity = totalProdStock;
    }

    return { ...batch };
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    return [...ordersData].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getOrderById(id: string): Promise<Order | null> {
    const order = ordersData.find((o) => o.id === id);
    return order ? { ...order } : null;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const order = ordersData.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());
    return order ? { ...order } : null;
  },

  async createOrder(data: {
    customerName: string;
    customerPhone: string;
    deliveryType: 'delivery' | 'pickup';
    deliveryAddress?: Order['deliveryAddress'];
    paymentMethod: Order['paymentMethod'];
    placedVia: Order['placedVia'];
    customerNotes?: string;
    prescriptionUrl?: string;
    items: Array<{
      productId: string;
      quantity: number;
    }>;
  }): Promise<Order> {
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `MM-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    let subtotal = 0;
    let taxAmount = 0;
    const orderItems: OrderItem[] = [];

    // Map items and calculate GST
    for (const item of data.items) {
      const prod = productsData.find((p) => p.id === item.productId);
      if (!prod) continue;

      // Find best FEFO batch
      const productBatches = batchesData
        .filter((b) => b.productId === prod.id && !b.isQuarantined && b.stockQuantity > 0)
        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

      const chosenBatch = productBatches[0];
      const unitPrice = chosenBatch ? chosenBatch.salePrice : prod.salePrice;
      const taxCalc = calculateItemTax({
        mrpInclusive: unitPrice,
        quantity: item.quantity,
        gstRate: prod.gstPercentage,
      });

      subtotal += taxCalc.grossAmount;
      taxAmount += taxCalc.totalTax;

      orderItems.push({
        id: `oi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        orderId,
        productId: prod.id,
        batchId: chosenBatch?.id,
        productName: prod.name,
        batchNumber: chosenBatch?.batchNumber || 'TBD',
        expiryDate: chosenBatch?.expiryDate,
        hsnCode: prod.hsnCode,
        quantity: item.quantity,
        unitPrice,
        gstPercentage: prod.gstPercentage,
        cgstAmount: taxCalc.cgstAmount,
        sgstAmount: taxCalc.sgstAmount,
        totalAmount: taxCalc.grossAmount,
      });

      // Deduct batch stock
      if (chosenBatch) {
        chosenBatch.stockQuantity = Math.max(0, chosenBatch.stockQuantity - item.quantity);
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
      }
    }

    const hasRx = orderItems.some((item) => {
      const p = productsData.find((pr) => pr.id === item.productId);
      return p?.prescriptionRequired;
    });

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryType: data.deliveryType,
      deliveryAddress: data.deliveryAddress,
      prescriptionUrl: data.prescriptionUrl,
      subtotal,
      discountAmount: 0.00,
      deliveryFee: data.deliveryType === 'delivery' ? 0.00 : 0.00, // Free local Koppa delivery
      taxAmount,
      totalAmount: subtotal,
      paymentStatus: 'pending',
      paymentMethod: data.paymentMethod,
      orderStatus: hasRx && !data.prescriptionUrl ? 'pending_review' : 'pending_review',
      placedVia: data.placedVia,
      customerNotes: data.customerNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: orderItems,
    };

    ordersData.unshift(newOrder);
    return newOrder;
  },

  async updateOrderStatus(
    orderId: string,
    newStatus: Order['orderStatus'],
    adminNotes?: string
  ): Promise<Order | null> {
    const order = ordersData.find((o) => o.id === orderId);
    if (!order) return null;

    order.orderStatus = newStatus;
    if (adminNotes) order.adminNotes = adminNotes;
    order.updatedAt = new Date().toISOString();

    // If marked completed, mark payment paid if COD
    if (newStatus === 'completed' && order.paymentStatus === 'pending') {
      order.paymentStatus = 'paid';
    }

    return { ...order };
  },

  // Prescriptions
  async getPrescriptions(): Promise<Prescription[]> {
    return [...prescriptionsData].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async verifyPrescription(
    prescriptionId: string,
    status: 'approved' | 'rejected',
    verifiedBy: string,
    rejectionReason?: string
  ): Promise<Prescription | null> {
    const rx = prescriptionsData.find((p) => p.id === prescriptionId);
    if (!rx) return null;

    rx.status = status;
    rx.verifiedBy = verifiedBy;
    rx.verifiedAt = new Date().toISOString();
    if (rejectionReason) rx.rejectionReason = rejectionReason;

    return { ...rx };
  },

  // Abandoned Carts
  async getAbandonedCarts(): Promise<AbandonedCart[]> {
    return [...abandonedCartsData];
  },

  async markAbandonedCartReminded(cartId: string): Promise<boolean> {
    const cart = abandonedCartsData.find((c) => c.id === cartId);
    if (!cart) return false;
    cart.whatsappReminderSent = true;
    cart.reminderSentAt = new Date().toISOString();
    return true;
  },

  // Suppliers & Procurement
  async getSuppliers(): Promise<Supplier[]> {
    return [...suppliersData];
  },

  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return [...purchaseOrdersData];
  },

  async getGoodsReceiptNotes(): Promise<GoodsReceiptNote[]> {
    return [...goodsReceiptNotesData];
  },

  async createGoodsReceiptNote(data: {
    supplierId: string;
    supplierInvoiceNo: string;
    supplierInvoiceDate: string;
    items: Array<{
      productId: string;
      batchNumber: string;
      expiryDate: string;
      receivedQuantity: number;
      freeQuantity: number;
      purchaseRate: number;
      mrp: number;
      salePrice: number;
      gstPercentage: number;
    }>;
  }): Promise<GoodsReceiptNote> {
    const supplier = suppliersData.find((s) => s.id === data.supplierId);
    const grnNumber = `GRN-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    let grandTotal = 0;
    const grnItems: GoodsReceiptNote['items'] = [];

    for (const item of data.items) {
      const prod = productsData.find((p) => p.id === item.productId);
      const itemTotal = (item.receivedQuantity + item.freeQuantity) * item.purchaseRate;
      grandTotal += itemTotal;

      grnItems.push({
        id: `grni-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        productId: item.productId,
        productName: prod ? prod.name : 'Unknown Product',
        batchNumber: item.batchNumber,
        manufacturingDate: new Date().toISOString().split('T')[0],
        expiryDate: item.expiryDate,
        receivedQuantity: item.receivedQuantity,
        freeQuantity: item.freeQuantity,
        purchaseRate: item.purchaseRate,
        mrp: item.mrp,
        salePrice: item.salePrice,
        gstPercentage: item.gstPercentage,
        totalAmount: itemTotal,
      });

      // Auto-inward into batches table
      const existingBatch = batchesData.find(
        (b) => b.productId === item.productId && b.batchNumber === item.batchNumber
      );

      const totalQty = item.receivedQuantity + item.freeQuantity;

      if (existingBatch) {
        existingBatch.stockQuantity += totalQty;
        existingBatch.purchasePrice = item.purchaseRate;
        existingBatch.mrp = item.mrp;
        existingBatch.salePrice = item.salePrice;
        existingBatch.expiryDate = item.expiryDate;
      } else {
        batchesData.unshift({
          id: `batch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          productId: item.productId,
          batchNumber: item.batchNumber,
          manufacturingDate: new Date().toISOString().split('T')[0],
          expiryDate: item.expiryDate,
          purchasePrice: item.purchaseRate,
          mrp: item.mrp,
          salePrice: item.salePrice,
          stockQuantity: totalQty,
          reservedQuantity: 0,
          rackLocation: 'Inwarding-Bay',
          isQuarantined: false,
          createdAt: new Date().toISOString(),
        });
      }

      if (prod) {
        prod.stockQuantity += totalQty;
        prod.mrp = item.mrp;
        prod.salePrice = item.salePrice;
      }
    }

    const totalTax = Number((grandTotal * 0.12).toFixed(2));
    const totalTaxable = Number((grandTotal - totalTax).toFixed(2));

    const newGrn: GoodsReceiptNote = {
      id: `grn-${Date.now()}`,
      grnNumber,
      supplierId: data.supplierId,
      supplierName: supplier ? supplier.name : 'Unknown Supplier',
      supplierInvoiceNo: data.supplierInvoiceNo,
      supplierInvoiceDate: data.supplierInvoiceDate,
      totalTaxable,
      totalTax,
      grandTotal,
      receivedBy: 'Pharmacist K. Venkatesh',
      createdAt: new Date().toISOString(),
      items: grnItems,
    };

    goodsReceiptNotesData.unshift(newGrn);
    return newGrn;
  },

  // Customers & Users
  async getCustomers(): Promise<Customer[]> {
    return [...MOCK_CUSTOMERS];
  },

  async getUsers(): Promise<UserProfile[]> {
    return [...MOCK_USERS];
  },

  // Financial & GST Report Calculations
  async getFinancialReports() {
    const orders = ordersData.filter((o) => o.orderStatus !== 'cancelled');
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalTaxCollected = orders.reduce((sum, o) => sum + o.taxAmount, 0);
    const totalOrdersCount = orders.length;

    // GSTR-1 Tax Slab Distribution
    let taxable12 = 0;
    let cgst12 = 0;
    let sgst12 = 0;

    let taxable18 = 0;
    let cgst18 = 0;
    let sgst18 = 0;

    orders.forEach((o) => {
      o.items.forEach((item) => {
        if (item.gstPercentage === 12) {
          taxable12 += item.totalAmount - (item.cgstAmount + item.sgstAmount);
          cgst12 += item.cgstAmount;
          sgst12 += item.sgstAmount;
        } else if (item.gstPercentage === 18) {
          taxable18 += item.totalAmount - (item.cgstAmount + item.sgstAmount);
          cgst18 += item.cgstAmount;
          sgst18 += item.sgstAmount;
        }
      });
    });

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalTaxCollected: Number(totalTaxCollected.toFixed(2)),
      totalOrdersCount,
      gstr1: {
        slab12: {
          taxableValue: Number(taxable12.toFixed(2)),
          cgst: Number(cgst12.toFixed(2)),
          sgst: Number(sgst12.toFixed(2)),
          totalTax: Number((cgst12 + sgst12).toFixed(2)),
        },
        slab18: {
          taxableValue: Number(taxable18.toFixed(2)),
          cgst: Number(cgst18.toFixed(2)),
          sgst: Number(sgst18.toFixed(2)),
          totalTax: Number((cgst18 + sgst18).toFixed(2)),
        },
      },
    };
  },
};
