import { TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-4" data-ocid="analytics.page">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <TrendingUp className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Student performance charts and class-wise comparisons
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <TrendingUp className="size-12 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="font-display font-semibold text-foreground mb-2">
          Analytics Module
        </h2>
        <p className="text-sm text-muted-foreground">
          Coming in the next build wave — per-student charts and exportable
          reports.
        </p>
      </div>
    </div>
  );
}
