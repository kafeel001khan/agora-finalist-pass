import { useEffect, useRef, useState } from "react";
import {
  displayBoxToCrop,
  getDisplayedImageRect,
  processPhotoFile,
  validatePhotoFile,
} from "../lib/image";

type PhotoUploaderProps = {
  previewUrl: string | null;
  onPhotoReady: (url: string) => void;
  onClear: () => void;
  onError: () => void;
};

export function PhotoUploader({ previewUrl, onPhotoReady, onClear, onError }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [original, setOriginal] = useState<File | null>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (validatePhotoFile(file) !== "ok") return onError();
    setOriginal(file);
    try {
      onPhotoReady(await processPhotoFile(file));
    } catch {
      onError();
    }
  };

  return (
    <>
      <div className="field">
        <label className="field-label" htmlFor="photo">Upload your photo</label>
        <div
          className={`upload-zone ${previewUrl ? "has-file" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          <div>
            <strong>Click or drag photo</strong>
            <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>JPG, PNG, WebP · Max 5MB</p>
            {previewUrl && (
              <div className="upload-actions">
                <button type="button" className="text-btn" onClick={(e) => { e.stopPropagation(); if (original) setCropFile(original); }}>Adjust crop</button>
                <button type="button" className="text-btn" onClick={(e) => { e.stopPropagation(); onClear(); }}>Remove</button>
              </div>
            )}
          </div>
          {previewUrl && <img className="upload-preview" src={previewUrl} alt="Preview" />}
        </div>
        <input ref={inputRef} id="photo" type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { void handleFile(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
      {cropFile && (
        <CropModal
          file={cropFile}
          onCancel={() => setCropFile(null)}
          onDone={async (crop) => {
            try {
              onPhotoReady(await processPhotoFile(cropFile, crop));
              setCropFile(null);
            } catch {
              onError();
            }
          }}
        />
      )}
    </>
  );
}

function CropModal({ file, onCancel, onDone }: { file: File; onCancel: () => void; onDone: (crop: { x: number; y: number; size: number }) => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [src, setSrc] = useState("");
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [box, setBox] = useState({ x: 0, y: 0, size: 180 });
  const [display, setDisplay] = useState<ReturnType<typeof getDisplayedImageRect> | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const img = imgRef.current;
    const stage = stageRef.current;
    if (!img || !stage) return;
    const load = () => {
      const rect = getDisplayedImageRect(stage.clientWidth, stage.clientHeight, img.naturalWidth, img.naturalHeight);
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      setDisplay(rect);
      const size = Math.min(rect.renderedW, rect.renderedH) * 0.8;
      setBox({ x: rect.offsetX + (rect.renderedW - size) / 2, y: rect.offsetY + (rect.renderedH - size) / 2, size });
    };
    img.addEventListener("load", load);
    if (img.complete) load();
    return () => img.removeEventListener("load", load);
  }, [src]);

  return (
    <div className="crop-overlay">
      <div className="crop-panel">
        <p className="field-label">Adjust crop</p>
        <div className="crop-stage" ref={stageRef}>
          <img ref={imgRef} src={src} alt="Crop" />
          <div className="crop-box" style={{ left: box.x, top: box.y, width: box.size, height: box.size }} />
        </div>
        <div className="upload-actions" style={{ marginTop: 12 }}>
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn-primary" style={{ width: "auto", flex: 1 }} onClick={() => display && onDone(displayBoxToCrop(box, display, natural.w, natural.h))}>Apply</button>
        </div>
      </div>
    </div>
  );
}
