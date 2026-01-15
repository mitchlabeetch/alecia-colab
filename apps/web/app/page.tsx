import nextDynamic from "next/dynamic";

// Force this page to be dynamic (not pre-rendered)
// This prevents SSG which would fail without providers
export const dynamic = "force-dynamic";

// Dynamic import the client page - force-dynamic ensures runtime execution
const ClientPage = nextDynamic(() => import("./ClientPage"), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-lg">Chargement...</div>
    </div>
  ),
});

export default function Page() {
  return <ClientPage />;
}
