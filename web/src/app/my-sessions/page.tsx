import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getMySessions } from "@/features/session/session.api";
import { getQueryClient } from "@/lib/react-query";
import { Sessions } from "@/features/session/components/my-sessions/sessions";
import { SessionsHeader } from "@/features/session/components/my-sessions/sessions-header";

export default async function MySessionsPage() {
  const queryClient = getQueryClient();

  // Prefetch the sessions data on the server
  try {
    await queryClient.prefetchQuery({
      queryKey: ["my-sessions"],
      queryFn: getMySessions,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  } catch (error) {
    console.error("Failed to prefetch sessions:", error);
    // Continue rendering even if prefetch fails
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-gradient-to-br from-background to-wellness-sage-light/20">
        <div className="container mx-auto px-4 py-8">
          <SessionsHeader />
          <Sessions />
        </div>
      </div>
    </HydrationBoundary>
  );
}
