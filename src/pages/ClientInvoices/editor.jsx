import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { priceFor, bonusFor, fmtUSD, fmtVND } from '../../utils/pricing.js';
import AddModel from '../../components/AddModel.jsx';
import { notifySuccess, notifyWarning } from '../../utils/toast.js';
import { Printer } from 'lucide-react';
import { api, loadInvoices, loadModels } from '../../services/api.js';
const DEFAULT_FROM = {
  name: 'Lạc Việt Studio',
  email: 'lacvietstu@gmail.com',
  address: 'Lk16.29 Hinode Royal Park city, Ha Noi, Viet Nam',
};

const EMPTY_TO = { name: 'BuildCores LLC', email: 'mohit@buildcores.com', address: '993 Throop St Dickson City, PA 18519 United States of America' };
const partySnapshot = (party = {}) => ({
  name: party.name ?? '',
  email: party.email ?? '',
  address: party.address ?? '',
});
const modelSnapshot = (models = []) => models.map((model) => ({
  id: String(model.id ?? model._id ?? ''),
  name: model.name ?? '',
  type: model.type ?? '',
  status: model.status ?? '',
  milestone: model.milestone ?? 0,
  deadline: model.deadline ?? 'OK',
  staff: model.staff ?? '',
  hasBonus: model.hasBonus,
  clientPaid: Boolean(model.clientPaid),
  freelancerPaid: Boolean(model.freelancerPaid),
}));

function ClientInvoiceEditor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Lấy id từ URL (undefined nếu là /create)
  const type = location.pathname.startsWith('/freelancer-invoices') ? 'freelancer' : 'customer';
  const audience = type === 'customer' ? 'client' : 'freelancer';
  const invoicePath = type === 'customer' ? '/client-invoices' : '/freelancer-invoices';

  const clientPrices = useSelector((s) => s.clientPrices);
  const freelancerPrices = useSelector((s) => s.freelancerPrices);

  // Xác định mode dựa trên sự tồn tại của id
  const isCreateMode = !id;
  const invoice = useSelector((s) => s.invoices.list.find((item) => item.id === id && item.type === type));

  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  // Draft state — nguồn dữ liệu duy nhất, luôn cho phép chỉnh sửa
  const [draftFrom, setDraftFrom] = useState(DEFAULT_FROM);
  const [draftTo, setDraftTo] = useState(EMPTY_TO);
  const [draftModels, setDraftModels] = useState([]);
  const [draftPaid, setDraftPaid] = useState(false);

  // Đồng bộ draft state khi invoice thay đổi (lần đầu load hoặc khi id đổi)
  useEffect(() => {
    if (invoice) {
      setDraftFrom(invoice.from ?? DEFAULT_FROM);
      setDraftTo(invoice.to ?? EMPTY_TO);
      setDraftModels(invoice.models ?? []);
      setDraftPaid(Boolean(invoice.paid));
    } else {
      // Create mode
      setDraftFrom(DEFAULT_FROM);
      setDraftTo(EMPTY_TO);
      setDraftModels([]);
      setDraftPaid(false);
    }
  }, [invoice]);
  // Xử lý trường hợp id không hợp lệ (chỉ ở edit mode)
  useEffect(() => {
    if (!isCreateMode && !invoice) {
      notifyWarning('Không tìm thấy hóa đơn!');
      // navigate('/client-invoices');
    }
  }, [isCreateMode, invoice, navigate]);

  const total = useMemo(
    () =>
      draftModels.reduce(
        (sum, m) =>
          sum +
          priceFor(m, audience, clientPrices, freelancerPrices) +
          (m.bonus ?? bonusFor(m, audience, clientPrices, freelancerPrices)),
        0
      ),
    [draftModels, clientPrices, freelancerPrices]
  );

  const originalFrom = invoice?.from ?? DEFAULT_FROM;
  const originalTo = invoice?.to ?? EMPTY_TO;
  const originalModels = invoice?.models ?? [];
  const hasUnsavedChanges =
    JSON.stringify(partySnapshot(draftFrom)) !== JSON.stringify(partySnapshot(originalFrom)) ||
    JSON.stringify(partySnapshot(draftTo)) !== JSON.stringify(partySnapshot(originalTo)) ||
    JSON.stringify(modelSnapshot(draftModels)) !== JSON.stringify(modelSnapshot(originalModels)) ||
    draftPaid !== Boolean(invoice?.paid);

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

  const handleSave = async () => {
    if (!draftTo.name.trim() || !draftTo.email.trim()) {
      notifyWarning('Vui lòng nhập đầy đủ thông tin khách hàng (To)!');
      return;
    }
    if (draftModels.length === 0) {
      notifyWarning('Hóa đơn cần ít nhất 1 model!');
      return;
    }

    try {
      if (isCreateMode) {
        await api('/invoices', { method: 'POST', body: JSON.stringify({ type, from: draftFrom, to: draftTo, models: draftModels }) });
        notifySuccess('Đã tạo hóa đơn mới!');
      } else {
        const paidChanged = draftPaid !== Boolean(invoice.paid);
        const saveInvoice = () => api(`/invoices/${invoice.id}`, {
          method: 'PUT',
          body: JSON.stringify({ from: draftFrom, to: draftTo, models: draftModels }),
        });
        const savePayment = () => api(`/invoices/${invoice.id}/pay`, {
          method: 'PATCH',
          body: JSON.stringify({ isPaid: draftPaid }),
        });

        // Hóa đơn đã thanh toán phải được chuyển về chưa thanh toán trước khi
        // API cho phép sửa nội dung hóa đơn.
        if (paidChanged && invoice.paid && !draftPaid) await savePayment();
        await saveInvoice();
        if (paidChanged && !invoice.paid && draftPaid) await savePayment();
        notifySuccess(`Đã lưu hóa đơn ${invoice.invoiceNumber}`);
      }

      dispatch({ type: 'SET_INVOICES', payload: [...await loadInvoices('customer'), ...await loadInvoices('freelancer')] });
      dispatch({ type: 'SET_MODELS', payload: await loadModels() });
      navigate(invoicePath);
    } catch (error) { notifyWarning(error.message); }
  };

  const handleTogglePaid = async () => {
    if (!invoice) return;
    setDraftPaid((current) => !current);
  };

  const handleBack = () => {
  navigate(invoicePath);
  };

  // Nếu đang ở edit mode mà chưa tìm thấy invoice, không render gì
  // (useEffect sẽ điều hướng về danh sách)
  if (!isCreateMode && !invoice) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className='flex flex-row'>
            <div>
            <h2 className="text-lg font-semibold text-gray-900">
                    {isCreateMode ? `Tạo hóa đơn mới (${type === 'customer' ? 'USD' : 'VND'})` : `Hóa đơn #${invoice.invoiceNumber} (${type === 'customer' ? 'USD' : 'VND'})`}
                </h2>
                {!isCreateMode && (
                    <p className="text-sm text-gray-400 mt-0.5">Ngày tạo: {invoice.createdAt}</p>
                )}
            </div>
            {!isCreateMode && (
                <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                    draftPaid ? ' text-emerald-600' : ' text-amber-600 d-block'
                }`}
                >
                {draftPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
            )}
        </div>
        
        
        <div className="flex items-center gap-3">
          {!isCreateMode && (
            <button type="button" onClick={() => navigate(`${invoicePath}/${invoice.id}/print`)} className="text-sm font-medium text-gray-600 hover:text-gray-900 flex flex-row items-center cursor-pointer mr-4">
              <Printer width={16} className='mr-2'/>
              In hóa đơn
            </button>
          )}
          <button type="button" onClick={handleBack} className="text-sm text-gray-500 hover:text-gray-800">
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
              <th className="pb-2 pl-3 text-right">Hành động</th>
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
              console.log(m)
              const price = priceFor(m, audience, clientPrices, freelancerPrices);
              const bonus = m.bonus ?? bonusFor(m, audience, clientPrices, freelancerPrices);
              return (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="py-2 pr-3 font-medium text-gray-900">{m.name}</td>
                  <td className="py-2 px-3 text-gray-500">{m.type}</td>
                  <td className="py-2 px-3 text-gray-500">{m.status}</td>
                  <td className="py-2 px-3 text-right font-mono">{audience === 'client' ? fmtUSD(price) : fmtVND(price)}</td>
                  <td className="py-2 px-3 text-right font-mono">{bonus ? (audience === 'client' ? fmtUSD(bonus) : fmtVND(bonus)) : '—'}</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">{audience === 'client' ? fmtUSD(price + bonus) : fmtVND(price + bonus)}</td>
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
                <td className="pt-3 text-right font-mono font-semibold">{audience === 'client' ? fmtUSD(total) : fmtVND(total)}</td>
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
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg mr-auto cursor-pointer"
          >
            {draftPaid ? 'Đánh dấu Chưa thanh toán' : 'Đánh dấu Đã thanh toán'}
          </button>
        )}
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${hasUnsavedChanges ? 'bg-gray-900 hover:bg-gray-800 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {isCreateMode ? 'Lưu hóa đơn' : 'Lưu thay đổi'}
        </button>
      </div>

      <AddModel
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        onAddModel={handleAddModel}
        audience={audience}
      />
    </div>
  );
}

export default ClientInvoiceEditor;
