// src/lib/mock/types.ts
// Strictly mirrors the Supabase PostgreSQL schema defined in Design.md

export type UserRole = 'super_admin' | 'admin' | 'staff' | 'customer';
export type DrugSchedule = 'otc' | 'schedule_h' | 'schedule_h1' | 'schedule_x' | 'ayurvedic';
export type DosageForm = 'tablet' | 'capsule' | 'syrup' | 'suspension' | 'injection' | 'ointment' | 'drops' | 'inhaler' | 'powder' | 'device';
export type PrescriptionStatus = 'pending' | 'approved' | 'rejected';
export type OrderStatus = 'pending_review' | 'confirmed' | 'packing' | 'out_for_delivery' | 'ready_for_pickup' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'cod' | 'refunded';
export type PaymentMethod = 'cod' | 'upi_on_delivery' | 'upi_prepaid' | 'card' | 'cash_counter';
export type OrderSource = 'web' | 'whatsapp' | 'counter';
export type POStatus = 'draft' | 'submitted' | 'received' | 'cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Batch {
  id: string;
  productId: string;
  batchNumber: string;
  manufacturingDate: string; // YYYY-MM-DD
  expiryDate: string;        // YYYY-MM-DD
  purchasePrice: number;     // Excl. GST
  mrp: number;               // Max Retail Price incl. GST
  salePrice: number;         // Actual selling price
  stockQuantity: number;
  reservedQuantity: number;
  rackLocation: string;      // e.g. "Rack-A2-Shelf1"
  isQuarantined: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brandManufacturer: string;
  genericSalt: string;
  categoryId: string;
  categoryName?: string;
  drugSchedule: DrugSchedule;
  dosageForm: DosageForm;
  packSize: string; // e.g. "Strip of 15 Tablets"
  hsnCode: string;  // e.g. "3004"
  gstPercentage: number; // e.g. 12
  prescriptionRequired: boolean;
  description: string;
  sideEffects?: string;
  storageInstructions?: string;
  safetyStockThreshold: number;
  isFeatured: boolean;
  isActive: boolean;
  imageUrl: string;
  // Computed fields from default active batch
  mrp: number;
  salePrice: number;
  stockQuantity: number;
}

export interface Prescription {
  id: string;
  userId?: string;
  filePath: string;
  fileType: string;
  patientName: string;
  doctorName?: string;
  notes?: string;
  status: PrescriptionStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  batchId?: string;
  productName: string;
  batchNumber?: string;
  expiryDate?: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number; // sale price
  gstPercentage: number;
  cgstAmount: number;
  sgstAmount: number;
  totalAmount: number;
}

export interface DeliveryAddress {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. MM-202610-0012
  userId?: string;
  customerName: string;
  customerPhone: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: DeliveryAddress;
  prescriptionId?: string;
  prescriptionUrl?: string;
  
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  placedVia: OrderSource;
  
  customerNotes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface AbandonedCart {
  id: string;
  sessionId: string;
  userId?: string;
  customerPhone?: string;
  customerName?: string;
  cartItems: Array<{
    productId: string;
    name: string;
    packSize: string;
    quantity: number;
    price: number;
  }>;
  totalValue: number;
  lastActivity: string;
  whatsappReminderSent: boolean;
  reminderSentAt?: string;
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  gstin: string;
  drugLicenseNumbers: string;
  phone: string;
  email: string;
  address: string;
  paymentTermsDays: number;
  isActive: boolean;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantityOrdered: number;
  estimatedUnitCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  status: POStatus;
  totalEstimatedAmount: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  items: PurchaseOrderItem[];
}

export interface GoodsReceiptItem {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  receivedQuantity: number;
  freeQuantity: number;
  purchaseRate: number;
  mrp: number;
  salePrice: number;
  gstPercentage: number;
  totalAmount: number;
}

export interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  poId?: string;
  supplierId: string;
  supplierName: string;
  supplierInvoiceNo: string;
  supplierInvoiceDate: string;
  totalTaxable: number;
  totalTax: number;
  grandTotal: number;
  receivedBy: string;
  createdAt: string;
  items: GoodsReceiptItem[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  lifetimeSpend: number;
  chronicCareRefillTag?: string; // e.g. "Monthly BP (Due on 5th)"
  addresses: DeliveryAddress[];
  prescriptions: Prescription[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  pharmacistLicenseNo?: string;
  lastLogin: string;
}
