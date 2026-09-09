import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePassId, previewPassId, savePass } from "../lib/passStorage";
import type { AppError, GenerationStep, PassRecord } from "../types/pass";
import { FinalistForm } from "./FinalistForm";
import { FinalistPassPreview } from "./FinalistPassPreview";
import { PassActions } from "./PassActions";

export function FinalistPassCreator() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [passId, setPassId] = useState(() => previewPassId(""));
  const [step, setStep] = useState<GenerationStep>("idle");
  const [error, setError] = useState<AppError | null>(null);
  const [pass, setPass] = useState<PassRecord | null>(null);

  useEffect(() => {
    const seed = `${name}${teamName}`;
    setPassId(seed.trim() ? previewPassId(seed) : previewPassId("preview"));
  }, [name, teamName]);

  const generate = async () => {
    setError(null);
    if (name.trim().length < 2) return setError("name_required");
    if (teamName.trim().length < 2) return setError("team_required");
    if (!photo) return setError("photo_required");

    setStep("preparing");
    await new Promise((r) => setTimeout(r, 200));
    setStep("photo");
    await new Promise((r) => setTimeout(r, 200));
    setStep("render");

    const finalId = generatePassId();
    const record: PassRecord = {
      passId: finalId,
      name: name.trim(),
      teamName: teamName.trim(),
      photoDataUrl: photo,
      eventId: "echosphere-2026",
      createdAt: new Date().toISOString(),
    };

    savePass(record);
    setPassId(finalId);
    setPass(record);
    setStep("ready");
    navigate(`/pass/${finalId}`, { replace: true });
  };

  return (
    <div className="page-grid">
      <FinalistForm
        name={name}
        teamName={teamName}
        passId={passId}
        photoPreview={photo}
        loadingStep={step}
        error={error}
        onNameChange={setName}
        onTeamChange={setTeamName}
        onPhotoReady={setPhoto}
        onPhotoClear={() => setPhoto(null)}
        onSubmit={generate}
        onError={setError}
      />
      <div className="preview-col">
        <FinalistPassPreview name={name} teamName={teamName} passId={passId} photoUrl={photo} />
        {pass && step === "ready" && <PassActions pass={pass} />}
      </div>
    </div>
  );
}
