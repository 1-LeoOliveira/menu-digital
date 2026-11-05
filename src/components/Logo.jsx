export function Logo({ className = '' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="logo-fire" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF5B1A" />
          <stop offset="100%" stopColor="#FFB020" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#logo-fire)" />
      <circle cx="24" cy="24" r="20.5" fill="#0A0908" />
      {/* pão de cima */}
      <path
        d="M11 20c0-6.2 5.8-10.5 13-10.5S37 13.8 37 20H11Z"
        fill="url(#logo-fire)"
      />
      {/* recheio */}
      <rect x="10.5" y="22" width="27" height="3.4" rx="1.7" fill="#F6F1E8" />
      <rect x="10.5" y="27" width="27" height="4.2" rx="2.1" fill="url(#logo-fire)" />
      {/* pão de baixo */}
      <path
        d="M11.5 33h25c0 3.6-2.6 5.6-7 5.6h-11c-4.4 0-7-2-7-5.6Z"
        fill="#F6F1E8"
      />
      {/* gergelim */}
      <circle cx="19" cy="15.5" r="1.05" fill="#0A0908" opacity=".55" />
      <circle cx="25.5" cy="13.8" r="1.05" fill="#0A0908" opacity=".55" />
      <circle cx="31" cy="16.4" r="1.05" fill="#0A0908" opacity=".55" />
    </svg>
  )
}
