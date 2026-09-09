import { useState } from "react";
import { Link } from "react-router-dom";
import { downloadPassPng } from "../lib/downloadPass";
import {
  copyShareCaption,
  getLinkedInIntentUrl,
  getTwitterIntentUrl,
} from "../lib/sharePass";
import type { PassRecord } from "../types/pass";

export function PassActions({ pass }: { pass: PassRecord }) {
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <>
      {msg && <div className="info-banner">{msg}</div>}
      <div className="success-banner">
        <strong>✓ Your pass is ready</strong>
        <p style={{ marginTop: 6 }}>
          Download your pass PNG and share with {`#EchoSphere2026 #KNOTiC`}.
        </p>
      </div>
      <div className="actions-grid two">
        <button
          type="button"
          className="btn-secondary"
          onClick={async () => {
            try {
              await downloadPassPng(pass);
              setMsg("Pass downloaded. Attach it to your LinkedIn or X post.");
            } catch {
              setMsg("Download failed.");
            }
          }}
        >
          Download Pass
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={async () => {
            const ok = await copyShareCaption(pass, "linkedin");
            setMsg(ok ? "LinkedIn caption copied." : "Copy failed.");
          }}
        >
          Copy for LinkedIn
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={async () => {
            const ok = await copyShareCaption(pass, "twitter");
            setMsg(ok ? "X caption copied." : "Copy failed.");
          }}
        >
          Copy for X
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            window.open(getLinkedInIntentUrl(pass), "_blank", "noopener,noreferrer");
            setMsg("LinkedIn opened — attach your pass image.");
          }}
        >
          Post on LinkedIn
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            window.open(getTwitterIntentUrl(pass), "_blank", "noopener,noreferrer");
            setMsg("X opened — attach your pass image.");
          }}
        >
          Post on X
        </button>
        <Link className="btn-secondary" to={`/pass/${pass.passId}`} style={{ gridColumn: "1 / -1" }}>
          Open Pass URL
        </Link>
      </div>
    </>
  );
}
