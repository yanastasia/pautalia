export default function Loading() {
  return (
    <section className="section-space">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="page-simple-card">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">Loading</p>
          <h1 className="mt-4 font-serif text-4xl text-[color:var(--ink)]">Preparing the latest availability.</h1>
          <p className="mt-4 max-w-2xl text-[color:var(--muted)]">
            Please wait while the page loads the current building and apartment data.
          </p>
        </div>
      </div>
    </section>
  );
}
