import { useState, useEffect, useRef, useCallback } from "react";

interface CameraViewfinderProps {
  onCapture: (photoSrc?: string) => void;
  onBack: () => void;
  onSelectFromGallery?: (imageSrc: string) => void;
}

export function CameraViewfinder({ onCapture, onBack, onSelectFromGallery }: CameraViewfinderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  const [cameraStatus, setCameraStatus] = useState<"requesting" | "active" | "denied">("requesting");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isLevel, setIsLevel] = useState(false);
  const [flash, setFlash] = useState(false);
  const [grid, setGrid] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Check if device has multiple video devices (front and back)
  useEffect(() => {
    if (navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        setHasMultipleCameras(videoInputs.length > 1);
      }).catch(() => {});
    }
  }, []);

  // Start real device camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraStatus("requesting");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Câmera não suportada neste navegador.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setCameraStatus("active");
        };
      } else {
        setCameraStatus("active");
      }
    } catch {
      setCameraStatus("denied");
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    startCamera();
    const t = setTimeout(() => setIsLevel(true), 1500);

    return () => {
      clearTimeout(t);
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Toggle flash or hardware torch
  const toggleFlash = async () => {
    const nextFlash = !flash;
    setFlash(nextFlash);

    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        try {
          const trackWithTorch = track as MediaStreamTrack & {
            applyConstraints?: (c: { advanced: Array<{ torch?: boolean }> }) => Promise<void>;
          };
          if (trackWithTorch.applyConstraints) {
            await trackWithTorch.applyConstraints({
              advanced: [{ torch: nextFlash }],
            });
          }
        } catch {
          // Hardware torch unsupported; screen flash fallback works automatically
        }
      }
    }
  };

  // Switch between front and back camera
  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Capture real photo from live video feed
  const capturePhoto = () => {
    if (shutterFlash) return;
    setShutterFlash(true);

    setTimeout(() => {
      let photoUrl: string | undefined = undefined;
      const video = videoRef.current;

      if (cameraStatus === "active" && video && video.videoWidth > 0 && video.videoHeight > 0) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (facingMode === "user") {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          photoUrl = canvas.toDataURL("image/jpeg", 0.95);
        }
      }

      stopCamera();
      onCapture(photoUrl);
    }, 150);
  };

  // Gallery select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string" && onSelectFromGallery) {
          stopCamera();
          onSelectFromGallery(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // Native camera file fallback (when browser permissions are denied or unsupported)
  const handleNativeCameraFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          stopCamera();
          onCapture(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleBack = () => {
    stopCamera();
    onBack();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 select-none">
      <div className="w-full h-full sm:h-auto sm:max-w-md sm:aspect-[3/4.2] bg-neutral-950 sm:rounded-3xl overflow-hidden relative flex flex-col shadow-2xl border border-white/10">
        
        {/* Hidden inputs for gallery & native camera fallback */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={nativeCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleNativeCameraFile}
        />

        {/* Shutter flash animation overlay */}
        {shutterFlash && (
          <div className="absolute inset-0 bg-white z-50 transition-opacity duration-200 pointer-events-none" />
        )}

        {/* Screen flash light simulator */}
        {flash && (
          <div className="absolute inset-0 bg-white/25 pointer-events-none z-10" />
        )}

        {/* Top Controls Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-4 pb-3 px-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer text-white"
            title="Voltar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold backdrop-blur-sm transition-colors duration-500 ${
              cameraStatus === "active"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : cameraStatus === "requesting"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                cameraStatus === "active"
                  ? "bg-emerald-400 animate-pulse"
                  : cameraStatus === "requesting"
                  ? "bg-blue-400 animate-ping"
                  : "bg-amber-400"
              }`}
            />
            {cameraStatus === "active"
              ? "Câmera Ativa"
              : cameraStatus === "requesting"
              ? "Conectando..."
              : "Sem Acesso à Câmera"}
          </div>

          <div className="flex items-center gap-2">
            {/* Flip camera if multiple cameras exist */}
            {hasMultipleCameras && (
              <button
                onClick={toggleCameraFacing}
                title="Inverter Câmera (Frontal / Traseira)"
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
              >
                <span className="text-[16px]">🔄</span>
              </button>
            )}

            {/* Torch / Flash button */}
            <button
              onClick={toggleFlash}
              title="Alternar Flash"
              className={`w-10 h-10 rounded-full backdrop-blur-sm border flex items-center justify-center transition-colors cursor-pointer ${
                flash ? "bg-amber-400/40 border-amber-400" : "bg-black/50 border-white/15"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <polygon
                  points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                  stroke={flash ? "#FCD34D" : "white"}
                  strokeWidth="2"
                  fill={flash ? "#FCD34D" : "none"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Live Camera Viewfinder or Fallback View */}
        <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center overflow-hidden">
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              cameraStatus === "active" ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Fallback & Loading states */}
          {cameraStatus === "requesting" && (
            <div className="flex flex-col items-center gap-3 p-6 text-center text-white z-10">
              <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <p className="text-[13px] font-medium">Iniciando câmera do dispositivo...</p>
              <p className="text-[11px] text-white/50">Permita o acesso à câmera para fotografar</p>
            </div>
          )}

          {cameraStatus === "denied" && (
            <div className="flex flex-col items-center gap-3.5 p-6 text-center text-white z-20 max-w-[280px]">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl">
                📷
              </div>
              <div>
                <p className="text-[14px] font-semibold">Câmera não disponível</p>
                <p className="text-[11px] text-white/60 mt-0.5 leading-relaxed">
                  Você pode abrir a câmera nativa do seu aparelho ou tentar novamente.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full mt-1">
                <button
                  type="button"
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-[12px] font-semibold cursor-pointer shadow-lg"
                >
                  📸 Abrir Câmera do Aparelho
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[12px] font-medium cursor-pointer"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Document Scanner Frame Guides Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none z-20">
          <div className="relative w-full max-w-[300px] aspect-[0.707]">
            {/* Corner alignment brackets */}
            {[
              "top-0 left-0",
              "top-0 right-0 rotate-90",
              "bottom-0 right-0 rotate-180",
              "bottom-0 left-0 -rotate-90",
            ].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-8 h-8`}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M2 16V2H16"
                    stroke={isLevel ? "#34D399" : "#60A5FA"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="transition-colors duration-500"
                  />
                </svg>
              </div>
            ))}

            {/* Grid overlay */}
            {grid && (
              <div className="absolute inset-0 opacity-30">
                {[33, 66].map((p) => (
                  <div key={`h${p}`} className="absolute w-full h-px bg-white/50" style={{ top: `${p}%` }} />
                ))}
                {[33, 66].map((p) => (
                  <div key={`v${p}`} className="absolute h-full w-px bg-white/50" style={{ left: `${p}%` }} />
                ))}
              </div>
            )}

            {/* Dynamic laser scan line */}
            <div
              className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-bounce opacity-60"
              style={{ top: "45%", animationDuration: "2.4s" }}
            />
          </div>
        </div>

        {/* Level Indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none" style={{ top: "35%" }}>
          <div
            className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${
              isLevel ? "border-emerald-400" : "border-blue-400"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                isLevel ? "bg-emerald-400 scale-100" : "bg-blue-400 scale-75 translate-x-1 -translate-y-0.5"
              }`}
            />
          </div>
          {isLevel && (
            <div className="text-center mt-1">
              <span className="text-[9px] text-emerald-400 font-semibold bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                Enquadramento Correto
              </span>
            </div>
          )}
        </div>

        {/* Bottom Shutter & Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-6 pt-8 px-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
          <div className="flex items-center justify-between mb-4">
            {/* Gallery Picker Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Escolher da Galeria"
              className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all cursor-pointer text-white"
            >
              <span className="text-[18px]">🖼️</span>
            </button>

            {/* Big Shutter Capture Button */}
            <button
              onClick={capturePhoto}
              title="Capturar Foto da Página"
              className="relative rounded-full active:scale-90 transition-transform cursor-pointer"
              style={{ width: 72, height: 72 }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-white/60 shadow-lg shadow-black/50" />
              <div className="absolute inset-2 rounded-full bg-white hover:bg-neutral-100 transition-colors shadow-inner flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
              </div>
            </button>

            {/* Grid Toggle Button */}
            <button
              onClick={() => setGrid(!grid)}
              title="Alternar Grade"
              className={`w-12 h-12 rounded-xl backdrop-blur-sm border flex items-center justify-center transition-colors cursor-pointer ${
                grid ? "bg-white/25 border-white/50 text-white" : "bg-white/10 border-white/20 text-white"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="1" stroke="white" strokeWidth="1.6" />
                <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="white" strokeWidth="1.2" />
              </svg>
            </button>
          </div>

          <button
            onClick={handleBack}
            className="w-full py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[13px] font-medium hover:bg-white/20 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
