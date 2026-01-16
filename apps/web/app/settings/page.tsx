"use client";

import { useUser } from "@clerk/nextjs";
import { Bell, Monitor, Moon, Palette, Shield, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/tailwind/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { Label } from "@/components/tailwind/ui/label";
import { Separator } from "@/components/tailwind/ui/separator";
import { Switch } from "@/components/tailwind/ui/switch";

// Prevent static generation
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const isClerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const { user } = isClerkEnabled ? useUser() : { user: null };
  const [notifications, setNotifications] = useState(true);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte</p>
        </div>

        <div className="grid gap-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apparence
              </CardTitle>
              <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thème</Label>
                  <p className="text-sm text-muted-foreground">Choisissez votre thème préféré</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant={theme === "light" ? "default" : "outline"} size="sm" onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4 mr-2" />
                  Clair
                </Button>
                <Button variant={theme === "dark" ? "default" : "outline"} size="sm" onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4 mr-2" />
                  Sombre
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Système
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configurez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activer les notifications</Label>
                  <p className="text-sm text-muted-foreground">Recevoir des notifications pour les mises à jour</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </CardContent>
          </Card>

          {/* Profile */}
          {user && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profil
                </CardTitle>
                <CardDescription>Informations de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <p className="text-sm">{user.fullName || "Non défini"}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>Gérez vos paramètres de sécurité</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                La gestion de la sécurité est assurée par Clerk. Visitez votre profil pour plus d'options.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
