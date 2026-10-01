// components/Invoice/InvoiceDetail.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateInvoicePaid,
  updateInvoiceInfo,
  addModelToInvoice,
  removeModelFromInvoice,
} from '../redux/actions/invoiceActions.js';
import { priceFor, bonusFor, fmtUSD } from '../utils/pricing.js';
import { DeadlineBadge } from './Badge.jsx';
import AddModel from './AddModel.jsx';

function InvoiceDetail({ invoice, onBack, showToast, onPrint }) {
  const dispatch = useDispatch();
  const clientPrices = useSelector((s) => s.clientPrices);
  const freelancerPrices = useSelector((s) => s.freelancerPrices);

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFrom, setEditFrom] = useState(invoice.from);
  const [editTo, setEditTo] = useState(invoice.to);

  const total = invoice.models.reduce(
    (sum, m) =>
      sum +
      priceFor(m, 'client', clientPrices, freelancerPrices) +
      bonusFor(m, 'client', clientPrices, freelancerPrices),
    0
  );

  const handleTogglePaid = () => {
    dispatch(updateInvoicePaid(invoice.id, !invoice.paid));
    showToast?.(invoice.paid ? 'Đã chuyển về Chưa thanh toán' : 'Đã đánh dấu Đã thanh toán');
  };

  const handleStartEdit = () => {
    setEditFrom(invoice.from);
    setEditTo(invoice.to);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleFromChange = (e) => {
    const { name, value } = e.target;
    setEditFrom((prev) => ({ ...prev, [name]: value }));
  };

  const handleToChange = (e) => {
    const { name, value } = e.target;
    setEditTo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    if (!editTo.name.trim() || !editTo.email.trim()) {
      showToast?.('Vui lòng nhập đầy đủ thông tin khách hàng (To)!');
      return;
    }
    dispatch(updateInvoiceInfo(invoice.id, { from: editFrom, to: editTo }));
    showToast?.('Đã lưu thay đổi hóa đơn');
    setIsEditing(false);
  };

  const handleAddModel = (newModel) => {
    dispatch(addModelToInvoice(invoice.id, newModel));
  };

  const handleRemoveModel = (modelId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    dispatch(removeModelFromInvoice(invoice.id, modelId));
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Hóa đơn #{invoice.invoiceNumber}</h2>
          <p className="text-sm text-gray-400 mt-0.5">Ngày tạo: {invoice.createdAt}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              invoice.paid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            {invoice.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
          </span>
          {!isEditing && (
            <>
              <button
                type="button"
                onClick={onPrint}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                In hóa đơn
              </button>
              <button
                type="button"
                onClick={handleStartEdit}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Chỉnh sửa
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Quay lại danh sách
          </button>
        </div>
      </div>

      {/* From / To */}
      <div className="grid grid-cols-2 gap-6">
        {/* From */}
        {isEditing ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">From</p>
            <input
              type="text"
              name="name"
              value={editFrom.name}
              onChange={handleFromChange}
              placeholder="Tên công ty"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
            <input
              type="email"
              name="email"
              value={editFrom.email}
              onChange={handleFromChange}
              placeholder="Email"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
            <input
              type="text"
              name="address"
              value={editFrom.address}
              onChange={handleFromChange}
              placeholder="Địa chỉ"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">From</p>
            <p className="font-medium text-gray-900">{invoice.from.name}</p>
            <p className="text-sm text-gray-600">{invoice.from.email}</p>
            <p className="text-sm text-gray-600">{invoice.from.address}</p>
          </div>
        )}

        {/* To */}
        {isEditing ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">To</p>
            <input
              type="text"
              name="name"
              value={editTo.name}
              onChange={handleToChange}
              placeholder="Tên khách hàng"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
            <input
              type="email"
              name="email"
              value={editTo.email}
              onChange={handleToChange}
              placeholder="Email"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
            <input
              type="text"
              name="address"
              value={editTo.address}
              onChange={handleToChange}
              placeholder="Địa chỉ"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">To</p>
            <p className="font-medium text-gray-900">{invoice.to.name}</p>
            <p className="text-sm text-gray-600">{invoice.to.email}</p>
            <p className="text-sm text-gray-600">{invoice.to.address}</p>
          </div>
        )}
      </div>

      {/* Bảng Model */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Danh sách Model</p>
          {isEditing && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-full border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              + Thêm Model
            </button>
          )}
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-400">
              <th className="pb-2 pr-3">Model</th>
              <th className="pb-2 px-3">Loại</th>
              <th className="pb-2 px-3">Trạng thái</th>
              <th className="pb-2 px-3">Deadline</th>
              <th className="pb-2 px-3 text-right">Đơn giá</th>
              <th className="pb-2 px-3 text-right">Bonus</th>
              <th className="pb-2 px-3 text-right">Thành tiền</th>
              {isEditing && <th className="pb-2 pl-3"></th>}
            </tr>
          </thead>
          <tbody>
            {invoice.models.length === 0 && (
              <tr>
                <td colSpan={isEditing ? 8 : 7} className="py-8 text-center text-gray-400">
                  Chưa có model nào.
                </td>
              </tr>
            )}
            {invoice.models.map((m) => {
              const price = priceFor(m, 'client', clientPrices, freelancerPrices);
              const bonus = bonusFor(m, 'client', clientPrices, freelancerPrices);
              return (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="py-2 pr-3 font-medium text-gray-900">{m.name}</td>
                  <td className="py-2 px-3 text-gray-500">{m.type}</td>
                  <td className="py-2 px-3 text-gray-500">{m.status}</td>
                  <td className="py-2 px-3"><DeadlineBadge status={m.deadline} /></td>
                  <td className="py-2 px-3 text-right font-mono">{fmtUSD(price)}</td>
                  <td className="py-2 px-3 text-right font-mono">{bonus ? fmtUSD(bonus) : '—'}</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">{fmtUSD(price + bonus)}</td>
                  {isEditing && (
                    <td className="py-2 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveModel(m.id)}
                        className="text-xs text-gray-400 hover:text-rose-500"
                      >
                        Xóa
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-900">
              <td colSpan={6} className="pt-3 font-semibold text-gray-900">Tổng cộng</td>
              <td className="pt-3 text-right font-mono font-semibold">{fmtUSD(total)}</td>
              {isEditing && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg"
            >
              Lưu thay đổi
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleTogglePaid}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg"
          >
            {invoice.paid ? 'Đánh dấu Chưa thanh toán' : 'Đánh dấu Đã thanh toán'}
          </button>
        )}
      </div>

      <AddModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddModel={handleAddModel}
        showToast={showToast}
      />
    </div>
  );
}

export default InvoiceDetail;