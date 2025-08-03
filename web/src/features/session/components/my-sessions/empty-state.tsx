import { Plus } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-wellness-sage-light rounded-full flex items-center justify-center mb-4">
        <Plus className="h-8 w-8 text-wellness-sage" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
      <p className="text-muted-foreground mb-4">
        Create your first wellness session to get started
      </p>
    </div>
  );
};
