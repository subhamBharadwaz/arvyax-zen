"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getMySessionsInfinite,
  PaginatedSessionsResponse,
} from "../../session.api";
import { SessionData } from "../../types";
import { Session } from "./session-card";
import { SessionGrid } from "./sessions-grid";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Sessions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement>(null);

  // Fetch sessions data with infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["my-sessions"],
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      const cursor = pageParam as string | undefined;
      return getMySessionsInfinite(cursor, 12);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: PaginatedSessionsResponse) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleEditSession = (sessionId: string) => {
    router.push(`/session/editor/${sessionId}`);
  };

  const handleCreateNew = () => {
    // This will be handled by the SessionsHeader component
    toast("Create Session", {
      description: "Use the 'Create New Session' button above.",
    });
  };

  const handleFilterClick = () => {
    toast("Filters", { description: "Opening filter options..." });
    // Implement filter modal/dropdown logic here
  };

  // Flatten all pages and transform SessionData to the format expected by the UI components
  const allSessions =
    data?.pages.flatMap((page: PaginatedSessionsResponse) => page.sessions) ||
    [];

  const transformedSessions: Session[] = useMemo(() => {
    return allSessions.map((session: SessionData) => ({
      id: session._id,
      title: session.title || "Untitled Session",
      description: session.json_file_url || "No description available",
      date: new Date(session.created_at).toLocaleDateString(),
      duration: 0, // Not available in SessionData
      participants: 0, // Not available in SessionData
      maxParticipants: 0, // Not available in SessionData
      status: session.status,
      category:
        session.tags?.length > 0 ? session.tags.join(", ") : "Uncategorized",
    }));
  }, [allSessions]);

  const filteredSessions = useMemo(() => {
    return transformedSessions.filter((session) => {
      const matchesSearch =
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeTab === "drafts")
        return matchesSearch && session.status === "draft";
      if (activeTab === "published")
        return matchesSearch && session.status === "published";
      return matchesSearch;
    });
  }, [transformedSessions, searchQuery, activeTab]);

  const draftCount = transformedSessions.filter(
    (s) => s.status === "draft",
  ).length;
  const publishedCount = transformedSessions.filter(
    (s) => s.status === "published",
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <div className="text-muted-foreground">Loading sessions...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">
          Error loading sessions:{" "}
          {error?.message || "Please try refreshing the page."}
        </div>
      </div>
    );
  }

  return (
    <>
      <SessionGrid
        sessions={filteredSessions}
        onEdit={handleEditSession}
        onCreateNew={handleCreateNew}
      />

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-muted-foreground">
              Loading more sessions...
            </span>
          </div>
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerRef} className="h-4" />

      {/* End of results indicator */}
      {!hasNextPage && allSessions.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            You've reached the end of all sessions
          </p>
        </div>
      )}

      {/* Empty state */}
      {allSessions.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            No sessions found
          </p>
          <p className="text-sm text-muted-foreground">
            Create your first wellness session to get started
          </p>
        </div>
      )}

      {/* Session counts for tabs */}
      <div className="hidden">
        {/* These are used by parent components for tab badges */}
        <span data-draft-count={draftCount} />
        <span data-published-count={publishedCount} />
      </div>
    </>
  );
};
