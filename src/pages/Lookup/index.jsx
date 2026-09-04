import { useState, useMemo, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { DeadlineBadge, PaidBadge } from "../../components/Badge.jsx";

function Index() {
  // Lấy dữ liệu từ Redux store
  const models = useSelector((state) => state.models);
  
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState(null);
  const boxRef = useRef(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return models.filter((m) => m.name.toLowerCase().includes(q));
  }, [query, models]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setShowResults(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function handleSelect(model) {
    setSelected(model);
    setQuery(model.name);
    setShowResults(false);
  }

  return (
    <section className="px-8 py-8 max-w-4xl mx-auto">
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
      <div className="relative mb-6" ref={boxRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Nhập tên model, vd: RTX 5090…"
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
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

        {/* Kết quả tìm kiếm */}
        {showResults && matches.length > 0 && (
          <div className="absolute top-full mt-2 w-full rounded-xl border border-gray-100 bg-white shadow-lg max-h-64 overflow-y-auto z-10">
            {matches.map((m) => (
              <div
                key={m.id}
                onClick={() => handleSelect(m)}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
              >
                <span className="text-sm font-medium text-gray-900">{m.name}</span>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {m.type} · Milestone {m.milestone}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trạng thái chưa chọn model */}
      {!selected && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-12 text-center">
          <p className="text-sm text-gray-400">
            Chưa có model nào được chọn — hãy tìm ở ô phía trên.
          </p>
        </div>
      )}

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
        </div>
      )}
    </section>
  );
}
export default Index;