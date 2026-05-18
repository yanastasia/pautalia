import { redirect } from "next/navigation";

export default async function UnitRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/units/${id}`);
}
