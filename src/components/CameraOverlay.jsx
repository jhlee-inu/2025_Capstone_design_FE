import { useEffect, useRef, useState } from "react";
import { usePersona } from "../context/PersonaContext";

function CameraOverlay({ onClose }) {
  const { persona } = usePersona();
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState("");
  const [personaPosition, setPersonaPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const mediaSupported =
    typeof navigator !== "undefined" &&
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia;

  const avatarSize = 96;

  const personaImages = {
    bear: "/src/assets/bear.png",
    cat: "/src/assets/cat.png",
    panda: "/src/assets/panda.png",
    rabbit: "/src/assets/rabbit.png",
  };

  useEffect(() => {
    if (!mediaSupported) return;

    let cancelled = false;

    const requestStream = async () => {
      const constraintsList = [
        { video: { facingMode: { exact: "environment" } }, audio: false },
        { video: { facingMode: { ideal: "environment" } }, audio: false },
        { video: true, audio: false },
      ];

      let lastError;

      for (const constraints of constraintsList) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia(
            constraints
          );
          if (cancelled) {
            mediaStream.getTracks().forEach((track) => track.stop());
            return;
          }

          streamRef.current = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          setLoading(false);
          return;
        } catch (error) {
          lastError = error;
        }
      }

      if (!cancelled) {
        const message =
          lastError && lastError.name === "NotAllowedError"
            ? "Camera permission is required."
            : "Camera is not available on this device.";
        setError(message);
        setLoading(false);
      }
    };

    requestStream();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [mediaSupported]);

  const avatarSrc = personaImages[persona] || personaImages.bear;

  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setPersonaPosition({
      x: Math.max(0, rect.width - avatarSize - 16),
      y: Math.max(0, rect.height - avatarSize - 16),
    });
  }, [avatarSize]);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updatePersonaPosition = (clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nextX = clientX - rect.left - dragOffsetRef.current.x;
    const nextY = clientY - rect.top - dragOffsetRef.current.y;
    setPersonaPosition({
      x: clamp(nextX, 0, rect.width - avatarSize),
      y: clamp(nextY, 0, rect.height - avatarSize),
    });
  };

  const handlePointerDown = (event) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - rect.left - personaPosition.x,
      y: event.clientY - rect.top - personaPosition.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!dragging) return;
    updatePersonaPosition(event.clientX, event.clientY);
  };

  const handlePointerUp = (event) => {
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    if (!width || !height) return;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const video = videoRef.current;
    const videoWidth = video.videoWidth || width;
    const videoHeight = video.videoHeight || height;
    const scale = Math.max(width / videoWidth, height / videoHeight);
    const drawWidth = videoWidth * scale;
    const drawHeight = videoHeight * scale;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(
        img,
        personaPosition.x,
        personaPosition.y,
        avatarSize,
        avatarSize
      );
      setSnapshot(canvas.toDataURL("image/png"));
    };
    img.src = avatarSrc;
  };

  const handleDownload = () => {
    if (!snapshot) return;
    const link = document.createElement("a");
    link.href = snapshot;
    link.download = "snapshot.png";
    link.click();
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center">
      <div className="relative w-full max-w-[430px] h-full" ref={containerRef}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          playsInline
          muted
          onLoadedMetadata={() => setLoading(false)}
        />

        {mediaSupported && loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
            Loading camera...
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
            {error}
          </div>
        )}

        {!mediaSupported && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
            Camera is not supported on this device.
          </div>
        )}

        <img
          src={avatarSrc}
          alt="persona"
          className="absolute w-50 h-50 object-contain drop-shadow cursor-grab active:cursor-grabbing touch-none"
          style={{ left: personaPosition.x, top: personaPosition.y }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          draggable={false}
        />

        {snapshot && (
          <div className="absolute bottom-6 left-4 h-16 w-16 overflow-hidden rounded-lg border border-white/70 bg-black/40">
            <img
              src={snapshot}
              alt="snapshot preview"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleCapture}
            disabled={loading || !!error}
            className="h-11 px-5 rounded-full bg-white text-sm font-semibold shadow disabled:opacity-50"
          >
            Capture
          </button>
          {snapshot && (
            <button
              type="button"
              onClick={handleDownload}
              className="h-11 px-4 rounded-full bg-black/70 text-white text-sm font-semibold"
            >
              Save
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 text-white text-2xl leading-none"
          aria-label="close camera"
        >
          X
        </button>
      </div>
    </div>
  );
}

export default CameraOverlay;
