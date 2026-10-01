// utils/printInvoice.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RobotoRegular } from './fonts/Roboto-regular-base64';
import {RobotoBold} from './fonts/Roboto-Bold-base64'
// import {RobotoBold} from './fonts/Roboto-Regular-base64'
// Màu cam giống mẫu
const ORANGE = [217, 122, 68];       // tiêu đề "PC CASE INVOICE"
const HEADER_ROW_BG = [232, 187, 152]; // nền header bảng (cam nhạt)
const BORDER_BLACK = [0,0,0];

function formatDate(dateStr) {
  // dateStr dạng 'YYYY-MM-DD' -> 'M/D/YYYY' giống mẫu
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return dateStr;
  return `${Number(m)}/${Number(d)}/${y}`;
}

function formatInvoiceNumber(num) {
  return `#${String(num).padStart(10, '0')}`;
}
function registerFonts(doc) {
  doc.addFileToVFS('Roboto-Regular.ttf', RobotoRegular);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

  doc.addFileToVFS('Roboto-Bold.ttf', RobotoBold);
  doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
}
/**
 * invoice: {
 *   invoiceNumber, createdAt,
 *   from: { name, email, address },
 *   to: { name, email, address },
 * }
 * rows: [{ num, name, type, variant, milestone, deadline, price, bonus, note }]
 * totalLabel: '$648'  (số đã format sẵn, không có ký hiệu $ ở đầu -> truyền total number cũng được)
 */
export function printInvoice({ invoice, rows, total }) {
  const doc = new jsPDF({ orientation:'landscape',unit: 'pt', format: 'a4' }); // pt cho dễ căn chỉnh
  registerFonts(doc)
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let cursorY = 50;

  // ===== TITLE =====
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...ORANGE);
  doc.text('PC CASE INVOICE', pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 40;

  // ===== FROM / TO =====
  const colWidth = (pageWidth - marginX * 2) / 2;
  const fromX = marginX;
  const toX = marginX + colWidth;

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('From', fromX, cursorY);
  doc.text('To', toX, cursorY);

  cursorY += 18;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(10);

  const fromLines = [
    invoice.from.name,
    invoice.from.email,
    invoice.from.address,
  ].filter(Boolean);

  const toLines = [
    invoice.to.name,
    invoice.to.email,
    invoice.to.address,
  ].filter(Boolean);

  const maxLines = Math.max(fromLines.length, toLines.length);
  const lineHeight = 14;

  for (let i = 0; i < maxLines; i++) {
    if (fromLines[i]) doc.text(fromLines[i], fromX, cursorY + i * lineHeight);
    if (toLines[i]) doc.text(toLines[i], toX, cursorY + i * lineHeight);
  }

  cursorY += maxLines * lineHeight + 20;

  // ===== ISSUED TO / INVOICE NUMBER =====
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(12);
  doc.text('ISSUED TO', fromX, cursorY);

  doc.setFontSize(11);
  const invNumLabel = 'INVOICE NUMBER';
  doc.text(invNumLabel, pageWidth - marginX, cursorY, { align: 'right' });

  cursorY += 16;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(10);
  doc.text(invoice.to.name || '', fromX, cursorY);

  doc.setFont('helvetica', 'bold');
  doc.text(formatInvoiceNumber(invoice.invoiceNumber), pageWidth - marginX, cursorY, {
    align: 'right',
  });

  cursorY += 14;

  doc.setFont('Roboto', 'normal');
  doc.text('Date :', pageWidth - marginX - 90, cursorY, { align: 'left' });
  doc.text(formatDate(invoice.createdAt), pageWidth - marginX, cursorY, { align: 'right' });

  cursorY += 25;

  // ===== TABLE =====
  const head = [
    ['Num', 'Part Name', 'Part Type', 'Variant Amount', 'Milestone', 'Deadline Status', 'Price', 'Bonus', 'Note'],
  ];

  const body = rows.map((r) => [
    r.num,
    r.name,
    r.type,
    r.variant,
    r.milestone ?? '',
    r.deadline,
    r.price,
    r.bonus || 0,
    r.note || '',
  ]);

  autoTable(doc, {
    startY: cursorY,
    head,
    body,
    foot: [
    [
      {
        content: 'Total',
        colSpan: 6,
        styles: { halign: 'center', fontStyle: 'bold', fontSize: 13 },
      },
      {
        content: `$ ${total}`,
        colSpan: 2,
        styles: { halign: 'center', fontStyle: 'bold', fontSize: 13 },
      },
      { content: '', styles: {} }, // cột Note để trống
    ],
  ],
    theme: 'grid',
    styles: {
      font: 'Roboto',
      fontSize: 9,
      cellPadding: 6,
      lineColor: BORDER_BLACK,
      lineWidth: 0.5,
      textColor: [30, 30, 30],
    },
    headStyles: {
      fillColor: HEADER_ROW_BG,
      textColor: [60, 30, 10],
      fontStyle: 'bold',
      halign: 'center',
    },
     footStyles: {
      font: 'Roboto',
      fillColor: [255, 255, 255], // nền trắng cho dòng Total
      textColor: [0, 0, 0],
      lineColor: BORDER_BLACK,
      lineWidth: 0.5,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 40 },
      1: { cellWidth: 180 },
      2: { cellWidth: 70 },
      3: { cellWidth: 80, halign: 'center' },
      4: { halign: 'center', cellWidth: 55 },
      5: { halign: 'center', cellWidth: 70 },
      6: { halign: 'right', cellWidth: 55 },
      7: { halign: 'right', cellWidth: 50 },
      8: { cellWidth: 'auto' },
    },
    margin: { left: marginX, right: marginX },
  });


  return doc;
}

/**
 * Mở PDF trong tab mới để xem (thay vì tải trực tiếp)
 */
export function showInvoicePdf(doc) {
  const blobUrl = doc.output('bloburl');
  window.open(blobUrl, '_blank');
}

/**
 * Tải file PDF về máy
 */
export function downloadInvoicePdf(doc, filename) {
  doc.save(filename);
}