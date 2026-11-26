export function DeadlineBadge({ status }) {
  const ok = status === "OK";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        ok ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
      ].join(" ")}
    >
      <span className={["h-1.5 w-1.5 rounded-full", ok ? "bg-emerald-500" : "bg-rose-500"].join(" ")} />
      {ok ? "OK" : "Miss"}
    </span>
  );
}

export function InvoiceStatusBadge({ status }) {
  const styles = {
    paid: "bg-emerald-50 text-emerald-600",
    unpaid: "bg-amber-50 text-amber-600",
    notInitialized: "bg-gray-100 text-gray-500",
  };
  const labels = {
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
    notInitialized: "Chưa khởi tạo",
  };
  const initialized = status !== "notInitialized";

  return (
    <span className={["inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium", styles[status] || styles.notInitialized].join(" ")}>
      <span className={["h-1.5 w-1.5 rounded-full", initialized ? (status === "paid" ? "bg-emerald-500" : "bg-amber-500") : "bg-gray-400"].join(" ")} />
      {labels[status] || labels.notInitialized}
    </span>
  );
}

export function PaidBadge({ paid, paidLabel = "Đã thanh toán", pendingLabel = "Chưa thanh toán" }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        paid ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600",
      ].join(" ")}
    >
      <span className={["h-1.5 w-1.5 rounded-full", paid ? "bg-emerald-500" : "bg-amber-500"].join(" ")} />
      {paid ? paidLabel : pendingLabel}
    </span>
  );
}
