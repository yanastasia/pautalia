import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  copy?: ReactNode;
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, copy, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className={`text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)] sm:text-[0.72rem] sm:tracking-[0.34em] ${align === "center" ? "text-center" : ""}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-4 font-serif text-[2.15rem] leading-[0.98] text-[color:var(--ink)] sm:text-5xl sm:leading-[0.96] lg:text-6xl">{title}</h2>
      {copy ? <div className="mt-5 text-base leading-7 text-[color:var(--muted)] sm:text-[1.02rem] sm:leading-8">{copy}</div> : null}
    </div>
  );
}
