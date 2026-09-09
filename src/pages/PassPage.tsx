import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadPass } from "../lib/passStorage";
import type { PassRecord } from "../types/pass";
import { FinalistPassPreview } from "../components/FinalistPassPreview";
import { PassActions } from "../components/PassActions";

export function PassPage() {
  const { passId = "" } = useParams();
  const [pass, setPass] = useState<PassRecord | null>(null);

  useEffect(() => {
    setPass(loadPass(passId));
  }, [passId]);

  if (!pass) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1 className="hero-title">Pass not found</h1>
        <p className="hero-subtitle">Create a new finalist pass on this device.</p>
        <Link className="btn-secondary" to="/">
          Create pass
        </Link>
      </div>
    );
  }

  return (
    <div className="page-grid">
      <PassActions pass={pass} />
      <FinalistPassPreview
        name={pass.name}
        teamName={pass.teamName}
        passId={pass.passId}
        photoUrl={pass.photoDataUrl}
      />
    </div>
  );
}
