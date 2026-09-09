import {
  AGORA_LABEL,
  LOCKUP_DISPLAY_HEIGHT,
  LOCKUP_DISPLAY_WIDTH,
  LOCKUP_SRC,
} from "../lib/agoraLogo";

export function AgoraLogo() {
  return (
    <div className="agora-brand">
      <img
        className="agora-brand__lockup-img"
        src={LOCKUP_SRC}
        width={LOCKUP_DISPLAY_WIDTH}
        height={LOCKUP_DISPLAY_HEIGHT}
        alt="agora"
        decoding="sync"
      />
      <p className="agora-brand__label">{AGORA_LABEL}</p>
    </div>
  );
}
