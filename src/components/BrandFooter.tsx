import { useEffect, useState } from "react";
import { getKnoticLogoDataUrl } from "../lib/knoticLogo";

function KnoticLogoMark({ height = 24, className }: { height?: number; className?: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    getKnoticLogoDataUrl()
      .then(setSrc)
      .catch(() => setSrc("/knotic-logo.png"));
  }, []);

  return (
    <img
      className={className}
      src={src ?? "/knotic-logo.png"}
      alt="KNOTiC"
      height={height}
      loading="eager"
      decoding="async"
    />
  );
}

export function BrandFooter() {
  return (
    <div className="brand-footer" aria-label="Powered by KNOTiC">
      <span className="brand-footer__label">POWERED BY</span>
      <KnoticLogoMark className="brand-footer__logo" height={24} />
    </div>
  );
}
