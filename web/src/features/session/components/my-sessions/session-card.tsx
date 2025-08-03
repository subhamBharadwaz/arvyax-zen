"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  participants: number;
  maxParticipants: number;
  status: "draft" | "published";
  category: string;
}

interface SessionCardProps {
  session: Session;
  onEdit: (sessionId: string) => void;
}

export const SessionCard = ({ session, onEdit }: SessionCardProps) => {
  const isDraft = session.status === "draft";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        "bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm",
        isDraft
          ? "border-wellness-draft-border bg-wellness-draft/50"
          : "border-wellness-published-border bg-wellness-published/30",
      )}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-1",
          isDraft ? "bg-wellness-draft-border" : "bg-wellness-sage",
        )}
      />

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {session.title}
              </h3>
              <Badge
                variant={isDraft ? "secondary" : "default"}
                className={cn(
                  "text-xs",
                  isDraft
                    ? " bg-amber-400 dark:bg-amber-200 text-accent"
                    : "bg-primary text-accent",
                )}
              >
                {isDraft ? "Draft" : "Published"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {session.description}
            </p>
            <Badge variant="outline" className="text-xs">
              {session.category}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(session.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{session.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {session.participants}/{session.maxParticipants} participants
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(session.id)}
            className="flex-1 group-hover:border-primary group-hover:text-primary transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
