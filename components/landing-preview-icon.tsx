export function LandingPreviewIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Landing page preview"
      className={className}
    >
      <defs>
        <clipPath id="landing-preview-screen">
          <rect x="60" y="120" width="480" height="380" rx="8" />
        </clipPath>
      </defs>

      <rect x="60" y="80" width="480" height="420" rx="16" fill="var(--surface)" />
      <rect
        x="60"
        y="80"
        width="480"
        height="420"
        rx="16"
        fill="none"
        stroke="var(--border)"
        strokeWidth="2"
      />

      <rect x="60" y="80" width="480" height="40" rx="16" fill="var(--muted)" />
      <rect x="60" y="104" width="480" height="16" fill="var(--muted)" />
      <circle cx="86" cy="100" r="6" fill="#F0745A" />
      <circle cx="108" cy="100" r="6" fill="#F2B84B" />
      <circle cx="130" cy="100" r="6" fill="var(--primary)" />

      <g clipPath="url(#landing-preview-screen)">
        <rect x="60" y="120" width="480" height="380" fill="var(--card)" />

        <rect x="90" y="150" width="60" height="14" rx="3" fill="var(--foreground)" />
        <rect x="330" y="152" width="36" height="10" rx="2" fill="var(--muted-foreground)" />
        <rect x="380" y="152" width="36" height="10" rx="2" fill="var(--muted-foreground)" />
        <rect x="430" y="146" width="80" height="22" rx="11" fill="var(--primary)" />

        <rect x="90" y="205" width="280" height="26" rx="4" fill="var(--foreground)" />
        <rect x="90" y="240" width="220" height="26" rx="4" fill="var(--foreground)" />
        <rect x="90" y="286" width="300" height="12" rx="3" fill="var(--muted-foreground)" />
        <rect x="90" y="304" width="220" height="12" rx="3" fill="var(--muted-foreground)" />

        <rect x="90" y="336" width="130" height="34" rx="17" fill="var(--primary)" />
        <rect
          x="238"
          y="336"
          width="110"
          height="34"
          rx="17"
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
        />

        <rect x="90" y="404" width="130" height="76" rx="8" fill="var(--muted)" />
        <rect x="235" y="404" width="130" height="76" rx="8" fill="var(--accent)" fillOpacity="0.35" />
        <rect x="380" y="404" width="130" height="76" rx="8" fill="var(--muted)" />

        <rect x="106" y="420" width="22" height="22" rx="4" fill="var(--primary)" />
        <rect x="251" y="420" width="22" height="22" rx="4" fill="var(--accent)" />
        <rect x="396" y="420" width="22" height="22" rx="4" fill="var(--primary-hover)" />

        <rect x="106" y="452" width="80" height="10" rx="2" fill="var(--muted-foreground)" />
        <rect x="251" y="452" width="80" height="10" rx="2" fill="var(--muted-foreground)" />
        <rect x="396" y="452" width="80" height="10" rx="2" fill="var(--muted-foreground)" />
      </g>
    </svg>
  );
}
