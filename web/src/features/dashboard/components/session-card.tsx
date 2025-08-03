"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ExternalLink, Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  title: string;
  tags: string[];
  jsonFileUrl: string;
  duration?: string;
  instructor?: string;
}

export const SessionCard = ({
  title,
  tags,
  jsonFileUrl,
  duration,
  instructor,
}: SessionCardProps) => {
  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:shadow-wellness-calm/20 hover:-translate-y-1 bg-gradient-to-br from-card to-wellness-peace/30 border-wellness-calm/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-foreground leading-tight">
            {title}
          </CardTitle>
          <Link
            href={jsonFileUrl}
            className={cn(
              buttonVariants({ size: "sm", variant: "ghost" }),
              "shrink-0 h-8 w-8 p-0 hover:bg-wellness-calm/10 hover:text-wellness-calm",
            )}
          >
            <Play className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-wellness-calm/10 text-wellness-calm border-wellness-calm/20 hover:bg-wellness-calm/20"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground space-y-1">
            {duration && <div>Duration: {duration}</div>}
            {instructor && <div>By {instructor}</div>}
          </div>

          <Link
            href={jsonFileUrl}
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-wellness-calm hover:bg-wellness-calm/90 text-white",
            )}
          >
            <>
              <ExternalLink className="h-3 w-3 mr-1" />
              View
            </>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
