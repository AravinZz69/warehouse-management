import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SalesOrder } from '@/types/order.types';
import { PurchaseOrder } from '@/types/purchase.types';
import { Product } from '@/types/product.types';
import { formatCurrency, formatDate } from './format';

export function generateSalesInvoicePDF(order: SalesOrder): jsPDF {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(8, 12, 20); // Deep void navy #080C14
  doc.rect(0, 0, 210, 35, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(56, 189, 248); // Sky-400 #38BDF8
  doc.text('ARIA WMS & IMS', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(248, 250, 252);
  doc.text('AUTONOMOUS ENTERPRISE LOGISTICS & INVENTORY SYSTEM', 14, 27);

  doc.setFontSize(14);
  doc.setTextColor(248, 250, 252);
  doc.text('SALES INVOICE', 145, 20);

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(order.order_number, 145, 27);

  // Metadata Block
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.text('Customer Information:', 14, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${order.customer_name || 'Valued Customer'}`, 14, 52);
  doc.text(`Email: ${order.customer_email || 'N/A'}`, 14, 58);
  doc.text(`Tier: ${(order.customer_tier || 'standard').toUpperCase()}`, 14, 64);

  doc.setFont('helvetica', 'bold');
  doc.text('Order Details:', 120, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order Date: ${formatDate(order.created_at)}`, 120, 52);
  doc.text(`Delivery Date: ${formatDate(order.requested_delivery_date)}`, 120, 58);
  doc.text(`Payment Status: ${order.payment_status.toUpperCase()}`, 120, 64);
  doc.text(`Priority Level: ${order.priority_level.toUpperCase()}`, 120, 70);

  // Items Table
  const tableRows = (order.items || []).map((item, idx) => [
    idx + 1,
    item.sku || 'SKU-GENERIC',
    item.product_name || 'Product',
    item.quantity_ordered,
    formatCurrency(item.unit_price),
    formatCurrency(item.quantity_ordered * item.unit_price),
  ]);

  autoTable(doc, {
    startY: 78,
    head: [['#', 'SKU / Barcode', 'Item Description', 'Qty', 'Unit Price', 'Total']],
    body: tableRows,
    headStyles: { fillColor: [13, 19, 31], textColor: [56, 189, 248], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    styles: { font: 'helvetica', fontSize: 9 },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 140;

  // Summary Box
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Weight: ${order.total_weight_kg.toFixed(2)} kg`, 14, finalY + 15);
  doc.setFontSize(12);
  doc.setTextColor(14, 165, 233);
  doc.text(`TOTAL AMOUNT: ${formatCurrency(order.total_value)}`, 120, finalY + 15);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated autonomously by ARIA Engine v5.0 | High-Volume Logistics Protocol', 14, 285);

  return doc;
}

export function generatePurchaseOrderPDF(po: PurchaseOrder): jsPDF {
  const doc = new jsPDF();

  doc.setFillColor(8, 12, 20);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(139, 92, 246); // Violet-500 #8B5CF6
  doc.text('ARIA WMS & IMS', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(248, 250, 252);
  doc.text('PROCUREMENT & PURCHASE ORDER MANAGEMENT', 14, 27);

  doc.setFontSize(14);
  doc.setTextColor(248, 250, 252);
  doc.text('PURCHASE ORDER', 135, 20);

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(po.po_number, 135, 27);

  // Details
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Supplier Info:', 14, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`Company: ${po.supplier_name || 'Vendor'}`, 14, 52);
  doc.text(`Expected Delivery: ${formatDate(po.expected_delivery)}`, 14, 58);

  const tableRows = (po.items || []).map((item, idx) => [
    idx + 1,
    item.sku || 'SKU',
    item.product_name || 'Item',
    item.quantity_ordered,
    formatCurrency(item.unit_cost),
    formatCurrency(item.total_cost || item.quantity_ordered * item.unit_cost),
  ]);

  autoTable(doc, {
    startY: 68,
    head: [['#', 'SKU', 'Description', 'Qty Ordered', 'Unit Cost', 'Total Cost']],
    body: tableRows,
    headStyles: { fillColor: [19, 27, 43], textColor: [139, 92, 246], fontStyle: 'bold' },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 130;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`TOTAL PO AMOUNT: ${formatCurrency(po.total_amount)}`, 120, finalY + 15);

  return doc;
}

export function generateValuationReportPDF(products: Product[]): jsPDF {
  const doc = new jsPDF();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ARIA Inventory Valuation & Asset Report', 14, 20);

  const rows = products.map((p, idx) => {
    const qty = (p.total_available || 0) + (p.total_reserved || 0);
    const valuation = qty * p.purchase_price;
    return [idx + 1, p.sku, p.name, p.category, qty, formatCurrency(p.purchase_price), formatCurrency(valuation)];
  });

  autoTable(doc, {
    startY: 30,
    head: [['#', 'SKU', 'Product Name', 'Category', 'Qty', 'Unit Cost', 'Valuation']],
    body: rows,
    headStyles: { fillColor: [8, 12, 20], textColor: [56, 189, 248] },
  });

  return doc;
}
