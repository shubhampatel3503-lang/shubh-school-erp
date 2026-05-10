import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DemandRegisterTab from "@/pages/fees/DemandRegisterTab";
import { FeeHeadingsTab } from "@/pages/fees/FeeHeadingsTab";
import { FeePlansTab } from "@/pages/fees/FeePlansTab";
import { FeeRegisterTab } from "@/pages/fees/FeeRegisterTab";
import {
  BarChart3,
  BookOpen,
  CreditCard,
  FileText,
  IndianRupee,
} from "lucide-react";
import React, { Suspense, useState } from "react";

// ─── Isolated lazy-loaded Collect Fees tab ────────────────────────────────────
// React.lazy ensures CollectFees is code-split from the rest of FeesPage.
// If it ever throws during render, CollectFeesErrorBoundary catches it cleanly.
const CollectFeesTab = React.lazy(() => import("@/pages/fees/CollectFeesTab"));

// Minimal loading skeleton shown while CollectFeesTab bundle is fetching
function CollectFeesSuspenseFallback() {
  return (
    <div
      className="p-6 space-y-4"
      data-ocid="fees.collect.suspense_loading_state"
    >
      <div className="bg-card border border-border rounded-lg px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="h-7 w-28 rounded-full bg-muted animate-pulse" />
        <div className="h-7 w-32 rounded bg-muted animate-pulse" />
        <div className="flex-1 h-8 min-w-[220px] rounded bg-muted animate-pulse" />
      </div>
      <div className="bg-card border border-dashed border-border rounded-xl py-16 text-center flex flex-col items-center gap-3">
        <div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">
          Loading fee collection...
        </p>
      </div>
    </div>
  );
}

// ─── Local Error Boundary for Collect Fees tab ────────────────────────────────
interface CollectEBState {
  hasError: boolean;
  errorCount: number;
}
class CollectFeesErrorBoundary extends React.Component<
  { children: React.ReactNode },
  CollectEBState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }
  static getDerivedStateFromError(): Partial<CollectEBState> {
    return { hasError: true };
  }
  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error("[CollectFeesErrorBoundary]", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
          <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center text-2xl">
            ⚠️
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Collect Fees failed to load
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              An error occurred. Your data is safe.
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              onClick={() =>
                this.setState((s) => ({
                  hasError: false,
                  errorCount: s.errorCount + 1,
                }))
              }
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState("collect");

  return (
    <div className="flex flex-col h-full min-h-0" data-ocid="fees.page">
      {/* Page Header */}
      <div className="bg-card border-b px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <IndianRupee className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Fee Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage fee headings, plans, collections, and registers
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="bg-card border-b px-6 flex-shrink-0">
          <TabsList
            className="h-12 bg-transparent p-0 gap-1"
            data-ocid="fees.tabs"
          >
            <TabsTrigger
              value="headings"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3"
              data-ocid="fees.headings.tab"
            >
              <BookOpen size={14} /> Fee Headings
            </TabsTrigger>
            <TabsTrigger
              value="plans"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3"
              data-ocid="fees.plans.tab"
            >
              <IndianRupee size={14} /> Fee Plans
            </TabsTrigger>
            <TabsTrigger
              value="collect"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3"
              data-ocid="fees.collect.tab"
            >
              <CreditCard size={14} /> Collect Fees
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3"
              data-ocid="fees.register.tab"
            >
              <BarChart3 size={14} /> Fee Register
            </TabsTrigger>
            <TabsTrigger
              value="demand"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3"
              data-ocid="fees.demand.tab"
            >
              <FileText size={14} /> Demand Register
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 overflow-auto bg-background">
          <TabsContent
            value="headings"
            className="m-0 p-0 h-full data-[state=active]:flex data-[state=active]:flex-col"
          >
            <FeeHeadingsTab />
          </TabsContent>
          <TabsContent
            value="plans"
            className="m-0 p-0 h-full data-[state=active]:flex data-[state=active]:flex-col"
          >
            <FeePlansTab />
          </TabsContent>
          <TabsContent
            value="collect"
            className="m-0 p-0 h-full data-[state=active]:flex data-[state=active]:flex-col"
          >
            <CollectFeesErrorBoundary>
              <Suspense fallback={<CollectFeesSuspenseFallback />}>
                <CollectFeesTab />
              </Suspense>
            </CollectFeesErrorBoundary>
          </TabsContent>
          <TabsContent
            value="register"
            className="m-0 p-0 h-full data-[state=active]:flex data-[state=active]:flex-col"
          >
            <FeeRegisterTab />
          </TabsContent>
          <TabsContent
            value="demand"
            className="m-0 p-0 h-full data-[state=active]:flex data-[state=active]:flex-col"
          >
            <DemandRegisterTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
