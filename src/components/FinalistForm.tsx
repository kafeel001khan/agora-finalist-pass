import { EVENT } from "../config/event";
import type { AppError, GenerationStep } from "../types/pass";
import { PhotoUploader } from "./PhotoUploader";

type Props = {
  name: string;
  teamName: string;
  passId: string;
  photoPreview: string | null;
  loadingStep: GenerationStep;
  error: AppError | null;
  onNameChange: (v: string) => void;
  onTeamChange: (v: string) => void;
  onPhotoReady: (url: string) => void;
  onPhotoClear: () => void;
  onSubmit: () => void;
  onError: (e: AppError) => void;
};

export function FinalistForm({
  name,
  teamName,
  passId,
  photoPreview,
  loadingStep,
  error,
  onNameChange,
  onTeamChange,
  onPhotoReady,
  onPhotoClear,
  onSubmit,
  onError,
}: Props) {
  const busy = loadingStep !== "idle" && loadingStep !== "ready" && loadingStep !== "error";

  return (
    <section>
      <p className="hero-kicker">{EVENT.sideTagline}</p>
      <h1 className="hero-title">
        Create Your
        <br />
        <span className="grad">Grand Finalist</span>
      </h1>
      <p className="hero-subtitle">{EVENT.subtitle}</p>

      {error && (
        <div className="error-banner" role="alert">
          {error === "photo_invalid" || error === "photo_too_large"
            ? "Please upload a JPG, PNG or WebP under 5MB."
            : error === "name_required"
              ? "Enter your grand finalist name."
              : error === "team_required"
                ? "Enter your team name."
                : error === "photo_required"
                  ? "Upload a photo to continue."
                  : "Something went wrong. Please try again."}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="field">
          <label className="field-label" htmlFor="name">
            Grand Finalist name
          </label>
          <input
            id="name"
            className="field-input"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your name here"
            maxLength={80}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="team">
            Team name
          </label>
          <input
            id="team"
            className="field-input"
            value={teamName}
            onChange={(e) => onTeamChange(e.target.value)}
            placeholder="Your team name"
            maxLength={80}
          />
        </div>

        <PhotoUploader
          previewUrl={photoPreview}
          onPhotoReady={onPhotoReady}
          onClear={onPhotoClear}
          onError={() => onError("photo_invalid")}
        />

        <div className="field">
          <span className="field-label">Pass ID</span>
          <div className="field-readonly">{passId}</div>
        </div>

        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Generating…" : "Generate My Pass →"}
        </button>
      </form>
    </section>
  );
}
