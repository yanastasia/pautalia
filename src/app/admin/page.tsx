import { SectionHeading } from "@/components/ui/section-heading";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminLeads, getAdminUnits } from "@/lib/admin-data";
import { hasAdminSession, isAdminLoginConfigured } from "@/lib/admin-auth";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

async function getAdminDashboardData() {
  const [leads, units] = await Promise.all([getAdminLeads(undefined, 12), getAdminUnits()]);
  const apartmentUnits = units.filter((unit) => unit.kind === "apartment");
  const soldUnits = apartmentUnits.filter((unit) => unit.status === "sold").length;
  const availableUnits = apartmentUnits.filter((unit) => unit.status === "available").length;

  return {
    leads,
    units: units.slice(0, 8),
    leadCount: leads.length,
    unitCount: soldUnits,
    availableUnitCount: availableUnits,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === "bg" ? "Админ" : "Admin",
    description:
      locale === "bg"
        ? "Вътрешна зона за управление на запитвания, наличности и съдържание."
        : "Internal area for managing enquiries, availability, and content.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const isAuthenticated = hasAdminSession(await cookies());

  if (isAuthenticated) {
    const { leads, units, leadCount, unitCount, availableUnitCount } = await getAdminDashboardData();

    return (
      <section className="section-space">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdminDashboard
            counts={{
              leads: leadCount,
              units: unitCount,
              availableUnits: availableUnitCount,
            }}
            leads={leads}
            units={units}
            locale={locale}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="section-space">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={messages.admin.eyebrow}
          title={messages.admin.title}
        />

        <AdminLoginForm isConfigured={isAdminLoginConfigured()} />
      </div>
    </section>
  );
}
