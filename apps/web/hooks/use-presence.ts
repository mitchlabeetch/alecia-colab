"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const HEARTBEAT_INTERVAL = 10000; // 10 seconds
const USER_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
];

interface UsePresenceOptions {
  resourceType: "document" | "deal";
  resourceId: string;
  enabled?: boolean;
}

// Lazy import useUser to avoid SSR issues
let useUserHook: (() => { user: any }) | null = null;

function getUser() {
  if (typeof window === "undefined") return null;
  
  try {
    // Dynamically access Clerk's useUser if available
    if (!useUserHook) {
      const clerk = require("@clerk/nextjs");
      useUserHook = clerk.useUser;
    }
    return useUserHook?.()?.user || null;
  } catch {
    return null;
  }
}

export function usePresence({ resourceType, resourceId, enabled = true }: UsePresenceOptions) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  const isConvexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL;
  
  // Only run on client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const activeUsers = useQuery(
    api.presence.getActiveUsers,
    isConvexConfigured && enabled && mounted ? { resourceType, resourceId } : "skip"
  );
  
  const heartbeat = useMutation(api.presence.heartbeat);
  const leave = useMutation(api.presence.leave);

  // Generate consistent color for user based on ID
  const getUserColor = useCallback((userId: string) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash |= 0;
    }
    return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
  }, []);

  // Safely get user on client side
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const clerk = require("@clerk/nextjs");
      // This is a workaround - in a real app, you'd use useUser directly
      // but for SSR safety, we delay it
      const currentUser = getUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }, [mounted]);

  // Send heartbeat
  const sendHeartbeat = useCallback(async () => {
    if (!user?.id || !isConvexConfigured) return;
    
    try {
      await heartbeat({
        resourceType,
        resourceId,
        userId: user.id,
        userName: user.fullName || user.firstName || "Anonymous",
        userColor: getUserColor(user.id),
      });
    } catch (error) {
      console.error("Presence heartbeat error:", error);
    }
  }, [user, resourceType, resourceId, heartbeat, getUserColor, isConvexConfigured]);

  // Setup heartbeat interval
  useEffect(() => {
    if (!enabled || !user?.id || !isConvexConfigured || !mounted) return;

    // Send initial heartbeat
    sendHeartbeat();

    // Setup interval
    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    // Cleanup on unmount or resource change
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      // Leave the resource
      if (user?.id) {
        leave({ resourceType, resourceId, userId: user.id }).catch(() => {});
      }
    };
  }, [enabled, user?.id, resourceType, resourceId, sendHeartbeat, leave, isConvexConfigured, mounted]);

  // Filter out current user
  const otherUsers = activeUsers?.filter((u) => u.userId !== user?.id) || [];

  return {
    activeUsers: activeUsers || [],
    otherUsers,
    isLoading: activeUsers === undefined,
    currentUserId: user?.id,
  };
}
