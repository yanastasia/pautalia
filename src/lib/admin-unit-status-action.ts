"use server";

import { requireAdminSession } from "@/lib/admin-api";
import { adminUnitStatuses, revalidateAdminCrm, updateAdminUnitStatus } from "@/lib/admin-data";

export async function saveAdminUnitStatus(_previous: { result: string }, formData: FormData) {
  await requireAdminSession();
  const id = formData.get("id");
  const status = adminUnitStatuses.find((item) => item === formData.get("status"));
  if (typeof id !== "string" || !id || !status) return { result: "error" };

  try {
    await updateAdminUnitStatus(id, status);
  } catch {
    return { result: "error" };
  }

  revalidateAdminCrm();
  return { result: "saved", status };
}
