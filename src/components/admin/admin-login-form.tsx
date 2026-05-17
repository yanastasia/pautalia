"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { getMessages } from "@/lib/i18n/messages";

type LoginState = "idle" | "submitting" | "error" | "not-configured" | "totp";

export function AdminLoginForm({ isConfigured }: { isConfigured: boolean }) {
  const locale = useLocale();
  const messages = getMessages(locale);
  const [state, setState] = useState<LoginState>(isConfigured ? "idle" : "not-configured");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured) return;

    setState("submitting");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });

    if (response.ok) {
      window.location.assign("/admin");
      return;
    }

    if (response.status === 401) {
      const body = await response.json().catch(() => null) as { requiresTotp?: boolean } | null;
      setState(body?.requiresTotp ? "totp" : "error");
      return;
    }

    setState(response.status === 503 ? "not-configured" : "error");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-5 rounded-[var(--radius-xl)] card-surface p-6">
      <div>
        <label htmlFor="admin-username" className="premium-label text-[color:var(--muted)]">
          {messages.admin.username}
        </label>
        <input
          id="admin-username"
          name="username"
          type="text"
          autoComplete="username"
          disabled={!isConfigured || state === "submitting"}
          className="mt-3 w-full rounded-full border border-[rgba(16,18,20,0.14)] bg-white px-5 py-3 text-base text-[color:var(--ink)] outline-none transition focus:border-[color:var(--accent)]"
          required
        />
      </div>

      <div>
        <label htmlFor="admin-password" className="premium-label text-[color:var(--muted)]">
          {messages.admin.password}
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          disabled={!isConfigured || state === "submitting"}
          className="mt-3 w-full rounded-full border border-[rgba(16,18,20,0.14)] bg-white px-5 py-3 text-base text-[color:var(--ink)] outline-none transition focus:border-[color:var(--accent)]"
          required
        />
      </div>

      {state === "totp" ? (
        <div>
          <label htmlFor="admin-totp" className="premium-label text-[color:var(--muted)]">
            {messages.admin.totp}
          </label>
          <input
            id="admin-totp"
            name="totp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="mt-3 w-full rounded-full border border-[rgba(16,18,20,0.14)] bg-white px-5 py-3 text-base text-[color:var(--ink)] outline-none transition focus:border-[color:var(--accent)]"
            required
          />
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!isConfigured || state === "submitting"}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[color:var(--ink)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[color:var(--accent)] disabled:cursor-not-allowed disabled:opacity-55"
      >
        {state === "submitting" ? messages.admin.signingIn : messages.admin.signIn}
      </button>

      {state === "error" ? <p className="text-sm text-red-700">{messages.admin.loginError}</p> : null}
      {state === "totp" ? <p className="text-sm text-[color:var(--muted)]">{messages.admin.totpHelp}</p> : null}
      {state === "not-configured" ? <p className="text-sm text-red-700">{messages.admin.notConfigured}</p> : null}
    </form>
  );
}
