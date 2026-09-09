import { EVENT } from "../config/event";
import type { PassRecord } from "../types/pass";

const KEY = "echo-finalist-passes";

function store(): Record<string, PassRecord> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, PassRecord>;
  } catch {
    return {};
  }
}

export function savePass(pass: PassRecord): void {
  const data = store();
  data[pass.passId] = pass;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadPass(passId: string): PassRecord | null {
  return store()[passId] ?? null;
}

export function passUrl(pass: PassRecord, origin = window.location.origin): string {
  return `${origin}/pass/${pass.passId}`;
}

export function generatePassId(): string {
  const n = Number(localStorage.getItem("echo-pass-counter") ?? "100") + 1;
  localStorage.setItem("echo-pass-counter", String(n));
  return `${EVENT.passIdPrefix}-${String(n).padStart(5, "0")}`;
}

export function previewPassId(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `${EVENT.passIdPrefix}-${String((h % 90000) + 10000).padStart(5, "0")}`;
}
