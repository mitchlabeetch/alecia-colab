/**
 * Dashboard Page - Main home page
 * Features: Welcome message, quick actions, recent documents, activity feed
 */

"use client";

// Force dynamic rendering to avoid SSG issues with Clerk
export const dynamic = "force-dynamic";

import { motion } from "motion/react";
import {
  FileText,
  Briefcase,
  Building,
  TrendingUp,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { Button } from "@/components/tailwind/ui/button";
import { Badge } from "@/components/tailwind/ui/badge";
import { Separator } from "@/components/tailwind/ui/separator";
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

const recentDocuments = [
  {
    title: "Q4 Financial Report",
    description: "Rapport financier trimestriel",
    date: "Il y a 2 heures",
    collaborators: 3,
  },
  {
    title: "TechVenture Due Diligence",
    description: "Documents de due diligence",
    date: "Il y a 5 heures",
    collaborators: 5,
  },
  {
    title: "Integration Plan Template",
    description: "Modèle de plan d'intégration",
    date: "Il y a 1 jour",
    collaborators: 2,
  },
];

const activityFeed = [
  {
    user: "Marie Dubois",
    action: "a créé un nouveau deal",
    target: "HealthTech Solutions",
    time: "Il y a 30 minutes",
  },
  {
    user: "Jean Martin",
    action: "a modifié le document",
    target: "Q4 Financial Report",
    time: "Il y a 1 heure",
  },
  {
    user: "Sophie Bernard",
    action: "a commenté sur",
    target: "TechVenture Due Diligence",
    time: "Il y a 2 heures",
  },
];

const stats = [
  {
    label: fr.dashboard.stats.dealsInProgress,
    value: "12",
    icon: Briefcase,
    trend: "+3 ce mois",
    color: "text-blue-500",
  },
  {
    label: fr.dashboard.stats.documentsCreated,
    value: "48",
    icon: FileText,
    trend: "+8 cette semaine",
    color: "text-green-500",
  },
  {
    label: fr.dashboard.stats.teamMembers,
    value: "15",
    icon: Users,
    trend: "+2 nouveaux",
    color: "text-purple-500",
  },
  {
    label: fr.dashboard.stats.tasksCompleted,
    value: "34",
    icon: CheckCircle2,
    trend: "85% terminé",
    color: "text-orange-500",
  },
];

export default function DashboardPage() {
  // Mock user for demo - in production, would use Clerk
  const user = null;
  const isLoaded = true;

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
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
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
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
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
              <div className="space-y-4">
                {recentDocuments.map((doc, index) => (
                  <div key={index}>
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
                              {doc.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {doc.collaborators} collaborateurs
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < recentDocuments.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {activityFeed.map((activity, index) => (
                  <div key={index} className="flex gap-3">
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
