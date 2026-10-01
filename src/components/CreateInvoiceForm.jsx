// components/Invoice/CreateInvoiceForm.jsx
import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createInvoice } from '../redux/actions/invoiceActions.js';
import { priceFor, bonusFor, fmtUSD } from '../utils/pricing.js';
import AddModel from './AddModel.jsx';

const DEFAULT_FROM = {
  name: 'Lạc Việt Studio',
  email: 'lacvietstu@gmail.com',
  address: 'Lk16.29 Hinode Royal Park city, Ha Noi, Viet Nam',
};

function CreateInvoiceForm({ onDone, showToast }) {
  const dispatch = useDispatch();
  const clientPrices = useSelector((s) => s.clientPrices);
  const freelancerPrices = useSelector((s) => s.freelancerPrices);

  const [to, setTo] = useState({ name: '', email: '', address: '' });
  const [models, setModels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const total = useMemo(
    () =>
      models.reduce(
        (sum, m) =>
          sum +
          priceFor(m, 'client', clientPrices, freelancerPrices) +
          bonusFor(m, 'client', clientPrices, freelancerPrices),
        0
      ),
    [models, clientPrices, freelancerPrices]
  );

  const handleToChange = (e) => {
    const { name, value } = e.target;
    setTo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddModel = (newModel) => {
    setModels((prev) => [...prev, newModel]);
  };

  const handleRemoveModel = (modelId) => {
    setModels((prev) => prev.filter((m) => m.id !== modelId));
  };

  const handleSave = () => {
    if (!to.name.trim() || !to.email.trim()) {
      showToast?.('Vui lòng nhập thông tin khách hàng (To)!');
      return;
    }
    if (models.length === 0) {
      showToast?.('Hóa đơn cần ít nhất 1 model!');
      return;
    }

    dispatch(
      createInvoice({
        from: DEFAULT_FROM,
        to,
        models,
      })
    );
    showToast?.('Đã tạo hóa đơn mới!');
    onDone?.();
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Tạo hóa đơn mới</h2>
        <button
          type="button"
          onClick={onDone}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Quay lại danh sách
        </button>
      </div>

      {/* From / To */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">From</p>
          <p className="font-medium text-gray-900">{DEFAULT_FROM.name}</p>
          <p className="text-sm text-gray-600">{DEFAULT_FROM.email}</p>
          <p className="text-sm text-gray-600">{DEFAULT_FROM.address}</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">To</p>
          <input
            type="text"
            name="name"
            value={to.name}
            onChange={handleToChange}
            placeholder="Tên khách hàng"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
          <input
            type="email"
            name="email"
            value={to.email}
            onChange={handleToChange}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
          <input
            type="text"
            name="address"
            value={to.address}
            onChange={handleToChange}
            placeholder="Địa chỉ"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>
      </div>

      {/* Bảng Model */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Danh sách Model</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
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
            {models.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  Chưa có model nào — bấm "+ Thêm Model".
                </td>
              </tr>
            )}
            {models.map((m) => {
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
          {models.length > 0 && (
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

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
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
          Lưu hóa đơn
        </button>
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

export default CreateInvoiceForm;