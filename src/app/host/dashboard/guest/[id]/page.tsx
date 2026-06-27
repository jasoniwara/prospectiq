import { redirect } from "next/navigation";
import { isHostAuthenticated } from "@/lib/auth";
import GuestDetailClient from "./GuestDetailClient";

export default async function GuestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isHostAuthenticated())) {
    redirect("/host/login");
  }
  const { id } = await params;
  return <GuestDetailClient guestId={id} />;
}
