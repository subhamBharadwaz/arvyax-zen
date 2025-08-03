"use client";

import { EmptyState } from "./empty-state";
import { Session, SessionCard } from "./session-card";

interface SessionGridProps {
  sessions: Session[];
  onEdit: (sessionId: string) => void;
  onCreateNew?: () => void;
}

export const SessionGrid = ({
  sessions,
  onEdit,
  onCreateNew,
}: SessionGridProps) => {
  if (sessions.length === 0) {
    return <EmptyState onCreateNew={onCreateNew} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} onEdit={onEdit} />
      ))}
    </div>
  );
};
