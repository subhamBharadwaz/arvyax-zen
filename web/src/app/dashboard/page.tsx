import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getPublicSessions } from "@/features/session/session.api";
import { getQueryClient } from "@/lib/react-query";
import { PublicSessions } from "@/features/dashboard/components/public-sessions/public-sessions";

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["public-sessions"],
      queryFn: getPublicSessions,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  } catch (error) {
    console.error("Failed to prefetch public sessions:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-gradient-to-br from-background via-wellness-peace/20 to-wellness-calm/10">
        <div className="container mx-auto px-4 py-8">
          <PublicSessions />
        </div>
      </div>
    </HydrationBoundary>
  );
}
