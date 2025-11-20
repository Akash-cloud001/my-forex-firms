import React from "react";
import Image from "next/image";
const LoadingScreen = ({
  title = "Getting things ready...",
  subtitle = "This will only take a moment.",
}) => {
  return (
    <div style={styles.backdrop}>
      <div>
        {/* Top logo / circle */}
        <Image src="/mff-logo.svg" alt="logo" width={100} height={100} className="mx-auto" />
        {/* Progress bar container */}
        <div style={styles.progressWrapper}>
          <div style={styles.progressTrack}>
            <div style={styles.progressBar} />
          </div>
        </div>

        {/* Small hint text */}
        <p style={styles.hint}>Please don’t close this window.</p>
      </div>
    </div>
  );
};

const shimmerAnimation = `
@keyframes loadingBar {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("loading-screen-animations")) {
  const styleTag = document.createElement("style");
  styleTag.id = "loading-screen-animations";
  styleTag.innerHTML = shimmerAnimation;
  document.head.appendChild(styleTag);
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 60%), var(--background)",
    backdropFilter: "blur(12px)",
    zIndex: 9999,
  },
  card: {
    width: "min(420px, 92vw)",
    borderRadius: "24px",
    padding: "24px 22px 20px",
    background: "var(--card)",
    boxShadow:
      "0 18px 45px rgba(0,0,0,0.55), 0 0 0 1px var(--border)",
    color: "var(--foreground)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    animation: "fadeInUp 0.32s ease-out",
  },
  logoWrapper: {
    width: 52,
    height: 52,
    borderRadius: "999px",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    background:
      "radial-gradient(circle at 30% 0%, var(--primary), transparent 55%)",
    opacity: 0.18,
  },
  logoInner: {
    width: 28,
    height: 28,
    borderRadius: "999px",
    background: "var(--grad-btn)",
    boxShadow: "var(--shadow-primary)",
  },
  textBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  title: {
    fontSize: "1.05rem",
    fontWeight: 600,
    letterSpacing: "0.01em",
    margin: 0,
    color: "var(--foreground)",
  },
  subtitle: {
    fontSize: "0.82rem",
    color: "var(--muted-foreground)",
    margin: 0,
  },
  progressWrapper: {
    marginTop: 4,
  },
  progressTrack: {
    position: "relative",
    width: "100%",
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
    background: "var(--muted)",
    boxShadow: "inset 0 0 0 1px var(--border)",
  },
  progressBar: {
    position: "absolute",
    inset: 0,
    transform: "translateX(-100%)",
    background: "var(--grad-btn)",
    opacity: 0.8,
    animation: "loadingBar 1.4s ease-in-out infinite",
  },
  hint: {
    marginTop: 10,
    fontSize: "0.72rem",
    color: "var(--muted-foreground)",
    textAlign: "right",
  },
};

export default LoadingScreen;
