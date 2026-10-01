// components/Index.jsx
import { useSelector, useDispatch } from "react-redux";
import { 
  updateClientPrice, 
  updateFreelancerPrice,
  addClientRow,
  deleteClientRow,
  addFreelancerRow,
  deleteFreelancerRow
} from "../../redux/actions/priceActions.js";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

function Index() {
  const dispatch = useDispatch();
  const clientPrices = useSelector((state) => state.clientPrices);
  const freelancerPrices = useSelector((state) => state.freelancerPrices);



  // State cho ô nhập tên loại mới
  const [newClientType, setNewClientType] = useState('');
  const [newFreelancerType, setNewFreelancerType] = useState('');

  // Handlers cho thêm dòng
  const handleAddClientRow = () => {
    if (newClientType.trim() && !clientPrices[newClientType.trim()]) {
      dispatch(addClientRow(newClientType.trim()));
      setNewClientType('');
    } else {
      alert('Tên loại không được để trống hoặc đã tồn tại!');
    }
  };

  const handleAddFreelancerRow = () => {
    if (newFreelancerType.trim() && !freelancerPrices[newFreelancerType.trim()]) {
      dispatch(addFreelancerRow(newFreelancerType.trim()));
      setNewFreelancerType('');
    } else {
      alert('Tên loại không được để trống hoặc đã tồn tại!');
    }
  };

  // Handlers cho xóa dòng
  const handleDeleteClientRow = (type) => {
    if (window.confirm(`Xóa dòng "${type}"?`)) {
      dispatch(deleteClientRow(type));
    }
  };

  const handleDeleteFreelancerRow = (type) => {
    if (window.confirm(`Xóa dòng "${type}"?`)) {
      dispatch(deleteFreelancerRow(type));
    }
  };

  return (
    <section className="px-8 py-8 mx-auto">
      {/* Header và Note giữ nguyên ... */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bảng giá khách hàng (USD) */}
        <div>
          {/* Phần header và input thêm mới */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Giá khách hàng (USD)</h2>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Thêm loại mới..."
                value={newClientType}
                onChange={(e) => setNewClientType(e.target.value)}
                className="px-3 py-2 rounded-full border border-neutral-200 bg-neutral-50 text-sm w-40 text-neutral-700 outline-none"
              />
              <button
                    onClick={handleAddClientRow}
                    className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors duration-150 bg-neutral-50 cursor-pointer"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Thêm
                </button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-400 border-b border-gray-100">
                    <th className="py-3 px-4">Loại</th>
                    <th className="py-3 px-4 text-right">New</th>
                    <th className="py-3 px-4 text-right">Sim. 1</th>
                    <th className="py-3 px-4 text-right">Sim. 2</th>
                    <th className="py-3 px-4 text-right">Modular</th>
                    <th className="py-3 px-4 text-right">Bonus</th>
                    <th className="py-3 px-4 text-center w-16">Hành động</th>
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
                        value={p.similar2} 
                        onChange={(v) => dispatch(updateClientPrice(type, "similar2", v))} 
                      />
                      <PriceInput 
                        value={p.modular} 
                        onChange={(v) => dispatch(updateClientPrice(type, "modular", v))} 
                      />
                      <PriceInput 
                        value={p.bonus} 
                        onChange={(v) => dispatch(updateClientPrice(type, "bonus", v))} 
                      />
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteClientRow(type)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bảng giá freelancer (VND) - Tương tự */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Giá freelancer (VND)</h2>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Thêm loại mới..."
                value={newFreelancerType}
                onChange={(e) => setNewFreelancerType(e.target.value)}
                className="px-3 py-2 rounded-full border border-neutral-200 bg-neutral-50 text-sm w-40 text-neutral-700 outline-none"
              />
              <button
                    onClick={handleAddFreelancerRow}
                    className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors duration-150 bg-neutral-50 cursor-pointer"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Thêm
                </button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-400 border-b border-gray-100">
                    <th className="py-3 px-4">Loại</th>
                    <th className="py-3 px-4 text-right">News</th>
                    <th className="py-3 px-4 text-right">Sim. 1</th>
                    <th className="py-3 px-4 text-right">Sim. 2</th>
                    <th className="py-3 px-4 text-right">Modular</th>
                    <th className="py-3 px-4 text-right">Bonus</th>
                    <th className="py-3 px-4 text-center w-16">Hành động</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {Object.entries(freelancerPrices).map(([type, p]) => (
                    <tr key={type} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 px-4 font-medium text-gray-900 whitespace-nowrap">
                        {type}
                      </td>
                      <PriceInput 
                        value={p.new} 
                        onChange={(v) => dispatch(updateFreelancerPrice(type, "new", v))} 
                      />
                      <PriceInput 
                        value={p.similar1} 
                        onChange={(v) => dispatch(updateFreelancerPrice(type, "similar1", v))} 
                      />
                      <PriceInput 
                        value={p.similar2} 
                        onChange={(v) => dispatch(updateFreelancerPrice(type, "similar2", v))} 
                      />
                      <PriceInput 
                        value={p.modular} 
                        onChange={(v) => dispatch(updateFreelancerPrice(type, "modular", v))} 
                      />
                      <PriceInput 
                        value={p.bonus} 
                        onChange={(v) => dispatch(updateFreelancerPrice(type, "bonus", v))} 
                      />
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteFreelancerRow(type)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </td>
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

// Component PriceInput (giữ nguyên)
function PriceInput({ value, onChange }) {
  const [localValue, setLocalValue] = useState(String(value));

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const handleBlur = (e) => {
    const newValue = e.target.value.trim();
    if (newValue !== "" && !isNaN(newValue)) {
      onChange(newValue);
    } else {
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