import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

const salesEmail = "sales@pautalia.com";

type LeadEmailInput = {
  leadId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  unitCode?: string | null;
  sourcePageUrl: string;
  message?: string | null;
};

async function sendEmail({ to, subject, html, tag }: { to: string; subject: string; html: string; tag: string }) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    logger.warn("email.not_configured", { to, subject });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      tags: [
        {
          name: "category",
          value: tag,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend failed with status ${response.status}`);
  }
}

export async function sendLeadEmails(input: LeadEmailInput) {
  const unitLine = input.unitCode ? `<p><strong>Interest:</strong> ${input.unitCode}</p>` : "";

  const buyerHtml = `
    <p>Hello ${input.fullName},</p>
    <p>Thank you for your enquiry about Pautalia Residence. The sales team will follow up with you soon.</p>
    ${unitLine}
    <p>Reference: ${input.leadId}</p>
  `;

  const adminHtml = `
    <p><strong>New Pautalia lead</strong></p>
    <p><strong>Name:</strong> ${input.fullName}</p>
    <p><strong>Email:</strong> ${input.email}</p>
    <p><strong>Phone:</strong> ${input.phone ?? ""}</p>
    ${unitLine}
    <p><strong>Source:</strong> ${input.sourcePageUrl}</p>
    <p><strong>Message:</strong></p>
    <p>${input.message ?? ""}</p>
  `;

  await Promise.all([
    sendEmail({
      to: input.email,
      subject: "Your Pautalia enquiry was received",
      html: buyerHtml,
      tag: "inquiry",
    }),
    sendEmail({
      to: salesEmail,
      subject: `[ADMIN][INQUIRY] ${input.unitCode ?? "Pautalia"} - New lead from ${input.fullName}`,
      html: adminHtml,
      tag: "admin-inquiry",
    }),
  ]);
}
