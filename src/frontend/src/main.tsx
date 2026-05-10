import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// ─── Global Error Boundary — catches render errors so app never shows blank screen ──
interface EBState {
  hasError: boolean;
  errorMessage: string;
}
class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  EBState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }
  static getDerivedStateFromError(error: unknown): EBState {
    const msg =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return { hasError: true, errorMessage: msg };
  }
  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error("[GlobalErrorBoundary]", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
            background: "#f8fafc",
            color: "#1e293b",
          }}
        >
          <div
            style={{
              maxWidth: 480,
              textAlign: "center",
              background: "#fff",
              borderRadius: 12,
              padding: "2rem",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>
              Something went wrong
            </h2>
            <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: 14 }}>
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
    mutations: { retry: 0 },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <App />
      </InternetIdentityProvider>
    </QueryClientProvider>
  </GlobalErrorBoundary>,
);
