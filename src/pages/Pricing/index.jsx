// components/Index.jsx
import { useSelector, useDispatch } from "react-redux";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { createPriceList, updatePriceList, deletePriceList, loadPriceLists, priceListToTables } from '../../services/api.js';

function Index() {
  const emptyNewType = () => ({ name: '', new: { usd: '', vnd: '' }, similar1: { usd: '', vnd: '' }, similar2: { usd: '', vnd: '' }, modular: { usd: '', vnd: '' }, bonus: { usd: '', vnd: '' } });
  const dispatch = useDispatch();
  const clientPrices = useSelector((state) => state.clientPrices);
  const freelancerPrices = useSelector((state) => state.freelancerPrices);



  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newType, setNewType] = useState(emptyNewType);
  const [editingType, setEditingType] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const openCreateModal = () => {
    setEditingType(null);
    setNewType(emptyNewType());
    setIsAddModalOpen(true);
  };
  const openEditModal = (type) => {
    setEditingType(type);
    setNewType({
      name: type,
      ...Object.fromEntries(['new', 'similar1', 'similar2', 'modular', 'bonus'].map((field) => [field, {
        usd: clientPrices[type]?.[field] ?? 0,
        vnd: freelancerPrices[type]?.[field] ?? 0,
      }])),
    });
    setIsAddModalOpen(true);
  };
  const closeModal = () => {
    if (isSaving) return;
    setIsAddModalOpen(false);
    setEditingType(null);
  };
  const handleSaveType = async (event) => {
    event.preventDefault();
    const name = newType.name.trim();
    if (!name) return;
    if (!editingType && Object.keys(clientPrices).some((type) => type.toLowerCase() === name.toLowerCase())) {
      alert('Tên loại này đã tồn tại.');
      return;
    }
    setIsSaving(true);
    try {
      if (editingType) await updatePriceList(editingType, newType);
      else await createPriceList(name, newType);
      const tables = priceListToTables(await loadPriceLists());
      dispatch({ type: 'SET_CLIENT_PRICES', payload: tables.client });
      dispatch({ type: 'SET_FREELANCER_PRICES', payload: tables.freelancer });
      setIsAddModalOpen(false);
      setNewType(emptyNewType());
      setEditingType(null);
    } catch (error) { alert(error.message); }
    finally { setIsSaving(false); }
  };
  const removeType = async (name) => {
    try {
      await deletePriceList(name);
      const tables = priceListToTables(await loadPriceLists());
      dispatch({ type: 'SET_CLIENT_PRICES', payload: tables.client });
      dispatch({ type: 'SET_FREELANCER_PRICES', payload: tables.freelancer });
    } catch (error) { alert(error.message); }
  };

  // Handlers cho xóa dòng
  const handleDeleteType = (type) => {
    if (window.confirm(`Xóa dòng "${type}"?`)) {
      removeType(type);
    }
  };

  return (
    <section className="px-8 py-8 mx-auto">
      {/* Header và Note giữ nguyên ... */}

      <div className="mb-3 flex justify-end">
        <button type="button" onClick={openCreateModal} className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors bg-neutral-50 cursor-pointer">
          <Plus className="h-3.5 w-3.5" /> Thêm mới
        </button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-600">
                <th rowSpan={2} className="px-4 py-3 text-left">Loại linh kiện</th>
                <th colSpan={5} className="border-l border-gray-100 px-3 py-3 text-center">Khách hàng (USD)</th>
                <th colSpan={5} className="border-l border-gray-100 px-3 py-3 text-center">Freelancer (VND)</th>
                <th rowSpan={2} className="border-l border-gray-100 px-3 py-3 text-center">Thao tác</th>
              </tr>
              <tr className="border-b border-gray-100 text-xs font-medium text-gray-400">
                {['New', 'Sim. 1', 'Sim. 2', 'Modular', 'Bonus', 'New', 'Sim. 1', 'Sim. 2', 'Modular', 'Bonus'].map((label, index) => (
                  <th key={`${label}-${index}`} className={`px-2 py-2 text-right ${index === 0 || index === 5 ? 'border-l border-gray-100' : ''}`}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {[...new Set([...Object.keys(clientPrices), ...Object.keys(freelancerPrices)])].map((type) => {
                const client = clientPrices[type] || {};
                const freelancer = freelancerPrices[type] || {};
                return (
                  <tr key={type} className="border-b border-gray-50 last:border-0">
                    <td className="whitespace-nowrap px-4 py-2.5 font-medium text-gray-900">{type}</td>
                    {['new', 'similar1', 'similar2', 'modular', 'bonus'].map((field) => (
                      <PriceValue key={`usd-${field}`} className={field === 'new' ? 'border-l border-gray-100' : ''} value={client[field] ?? 0} locale="en-US" />
                    ))}
                    {['new', 'similar1', 'similar2', 'modular', 'bonus'].map((field) => (
                      <PriceValue key={`vnd-${field}`} className={field === 'new' ? 'border-l border-gray-100' : ''} value={freelancer[field] ?? 0} locale="vi-VN" />
                    ))}
                    <td className="border-l border-gray-100 px-3 py-2.5 text-center">
                      <button type="button" onClick={() => openEditModal(type)} aria-label={`Chỉnh sửa ${type}`} title="Chỉnh sửa" className="mr-2 text-gray-500 transition-colors hover:text-gray-900"><Pencil className="inline h-4 w-4" /></button>
                      <button type="button" onClick={() => handleDeleteType(type)} aria-label={`Xóa ${type}`} title="Xóa" className="text-red-400 transition-colors hover:text-red-600"><Trash2 className="inline h-4 w-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <form onSubmit={handleSaveType} className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editingType ? `Chỉnh sửa giá: ${editingType}` : 'Thêm loại linh kiện'}</h2>
              <button type="button" onClick={closeModal} disabled={isSaving} aria-label="Đóng popup" className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="mb-4 block text-sm font-medium text-gray-700">
              Tên loại
              <input autoFocus required readOnly={Boolean(editingType)} value={newType.name} onChange={(event) => setNewType((current) => ({ ...current, name: event.target.value }))} placeholder="Ví dụ: RAM" className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none read-only:bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10" />
            </label>
            <div className="mb-2 grid grid-cols-[1fr_1fr_1fr] gap-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <span>Mức giá</span><span>Khách hàng (USD)</span><span>Freelancer (VND)</span>
            </div>
            <div className="space-y-2">
              {[
                ['new', 'New'], ['similar1', 'Similar 1'], ['similar2', 'Similar 2'], ['modular', 'Modular'], ['bonus', 'Bonus'],
              ].map(([field, label]) => (
                <div key={field} className="grid grid-cols-[1fr_1fr_1fr] items-center gap-3">
                  <span className="text-sm text-gray-600">{label}</span>
                  {['usd', 'vnd'].map((currency) => (
                    <input key={currency} id={`new-price-${field}-${currency}`} required type="number" min="0" step="any" inputMode="decimal" value={newType[field][currency]} onChange={(event) => setNewType((current) => ({ ...current, [field]: { ...current[field], [currency]: event.target.value } }))} aria-label={`${label} ${currency.toUpperCase()}`} className="min-w-0 rounded-lg border border-gray-200 px-3 py-2 text-right text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10" />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4">
              <button type="button" onClick={closeModal} disabled={isSaving} className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">Hủy</button>
              <button type="submit" disabled={isSaving} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
                {isSaving ? 'Đang lưu...' : editingType ? 'Lưu thay đổi' : 'Lưu loại giá'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function PriceValue({ value, locale, className = '' }) {
  return (
    <td className={`py-2.5 px-2 text-right ${className}`}>
      <span className="font-mono text-sm text-gray-700 tabular-nums">{Number(value).toLocaleString(locale)}</span>
    </td>
  );
}

export default Index;
