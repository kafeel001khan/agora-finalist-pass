export function AgoraLogo() {
  return (
    <div className="agora-brand">
      <div className="agora-brand__lockup" aria-label="agora">
        <span className="agora-brand__word">agora</span>
        <svg className="agora-brand__wave" viewBox="0 0 54 32" aria-hidden="true">
          <text x="0" y="24" className="agora-brand__brace">
            {"{"}
          </text>
          <rect x="13" y="15" width="2.5" height="7" rx="1" fill="#64748b" />
          <rect x="18" y="10" width="2.5" height="17" rx="1" fill="#94a3b8" />
          <rect x="23" y="5" width="2.5" height="27" rx="1" fill="#cbd5e1" />
          <rect x="28" y="8" width="2.5" height="21" rx="1" fill="#94a3b8" />
          <rect x="33" y="13" width="2.5" height="11" rx="1" fill="#64748b" />
          <text x="40" y="24" className="agora-brand__brace">
            {"}"}
          </text>
        </svg>
      </div>
      <p className="agora-brand__label">Conversational AI Engine</p>
    </div>
  );
}
