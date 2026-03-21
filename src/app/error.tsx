"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: ErrorPageProps) {
  return (
    <section className="section-space">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="page-simple-card">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">Data unavailable</p>
          <h1 className="mt-4 font-serif text-4xl text-[color:var(--ink)]">We could not load the latest data.</h1>
          <p className="mt-4 max-w-2xl text-[color:var(--muted)]">
            Try again. If the issue continues, the public API may be temporarily unavailable.
          </p>
          <button type="button" onClick={() => reset()} className="premium-button mt-8">
            Retry
          </button>
        </div>
      </div>
    </section>
  );
}
