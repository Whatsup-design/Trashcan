// app/login/external/page.tsx
// placeholder — coming soon
import Link from "next/link";

export default function ExternalLoginPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
      <p style={{ fontSize: "14px", color: "#94a3b8" }}>External login coming soon</p>
      <Link href="/login" style={{ color: "#1177FE", fontSize: "13px" }}>← Back</Link>
    </div>
  );
}