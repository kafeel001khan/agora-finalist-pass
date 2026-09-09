import { useEffect, useState } from "react";
import { getAgoraBrandDataUrl } from "../lib/agoraLogo";

export function AgoraLogo() {
  const [brandSrc, setBrandSrc] = useState<string | null>(null);

  useEffect(() => {
    getAgoraBrandDataUrl()
      .then(setBrandSrc)
      .catch(() => setBrandSrc(null));
  }, []);

  return (
    <div className="agora-brand">
      {brandSrc ? (
        <img className="agora-brand__img" src={brandSrc} alt="agora Conversational AI Engine" />
      ) : (
        <div className="agora-brand__img agora-brand__img--placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
