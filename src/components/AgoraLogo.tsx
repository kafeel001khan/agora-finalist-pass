import { useEffect, useState } from "react";
import { AGORA_LABEL, getAgoraLockupDataUrl } from "../lib/agoraLogo";

export function AgoraLogo() {
  const [lockupSrc, setLockupSrc] = useState<string | null>(null);

  useEffect(() => {
    getAgoraLockupDataUrl()
      .then(setLockupSrc)
      .catch(() => setLockupSrc(null));
  }, []);

  return (
    <div className="agora-brand">
      {lockupSrc ? (
        <img className="agora-brand__lockup-img" src={lockupSrc} alt="agora" />
      ) : (
        <div className="agora-brand__lockup-img agora-brand__lockup-img--placeholder" aria-hidden="true" />
      )}
      <p className="agora-brand__label">{AGORA_LABEL}</p>
    </div>
  );
}
