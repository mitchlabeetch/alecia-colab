import DashboardPage from "./dashboard/page";

// Force this page to be dynamic (not pre-rendered)
// This prevents SSG which would fail without providers
export const dynamic = "force-dynamic";

export default function Page() {
  return <DashboardPage />;
}
