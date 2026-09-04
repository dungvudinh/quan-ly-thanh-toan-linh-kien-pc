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
