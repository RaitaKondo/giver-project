type StatePanelProps = {
  message: string;
  tone?: "neutral" | "error";
};

export function StatePanel({ message, tone = "neutral" }: StatePanelProps) {
  const className =
    tone === "error"
      ? "rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700"
      : "rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500";

  return <div className={className}>{message}</div>;
}
