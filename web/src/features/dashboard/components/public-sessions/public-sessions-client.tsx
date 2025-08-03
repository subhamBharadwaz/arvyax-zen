"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPublicSessions } from "../../../session/session.api";
import { SessionData } from "../../../session/types";
import { PublicSession } from "./public-session-card";
import { PublicSessionsGrid } from "./public-sessions-grid";

export const PublicSessionsClient = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Fetch public sessions data
  const {
    data: sessions,
    isLoading,
    isError,
  } = useQuery<SessionData[]>({
    queryKey: ["public-sessions"],
    queryFn: getPublicSessions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleViewSession = (sessionId: string) => {
    // Navigate to view the session (you can create a view page later)
    router.push(`/session/view/${sessionId}`);
  };

  // Transform SessionData to the format expected by the UI components
  const transformedSessions: PublicSession[] = useMemo(() => {
    if (!sessions) return [];
    
    return sessions.map((session) => ({
      id: session._id,
      title: session.title || "Untitled Session",
      description: session.json_file_url || "No description available",
      date: new Date(session.created_at).toLocaleDateString(),
      duration: 0, // Not available in SessionData
      participants: 0, // Not available in SessionData
      maxParticipants: 0, // Not available in SessionData
      status: session.status,
      category: session.tags?.length > 0 ? session.tags.join(", ") : "Uncategorized",
      instructor: "Anonymous", // Not available in SessionData, could be added later
    }));
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return transformedSessions.filter((session) => {
      const matchesSearch =
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [transformedSessions, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading sessions...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">
          Error loading sessions. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Sessions count */}
      <div className="text-center">
        <p className="text-muted-foreground text-lg">
          {filteredSessions.length} wellness sessions available
        </p>
      </div>

      {/* Sessions grid */}
      <PublicSessionsGrid
        sessions={filteredSessions}
        onView={handleViewSession}
      />
    </div>
  );
}; 