// pages/InvoiceListPage.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { priceFor, bonusFor, fmtUSD } from '../../utils/pricing.js';
import { printInvoice, showInvoicePdf } from '../../utils/printInvoice.js';
import { notifySuccess, notifyWarning } from '../../utils/toast.js';
import {  Pencil, Printer, Trash, X, Search } from 'lucide-react'; // 👈 thêm Search
import { useConfirmDialog } from '../../hooks/useConfirmDialog.js';
const PAGE_SIZE = 5;

function InvoiceTotal({ invoice, clientPrices, freelancerPrices }) {
  const total = invoice.models.reduce(
    (sum, m) =>
      sum +
      priceFor(m, 'client', clientPrices, freelancerPrices) +
      bonusFor(m, 'client', clientPrices, freelancerPrices),
    0
  );
  return <span>{fmtUSD(total)}</span>;
}

function ClientInvoices() {
  const navigate = useNavigate();
  const invoices = useSelector((s) => s.invoices.list);
  const clientPrices = useSelector((s) => s.clientPrices);
  const freelancerPrices = useSelector((s) => s.freelancerPrices);
  const { confirm } = useConfirmDialog();
  const [view, setView] = useState('list');
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // 👈 state cho input tìm kiếm
  console.log(invoices)
  // 👈 Lọc invoices theo searchTerm (mã HĐ + tên khách hàng)
  const filteredInvoices = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return invoices;

    return invoices.filter((inv) => {
      const invoiceNumberStr = String(inv.invoiceNumber ?? '').toLowerCase();
      const customerName = (inv.to?.name ?? '').toLowerCase();
      return (
        invoiceNumberStr.includes(keyword) ||
        customerName.includes(keyword)
      );
    });
  }, [invoices, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));

  // 👈 Dùng filteredInvoices thay vì invoices
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredInvoices.slice(start, start + PAGE_SIZE);
  }, [filteredInvoices, page]);

  // 👈 Reset về trang 1 mỗi khi searchTerm thay đổi
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(1);
  };

  const handleDelete = async (invoiceId) => {
    const ok = await confirm({
      title: 'Bạn có chắc chắn muốn xóa ?',
      text: 'Bài viết sẽ bị xóa vĩnh viễn và không thể khôi phục',
      type: 'danger',
      confirmText: 'Xóa',
    });
    if (!ok) return;
    const remaining = invoices.length - 1;
    const newTotalPages = Math.max(1, Math.ceil(remaining / PAGE_SIZE));
    if (page > newTotalPages) setPage(newTotalPages);
    notifySuccess('Đã xóa hóa đơn');
  };

  const handlePrint = (invoice) => {
    if (invoice.models.length === 0) {
      notifyWarning('Hóa đơn chưa có model nào để in');
      return;
    }
    const rows = invoice.models.map((m, index) => ({
      num: index + 1,
      name: m.name,
      type: m.type,
      variant: m.status,
      milestone: m.milestone,
      deadline: m.deadline,
      price: priceFor(m, 'client', clientPrices, freelancerPrices),
      bonus: bonusFor(m, 'client', clientPrices, freelancerPrices),
      note: '',
    }));
    const total = rows.reduce((sum, r) => sum + r.price + r.bonus, 0);
    const doc = printInvoice({ invoice, rows, total });
    showInvoicePdf(doc);
  };

  return (
    <section className="px-8 py-8">
      <div className="flex items-end justify-between gap-4 pb-5 mb-6 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Hóa đơn khách hàng</h1>
          <p className="text-sm text-gray-400 mt-1">Danh sách hóa đơn đã tạo</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              width={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Tìm theo mã HĐ hoặc tên khách hàng..."
              className="w-[300px] rounded-full border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-700 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white focus:ring-4 focus:ring-neutral-100"
            />
            
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                title="Xóa tìm kiếm"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <X width={14} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/client-invoices/create')}
            className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            + Tạo hóa đơn
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-400">
              <th className="pb-3 pr-3">Số HĐ</th>
              <th className="pb-3 px-3">Ngày tạo</th>
              <th className="pb-3 px-3">Khách hàng</th>
              <th className="pb-3 px-3 text-center">Số model</th>
              <th className="pb-3 px-3 text-center">Tổng tiền</th>
              <th className="pb-3 px-3 text-center">Trạng thái</th>
              <th className="pb-3 pl-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">
                  {searchTerm
                    ? `Không tìm thấy hóa đơn nào khớp với "${searchTerm}".`
                    : 'Chưa có hóa đơn nào.'}
                </td>
              </tr>
            )}
            {pageItems.map((inv) => (
              <tr key={inv.id} className="border-t border-gray-100">
                <td className="py-3 pr-3 font-mono">#{inv.invoiceNumber}</td>
                <td className="py-3 px-3 text-gray-500">{inv.createdAt}</td>
                <td className="py-3 px-3">
                  <div className="font-medium text-gray-900">{inv.to.name}</div>
                  <div className="text-xs text-gray-400">{inv.to.email}</div>
                </td>
                <td className="py-3 px-3 font-mono text-center">{inv.models.length}</td>
                <td className="py-3 px-3 font-mono font-semibold text-center">
                  <InvoiceTotal invoice={inv} clientPrices={clientPrices} freelancerPrices={freelancerPrices} />
                </td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      inv.paid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {inv.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </td>
                <td className="py-3 pl-3 whitespace-nowrap text-center">
                  <button
                    type="button"
                    title="Chỉnh sửa hóa đơn"
                    onClick={() => navigate(`/client-invoices/${inv.id}/edit`)}
                    className="text-gray-600 hover:text-gray-900 mr-3 cursor-pointer"
                  >
                    <Pencil width={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePrint(inv)}
                    title="In hóa đơn"
                    className="text-gray-600 hover:text-gray-900 cursor-pointer mr-3"
                  >
                    <Printer width={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(inv.id)}
                    title="Xóa hóa đơn"
                    className="text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    <Trash width={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            ‹ Trước
          </button>
          <span className="text-sm text-gray-500">
            Trang {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            Sau ›
          </button>
        </div>
      </div>
    </section>
  );
}

export default ClientInvoices;