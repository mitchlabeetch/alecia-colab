"use client";

/**
 * Dashboard Page - Main home page
 * Features: Welcome message, quick actions, recent documents, activity feed
 */

import { RecentFiles } from "@/components/recent-files";
import { Button } from "@/components/tailwind/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { Separator } from "@/components/tailwind/ui/separator";
import { useDeals, useDocuments } from "@/hooks/use-convex";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { fr, t } from "@/lib/i18n";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useUser } from "@clerk/nextjs";
import {
  ArrowRight,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  LayoutDashboard,
  Users,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const quickActions = [
  {
    icon: Briefcase,
    label: fr.dashboard.quickAction.deal,
    href: "/pipeline",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: FileText,
    label: fr.dashboard.quickAction.document,
    href: "/documents",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Building,
    label: fr.dashboard.quickAction.company,
    href: "/companies",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Users,
    label: fr.dashboard.quickAction.contact,
    href: "https://alecia.markets/admin/crm/contacts",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const getTimestamp = (timestamp?: number, fallback?: number) => timestamp ?? fallback ?? 0;

const isDealNew = (deal: { updatedAt?: number; createdAt?: number }) =>
  !deal.updatedAt || deal.updatedAt === deal.createdAt;

const getInitials = (name?: string) => {
  if (!name) return "?";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2) || "?"
  );
};

export default function Dashboard() {
  const [hasAuth, setHasAuth] = useState(false);

  // Safe check for Clerk environment
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      setHasAuth(true);
    }
  }, []);

  return hasAuth ? <DashboardContent /> : <DashboardContentMock />;
}

function DashboardContent() {
  const { user, isLoaded } = useUser();
  const { documents, isLoading: documentsLoading, isConvexAvailable: isDocumentsAvailable } = useDocuments(user?.id);
  const { deals, isLoading: dealsLoading, isConvexAvailable: isDealsAvailable } = useDeals(user?.id);

  // Reuse logic...
  // To avoid duplicating huge code blocks, I should have extracted the main logic.
  // But given constraints, I will keep it inline in this component
  // and have a mock component that doesn't use hooks.
  // Actually, I can just use a conditional hook call? No, that's illegal in React.
  // So splitting is correct.

  // Wait, duplicating the whole logic is bad.
  // I will refactor DashboardContent to accept user/data as props or use hooks if auth is present.
  // But useUser throws if not in provider.
  // So DashboardContent MUST be a separate component that is only rendered if auth is present.

  // However, I need to copy the logic.
  // Since I can't easily extract all the logic without rewriting a lot,
  // I will just use the existing logic for DashboardContent
  // and create a simplified mock for the "no-auth" case (dev environment).

  const isDocumentsLoading = documentsLoading && isDocumentsAvailable;
  const isDealsLoading = dealsLoading && isDealsAvailable;
  const isDataLoading = !isLoaded || isDocumentsLoading || isDealsLoading;
  const activeDocuments = useMemo(() => documents.filter((document) => !document.isArchived), [documents]);
  const activeDeals = useMemo(() => deals.filter((deal) => !deal.isArchived), [deals]);
  const inProgressDeals = useMemo(
    () => activeDeals.filter((deal) => !["closed-won", "closed-lost"].includes(deal.stage)),
    [activeDeals],
  );
  const closedDeals = useMemo(
    () => activeDeals.filter((deal) => ["closed-won", "closed-lost"].includes(deal.stage)),
    [activeDeals],
  );
  const displayName = user?.fullName || user?.firstName || user?.username || "Utilisateur";

  const memberIds = useMemo(() => {
    const ids = new Set<string>();
    if (user?.id) {
      ids.add(user.id);
    }
    activeDocuments.forEach((document) => {
      if (document.userId) {
        ids.add(document.userId);
      }
    });
    activeDeals.forEach((deal) => {
      if (deal.userId) {
        ids.add(deal.userId);
      }
    });
    return ids;
  }, [activeDocuments, activeDeals, user?.id]);

  const getDocumentTimestamp = (document: (typeof documents)[number]) =>
    getTimestamp(document.updatedAt, document.createdAt ?? document._creationTime);
  const getDealTimestamp = (deal: (typeof deals)[number]) =>
    getTimestamp(deal.updatedAt, deal.createdAt ?? deal._creationTime);

  const recentDocuments = useMemo(
    () =>
      activeDocuments
        .map((document) => {
          const timestamp = getDocumentTimestamp(document);
          return {
            id: document._id,
            title: document.title || t("editor.untitled"),
            description: document.dealId ? fr.dashboard.documentLinkedToDeal : fr.dashboard.documentCollaboration,
            time: formatRelativeTime(timestamp),
            collaborators: document.userId ? 1 : 0,
            href: `/documents/${document._id}`,
            timestamp,
          };
        })
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 3),
    [activeDocuments],
  );

  const activityFeed = useMemo(
    () =>
      [
        ...activeDocuments.map((document) => {
          const timestamp = getDocumentTimestamp(document);
          return {
            id: `document-${document._id}`,
            user: document.userId === user?.id ? displayName : fr.common.collaborator,
            action: fr.activity.updatedDocument,
            target: document.title || t("editor.untitled"),
            time: formatRelativeTime(timestamp),
            timestamp,
          };
        }),
        ...activeDeals.map((deal) => {
          const timestamp = getDealTimestamp(deal);
          const isNewDeal = isDealNew(deal);
          return {
            id: `deal-${deal._id}`,
            user: deal.lead || (deal.userId === user?.id ? displayName : fr.common.team),
            action: isNewDeal ? fr.activity.createdDeal : fr.activity.updatedDeal,
            target: deal.company,
            time: formatRelativeTime(timestamp),
            timestamp,
          };
        }),
      ]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5),
    [activeDeals, activeDocuments, displayName, user?.id],
  );

  const initialStats = [
    {
      id: "deals",
      label: fr.dashboard.stats.dealsInProgress,
      value: isDataLoading ? "—" : inProgressDeals.length.toString(),
      icon: Briefcase,
      trend: isDataLoading ? fr.loader.loading : `${activeDeals.length} ${fr.common.total}`,
      color: "text-blue-500",
    },
    {
      id: "documents",
      label: fr.dashboard.stats.documentsCreated,
      value: isDataLoading ? "—" : activeDocuments.length.toString(),
      icon: FileText,
      trend: isDataLoading
        ? fr.loader.loading
        : recentDocuments[0]
          ? `${fr.dashboard.lastUpdate} ${recentDocuments[0].time}`
          : fr.dashboard.noDocuments,
      color: "text-green-500",
    },
    {
      id: "members",
      label: fr.dashboard.stats.teamMembers,
      value: isDataLoading ? "—" : memberIds.size.toString(),
      icon: Users,
      trend: isDataLoading ? fr.loader.loading : memberIds.size > 0 ? fr.dashboard.activeTeam : fr.dashboard.noMembers,
      color: "text-purple-500",
    },
    {
      id: "tasks",
      label: fr.dashboard.stats.tasksCompleted,
      value: isDataLoading ? "—" : closedDeals.length.toString(),
      icon: CheckCircle2,
      trend: isDataLoading
        ? fr.loader.loading
        : closedDeals.length > 0
          ? `${closedDeals.length} ${fr.dashboard.dealsClosed}`
          : fr.dashboard.noClosedDeals,
      color: "text-orange-500",
    },
  ];

  return (
    <DashboardUI
      isLoaded={isLoaded}
      user={user}
      initialStats={initialStats}
      recentDocuments={recentDocuments}
      activityFeed={activityFeed}
      isDocumentsLoading={isDocumentsLoading}
      isDataLoading={isDataLoading}
    />
  );
}

// Mock content for dev/no-auth environment
function DashboardContentMock() {
  const initialStats = [
    {
      id: "deals",
      label: fr.dashboard.stats.dealsInProgress,
      value: "12",
      icon: Briefcase,
      trend: `15 ${fr.common.total}`,
      color: "text-blue-500",
    },
    {
      id: "documents",
      label: fr.dashboard.stats.documentsCreated,
      value: "8",
      icon: FileText,
      trend: `${fr.dashboard.lastUpdate} 2h ago`,
      color: "text-green-500",
    },
    {
      id: "members",
      label: fr.dashboard.stats.teamMembers,
      value: "4",
      icon: Users,
      trend: fr.dashboard.activeTeam,
      color: "text-purple-500",
    },
    {
      id: "tasks",
      label: fr.dashboard.stats.tasksCompleted,
      value: "5",
      icon: CheckCircle2,
      trend: `5 ${fr.dashboard.dealsClosed}`,
      color: "text-orange-500",
    },
  ];

  return (
    <DashboardUI
      isLoaded={true}
      user={{ firstName: "Demo", username: "User" } as any}
      initialStats={initialStats}
      recentDocuments={[]}
      activityFeed={[]}
      isDocumentsLoading={false}
      isDataLoading={false}
    />
  );
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Bonjour";
  if (hour >= 12 && hour < 14) return "Bon Appétit";
  if (hour >= 14 && hour < 18) return "Bon après-midi";
  if (hour >= 18 && hour < 22) return "Bonne soirée";
  return "Bonne nuit";
};

// UI Component to share layout
function DashboardUI({ isLoaded, user, initialStats, recentDocuments, activityFeed, isDocumentsLoading, isDataLoading }: any) {
  const [stats, setStats] = useState(initialStats);
  const greeting = getGreeting();

  useEffect(() => {
    // Update stats when initialStats change (e.g. data loading)
    // Only update values, preserve order
    const updatedStats = stats.map(s => {
      const newStat = initialStats.find((is: any) => is.id === s.id);
      return newStat ? { ...s, ...newStat } : s;
    });
    setStats(updatedStats);
  }, [initialStats]); // Careful with dependency loop, strictly we should use deep comparison or just ids

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(stats);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setStats(items);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold">
          {greeting}
          {isLoaded && user && <span className="text-primary">, {user.firstName || user.username}</span>}
        </h1>
        <p className="mt-2 text-muted-foreground">{fr.dashboard.welcomeMessage}</p>
      </motion.div>

      {/* Stats Grid (DnD) */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="stats" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {stats.map((stat: any, index: number) => {
                const Icon = stat.icon;
                return (
                  <Draggable key={stat.id} draggableId={stat.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                         <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <Icon className={`h-4 w-4 ${stat.color}`} />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.trend}</p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Recent Files & Quick Navigation - Moved ABOVE Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Recent Files Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{fr.dashboard.recentDocuments}</CardTitle>
            <CardDescription>{fr.dashboard.recentDocumentsDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
              <RecentFiles limit={5} showCreateButton={true} />
            ) : (
              <div className="text-sm text-muted-foreground">{fr.dashboard.recentFilesUnavailable}</div>
            )}
          </CardContent>
        </Card>

        {/* Quick Navigation Card */}
        <Card>
          <CardHeader>
            <CardTitle>{fr.dashboard.quickNavigation}</CardTitle>
            <CardDescription>{fr.dashboard.quickNavigationDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="https://alecia.markets/admin/dashboard" target="_blank" rel="noopener noreferrer">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {fr.dashboard.adminDashboard}
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="https://alecia.markets/admin/crm/contacts" target="_blank" rel="noopener noreferrer">
                <Users className="h-4 w-4 mr-2" />
                {fr.dashboard.crmContacts}
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="https://alecia.markets/admin/crm/companies" target="_blank" rel="noopener noreferrer">
                <Building className="h-4 w-4 mr-2" />
                {fr.dashboard.companies}
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="https://alecia.markets" target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                {fr.dashboard.website}
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions - Revised: Smaller, No Title, More Comprehensive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex gap-4 overflow-x-auto pb-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <div className="flex flex-col items-center gap-2 group cursor-pointer min-w-[80px]">
                  <div className={`w-10 h-10 rounded-full ${action.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{action.label}</span>
                </div>
              </Link>
            );
          })}
          {/* Add more generic entry button */}
           <div className="flex flex-col items-center gap-2 group cursor-pointer min-w-[80px]">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-transform group-hover:scale-110">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{fr.dashboard.quickAction.other}</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{fr.dashboard.recentDocuments}</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/documents">
                    {fr.dashboard.viewAll} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isDocumentsLoading ? (
                <p className="text-sm text-muted-foreground">{fr.loader.loading}</p>
              ) : recentDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground">{fr.nav.noRecentDocuments}</p>
              ) : (
                <div className="space-y-4">
                  {recentDocuments.map((doc: any, index: number) => (
                    <div key={doc.id}>
                      <Link href={doc.href} className="block">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{doc.title}</h4>
                              <p className="text-sm text-muted-foreground">{doc.description}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {doc.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {doc.collaborators}{" "}
                                  {doc.collaborators === 1
                                    ? fr.common.collaboratorSingle
                                    : fr.common.collaboratorPlural}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      {index < recentDocuments.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{fr.dashboard.activityFeed}</CardTitle>
            </CardHeader>
            <CardContent>
              {isDataLoading ? (
                <p className="text-sm text-muted-foreground">{fr.loader.loading}</p>
              ) : activityFeed.length === 0 ? (
                <p className="text-sm text-muted-foreground">{fr.dashboard.noRecentActivity}</p>
              ) : (
                <div className="space-y-4">
                  {activityFeed.map((activity: any) => {
                    const initials = getInitials(activity.user);
                    return (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {initials || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>{" "}
                            <span className="text-muted-foreground">{activity.action}</span>{" "}
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
