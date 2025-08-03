export interface SessionData {
  _id: string;
  title: string;
  tags: string[];
  json_file_url: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export type SessionFormData = {
  title: string;
  tags: string;
  json_file_url: string;
};

export type SessionPayload = Omit<SessionFormData, 'tags'> & {
  tags: string[];
  status: "draft" | "published";
  sessionId?: string;
};

export type SaveDraftResponse = {
  session: SessionData;
};

export type SessionResponse = {
  success: boolean;
  session: SessionData;
};
