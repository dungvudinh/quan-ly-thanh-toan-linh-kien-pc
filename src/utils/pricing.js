export function fmtUSD(n) {
  return "$" + Number(n).toLocaleString("en-US");
}

export function fmtVND(n) {
  return Number(n).toLocaleString("vi-VN") + " ₫";
}

/**
 * Tra giá đơn vị của 1 model theo loại + trạng thái (New/Similar1/Similar2)
 * dựa trên bảng giá tương ứng (khách hàng hoặc freelancer).
 */
export function priceFor(model, audience, clientPrices, freelancerPrices) {
  const status = String(model.status || "").toLowerCase().replace(/\s+/g, "");
  if (audience === "client") {
    const p = clientPrices[model.type];
    if (!p) return 0;
    if (status === "new") return p.new;
    if (status === "similar1") return p.similar1;
    if (status === "similar2") return p.similar2;
    if (status === "modularsimilar") return p.modularSimilar;
    return p.modular;
  }
  const p = freelancerPrices[model.type];
  if (!p) return 0;
  if (status === "new") return p.new;
  if (status === "similar1") return p.similar1;
  if (status === "similar2") return p.similar2;
  if (status === "modularsimilar") return p.modularSimilar;
  return p.modular;
}

/** Bonus chỉ áp dụng khi deadline là OK. */
export function bonusFor(model, audience, clientPrices, freelancerPrices) {
  if ((model.deadline || "OK") !== "OK") return 0;
  const p = audience === "client" ? clientPrices[model.type] : freelancerPrices[model.type];
  if (!p) return 0;
  return audience === "client" ? p.bonus : p.bonus;
}

export function lineTotal(model, audience, clientPrices, freelancerPrices) {
  return (
    priceFor(model, audience, clientPrices, freelancerPrices) +
    bonusFor(model, audience, clientPrices, freelancerPrices)
  );
}
