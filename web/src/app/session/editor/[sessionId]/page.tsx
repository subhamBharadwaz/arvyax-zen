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

  try {
    await queryClient.prefetchQuery({
      queryKey: ["session", sessionId],
      queryFn: () => fetchSessionById(sessionId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  } catch (error) {
    console.error("Failed to prefetch session:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen space-y-5 bg-background text-foreground">
        <header className="w-full px-6 py-4 border-b border-border bg-card shadow-sm">
          <h1 className="text-2xl font-semibold text-primary">
            Edit Your Session
          </h1>
        </header>

        <main className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl">
            <SessionEditorForm sessionId={sessionId} />
          </div>
        </main>
      </div>
    </HydrationBoundary>
  );
}
