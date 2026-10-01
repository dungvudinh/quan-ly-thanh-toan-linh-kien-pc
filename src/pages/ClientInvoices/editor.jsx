import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createInvoice, updateInvoice, updateInvoicePaid } from '../../redux/actions/invoiceActions.js';
import { priceFor, bonusFor, fmtUSD } from '../../utils/pricing.js';
import AddModel from '../../components/AddModel.jsx';
import { notifySuccess, notifyWarning } from '../../utils/toast.js';
import { Printer } from 'lucide-react';

const DEFAULT_FROM = {
  name: 'Lạc Việt Studio',
  email: 'lacvietstu@gmail.com',
  address: 'Lk16.29 Hinode Royal Park city, Ha Noi, Viet Nam',
};

const EMPTY_TO = { name: '', email: '', address: '' };

function ClientInvoiceEditor({ invoice, onDone, onPrint }) {
  const dispatch = useDispatch();
  const clientPrices = useSelector((s) => s.clientPrices);
  const freelancerPrices = useSelector((s) => s.freelancerPrices);

  const isCreateMode = invoice === null;

  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  // Draft state — nguồn dữ liệu duy nhất, luôn cho phép chỉnh sửa
  const [draftFrom, setDraftFrom] = useState(invoice?.from ?? DEFAULT_FROM);
  const [draftTo, setDraftTo] = useState(invoice?.to ?? EMPTY_TO);
  const [draftModels, setDraftModels] = useState(invoice?.models ?? []);

  const total = useMemo(
    () =>
      draftModels.reduce(
        (sum, m) =>
          sum +
          priceFor(m, 'client', clientPrices, freelancerPrices) +
          bonusFor(m, 'client', clientPrices, freelancerPrices),
        0
      ),
    [draftModels, clientPrices, freelancerPrices]
  );

  const handleFromChange = (e) => {
    const { name, value } = e.target;
    setDraftFrom((prev) => ({ ...prev, [name]: value }));
  };

  const handleToChange = (e) => {
    const { name, value } = e.target;
    setDraftTo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddModel = (newModel) => {
    setDraftModels((prev) => [...prev, newModel]);
  };

  const handleRemoveModel = (modelId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    setDraftModels((prev) => prev.filter((m) => m.id !== modelId));
  };

  const handleSave = () => {
    if (!draftTo.name.trim() || !draftTo.email.trim()) {
      notifyWarning('Vui lòng nhập đầy đủ thông tin khách hàng (To)!');
      return;
    }
    if (draftModels.length === 0) {
      notifyWarning('Hóa đơn cần ít nhất 1 model!');
      return;
    }

    if (isCreateMode) {
      dispatch(createInvoice({ from: draftFrom, to: draftTo, models: draftModels }));
      notifySuccess('Đã tạo hóa đơn mới!');
    } else {
      dispatch(updateInvoice(invoice.id, { from: draftFrom, to: draftTo, models: draftModels }));
      notifySuccess('Đã lưu thay đổi hóa đơn');
    }

    onDone?.();
  };

  const handleTogglePaid = () => {
    dispatch(updateInvoicePaid(invoice.id, !invoice.paid));
    notifySuccess(invoice.paid ? 'Đã chuyển về Chưa thanh toán' : 'Đã đánh dấu Đã thanh toán');
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className='flex flex-row'>
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    {isCreateMode ? 'Tạo hóa đơn mới' : `Hóa đơn #${invoice.invoiceNumber}`}
                </h2>
                {!isCreateMode && (
                    <p className="text-sm text-gray-400 mt-0.5">Ngày tạo: {invoice.createdAt}</p>
                )}
            </div>
            {!isCreateMode && (
                <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                    invoice.paid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 d-block'
                }`}
                >
                {invoice.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
            )}
        </div>
        
        
        <div className="flex items-center gap-3">
          {!isCreateMode && (
            <button type="button" onClick={onPrint} className="text-sm font-medium text-gray-600 hover:text-gray-900 flex flex-row items-center cursor-pointer mr-4">
              <Printer width={16} className='mr-2'/>
              In hóa đơn
            </button>
          )}
          <button type="button" onClick={onDone} className="text-sm text-gray-500 hover:text-gray-800">
            ← Quay lại danh sách
          </button>
        </div>
      </div>

      {/* From / To — luôn ở dạng nhập */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">From</p>
          <input
            type="text"
            name="name"
            value={draftFrom.name}
            onChange={handleFromChange}
            placeholder="Tên công ty"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
          <input
            type="email"
            name="email"
            value={draftFrom.email}
            onChange={handleFromChange}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
          <input
            type="text"
            name="address"
            value={draftFrom.address}
            onChange={handleFromChange}
            placeholder="Địa chỉ"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">To</p>
          <input
            type="text"
            name="name"
            value={draftTo.name}
            onChange={handleToChange}
            placeholder="Tên khách hàng"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
          <input
            type="email"
            name="email"
            value={draftTo.email}
            onChange={handleToChange}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
          <input
            type="text"
            name="address"
            value={draftTo.address}
            onChange={handleToChange}
            placeholder="Địa chỉ"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>
      </div>

      {/* Bảng Model — luôn cho thêm/xóa */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Danh sách Model</p>
          <button
            type="button"
            onClick={() => setIsModelModalOpen(true)}
            className="rounded-full border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            + Thêm Model
          </button>
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-400">
              <th className="pb-2 pr-3">Model</th>
              <th className="pb-2 px-3">Loại</th>
              <th className="pb-2 px-3">Trạng thái</th>
              <th className="pb-2 px-3 text-right">Đơn giá</th>
              <th className="pb-2 px-3 text-right">Bonus</th>
              <th className="pb-2 px-3 text-right">Thành tiền</th>
              <th className="pb-2 pl-3"></th>
            </tr>
          </thead>
          <tbody>
            {draftModels.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  Chưa có model nào — bấm "+ Thêm Model".
                </td>
              </tr>
            )}
            {draftModels.map((m) => {
              const price = priceFor(m, 'client', clientPrices, freelancerPrices);
              const bonus = bonusFor(m, 'client', clientPrices, freelancerPrices);
              return (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="py-2 pr-3 font-medium text-gray-900">{m.name}</td>
                  <td className="py-2 px-3 text-gray-500">{m.type}</td>
                  <td className="py-2 px-3 text-gray-500">{m.status}</td>
                  <td className="py-2 px-3 text-right font-mono">{fmtUSD(price)}</td>
                  <td className="py-2 px-3 text-right font-mono">{bonus ? fmtUSD(bonus) : '—'}</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">{fmtUSD(price + bonus)}</td>
                  <td className="py-2 pl-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveModel(m.id)}
                      className="text-xs text-gray-400 hover:text-rose-500"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {draftModels.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-gray-900">
                <td colSpan={5} className="pt-3 font-semibold text-gray-900">Tổng cộng</td>
                <td className="pt-3 text-right font-mono font-semibold">{fmtUSD(total)}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
        {!isCreateMode && (
          <button
            type="button"
            onClick={handleTogglePaid}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg mr-auto"
          >
            {invoice.paid ? 'Đánh dấu Chưa thanh toán' : 'Đánh dấu Đã thanh toán'}
          </button>
        )}
        <button
          type="button"
          onClick={onDone}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg"
        >
          {isCreateMode ? 'Lưu hóa đơn' : 'Lưu thay đổi'}
        </button>
      </div>

      <AddModel
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        onAddModel={handleAddModel}
      />
    </div>
  );
}

export default ClientInvoiceEditor;