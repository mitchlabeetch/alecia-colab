import { redirect } from "next/navigation";

// Force this page to be dynamic (not pre-rendered)
// This prevents SSG which would fail without providers
export const dynamic = "force-dynamic";

export default function Page() {
  // Root page redirects to dashboard
  redirect("/dashboard");
}
