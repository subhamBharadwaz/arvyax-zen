// app/sessions/editor/[sessionId]/page.tsx
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchSessionById } from "@/features/session/session.api";
import { SessionEditorForm } from "@/features/session/components/editor/session-editor-form";
import { getQueryClient } from "@/lib/react-query";

interface SessionEditorPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionEditorPage({
  params,
}: SessionEditorPageProps) {
  const { sessionId } = await params;
  const queryClient = getQueryClient();

  // Prefetch the session data on the server
  try {
    await queryClient.prefetchQuery({
      queryKey: ["session", sessionId],
      queryFn: () => fetchSessionById(sessionId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  } catch (error) {
    console.error("Failed to prefetch session:", error);
    // Continue rendering even if prefetch fails
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SessionEditorForm sessionId={sessionId} />
    </HydrationBoundary>
  );
}
