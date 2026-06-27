import { redirect } from "next/navigation";
import { isHostAuthenticated } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  if (!(await isHostAuthenticated())) {
    redirect("/host/login");
  }

  return <DashboardClient />;
}
