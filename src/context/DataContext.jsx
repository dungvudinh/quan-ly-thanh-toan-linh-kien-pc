import { createContext, useContext, useState, useCallback } from "react";
import { initialModels, initialClientPrices, initialFreelancerPrices } from "../data/mockData.js";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [models, setModels] = useState(initialModels);
  const [clientPrices, setClientPrices] = useState(initialClientPrices);
  const [freelancerPrices, setFreelancerPrices] = useState(initialFreelancerPrices);
  const [clientInvoiceIds, setClientInvoiceIds] = useState([]);
  const [freelancerInvoiceIds, setFreelancerInvoiceIds] = useState([]);

  const addToInvoice = useCallback((audience, modelId) => {
    const setter = audience === "client" ? setClientInvoiceIds : setFreelancerInvoiceIds;
    setter((prev) => (prev.includes(modelId) ? prev : [...prev, modelId]));
  }, []);

  const removeFromInvoice = useCallback((audience, modelId) => {
    const setter = audience === "client" ? setClientInvoiceIds : setFreelancerInvoiceIds;
    setter((prev) => prev.filter((id) => id !== modelId));
  }, []);

  // Đánh dấu toàn bộ model trong hóa đơn hiện tại là đã thanh toán.
  const markInvoicePaid = useCallback(
    (audience) => {
      const ids = audience === "client" ? clientInvoiceIds : freelancerInvoiceIds;
      if (ids.length === 0) return false;
      setModels((prev) =>
        prev.map((m) =>
          ids.includes(m.id)
            ? { ...m, [audience === "client" ? "clientPaid" : "freelancerPaid"]: true }
            : m
        )
      );
      return true;
    },
    [clientInvoiceIds, freelancerInvoiceIds]
  );

  const updateClientPrice = useCallback((type, field, value) => {
    setClientPrices((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: Number(value) || 0 },
    }));
  }, []);

  const updateFreelancerPrice = useCallback((type, field, value) => {
    setFreelancerPrices((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: Number(value) || 0 },
    }));
  }, []);

  const value = {
    models,
    clientPrices,
    freelancerPrices,
    clientInvoiceIds,
    freelancerInvoiceIds,
    addToInvoice,
    removeFromInvoice,
    markInvoicePaid,
    updateClientPrice,
    updateFreelancerPrice,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData phải được gọi bên trong <DataProvider>");
  return ctx;
}
