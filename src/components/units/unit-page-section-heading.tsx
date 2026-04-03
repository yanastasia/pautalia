type UnitPageSectionHeadingProps = {
  eyebrow: string;
  title: string;
  copy?: string;
};

export function UnitPageSectionHeading({ eyebrow, title, copy }: UnitPageSectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-[2rem] leading-[0.98] text-[color:var(--ink)] sm:text-[2.6rem] lg:text-[3.35rem] xl:text-[3.7rem]">
        {title}
      </h2>
      {copy ? <p className="mt-4 text-[0.98rem] leading-7 text-[color:var(--muted)]">{copy}</p> : null}
    </div>
  );
}
