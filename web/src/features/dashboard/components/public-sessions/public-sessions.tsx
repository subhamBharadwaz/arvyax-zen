"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getPublicSessionsInfinite,
  PaginatedSessionsResponse,
} from "@/features/session/session.api";
import { SessionData } from "@/features/session/types";
import { SessionCard } from "@/features/dashboard/components/session-card";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export const PublicSessions = () => {
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["public-sessions"],
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      const cursor = pageParam as string | undefined;
      return getPublicSessionsInfinite(cursor, 12);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: PaginatedSessionsResponse) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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

  if (isLoading) {
    return (
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-muted-foreground text-lg">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mb-8 text-center">
        <p className="text-red-500 text-lg">
          Error loading sessions: {error?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  // Flatten all pages into a single array with proper typing
  const allSessions =
    data?.pages.flatMap((page: PaginatedSessionsResponse) => page.sessions) ||
    [];
  const totalSessions = data?.pages[0]?.total || allSessions.length;

  const transformedSessions = allSessions.map((session, index) => ({
    id: session._id || `session-${index}`,
    title: session.title || "Untitled Session",
    tags: session.tags || [],
    jsonFileUrl: session.json_file_url || "",
    duration: calculateDuration(session),
    instructor: getInstructorName(session),
    createdAt: session.created_at,
  }));

  return (
    <>
      <div className="mb-8 text-center">
        <p className="text-muted-foreground text-lg">
          {allSessions.length} of {totalSessions} wellness sessions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {transformedSessions.map((session) => (
          <SessionCard
            key={session.id}
            title={session.title}
            tags={session.tags}
            jsonFileUrl={session.jsonFileUrl}
            duration={session.duration}
            instructor={session.instructor}
          />
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-muted-foreground">Loading more sessions...</p>
          </div>
        </div>
      )}

      <div ref={observerRef} className="h-4" />

      {!hasNextPage && allSessions.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You've reached the end of all sessions
          </p>
        </div>
      )}

      {/* Empty state */}
      {allSessions.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            No wellness sessions available yet
          </p>
          <p className="text-sm text-muted-foreground">
            Check back later for new content
          </p>
        </div>
      )}
    </>
  );
};

const calculateDuration = (session: SessionData): string => {
  return "15 min";
};

const getInstructorName = (session: SessionData): string => {
  // @ts-ignore
  return session.user_id?.name || "Anonymous";
};
