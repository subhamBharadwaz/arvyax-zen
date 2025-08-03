"use client";

import { useDebounceCallback } from "usehooks-ts";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import {
  SessionFormData,
  draftSessionSchema,
  publishSessionSchema,
} from "../../schema";
import { SessionPayload, SessionResponse } from "../../types";
import {
  publishSession,
  saveDraftSession,
  fetchSessionById,
} from "../../session.api";

export interface SessionEditorFormProps {
  sessionId: string;
}

export function SessionEditorForm({ sessionId }: SessionEditorFormProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"draft" | "published">(
    "draft",
  );
  const [isTabActive, setIsTabActive] = useState(true);

  // Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    // Listen for visibility change events
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also listen for window focus/blur events
    const handleFocus = () => setIsTabActive(true);
    const handleBlur = () => setIsTabActive(false);

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Fetch session data with proper typing
  const {
    data: sessionData,
    isLoading,
    isError,
    error,
  } = useQuery<SessionResponse>({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSessionById(sessionId),
    enabled: !!sessionId,
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (authentication issues)
      if (error instanceof Error && error.message.includes("401")) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const form = useForm<SessionFormData>({
    resolver: zodResolver(draftSessionSchema),
    defaultValues: {
      title: "",
      tags: "",
      json_file_url: "",
    },
  });

  const sessionIdRef = useRef<string | undefined>(sessionId);
  const lastAutoSaveRef = useRef<string>("");
  const hasInitializedRef = useRef(false);
  const queryClient = useQueryClient();

  // Update sessionIdRef when sessionId changes
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  // Initialize form with session data - only once when data is loaded
  useEffect(() => {
    if (sessionData && !hasInitializedRef.current) {
      hasInitializedRef.current = true;

      // Extract the actual session data from the response
      const actualSessionData = sessionData.session;

      const formData = {
        title: actualSessionData.title || "",
        tags: Array.isArray(actualSessionData.tags)
          ? actualSessionData.tags.join(", ")
          : "",
        json_file_url: actualSessionData.json_file_url || "",
      };

      console.log("Form init - Session tags:", actualSessionData.tags);
      console.log(
        "Form init - Setting tags array:",
        Array.isArray(actualSessionData.tags) ? actualSessionData.tags : [],
      );

      // Reset form with fetched data
      form.reset(formData);

      // Set tags array
      setTags(
        Array.isArray(actualSessionData.tags) ? actualSessionData.tags : [],
      );
    }
  }, [sessionData, form]);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    console.log(
      "Adding tag:",
      trimmedTag,
      "Current tags:",
      tags,
      "Tags length:",
      tags.length,
    );

    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      console.log("New tags array:", newTags);
      setTags(newTags);
      form.setValue("tags", newTags.join(", "));
    } else {
      console.log("Tag not added - already exists or empty");
    }
    setTagInput("");
  };

  const saveDraftMutation = useMutation({
    mutationFn: saveDraftSession,
    onSuccess: (data) => {
      if (data.session?._id && !sessionIdRef.current) {
        sessionIdRef.current = data.session._id;
      }
      // Invalidate the query cache to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
    },
    onError: () => toast.error("Failed to save draft."),
  });

  const publishSessionMutation = useMutation({
    mutationFn: publishSession,
    onSuccess: () => toast("Published Successfully"),
    onError: () => toast.error("Failed to publish session."),
  });

  // Debounced auto-save
  const debouncedAutoSave = useDebounceCallback(async () => {
    // Only auto-save if session exists, form has been initialized with data, and tab is active
    if (
      !sessionIdRef.current ||
      !hasInitializedRef.current ||
      !sessionData ||
      !isTabActive
    ) {
      return;
    }

    const data = form.getValues();
    const currentDataHash = JSON.stringify({ ...data, tags });

    console.log(
      "Auto-save check - Tags before save:",
      tags,
      "Tags length:",
      tags.length,
    );

    // Prevent duplicate saves
    if (currentDataHash === lastAutoSaveRef.current) {
      return;
    }

    // Don't save if all fields are empty (prevents saving empty data)
    if (!data.title.trim() && !data.json_file_url.trim() && tags.length === 0) {
      return;
    }

    const payload: SessionPayload = {
      ...data,
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
      status: "draft",
      sessionId: sessionIdRef.current,
    };

    console.log("Auto-save payload tags:", payload.tags);

    try {
      await saveDraftSession(payload);
      lastAutoSaveRef.current = currentDataHash;
      toast("Auto-saved", {
        description: "Your changes have been automatically saved.",
      });
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Auto-save failed");
    }
  }, 3000);

  // Watch form changes for auto-save
  const watchedValues = form.watch();

  useEffect(() => {
    // Only start auto-saving after form is initialized with data and tab is active
    if (
      sessionIdRef.current &&
      hasInitializedRef.current &&
      sessionData &&
      isTabActive
    ) {
      // Add a small delay to ensure form is fully initialized
      const timer = setTimeout(() => {
        debouncedAutoSave();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [watchedValues, tags, debouncedAutoSave, sessionData, isTabActive]);

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags.join(", "));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleSubmit = async (data: SessionFormData) => {
    // Validate for publish only
    if (submitStatus === "published") {
      try {
        publishSessionSchema.parse(data);
      } catch (err) {
        if (err instanceof z.ZodError) {
          err.issues.forEach((error) => {
            form.setError(error.path[0] as keyof SessionFormData, {
              message: error.message,
            });
          });
        }
        return;
      }
    }

    // Ensure we have a sessionId for publishing
    const currentSessionId = sessionIdRef.current || sessionId;

    console.log("Submitting session:", {
      submitStatus,
      sessionId: currentSessionId,
      sessionIdRef: sessionIdRef.current,
      propSessionId: sessionId,
      payload: {
        ...data,
        tags: tags.map((tag) => tag.trim()).filter(Boolean),
        status: submitStatus,
        sessionId: currentSessionId,
      },
    });

    const payload: SessionPayload = {
      ...data,
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
      status: submitStatus,
      sessionId: currentSessionId, // Use sessionId instead of _id
    };

    try {
      if (submitStatus === "draft") {
        const response = await saveDraftSession(payload);
        if (response.session?._id && !sessionIdRef.current) {
          sessionIdRef.current = response.session._id;
        }
        toast("Saved as Draft", {
          description: "Your session has been saved.",
        });
      } else {
        await publishSession(payload);
        toast("Published Successfully", {
          description: "Your session has been published.",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        submitStatus === "draft"
          ? "Failed to save draft."
          : "Failed to publish session.",
      );
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading session...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="space-y-4">
            <div className="text-red-500 text-center">
              Error loading session. Please try refreshing the page.
            </div>

            {/* Debug information */}
            <div className="bg-muted p-4 rounded-lg text-sm">
              <h3 className="font-semibold mb-2">Debug Information:</h3>
              <div>Session ID: {sessionId}</div>
              <div>Error: {error?.message}</div>
              <div>
                Has localStorage Token:{" "}
                {typeof window !== "undefined"
                  ? !!localStorage.getItem("accessToken")
                  : "Unknown"}
              </div>
              <div>
                Has Cookie Token:{" "}
                {typeof document !== "undefined"
                  ? !!document.cookie.includes("token=")
                  : "Unknown"}
              </div>
              <div>
                All Cookies:{" "}
                {typeof document !== "undefined" ? document.cookie : "N/A"}
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={() => (window.location.href = "/login")}
                variant="outline"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">
          {sessionData?.session?.title ? "Edit Session" : "Create New Session"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    Session Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter session title..."
                      className="bg-card border-border focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    Tags
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Input
                        placeholder="Add tags (press Enter or comma to add)..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onBlur={() => tagInput.trim() && handleAddTag(tagInput)}
                        className="bg-card border-border focus:border-primary"
                      />
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-primary/10 text-primary hover:bg-primary/20 pr-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="json_file_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    JSON File URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/session.json"
                      className="bg-card border-border focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSubmitStatus("draft");
                  form.handleSubmit(handleSubmit)();
                }}
                className="flex-1 border-border hover:bg-muted text-foreground"
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setSubmitStatus("published");
                  form.handleSubmit(handleSubmit)();
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Publish Session
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
