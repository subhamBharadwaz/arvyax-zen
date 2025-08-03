import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getMySessionsInfinite } from "@/features/session/session.api";
import { getQueryClient } from "@/lib/react-query";
import { Sessions } from "@/features/session/components/my-sessions/sessions";
import { SessionsHeader } from "@/features/session/components/my-sessions/sessions-header";

export default async function MySessionsPage() {
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["my-sessions"],
      queryFn: async ({ pageParam }: { pageParam: unknown }) => {
        const cursor = pageParam as string | undefined;
        return getMySessionsInfinite(cursor, 12);
      },
      initialPageParam: undefined as string | undefined,
      staleTime: 30 * 1000, // Match the Sessions component staleTime
    });
  } catch (error) {
    console.error("Failed to prefetch sessions:", error);
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
