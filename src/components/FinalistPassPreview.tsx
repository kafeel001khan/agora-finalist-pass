import { useEffect, useRef } from "react";
import { EVENT } from "../config/event";
import type { PassRecord } from "../types/pass";
import { BrandFooter } from "./BrandFooter";
import { AgoraLogo } from "./AgoraLogo";

function CalendarIcon() {
  return (
    <svg className="meta-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="meta-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="11" r="2.2" fill="currentColor" />
    </svg>
  );
}

function QR({ passId }: { passId: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const url = `${window.location.origin}/pass/${passId}`;

    import("../lib/qr").then(({ renderQrCanvas }) =>
      renderQrCanvas(url, 48).then((canvas) => {
        if (cancelled || !ref.current) return;
        canvas.setAttribute("role", "img");
        canvas.setAttribute("aria-label", "Pass verification QR code");
        ref.current.replaceChildren(canvas);
      }),
    );

    return () => {
      cancelled = true;
    };
  }, [passId]);

  return <div className="badge-qr" ref={ref} />;
}

type Props = {
  name: string;
  teamName: string;
  passId: string;
  photoUrl: string | null;
  pass?: PassRecord | null;
};

export function FinalistPassPreview({ name, teamName, passId, photoUrl }: Props) {
  const displayName = name.trim() || "Your Name";
  const displayTeam = teamName.trim() || "TEAM NAME";

  return (
    <div className="pass-poster" aria-label="Grand Finalist pass preview">
      <div className="pass-poster__ribbon pass-poster__ribbon--a" aria-hidden="true" />
      <div className="pass-poster__ribbon pass-poster__ribbon--b" aria-hidden="true" />
      <div className="pass-poster__orb pass-poster__orb--a" aria-hidden="true" />
      <div className="pass-poster__orb pass-poster__orb--b" aria-hidden="true" />
      <div className="pass-poster__orb pass-poster__orb--c" aria-hidden="true" />

      <div className="lanyard-unit">
        <svg className="lanyard-strap" viewBox="0 0 48 96" aria-hidden="true">
          <defs>
            <linearGradient id="strapFabric" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="45%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
            <linearGradient id="strapClip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
          <rect x="14" y="0" width="20" height="72" rx="6" fill="url(#strapFabric)" />
          <rect x="16" y="8" width="16" height="2" rx="1" fill="rgba(255,255,255,0.35)" />
          <rect x="16" y="24" width="16" height="2" rx="1" fill="rgba(255,255,255,0.25)" />
          <rect x="16" y="40" width="16" height="2" rx="1" fill="rgba(255,255,255,0.25)" />
          <rect x="16" y="56" width="16" height="2" rx="1" fill="rgba(255,255,255,0.35)" />
          <rect x="10" y="72" width="28" height="10" rx="3" fill="url(#strapClip)" />
          <rect x="18" y="82" width="12" height="6" rx="2" fill="#64748b" />
        </svg>

        <article className="badge-card">
          <div className="badge-card__shine" aria-hidden="true" />

          <div className="badge-card__brands">
            <AgoraLogo />
            <div className="poster-brand poster-brand--echo">
              <span className="poster-brand__echo">
                Echo<span className="poster-brand__sphere">Sphere</span>
              </span>
              <span className="poster-brand__hack">{EVENT.hackathonLabel}</span>
            </div>
          </div>

          <p className="badge-event">{EVENT.name}</p>

          <div className="badge-title">
            <span className="badge-title__gradient">{EVENT.passTitleGradient}</span>
            <span className="badge-title__pass">{EVENT.passTitleBold}</span>
          </div>

          <div className="badge-finale">
            <span className="badge-finale__line" />
            <span>{EVENT.passSubtitle}</span>
            <span className="badge-finale__line" />
          </div>

          <div className="badge-photo-wrap">
            {photoUrl ? (
              <img className="badge-photo" src={photoUrl} alt={displayName} />
            ) : (
              <div className="badge-photo badge-photo--placeholder" aria-hidden="true" />
            )}
          </div>

          <h2 className="badge-name">{displayName}</h2>
          <p className="badge-team">{displayTeam}</p>

          <div className="badge-meta">
            <div className="badge-meta__col">
              <CalendarIcon />
              <div>
                <div className="badge-meta__primary">{EVENT.date}</div>
                <div className="badge-meta__secondary">{EVENT.day}</div>
              </div>
            </div>
            <div className="badge-meta__divider" aria-hidden="true" />
            <div className="badge-meta__col">
              <PinIcon />
              <div>
                <div className="badge-meta__primary">{EVENT.venueLine1}</div>
                <div className="badge-meta__secondary">{EVENT.venueLine2}</div>
              </div>
            </div>
          </div>

          <QR passId={passId} />
          <p className="badge-pass-id">PASS ID {passId}</p>

          <footer className="badge-card__footer">
            <BrandFooter />
            <p className="badge-hashtag">#EchoSphere2026</p>
          </footer>
        </article>
      </div>

      <footer className="pass-poster__footer">
        <div className="pass-poster__signoff">
          <p className="pass-signoff">{EVENT.signoff}</p>
        </div>
      </footer>
    </div>
  );
}
