import { Product } from '@/types/product.types';
import { InventoryLevel } from '@/types/inventory.types';

export interface ValuationSummary {
  total_purchase_valuation: number;
  total_retail_valuation: number;
  potential_gross_margin: number;
  margin_percentage: number;
  skus_analyzed: number;
  total_units: number;
}

export function calculateInventoryValuation(
  products: Product[],
  inventory: InventoryLevel[]
): ValuationSummary {
  let totalPurchaseValuation = 0;
  let totalRetailValuation = 0;
  let totalUnits = 0;

  const productMap = new Map<string, Product>();
  for (const p of products) {
    productMap.set(p.id, p);
  }

  for (const item of inventory) {
    const prod = productMap.get(item.product_id);
    const qty = item.quantity_available + item.quantity_reserved;
    if (qty <= 0 || !prod) continue;

    const unitCost = prod.purchase_price || 0;
    const unitPrice = prod.selling_price || 0;

    totalPurchaseValuation += qty * unitCost;
    totalRetailValuation += qty * unitPrice;
    totalUnits += qty;
  }

  const grossMargin = totalRetailValuation - totalPurchaseValuation;
  const marginPct = totalRetailValuation > 0 ? (grossMargin / totalRetailValuation) * 100 : 0;

  return {
    total_purchase_valuation: Number(totalPurchaseValuation.toFixed(2)),
    total_retail_valuation: Number(totalRetailValuation.toFixed(2)),
    potential_gross_margin: Number(grossMargin.toFixed(2)),
    margin_percentage: Number(marginPct.toFixed(1)),
    skus_analyzed: products.length,
    total_units: totalUnits,
  };
}
