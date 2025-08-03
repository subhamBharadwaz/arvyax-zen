"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { saveDraftSession } from "../../session.api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SessionsHeader = () => {
  const router = useRouter();

  const handleCreateSession = async () => {
    try {
      const response = await saveDraftSession({
        title: "",
        tags: [],
        json_file_url: "",
        status: "draft",
      });

      router.push(`/session/editor/${response.session._id}`);
    } catch (err) {
      toast.error("Failed to create a new session");
    }
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
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Session
        </Button>
      </div>
    </div>
  );
};
