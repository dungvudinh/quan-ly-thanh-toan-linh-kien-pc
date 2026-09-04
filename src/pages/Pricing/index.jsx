import { useSelector, useDispatch } from "react-redux";
import { updateClientPrice, updateFreelancerPrice } from "../../redux/actions/priceActions.js";
import { useState, useEffect} from "react";
function Index() {
  const dispatch = useDispatch();
  
  // Lấy dữ liệu từ Redux store
  const clientPrices = useSelector((state) => state.clientPrices);
  const freelancerPrices = useSelector((state) => state.freelancerPrices);

  return (
    <section className="px-8 py-8 max-w-7xl mx-auto">
      {/* Header trang */}
      <div className="flex items-end justify-between gap-4 pb-5 mb-6 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Bảng giá
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Nguồn dữ liệu duy nhất mà hóa đơn khách hàng và freelancer tham chiếu để tự điền giá
          </p>
        </div>
      </div>

      {/* Note */}
      <div className="mb-6 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700">
        Số liệu bảng giá khách hàng là dữ liệu mẫu — chỉnh trực tiếp trong các ô để khớp bảng giá thật.
      </div>

      {/* Grid 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bảng giá khách hàng */}
        <div>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Giá khách hàng (USD)</h2>
            <p className="text-xs text-gray-400 mt-0.5">New · Similar 1 · New Modular · Bonus · Modular Similar</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-400 border-b border-gray-100">
                    <th className="py-3 px-4">Loại</th>
                    <th className="py-3 px-4 text-right">New</th>
                    <th className="py-3 px-4 text-right">Sim. 1</th>
                    <th className="py-3 px-4 text-right">New Mod.</th>
                    <th className="py-3 px-4 text-right">Bonus</th>
                    <th className="py-3 px-4 text-right">Mod. Sim.</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {Object.entries(clientPrices).map(([type, p]) => (
                    <tr key={type} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 px-4 font-medium text-gray-900 whitespace-nowrap">
                        {type}
                      </td>
                      <PriceInput 
                        value={p.new} 
                        onChange={(v) => dispatch(updateClientPrice(type, "new", v))} 
                      />
                      <PriceInput 
                        value={p.similar1} 
                        onChange={(v) => dispatch(updateClientPrice(type, "similar1", v))} 
                      />
                      <PriceInput 
                        value={p.newModular} 
                        onChange={(v) => dispatch(updateClientPrice(type, "newModular", v))} 
                      />
                      <PriceInput 
                        value={p.bonus} 
                        onChange={(v) => dispatch(updateClientPrice(type, "bonus", v))} 
                      />
                      <PriceInput 
                        value={p.modularSimilar} 
                        onChange={(v) => dispatch(updateClientPrice(type, "modularSimilar", v))} 
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bảng giá freelancer */}
        <div>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Giá freelancer (VND)</h2>
            <p className="text-xs text-gray-400 mt-0.5">Price · Bonus · Similar 1 (65–90%) · Similar 2 (90–95%)</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-400 border-b border-gray-100">
                    <th className="py-3 px-4">Loại</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-right">Bonus</th>
                    <th className="py-3 px-4 text-right">Sim. 1</th>
                    <th className="py-3 px-4 text-right">Sim. 2</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {Object.entries(freelancerPrices).map(([type, p]) => (
                    <tr key={type} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 px-4 font-medium text-gray-900 whitespace-nowrap">
                        {type}
                      </td>
                      <PriceInput 
                        value={p.price} 
                        onChange={(v) => dispatch(updateFreelancerPrice(type, "price", v))} 
                      />
                      <PriceInput 
                        value={p.bonus} 
                        onChange={(v) => dispatch(updateFreelancerPrice(type, "bonus", v))} 
                      />
                      <PriceInput 
                        value={p.similar1} 
                        onChange={(v) => dispatch(updateFreelancerPrice(type, "similar1", v))} 
                      />
                      <PriceInput 
                        value={p.similar2} 
                        onChange={(v) => dispatch(updateFreelancerPrice(type, "similar2", v))} 
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Component PriceInput
function PriceInput({ value, onChange }) {
  const [localValue, setLocalValue] = useState(String(value));

  // Cập nhật local value khi prop value thay đổi từ bên ngoài
  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const handleBlur = (e) => {
    const newValue = e.target.value.trim();
    // Chỉ cập nhật nếu giá trị khác rỗng và là số hợp lệ
    if (newValue !== "" && !isNaN(newValue)) {
      onChange(newValue);
    } else {
      // Nếu không hợp lệ, reset về giá trị cũ
      setLocalValue(String(value));
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <td className="py-2.5 px-4 text-right">
      <input
        type="text"
        inputMode="numeric"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="w-full max-w-[80px] ml-auto rounded-md border border-transparent px-2 py-1 text-right font-mono text-sm text-gray-700 tabular-nums hover:border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors bg-transparent hover:bg-gray-50"
      />
    </td>
  );
}
export default Index;