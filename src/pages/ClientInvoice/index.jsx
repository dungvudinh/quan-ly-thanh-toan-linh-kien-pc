// components/Invoice/Index.jsx (đã chuyển sang Redux)
import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToClientInvoice,removeFromClientInvoice } from '../../redux/actions/clientInvoiceActions.js';
import { updateModelPaid } from '../../redux/actions/modelActions.js';
import { DeadlineBadge, PaidBadge } from '../../components/Badge.jsx';
import { priceFor, bonusFor, fmtUSD } from '../../utils/pricing.js';
import { printInvoice } from '../../utils/printInvoice.js';

function Index({ showToast }) {
  const dispatch = useDispatch();
  
  // Lấy dữ liệu từ Redux store
  const models = useSelector((state) => state.models);
  const {ids} = useSelector((state) => state.clientInvoice);
  const clientPrices = useSelector((state) => state.clientPrices);
  const freelancerPrices = useSelector((state) => state.freelancerPrices);

  const [selectedId, setSelectedId] = useState('');
  console.log(ids)
  const rows = useMemo(
    () => ids.map((id) => models.find((m) => m.id === id)).filter(Boolean),
    [ids, models]
  );

  const availableModels = useMemo(
    () => models.filter((m) => !ids.includes(m.id)),
    [models, ids]
  );

  const total = rows.reduce(
    (sum, m) =>
      sum + priceFor(m, 'client', clientPrices, freelancerPrices) + bonusFor(m, 'client', clientPrices, freelancerPrices),
    0
  );

  function handleAddRow() {
    if (!selectedId) return;
    dispatch(addToClientInvoice(Number(selectedId)));
    setSelectedId('');
  }

  function handleMarkPaid() {
    if (clientInvoiceIds.length === 0) {
      showToast?.('Chưa có dòng nào trong hóa đơn');
      return;
    }
    dispatch(updateModelPaid(clientInvoiceIds, 'client'));
    showToast?.('Đã đánh dấu hóa đơn khách hàng: Paid');
  }

  function handleExportPdf() {
    if (rows.length === 0) {
      showToast?.('Chưa có dòng nào để xuất');
      return;
    }
    const printRows = rows.map((m) => {
      const price = priceFor(m, 'client', clientPrices, freelancerPrices);
      const bonus = bonusFor(m, 'client', clientPrices, freelancerPrices);
      return {
        name: m.name,
        type: m.type,
        status: m.status,
        milestone: m.milestone,
        deadline: m.deadline,
        priceLabel: fmtUSD(price),
        bonusLabel: bonus ? fmtUSD(bonus) : '—',
        lineTotalLabel: fmtUSD(price + bonus),
      };
    });
    printInvoice({
      audienceLabel: 'Hóa đơn khách hàng',
      rows: printRows,
      totalLabel: fmtUSD(total),
      invoiceNumber: Math.floor(1000 + Math.random() * 9000),
    });
  }

  return (
    <section className="px-8 py-8 max-w-6xl">
      {/* Header trang */}
      <div className="flex items-end justify-between gap-4 pb-5 mb-6 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Hóa đơn khách hàng</h1>
          <p className="text-sm text-gray-400 mt-1">
            Đơn vị: USD — Bonus áp dụng cho hàng New thuộc Mainboard / Case / VGA khi Deadline đạt OK
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportPdf}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Xuất PDF
          </button>
          <button
            type="button"
            onClick={handleMarkPaid}
            className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Đánh dấu đã thanh toán
          </button>
        </div>
      </div>

      {/* Bảng hóa đơn */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-400">
              <th className="pb-3 pr-3">Model</th>
              <th className="pb-3 px-3">Loại</th>
              <th className="pb-3 px-3">Trạng thái</th>
              <th className="pb-3 px-3 text-right">Milestone</th>
              <th className="pb-3 px-3">Deadline</th>
              <th className="pb-3 px-3 text-right">Đơn giá</th>
              <th className="pb-3 px-3 text-right">Bonus</th>
              <th className="pb-3 px-3 text-right">Thành tiền</th>
              <th className="pb-3 pl-3"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="py-10 text-center text-sm text-gray-400">
                  Chưa có dòng nào — thêm model ở bên dưới.
                </td>
              </tr>
            )}
            {rows.map((m) => {
              const price = priceFor(m, 'client', clientPrices, freelancerPrices);
              const bonus = bonusFor(m, 'client', clientPrices, freelancerPrices);
              return (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                      {m.name}
                      {m.clientPaid && <PaidBadge paid paidLabel="Paid" />}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-500">{m.type}</td>
                  <td className="py-3 px-3 text-gray-500">{m.status}</td>
                  <td className="py-3 px-3 text-right font-mono text-gray-700 tabular-nums">{m.milestone}</td>
                  <td className="py-3 px-3"><DeadlineBadge status={m.deadline} /></td>
                  <td className="py-3 px-3 text-right font-mono text-gray-700 tabular-nums">{fmtUSD(price)}</td>
                  <td className="py-3 px-3 text-right font-mono text-gray-700 tabular-nums">
                    {bonus ? fmtUSD(bonus) : '—'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-gray-900 tabular-nums">
                    {fmtUSD(price + bonus)}
                  </td>
                  <td className="py-3 pl-3 text-right">
                    <button
                      type="button"
                      onClick={() => dispatch(removeFromClientInvoice(m.id))}
                      className="text-xs text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-900">
              <td colSpan={7} className="pt-4 font-semibold text-gray-900">Tổng cộng</td>
              <td className="pt-4 text-right font-mono font-semibold text-gray-900 tabular-nums">{fmtUSD(total)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        {/* Thanh thêm dòng */}
        <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-gray-100">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="min-w-[280px] rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <option value="">— Chọn model —</option>
            {availableModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.type} / {m.status}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddRow}
            className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            + Thêm dòng
          </button>
        </div>
      </div>
    </section>
  );
}

export default Index;