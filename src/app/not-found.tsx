import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "65vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        background: "#f9fafb",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          maxWidth: "540px",
          width: "100%",
          textAlign: "center",
          background: "#ffffff",
          padding: "48px 32px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            fontSize: "4.5rem",
            fontWeight: 800,
            color: "#1b7f3c",
            lineHeight: 1,
            marginBottom: "16px",
            letterSpacing: "-0.05em",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "12px",
          }}
        >
          Page Not Found
        </h1>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#6b7280",
            lineHeight: 1.6,
            marginBottom: "28px",
          }}
        >
          The page or product you are looking for does not exist, has been removed,
          or is temporarily unavailable.
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              backgroundColor: "#1b7f3c",
              color: "#ffffff",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            Back to Homepage
          </Link>
          <Link
            href="/about"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              border: "1px solid #d1d5db",
            }}
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
