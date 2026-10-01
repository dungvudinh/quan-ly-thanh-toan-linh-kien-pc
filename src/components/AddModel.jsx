// components/Invoice/AddModel.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function AddModel({ isOpen, onClose, onAddModel, showToast }) {
  const clientPrices = useSelector((state) => state.clientPrices);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'New',
    milestone: 0,
    deadline: 'OK',
    staff: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        type: Object.keys(clientPrices)[0] || '',
        status: 'New',
        milestone: 0,
        deadline: 'OK',
        staff: '',
      });
    }
  }, [isOpen, clientPrices]);

  const statusOptions = [
    { title: 'New', key: 'new' },
    { title: 'Similar 1', key: 'similar1' },
    { title: 'Similar 2', key: 'similar2' },
    { title: 'Modular', key: 'modular' },
  ];

  const typeOptions = Object.keys(clientPrices);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.type) {
      showToast?.('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const newModel = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      type: formData.type,
      milestone: Number(formData.milestone) || 0,
      status: formData.status,
      deadline: formData.deadline,
      staff: formData.staff.trim() || 'Chưa phân công',
    };

    onAddModel?.(newModel); // <-- cha quyết định lưu vào đâu
    showToast?.('Đã thêm model vào hóa đơn!');
    onClose();
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
              <p>Trạng thái: <span className="font-mono">{formData.status}</span></p>
              {formData.type && clientPrices[formData.type] && (
                <>
                  <p>Giá {formData.status}: <span className="font-mono">${clientPrices[formData.type][formData.status.toLowerCase()] || 0}</span></p>
                  {formData.deadline === 'OK' && (
                    <p>Bonus: <span className="font-mono">${clientPrices[formData.type].bonus || 0}</span></p>
                  )}
                  <p className="font-semibold text-gray-900">
                    Thành tiền: ${(
                      (clientPrices[formData.type]?.[formData.status.toLowerCase()] || 0) +
                      (formData.deadline === 'OK' ? (clientPrices[formData.type]?.bonus || 0) : 0)
                    )}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Thêm Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModel;