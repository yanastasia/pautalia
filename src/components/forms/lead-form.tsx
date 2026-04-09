"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { getMessages } from "@/lib/i18n/messages";

type LeadFormProps = {
  unitId?: string;
  buildingId?: string;
  source: string;
  heading?: string;
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
};

export function LeadForm({ unitId, buildingId, source, heading = "Request information" }: LeadFormProps) {
  const locale = useLocale();
  const messages = getMessages(locale);
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();

    const response = await fetch("/api/pautalia/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        unitId,
        buildingId,
        sourcePageUrl: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : source,
        referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
        utmSource: searchParams.get("utm_source") ?? undefined,
        utmMedium: searchParams.get("utm_medium") ?? undefined,
        utmCampaign: searchParams.get("utm_campaign") ?? undefined,
        utmTerm: searchParams.get("utm_term") ?? undefined,
        utmContent: searchParams.get("utm_content") ?? undefined,
        company: String(formData.get("company") ?? ""),
      }),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setForm(initialState);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[color:var(--surface-dark)] px-5 py-6 text-white sm:px-8 sm:py-8">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between md:gap-4 md:pb-6">
        <div className="max-w-xl">
          <p className="font-sans text-xs uppercase tracking-[0.22em] text-[color:var(--accent)]">{messages.leadForm.eyebrow}</p>
          <h3 className="mt-2 font-serif text-[2.15rem] leading-[0.98] text-white sm:text-4xl">{heading}</h3>
          <p className="mt-2 text-sm leading-6 text-white/62 sm:mt-3 sm:leading-7">
            {messages.leadForm.copy}
          </p>
        </div>
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3.5 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-white/58 md:mt-1">
          {messages.leadForm.responsePledge}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:mt-6 md:grid-cols-2">
        <label className="block">
          <span className="premium-label text-white/54">{messages.leadForm.fullName}</span>
          <input
            required
            placeholder="Name"
            value={form.fullName}
            onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
            className="premium-input mt-2 border-white/8 bg-white/8 text-white placeholder:text-white/34"
          />
        </label>
        <label className="block">
          <span className="premium-label text-white/54">{messages.leadForm.email}</span>
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="premium-input mt-2 border-white/8 bg-white/8 text-white placeholder:text-white/34"
          />
        </label>
        <label className="block">
          <span className="premium-label text-white/54">{messages.leadForm.phone}</span>
          <input
            required
            placeholder="Phone"
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            className="premium-input mt-2 border-white/8 bg-white/8 text-white placeholder:text-white/34"
          />
        </label>
        <div className="rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-4 text-sm leading-6 text-white/58">
          {messages.leadForm.contextCopy}
        </div>
        <label className="block md:col-span-2">
          <span className="premium-label text-white/54">{messages.leadForm.message}</span>
          <textarea
            placeholder={messages.leadForm.messagePlaceholder}
            rows={4}
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            className="premium-textarea mt-2 border-white/8 bg-white/8 text-white placeholder:text-white/34"
          />
        </label>
        <input
          tabIndex={-1}
          autoComplete="off"
          name="company"
          defaultValue=""
          className="hidden"
          aria-hidden="true"
        />
        <label className="md:col-span-2 flex items-start gap-3 border-t border-white/10 px-1 py-4 text-sm leading-7 text-white/64">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(event) => setForm((current) => ({ ...current, consent: event.target.checked }))}
            className="mt-1 size-4 rounded border-white/20 bg-transparent"
          />
          <span>{messages.leadForm.consent}</span>
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-4 md:mt-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-white/52">{messages.leadForm.rateLimited}</p>
        <button
          type="submit"
          disabled={status === "submitting" || !form.consent}
          className="premium-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:min-w-[220px]"
        >
          {status === "submitting" ? messages.leadForm.sending : messages.leadForm.submit}
        </button>
      </div>

      <div aria-live="polite">
        {status === "success" ? (
          <p className="mt-4 rounded-[1.2rem] border border-emerald-300/16 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
            {messages.leadForm.success}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="mt-4 rounded-[1.2rem] border border-rose-300/16 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
            {messages.leadForm.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
