import { cn } from "@/lib/utils";

export function LanguageSwitcher({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const darkSurface = variant === "dark";

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-2 py-1.5",
        darkSurface ? "border-white/12 bg-white/6" : "border-[color:var(--line)] bg-white/72 shadow-[0_10px_28px_rgba(13,14,16,0.05)]",
      )}
    >
      <span
        className={cn(
          "rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em]",
          darkSurface ? "bg-white/14 text-white" : "bg-[color:var(--surface-dark)] text-white",
        )}
      >
        BG
      </span>
    </div>
  );
}
