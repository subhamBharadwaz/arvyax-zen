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

export async function saveDraftSession(
  data: SessionPayload,
): Promise<SaveDraftResponse> {
  return apiFetch("/api/v1/my-sessions/save-draft", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function publishSession(
  data: SessionPayload,
): Promise<SaveDraftResponse> {
  return apiFetch("/api/v1/my-sessions/publish", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
