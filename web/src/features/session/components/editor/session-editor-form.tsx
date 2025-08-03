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
      if (error instanceof Error && error.message.includes("401")) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 30 * 1000, // Reduced to 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true, // Enable refetch on window focus
    refetchOnReconnect: true,
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

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    hasInitializedRef.current = false;
    lastAutoSaveRef.current = "";
  }, [sessionId]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [queryClient, sessionId]);

  useEffect(() => {
    if (sessionData && !hasInitializedRef.current) {
      hasInitializedRef.current = true;

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

      form.reset(formData, {
        keepDirty: false,
        keepTouched: false,
        keepErrors: false,
      });

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
      console.log("Save draft success:", data);

      if (data.session?._id && !sessionIdRef.current) {
        sessionIdRef.current = data.session._id;
        console.log("Updated sessionIdRef to:", data.session._id);
      }

      if (data.session) {
        queryClient.setQueryData(["session", sessionIdRef.current], data);

        queryClient.setQueryData(["my-sessions"], (oldData: any) => {
          console.log("Updating my-sessions cache with:", data.session);
          if (!oldData?.pages) return oldData;

          let sessionFound = false;
          const updatedData = {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              sessions: page.sessions.map((session: any) => {
                if (session._id === data.session._id) {
                  sessionFound = true;
                  return { ...session, ...data.session };
                }
                return session;
              }),
            })),
          };

          if (!sessionFound && oldData.pages.length > 0) {
            console.log("Session not found in cache, adding to first page");
            updatedData.pages[0] = {
              ...updatedData.pages[0],
              sessions: [data.session, ...updatedData.pages[0].sessions],
            };
          }

          return updatedData;
        });
      }

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["my-sessions"] });
        queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      }, 100);
    },
    onError: (error) => {
      console.error("Save draft error:", error);
      toast.error("Failed to save draft.");
    },
  });

  const publishSessionMutation = useMutation({
    mutationFn: publishSession,
    onSuccess: (data) => {
      toast("Published Successfully");

      if (data?.session) {
        queryClient.setQueryData(["session", sessionIdRef.current], data);

        queryClient.setQueryData(["my-sessions"], (oldData: any) => {
          console.log(
            "Updating my-sessions cache with published session:",
            data.session,
          );
          if (!oldData?.pages) return oldData;

          let sessionFound = false;
          const updatedData = {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              sessions: page.sessions.map((session: any) => {
                if (session._id === data.session._id) {
                  sessionFound = true;
                  return { ...session, ...data.session };
                }
                return session;
              }),
            })),
          };

          if (!sessionFound && oldData.pages.length > 0) {
            console.log(
              "Published session not found in cache, adding to first page",
            );
            updatedData.pages[0] = {
              ...updatedData.pages[0],
              sessions: [data.session, ...updatedData.pages[0].sessions],
            };
          }

          return updatedData;
        });
      }

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["my-sessions"] });
        queryClient.invalidateQueries({ queryKey: ["public-sessions"] });
        queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      }, 100);
    },
    onError: () => toast.error("Failed to publish session."),
  });

  const debouncedAutoSave = useDebounceCallback(async () => {
    // Only auto-save if session exists, form has been initialized with data, and tab is active
    if (
      !sessionIdRef.current ||
      !hasInitializedRef.current ||
      !sessionData ||
      !isTabActive
    ) {
      console.log("Auto-save skipped - conditions not met:", {
        sessionId: sessionIdRef.current,
        initialized: hasInitializedRef.current,
        hasData: !!sessionData,
        tabActive: isTabActive,
      });
      return;
    }

    const data = form.getValues();
    const currentDataHash = JSON.stringify({ ...data, tags });

    console.log(
      "Auto-save check - Tags before save:",
      tags,
      "Tags length:",
      tags.length,
      "Form data:",
      data,
    );

    // Prevent duplicate saves
    if (currentDataHash === lastAutoSaveRef.current) {
      console.log("Auto-save skipped - no changes detected");
      return;
    }

    // Only auto-save if there are meaningful changes (at least title or content)
    if (!data.title.trim() && !data.json_file_url.trim()) {
      console.log("Auto-save skipped - no meaningful content");
      return;
    }

    const payload: SessionPayload = {
      ...data,
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
      status: "draft",
      sessionId: sessionIdRef.current,
    };

    console.log("Auto-save payload:", payload);

    const optimisticSessionData = {
      title: data.title || "Untitled Session",
      tags: payload.tags,
      json_file_url: data.json_file_url,
      updated_at: new Date().toISOString(),
      status: "draft",
    };

    queryClient.setQueryData(["my-sessions"], (oldData: any) => {
      console.log("Auto-save: Optimistically updating my-sessions cache");
      if (!oldData?.pages) return oldData;

      let sessionFound = false;
      const updatedData = {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          sessions: page.sessions.map((session: any) => {
            if (session._id === sessionIdRef.current) {
              sessionFound = true;
              return { ...session, ...optimisticSessionData };
            }
            return session;
          }),
        })),
      };

      if (!sessionFound && oldData.pages.length > 0) {
        console.log("Auto-save: Session not found, adding to first page");
        updatedData.pages[0] = {
          ...updatedData.pages[0],
          sessions: [
            { _id: sessionIdRef.current, ...optimisticSessionData },
            ...updatedData.pages[0].sessions,
          ],
        };
      }

      return updatedData;
    });

    queryClient.setQueryData(
      ["session", sessionIdRef.current],
      (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          session: {
            ...oldData.session,
            ...optimisticSessionData,
          },
        };
      },
    );

    try {
      const response = await saveDraftSession(payload);

      if (response.session?._id && !sessionIdRef.current) {
        sessionIdRef.current = response.session._id;
        console.log("Updated sessionIdRef to:", response.session._id);
      }

      if (response.session) {
        queryClient.setQueryData(["session", sessionIdRef.current], response);

        queryClient.setQueryData(["my-sessions"], (oldData: any) => {
          console.log(
            "Auto-save success: Updating my-sessions cache with response:",
            response.session,
          );
          if (!oldData?.pages) return oldData;

          let sessionFound = false;
          const updatedData = {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              sessions: page.sessions.map((session: any) => {
                if (session._id === response.session._id) {
                  sessionFound = true;
                  return { ...session, ...response.session };
                }
                return session;
              }),
            })),
          };

          if (!sessionFound && oldData.pages.length > 0) {
            console.log(
              "Auto-save success: Session not found, adding to first page",
            );
            updatedData.pages[0] = {
              ...updatedData.pages[0],
              sessions: [response.session, ...updatedData.pages[0].sessions],
            };
          }

          return updatedData;
        });
      }

      lastAutoSaveRef.current = currentDataHash;

      toast("Auto-saved", {
        description: "Your changes have been automatically saved.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Auto-save failed");

      queryClient.invalidateQueries({ queryKey: ["my-sessions"] });
      queryClient.invalidateQueries({
        queryKey: ["session", sessionIdRef.current],
      });
    }
  }, 3000);

  const watchedValues = form.watch();

  useEffect(() => {
    if (
      sessionIdRef.current &&
      hasInitializedRef.current &&
      sessionData &&
      isTabActive
    ) {
      const timer = setTimeout(() => {
        debouncedAutoSave();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [watchedValues, tags, debouncedAutoSave, sessionData, isTabActive]);

  useEffect(() => {
    return () => {
      debouncedAutoSave.cancel();
    };
  }, [debouncedAutoSave]);

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

    const currentSessionId = sessionIdRef.current || sessionId;

    const payload: SessionPayload = {
      ...data,
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
      status: submitStatus,
      sessionId: currentSessionId, // Use sessionId instead of _id
    };

    try {
      if (submitStatus === "draft") {
        const response = await saveDraftMutation.mutateAsync(payload);

        if (response.session?._id && !sessionIdRef.current) {
          sessionIdRef.current = response.session._id;
        }

        toast("Saved as Draft", {
          description: "Your session has been saved.",
        });
      } else {
        await publishSessionMutation.mutateAsync(payload);
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

  const handleSubmitWithStatus = async (
    data: SessionFormData,
    status: "draft" | "published",
  ) => {
    if (status === "published") {
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

    const currentSessionId = sessionIdRef.current || sessionId;
    const payload: SessionPayload = {
      ...data,
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
      status,
      sessionId: currentSessionId,
    };

    try {
      if (status === "draft") {
        const response = await saveDraftMutation.mutateAsync(payload);
        if (response.session?._id && !sessionIdRef.current) {
          sessionIdRef.current = response.session._id;
        }
        toast("Saved as Draft", {
          description: "Your session has been saved.",
        });
      } else {
        await publishSessionMutation.mutateAsync(payload);
        toast("Published Successfully", {
          description: "Your session has been published.",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        status === "draft"
          ? "Failed to save draft."
          : "Failed to publish session.",
      );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto px-4 sm:px-6">
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

            <div className="flex flex-col gap-6 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.handleSubmit((data) =>
                    handleSubmitWithStatus(data, "draft"),
                  )();
                }}
                className=" border-border cursor-pointer hover:bg-muted text-foreground"
                disabled={saveDraftMutation.isPending}
              >
                {saveDraftMutation.isPending ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  form.handleSubmit((data) =>
                    handleSubmitWithStatus(data, "published"),
                  )();
                }}
                className=" border-border cursor-pointer hover:bg-muted text-foreground"
                disabled={publishSessionMutation.isPending}
              >
                {publishSessionMutation.isPending
                  ? "Publishing..."
                  : "Publish Session"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
