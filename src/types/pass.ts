export type PassRecord = {
  passId: string;
  name: string;
  teamName: string;
  photoDataUrl: string;
  eventId: string;
  createdAt: string;
};

export type AppError =
  | "photo_invalid"
  | "photo_too_large"
  | "name_required"
  | "team_required"
  | "photo_required"
  | "generation_failed";

export type GenerationStep = "idle" | "preparing" | "photo" | "render" | "ready" | "error";
