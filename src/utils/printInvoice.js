// Mở cửa sổ in trình duyệt với nội dung hóa đơn đã render sẵn.
// Dùng window.print() cho bản demo — khi có backend thật, có thể thay
// bằng gọi API POST /api/invoices/:id/export-pdf trả về file PDF.
export function printInvoice({ audienceLabel, rows, totalLabel, invoiceNumber }) {
  const win = window.open("", "_blank", "width=850,height=1100");
  if (!win) return;

  const rowsHtml = rows
    .map(
      (r) => `<tr>
        <td>${r.name}</td>
        <td>${r.type}</td>
        <td>${r.status}</td>
        <td>${r.milestone}</td>
        <td>${r.deadline}</td>
        <td class="num">${r.priceLabel}</td>
        <td class="num">${r.bonusLabel}</td>
        <td class="num">${r.lineTotalLabel}</td>
      </tr>`
    )
    .join("");

  win.document.write(`
    <!doctype html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <title>Hóa đơn — ${audienceLabel}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #1e2320; }
        .head { display: flex; justify-content: space-between; margin-bottom: 24px; }
        .brand { font-size: 20px; font-weight: 700; }
        .meta { text-align: right; font-size: 12px; color: #6b7268; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { text-align: left; border-bottom: 1.5px solid #1e2320; padding: 6px 8px; }
        td { border-bottom: 1px solid #d9dad2; padding: 8px; }
        .num { text-align: right; font-variant-numeric: tabular-nums; }
        .total { text-align: right; margin-top: 16px; font-size: 15px; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="head">
        <div>
          <div class="brand">Lạc Việt Studio</div>
          <div style="color:#6b7268; font-size:12px; margin-top:4px;">${audienceLabel}</div>
        </div>
        <div class="meta">
          INVOICE #${invoiceNumber}<br />
          ${new Date().toLocaleDateString("vi-VN")}
        </div>
      </div>
      <table>
        <thead>
          <tr><th>Model</th><th>Loại</th><th>Trạng thái</th><th>Milestone</th><th>Deadline</th><th class="num">Đơn giá</th><th class="num">Bonus</th><th class="num">Thành tiền</th></tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <div class="total">Tổng cộng: ${totalLabel}</div>
    </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
}
