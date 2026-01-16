"use client";

/**
 * Dashboard Page - Main home page
 * Features: Welcome message, quick actions, recent documents, activity feed
 */

import { motion } from "motion/react";
import { useUser } from "@clerk/nextjs";
import {
  FileText,
  Briefcase,
  Building,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { Button } from "@/components/tailwind/ui/button";
import { Separator } from "@/components/tailwind/ui/separator";
import { useDeals, useDocuments } from "@/hooks/use-convex";
import { fr } from "@/lib/i18n";

const quickActions = [
  {
    icon: Briefcase,
    label: fr.actions.newDeal,
    description: "Créer un nouveau deal dans le pipeline",
    href: "/pipeline",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: FileText,
    label: fr.actions.newDocument,
    description: "Créer un nouveau document de collaboration",
    href: "/documents",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Building,
    label: fr.actions.newCompanyProfile,
    description: "Ajouter un profil d'entreprise",
    href: "/companies",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const formatRelativeTime = (timestamp?: number) => {
  if (!timestamp) return fr.loader.loading;
  const diff = Math.max(Date.now() - timestamp, 0);
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;

  const days = Math.floor(hours / 24);
  return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
};

const getTimestamp = (timestamp?: number, fallback?: number) =>
  timestamp ?? fallback ?? 0;

export default function Dashboard() {
  const isClerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const { user, isLoaded } = isClerkEnabled
    ? useUser()
    : { user: null, isLoaded: true };
  const {
    documents,
    isLoading: documentsLoading,
    isConvexAvailable: isDocumentsAvailable,
  } = useDocuments(user?.id);
  const {
    deals,
    isLoading: dealsLoading,
    isConvexAvailable: isDealsAvailable,
  } = useDeals(user?.id);

  const isDocumentsLoading = documentsLoading && isDocumentsAvailable;
  const isDealsLoading = dealsLoading && isDealsAvailable;
  const isDataLoading = !isLoaded || isDocumentsLoading || isDealsLoading;
  const activeDocuments = documents.filter((document) => !document.isArchived);
  const activeDeals = deals.filter((deal) => !deal.isArchived);
  const inProgressDeals = activeDeals.filter(
    (deal) => !["closed-won", "closed-lost"].includes(deal.stage)
  );
  const closedDeals = activeDeals.filter((deal) =>
    ["closed-won", "closed-lost"].includes(deal.stage)
  );
  const displayName =
    user?.fullName || user?.firstName || user?.username || "Utilisateur";

  const memberIds = new Set<string>();
  if (user?.id) {
    memberIds.add(user.id);
  }
  activeDocuments.forEach((document) => {
    if (document.userId) {
      memberIds.add(document.userId);
    }
  });
  activeDeals.forEach((deal) => {
    if (deal.userId) {
      memberIds.add(deal.userId);
    }
  });

  const getDocumentTimestamp = (document: (typeof documents)[number]) =>
    getTimestamp(document.updatedAt, document.createdAt ?? document._creationTime);
  const getDealTimestamp = (deal: (typeof deals)[number]) =>
    getTimestamp(deal.updatedAt, deal.createdAt ?? deal._creationTime);

  const recentDocuments = activeDocuments
    .map((document) => {
      const timestamp = getDocumentTimestamp(document);
      return {
        id: document._id,
        title: document.title || fr.editor.untitled,
        description: document.dealId
          ? "Document lié à un deal"
          : "Document de collaboration",
        time: formatRelativeTime(timestamp),
        collaborators: document.userId ? 1 : 0,
        href: `/documents/${document._id}`,
        timestamp,
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  const activityFeed = [
    ...activeDocuments.map((document) => {
      const timestamp = getDocumentTimestamp(document);
      return {
        id: `document-${document._id}`,
        user: document.userId === user?.id ? displayName : fr.common.collaborator,
        action: fr.activity.updatedDocument,
        target: document.title || fr.editor.untitled,
        time: formatRelativeTime(timestamp),
        timestamp,
      };
    }),
    ...activeDeals.map((deal) => {
      const timestamp = getDealTimestamp(deal);
      return {
        id: `deal-${deal._id}`,
        user:
          deal.lead ||
          (deal.userId === user?.id ? displayName : fr.common.team),
        action:
          deal.updatedAt === deal.createdAt
            ? fr.activity.createdDeal
            : fr.activity.updatedDeal,
        target: deal.company,
        time: formatRelativeTime(timestamp),
        timestamp,
      };
    }),
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const stats = [
    {
      id: "deals",
      label: fr.dashboard.stats.dealsInProgress,
      value: isDataLoading ? "—" : inProgressDeals.length.toString(),
      icon: Briefcase,
      trend: isDataLoading
        ? fr.loader.loading
        : `${activeDeals.length} ${fr.common.total}`,
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
      trend: isDataLoading
        ? fr.loader.loading
        : memberIds.size > 0
          ? fr.dashboard.activeTeam
          : fr.dashboard.noMembers,
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold">
          {fr.dashboard.welcomeBack}
          {isLoaded && user && (
            <span className="text-primary">, {user.firstName || user.username}</span>
          )}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gérez vos deals, documents et collaborations en un seul endroit
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">{fr.dashboard.quickActions}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <CardTitle>{action.label}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
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
                    Voir tout <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isDocumentsLoading ? (
                <p className="text-sm text-muted-foreground">
                  {fr.loader.loading}
                </p>
              ) : recentDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {fr.nav.noRecentDocuments}
                </p>
              ) : (
                <div className="space-y-4">
                  {recentDocuments.map((doc, index) => (
                    <div key={doc.id}>
                      <Link href={doc.href} className="block">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{doc.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {doc.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {doc.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {doc.collaborators} collaborateur
                                  {doc.collaborators > 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      {index < recentDocuments.length - 1 && (
                        <Separator className="mt-4" />
                      )}
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
                <p className="text-sm text-muted-foreground">
                  {fr.loader.loading}
                </p>
              ) : activityFeed.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {fr.dashboard.noRecentActivity}
                </p>
              ) : (
                <div className="space-y-4">
                  {activityFeed.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {activity.user.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-muted-foreground">
                            {activity.action}
                          </span>{" "}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
