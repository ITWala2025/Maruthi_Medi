// src/lib/tax/gstCalculator.ts

export interface TaxableItemInput {
  mrpInclusive: number; // MRP as printed on the strip (includes GST)
  quantity: number;
  gstRate: number;      // e.g. 12 for 12%
}

export interface TaxBreakdown {
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  totalTax: number;
  grossAmount: number;
}

/**
 * Calculates reverse GST tax breakdown for Indian retail pharmacy invoices.
 * Prices on medicine strips are MRP inclusive of tax.
 */
export function calculateItemTax(item: TaxableItemInput): TaxBreakdown {
  const grossAmount = Number((item.mrpInclusive * item.quantity).toFixed(2));
  // Reverse calculation: Taxable Value = Gross / (1 + Rate / 100)
  const taxableValue = Number((grossAmount / (1 + item.gstRate / 100)).toFixed(2));
  const totalTax = Number((grossAmount - taxableValue).toFixed(2));
  
  // Equal 50/50 split between Central and State GST for Karnataka intra-state supply
  const cgstRate = Number((item.gstRate / 2).toFixed(2));
  const sgstRate = Number((item.gstRate / 2).toFixed(2));
  const cgstAmount = Number((totalTax / 2).toFixed(2));
  const sgstAmount = Number((totalTax - cgstAmount).toFixed(2));

  return {
    taxableValue,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    totalTax,
    grossAmount
  };
}
