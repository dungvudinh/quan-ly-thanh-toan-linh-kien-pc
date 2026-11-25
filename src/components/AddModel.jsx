// components/Invoice/AddModel.jsx
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { notifySuccess, notifyWarning } from '../utils/toast.js';

function AddModel({ isOpen, onClose, onAddModel, audience = 'client' }) {
  const clientPrices = useSelector((state) => state.clientPrices);
  const freelancerPrices = useSelector((state) => state.freelancerPrices);
  const prices = audience === 'freelancer' ? freelancerPrices : clientPrices;
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'new',
    milestone: 0,
    deadline: 'OK',
    staff: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        type: Object.keys(prices)[0] || '',
        status: 'new',
        milestone: 0,
        deadline: 'OK',
        staff: '',
      });
    }
  }, [isOpen, prices]);

  const statusOptions = [
    { title: 'New', key: 'new' },
    { title: 'Similar 1', key: 'similar1' },
    { title: 'Similar 2', key: 'similar2' },
    { title: 'Modular', key: 'modular' },
    { title: 'Modular Similar', key: 'modularsimilar' },
  ];

  const typeOptions = Object.keys(prices);
  const statusLabel = statusOptions.find(({ key }) => key === formData.status)?.title || formData.status;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Tìm model trùng trong dữ liệu đã tải từ API.
   * Trả về model trùng (kèm id) hoặc null nếu không có.
   */
  const models = useSelector((state) => state.models);
  const invoices = useSelector((state) => state.invoices.list);
  const findDuplicateModel = (model) => {
    const normalizedName = model.name.trim().toLowerCase();
    return (
      models.find(
        (m) => m.name?.trim().toLowerCase() === normalizedName
      ) ?? null
    );
  };

  /**
   * Tìm hóa đơn chứa model (theo id).
   * Trả về invoice hoặc null.
   */
  const findInvoiceContainingModel = (modelId, invoiceType) => {
    return (
      invoices.find((inv) => inv.type === invoiceType &&
        inv.models?.some((m) => m.id === modelId)
      ) ?? null
    );
  };

  /**
   * Tạo object model từ form + validate.
   * Trả về null nếu validate thất bại (đã toast warning).
   */
  const buildModel = () => {
    if (!formData.name.trim()) {
      notifyWarning('Vui lòng nhập tên Model!');
      return null;
    }
    if (!formData.type) {
      notifyWarning('Vui lòng chọn loại linh kiện!');
      return null;
    }

    try {
      return {
        id: crypto.randomUUID(),
        name: formData.name.trim(),
        type: formData.type,
        milestone: Number(formData.milestone) || 0,
        status: formData.status,
        deadline: formData.deadline,
        hasBonus: formData.deadline === 'OK',
        staff: formData.staff.trim() || 'Chưa phân công',
        // Mặc định chưa thanh toán
        clientPaid: false,
        freelancerPaid: false,
      };
    } catch (err) {
      notifyWarning('Có lỗi khi tạo model, vui lòng thử lại!');
      console.error('Lỗi build model:', err);
      return null;
    }
  };

  /** Nút "Thêm Model" */
  const handleAddModel = async (e) => {
    e.preventDefault();

    const newModel = buildModel();
    if (!newModel) return;

    // Model được dùng lại giữa hai loại hóa đơn, nhưng không được lặp
    // trong hai hóa đơn cùng loại.
    const duplicateModel = findDuplicateModel(newModel);
    const invoiceType = audience === 'client' ? 'customer' : 'freelancer';
    if (duplicateModel) {
      const invoice = findInvoiceContainingModel(duplicateModel.id, invoiceType);
      if (invoice) {
        notifyWarning(
          `Model "${newModel.name}" đã tồn tại trong hóa đơn #${invoice.invoiceNumber}!`
        );
        return;
      }

      // Dùng lại model hiện có để giữ đúng thông tin và trạng thái thanh toán.
      Object.assign(newModel, duplicateModel, { id: duplicateModel.id });
      // The preview's eligibility rule is authoritative when reusing a model
      // whose stored hasBonus value predates the current invoice flow.
      newModel.hasBonus = newModel.deadline === 'OK';
    }

    // 3. Thêm model vào hóa đơn (draft)
    try {
      await onAddModel?.(newModel);
      notifySuccess(`Đã thêm model "${newModel.name}" vào hóa đơn!`);
      onClose();
    } catch (err) {
      notifyWarning('Thêm model thất bại, vui lòng thử lại!');
      console.error('Lỗi khi thêm model:', err);
    }
  };

  // Enter trong form = click "Thêm Model"
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddModel(e);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Thêm Model Mới</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: ZOTAC RTX 5090 TURBO OC 16G"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              required
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              required
            >
              {statusOptions.map((status, index) => (
                <option key={index} value={status.key}>{status.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Milestone</label>
            <input
              type="number"
              name="milestone"
              value={formData.milestone}
              onChange={handleChange}
              min="0"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline <span className="text-red-500">*</span>
            </label>
            <select
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              required
            >
              <option value="OK">OK</option>
              <option value="Miss">Miss</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {formData.deadline === 'OK'
                ? '✅ Bonus sẽ được tính tự động theo bảng giá'
                : '❌ Bonus sẽ để trống'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nhân viên phụ trách</label>
            <input
              type="text"
              name="staff"
              value={formData.staff}
              onChange={handleChange}
              placeholder="Tên nhân viên"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="font-medium text-gray-700 mb-1">🔍 Xem trước:</p>
            <div className="space-y-1 text-gray-600">
              <p>Loại: <span className="font-mono">{formData.type}</span></p>
              <p>Trạng thái: <span className="font-mono">{statusLabel}</span></p>
              {formData.type && prices[formData.type] && (
                <>
                  <p>Giá {statusLabel}: <span className="font-mono">{audience === 'client' ? '$' : ''}{prices[formData.type][formData.status.toLowerCase() === 'modularsimilar' ? 'modularSimilar' : formData.status.toLowerCase()] || 0}{audience === 'freelancer' ? ' ₫' : ''}</span></p>
                  {formData.deadline === 'OK' && (
                    <p>Bonus: <span className="font-mono">{audience === 'client' ? '$' : ''}{prices[formData.type].bonus || 0}{audience === 'freelancer' ? ' ₫' : ''}</span></p>
                  )}
                  <p className="font-semibold text-gray-900">
                    Thành tiền: {audience === 'client' ? '$' : ''}{(
                      (prices[formData.type]?.[formData.status.toLowerCase() === 'modularsimilar' ? 'modularSimilar' : formData.status.toLowerCase()] || 0) +
                      (formData.deadline === 'OK' ? (prices[formData.type]?.bonus || 0) : 0)
                    )}{audience === 'freelancer' ? ' ₫' : ''}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-3 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors flex items-center cursor-pointer"
            >
              <Plus width={15} className='mr-1'/>
              Thêm Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModel;
