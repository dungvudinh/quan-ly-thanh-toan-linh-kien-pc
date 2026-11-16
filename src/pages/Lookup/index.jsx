import { useState, useEffect } from "react";
import { DeadlineBadge, PaidBadge } from "../../components/Badge.jsx";
import { fmtUSD, fmtVND } from "../../utils/pricing.js";
import { api } from "../../services/api.js";

function Index() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    let active = true;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const queryString = q ? `q=${encodeURIComponent(q)}&` : '';
        const firstPage = await api(`/models/search?${queryString}inInvoice=true&limit=100&page=1`);
        const remainingPages = await Promise.all(
          Array.from({ length: Math.max(0, firstPage.totalPages - 1) }, (_, index) =>
            api(`/models/search?${queryString}inInvoice=true&limit=100&page=${index + 2}`)
          )
        );
        if (active) setMatches([...firstPage.data, ...remainingPages.flatMap((page) => page.data)]);
      } catch {
        if (active) setMatches([]);
      } finally {
        if (active) setIsLoading(false);
      }
    }, q ? 250 : 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  function handleSelect(model) {
    setSelected(model);
  }

  return (
    <section className="mx-auto max-w-7xl px-8 py-8">
      {/* Header trang */}
      <div className="flex items-end justify-between gap-4 pb-5 mb-6 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Tra cứu model
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Tìm theo tên để xem trạng thái deadline và thanh toán mới nhất
          </p>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Nhập tên model, vd: RTX 5090…"
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-shadow"
          />
          {/* Icon tìm kiếm (tùy chọn) */}
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500">
              <tr>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Khách hàng (USD)</th>
                <th className="px-4 py-3 text-right">Freelancer (VND)</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Đang tải danh sách model...</td></tr>}
              {!isLoading && matches.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Không có model nào trong hóa đơn phù hợp.</td></tr>}
              {!isLoading && matches.map((model) => (
                <tr key={model.id} onClick={() => handleSelect(model)} className={`cursor-pointer border-t border-gray-100 hover:bg-gray-50 ${selected?.id === model.id ? 'bg-gray-50' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-900">{model.name}</td>
                  <td className="px-4 py-3 text-gray-500">{model.type}</td>
                  <td className="px-4 py-3 text-gray-500">{model.status}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700">{model.customerPrice ? `${fmtUSD(model.customerPrice.unit)} + ${fmtUSD(model.customerPrice.bonus)}` : '—'}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700">{model.freelancerPrice ? `${fmtVND(model.freelancerPrice.unit)} + ${fmtVND(model.freelancerPrice.bonus)}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thông tin chi tiết model */}
      {selected && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
          {/* Header thông tin model */}
          <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{selected.name}</h2>
              <span className="inline-block mt-1 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {selected.type}
              </span>
            </div>
          </div>

          {/* Grid thông tin chi tiết */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Milestone */}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-500">Milestone</span>
              <span className="text-sm font-semibold text-gray-900">{selected.milestone}</span>
            </div>

            {/* Trạng thái */}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-500">Trạng thái</span>
              <span className="text-sm font-semibold text-gray-900">{selected.status}</span>
            </div>

            {/* Deadline */}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-500">Deadline</span>
              <span className="text-sm font-semibold">
                <DeadlineBadge status={selected.deadline} />
              </span>
            </div>

            {/* Staff */}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-500">Staff</span>
              <span className="text-sm font-semibold text-gray-900">{selected.staff}</span>
            </div>

            {/* Thanh toán khách hàng */}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-500">Thanh toán khách hàng</span>
              <span className="text-sm font-semibold">
                <PaidBadge 
                  paid={selected.clientPaid} 
                  paidLabel="Paid" 
                  pendingLabel="Not Paid" 
                />
              </span>
            </div>

            {/* Thanh toán freelancer */}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-500">Thanh toán freelancer</span>
              <span className="text-sm font-semibold">
                <PaidBadge 
                  paid={selected.freelancerPaid} 
                  paidLabel="Paid" 
                  pendingLabel="Not Paid" 
                />
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Giá theo bảng giá</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: 'Khách hàng (USD)', price: selected.customerPrice, format: fmtUSD },
                { label: 'Freelancer (VND)', price: selected.freelancerPrice, format: fmtVND },
              ].map(({ label, price, format }) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-gray-800">{label}</h4>
                  {price ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-3"><span className="text-gray-500">Đơn giá</span><span className="font-mono font-medium text-gray-900">{format(price.unit)}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">Bonus</span><span className="font-mono font-medium text-gray-900">{format(price.bonus)}</span></div>
                      <div className="flex justify-between gap-3 border-t border-gray-200 pt-2"><span className="font-medium text-gray-700">Thành tiền</span><span className="font-mono font-semibold text-gray-900">{format(price.unit + price.bonus)}</span></div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Chưa có giá trong bảng này.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
export default Index;
