import Dashboard from "./Dashboard";

// Force dynamic rendering to avoid SSG issues with Clerk
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return <Dashboard />;
}
