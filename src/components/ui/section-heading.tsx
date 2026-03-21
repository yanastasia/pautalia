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
        <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-[color:var(--muted)] ${align === "center" ? "text-center" : ""}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-4 font-serif text-5xl leading-[0.96] text-[color:var(--ink)] sm:text-6xl">{title}</h2>
      {copy ? <div className="mt-5 text-[1.02rem] leading-8 text-[color:var(--muted)]">{copy}</div> : null}
    </div>
  );
}
