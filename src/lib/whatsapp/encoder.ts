// src/lib/whatsapp/encoder.ts

export interface WhatsAppOrderManifest {
  orderNumber?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: Array<{
    name: string;
    packSize: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  prescriptionUrl?: string;
  customerNotes?: string;
}

const STORE_WHATSAPP = "917676222727"; // Maruthi Medical Store WhatsApp

/**
 * Encodes an itemized order into an official wa.me deep-link.
 * Zero-cost, completely bypasses Meta Cloud API subscription requirements.
 */
export function generateWhatsAppOrderLink(
  manifest: WhatsAppOrderManifest,
  storePhone: string = STORE_WHATSAPP
): string {
  const lines: string[] = [];

  lines.push("🌿 *NEW ORDER — MARUTHI MEDICAL* 🌿");
  lines.push("📍 _Shop no.7, Koppa Village, Bengaluru 560105_");
  lines.push("----------------------------------------");
  if (manifest.orderNumber) {
    lines.push(`*Order No:* #${manifest.orderNumber}`);
  }
  lines.push(`*Customer:* ${manifest.customerName}`);
  lines.push(`*Phone:* ${manifest.customerPhone}`);
  lines.push(`*Delivery Address:* ${manifest.deliveryAddress}`);
  lines.push("----------------------------------------");
  lines.push("*MEDICINES / ITEMS ORDERED:*");

  manifest.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. *${item.name}* (${item.packSize})\n   Qty: ${item.quantity} × ₹${item.price.toFixed(2)} = ₹${(item.quantity * item.price).toFixed(2)}`
    );
  });

  lines.push("----------------------------------------");
  lines.push(`*Subtotal:* ₹${manifest.subtotal.toFixed(2)}`);
  lines.push(
    `*Delivery:* ${manifest.deliveryFee === 0 ? "FREE (Koppa / Jigani Local)" : `₹${manifest.deliveryFee.toFixed(2)}`}`
  );
  lines.push(`*TOTAL PAYABLE:* ₹${manifest.total.toFixed(2)}`);

  if (manifest.prescriptionUrl) {
    lines.push("----------------------------------------");
    lines.push("📎 *Prescription Attached:* Yes (View attached file in chat)");
  }

  if (manifest.customerNotes) {
    lines.push("----------------------------------------");
    lines.push(`💬 *Special Instructions:* "${manifest.customerNotes}"`);
  }

  lines.push("----------------------------------------");
  lines.push("Please confirm stock availability and estimated dispatch time. Thank you!");

  const rawMessage = lines.join("\n");
  return `https://wa.me/${storePhone}?text=${encodeURIComponent(rawMessage)}`;
}

/**
 * 1-Click WhatsApp Abandoned Cart Recovery Link Generator
 */
export function generateAbandonedCartRecoveryLink(params: {
  customerName: string;
  customerPhone: string;
  cartItemSummary: string;
  cartValue: number;
  recoveryUrl: string;
}): string {
  const text =
    `Hello ${params.customerName}! 👋\n\n` +
    `We noticed you left ${params.cartItemSummary} (worth ₹${params.cartValue.toFixed(2)}) in your cart at *Maruthi Medical, Koppa Village*.\n\n` +
    `Would you like our pharmacist to pack your medicines for prompt doorstep delivery today?\n\n` +
    `👉 *Tap here to review & complete your order:* ${params.recoveryUrl}\n\n` +
    `Or reply to this message directly and we'll dispatch it right away! 🌿`;

  const phone = params.customerPhone.replace(/\D/g, "");
  const formattedPhone = phone.startsWith("91") ? phone : `91${phone}`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Direct WhatsApp Prescription Consultation Link
 */
export function generateRxConsultationLink(
  message: string = "Hello Maruthi Medical, I have a doctor prescription to order for delivery to Koppa Village.",
  storePhone: string = STORE_WHATSAPP
): string {
  return `https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Order Status Notification Link (for Admin/Staff to inform customer)
 */
export function generateOrderStatusNotificationLink(params: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: string;
  eta?: string;
}): string {
  const text =
    `Hello ${params.customerName}! 🌿\n\n` +
    `Update on your *Maruthi Medical* Order *#${params.orderNumber}*:\n` +
    `Status: *${params.status}*\n` +
    (params.eta ? `Estimated Delivery: *${params.eta}*\n\n` : "\n") +
    `Our pharmacy team is actively preparing your order. For inquiries, reply here or call us at 076762 22727.`;

  const phone = params.customerPhone.replace(/\D/g, "");
  const formattedPhone = phone.startsWith("91") ? phone : `91${phone}`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
}
