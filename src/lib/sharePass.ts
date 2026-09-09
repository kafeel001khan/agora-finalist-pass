import { EVENT } from "../config/event";
import { passUrl } from "./passStorage";
import type { PassRecord } from "../types/pass";

export function buildLinkedInCaption(pass: PassRecord): string {
  return [
    "I'm a Finalist ⚡",
    "",
    `${EVENT.nameDisplay} ${EVENT.passSubtitle} — ${EVENT.passTitleGradient} ${EVENT.passTitleBold}`,
    `${EVENT.date} · ${EVENT.venueLine1} ${EVENT.venueLine2}`,
    "",
    `Finalist: ${pass.name}`,
    `Team: ${pass.teamName}`,
    `Pass ID: ${pass.passId}`,
    "",
    EVENT.signoff,
    "",
    "Download your pass image and post it with this caption.",
    passUrl(pass),
    "",
    EVENT.shareHashtags,
  ].join("\n");
}

export function buildTwitterCaption(pass: PassRecord): string {
  return [
    `Finalist Pass ✓ ${EVENT.nameDisplay} ⚡`,
    `${pass.name} · ${pass.teamName}`,
    `${pass.passId} · ${EVENT.date}`,
    "",
    EVENT.shareHashtags,
  ].join("\n");
}

export function getTwitterIntentUrl(pass: PassRecord): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(buildTwitterCaption(pass))}`;
}

export function getLinkedInIntentUrl(pass: PassRecord): string {
  return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(buildLinkedInCaption(pass))}`;
}

export async function copyShareCaption(pass: PassRecord, platform: "linkedin" | "twitter"): Promise<boolean> {
  const text = platform === "linkedin" ? buildLinkedInCaption(pass) : buildTwitterCaption(pass);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
