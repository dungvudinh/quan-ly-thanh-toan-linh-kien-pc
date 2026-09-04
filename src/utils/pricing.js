import { BONUS_TYPES } from "../data/mockData.js";

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
  if (audience === "client") {
    const p = clientPrices[model.type];
    if (!p) return 0;
    if (model.status === "New") return p.new;
    if (model.status === "Similar1") return p.similar1;
    return p.newModular;
  }
  const p = freelancerPrices[model.type];
  if (!p) return 0;
  if (model.status === "New") return p.price;
  if (model.status === "Similar1") return p.similar1;
  return p.similar2;
}

/**
 * Bonus chỉ áp dụng khi: trạng thái = New, deadline = OK,
 * và loại thuộc { Mainboard, Case, VGA }.
 */
export function bonusFor(model, audience, clientPrices, freelancerPrices) {
  if (model.status !== "New" || model.deadline !== "OK") return 0;
  if (!BONUS_TYPES.includes(model.type)) return 0;
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
