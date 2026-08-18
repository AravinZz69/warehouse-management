import * as XLSX from 'xlsx';
import { Product } from '@/types/product.types';
import { SalesOrder } from '@/types/order.types';
import { PurchaseOrder } from '@/types/purchase.types';

export function exportProductsToExcel(products: Product[], filename = 'ARIA_Inventory_Catalog.xlsx') {
  const data = products.map((p) => ({
    SKU: p.sku,
    Barcode: p.barcode,
    Name: p.name,
    Category: p.category,
    Brand: p.brand,
    'Purchase Cost ($)': p.purchase_price,
    'Selling Price ($)': p.selling_price,
    'Weight (kg)': p.weight_kg,
    'Reorder Threshold': p.reorder_threshold,
    'Reorder Quantity': p.reorder_quantity,
    'Cold Storage': p.requires_cold_storage ? 'YES' : 'NO',
    Fragile: p.is_fragile ? 'YES' : 'NO',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Catalog');
  XLSX.writeFile(workbook, filename);
}

export function exportOrdersToExcel(orders: SalesOrder[], filename = 'ARIA_Sales_Orders.xlsx') {
  const data = orders.map((o) => ({
    'Order #': o.order_number,
    Customer: o.customer_name || 'N/A',
    Tier: (o.customer_tier || 'standard').toUpperCase(),
    Status: o.status.toUpperCase(),
    Payment: o.payment_status.toUpperCase(),
    'Priority Score': o.priority_score,
    'Priority Level': o.priority_level.toUpperCase(),
    'Total Value ($)': o.total_value,
    'Item Count': o.item_count,
    'Delivery Date': o.requested_delivery_date,
    'Created At': o.created_at,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Orders');
  XLSX.writeFile(workbook, filename);
}

export function exportPurchaseOrdersToExcel(pos: PurchaseOrder[], filename = 'ARIA_Purchase_Orders.xlsx') {
  const data = pos.map((p) => ({
    'PO #': p.po_number,
    Supplier: p.supplier_name || 'N/A',
    Status: p.status.toUpperCase(),
    'Total Amount ($)': p.total_amount,
    'Expected Delivery': p.expected_delivery,
    'Actual Delivery': p.actual_delivery || 'Pending',
    Notes: p.notes || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchase Orders');
  XLSX.writeFile(workbook, filename);
}
