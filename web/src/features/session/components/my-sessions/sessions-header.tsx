"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createEmptySession } from "../../session.api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export const SessionsHeader = () => {
  const router = useRouter();

  const createSessionMutation = useMutation({
    mutationFn: createEmptySession,
    onSuccess: (response) => {
      console.log("Create session success:", response);

      router.push(`/session/editor/${response.session._id}`);

      toast.success("New session created");
    },
    onError: (error) => {
      console.error("Failed to create session:", error);
      toast.error("Failed to create a new session");
    },
  });

  const handleCreateSession = async () => {
    createSessionMutation.mutate();
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Wellness Sessions
          </h1>
          <p className="text-muted-foreground">
            Manage your wellness sessions and track participant engagement
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-accent transition-colors"
          onClick={handleCreateSession}
          disabled={createSessionMutation.isPending}
        >
          <Plus className="h-5 w-5 mr-2" />
          {createSessionMutation.isPending
            ? "Creating..."
            : "Create New Session"}
        </Button>
      </div>
    </div>
  );
};
