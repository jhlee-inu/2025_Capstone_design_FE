// layouts/AppLayout.jsx
import BottomTab from "../components/BottomTab";

export default function AppLayout({
  header,
  children,
  showBottomTab = true,
}) {
  return (
    <div
      className="flex flex-col w-full"
      style={{ height: "var(--app-height, 100vh)" }}
    >
      {/* Header */}
      {header}

      {/* Content */}
      <main className="flex-1 min-h-0 relative overflow-y-auto">
        {children}
      </main>

      {/* BottomTab */}
      {showBottomTab && (
        <div
          className="flex-shrink-0 bg-white"
          style={{
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
            minHeight: "calc(4rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="h-16">
            <BottomTab />
          </div>
        </div>
      )}
    </div>
  );
}
