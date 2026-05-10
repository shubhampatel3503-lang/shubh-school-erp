import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ShieldOff } from "lucide-react";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center p-8"
      data-ocid="unauthorized.page"
    >
      <div className="size-20 rounded-full bg-destructive/10 flex items-center justify-center">
        <ShieldOff className="size-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Access Denied
        </h1>
        <p className="text-muted-foreground max-w-sm">
          You don't have permission to access this page. Contact your
          administrator to request access.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/dashboard" })}
          data-ocid="unauthorized.dashboard_button"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
