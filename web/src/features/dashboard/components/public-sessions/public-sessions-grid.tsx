"use client";

import { PublicSession, PublicSessionCard } from "./public-session-card";

interface PublicSessionsGridProps {
  sessions: PublicSession[];
  onView: (sessionId: string) => void;
}

export const PublicSessionsGrid = ({
  sessions,
  onView,
}: PublicSessionsGridProps) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-wellness-sage-light rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🧘</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
        <p className="text-muted-foreground">
          No published wellness sessions are available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <PublicSessionCard key={session.id} session={session} onView={onView} />
      ))}
    </div>
  );
}; 