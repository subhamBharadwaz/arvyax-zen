import { apiFetch } from "@/lib/api";
import {
  SaveDraftResponse,
  SessionPayload,
  SessionData,
  SessionResponse,
} from "./types";

// Updated response type for pagination
export interface PaginatedSessionsResponse {
  success: boolean;
  sessions: SessionData[];
  hasMore: boolean;
  nextCursor: string | null;
  total: number;
}

// Legacy function - kept for backward compatibility
export async function getMySessions(): Promise<SessionData[]> {
  const response = await apiFetch("/api/v1/my-sessions", {});
  // Handle different response structures
  if (Array.isArray(response)) {
    return response;
  } else if (
    response &&
    typeof response === "object" &&
    "sessions" in response
  ) {
    return (response as any).sessions || [];
  } else if (response && typeof response === "object" && "data" in response) {
    return (response as any).data || [];
  } else {
    console.warn("Unexpected response structure from getMySessions:", response);
    return [];
  }
}

// Legacy function - kept for backward compatibility
export async function getPublicSessions(): Promise<SessionData[]> {
  const response = await apiFetch("/api/v1/sessions", {});
  // Handle different response structures
  if (Array.isArray(response)) {
    return response;
  } else if (
    response &&
    typeof response === "object" &&
    "sessions" in response
  ) {
    return (response as any).sessions || [];
  } else if (response && typeof response === "object" && "data" in response) {
    return (response as any).data || [];
  } else {
    console.warn(
      "Unexpected response structure from getPublicSessions:",
      response,
    );
    return [];
  }
}

// New infinite query functions
export async function getMySessionsInfinite(
  cursor?: string,
  limit: number = 12,
): Promise<PaginatedSessionsResponse> {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  if (cursor) {
    params.append("cursor", cursor);
  }
  const response = await apiFetch(`/api/v1/my-sessions?${params}`, {});
  return handlePaginatedResponse(response, limit);
}

export async function getPublicSessionsInfinite(
  cursor?: string,
  limit: number = 12,
): Promise<PaginatedSessionsResponse> {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  if (cursor) {
    params.append("cursor", cursor);
  }
  const response = await apiFetch(`/api/v1/sessions?${params}`, {});
  return handlePaginatedResponse(response, limit);
}

// Helper function to handle different response formats
function handlePaginatedResponse(
  response: any,
  limit: number,
): PaginatedSessionsResponse {
  if (response && typeof response === "object" && "hasMore" in response) {
    return response as PaginatedSessionsResponse;
  }
  let sessions: SessionData[] = [];
  if (Array.isArray(response)) {
    sessions = response;
  } else if (response && typeof response === "object") {
    sessions = (response as any).sessions || (response as any).data || [];
  }
  const hasMore = sessions.length === limit;
  const nextCursor =
    sessions.length > 0 ? sessions[sessions.length - 1].created_at : null;
  return {
    success: true,
    sessions,
    hasMore,
    nextCursor,
    total: sessions.length,
  };
}

export async function fetchSessionById(
  sessionId: string,
): Promise<SessionResponse> {
  return apiFetch(`/api/v1/my-sessions/${sessionId}`);
}

// Improved saveDraftSession with better logging and error handling
export async function saveDraftSession(
  data: SessionPayload,
): Promise<SaveDraftResponse> {
  console.log("saveDraftSession called with:", data);

  // Prepare the payload for your backend
  const payload: any = {
    title: data.title,
    tags: data.tags,
    json_file_url: data.json_file_url,
    status: data.status || "draft",
  };

  // If updating existing session, include _id (not sessionId)
  if (data.sessionId) {
    payload._id = data.sessionId;
    console.log("Updating existing session with _id:", data.sessionId);
  } else {
    console.log("Creating new session");
  }

  return apiFetch("/api/v1/my-sessions/save-draft", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function publishSession(
  data: SessionPayload,
): Promise<SaveDraftResponse> {
  console.log("publishSession called with:", data);

  if (!data.sessionId) {
    throw new Error("Session ID is required for publishing");
  }

  return apiFetch("/api/v1/my-sessions/publish", {
    method: "POST",
    body: JSON.stringify({
      sessionId: data.sessionId,
    }),
  });
}

// New function to create empty session
export async function createEmptySession(): Promise<SaveDraftResponse> {
  console.log("Creating empty session");
  return apiFetch("/api/v1/my-sessions/save-draft", {
    method: "POST",
    body: JSON.stringify({
      title: "",
      tags: [],
      json_file_url: "",
      status: "draft",
    }),
  });
}
