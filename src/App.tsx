import { useState } from "react";
import type { Screen, NavTab } from "@/types/navigation.types";
import type { AnalysisMode } from "@/types/analysis.types";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { HomeScreen } from "@/features/home";
import { CameraViewfinder, CropAdjuster } from "@/features/scanner";
import {
  ResultsView,
  QuickAnalysisHub,
  DeepAnalysisHub,
} from "@/features/analysis";
import { HistoryList } from "@/features/history";

export default function App() {
  const [navTab, setNavTab] = useState<NavTab>("home");
  const [screen, setScreen] = useState<Screen>("home");
  const [mode, setMode] = useState<AnalysisMode>("rapida");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropOrigin, setCropOrigin] = useState<"camera" | "home">("home");

  const handleNavChange = (tab: NavTab) => {
    setNavTab(tab);
    if (tab === "home") setScreen("home");
    else if (tab === "rapida") setScreen("home");
    else if (tab === "aprofundada") setScreen("home");
    else if (tab === "historico") setScreen("history");
  };

  const handleSelectGalleryImage = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setCropOrigin("home");
    setScreen("crop");
  };

  const handleCameraCapture = (photoSrc?: string) => {
    if (photoSrc) {
      setSelectedImage(photoSrc);
    }
    setCropOrigin("camera");
    setScreen("crop");
  };

  const showNav = screen !== "camera" && screen !== "crop";

  return (
    <div
      className="min-h-screen w-full bg-[#FBFBFA] flex flex-col text-[#1F2421]"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Top Header */}
      {showNav && (
        <AppHeader activeTab={navTab} onChangeTab={handleNavChange} />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col ${showNav ? "pb-20 md:pb-8" : ""}`}>
        {screen === "camera" ? (
          <CameraViewfinder
            onCapture={handleCameraCapture}
            onBack={() => setScreen("home")}
            onSelectFromGallery={(img) => {
              setSelectedImage(img);
              setCropOrigin("camera");
              setScreen("crop");
            }}
          />
        ) : screen === "crop" ? (
          <CropAdjuster
            imageSrc={selectedImage}
            onConfirm={(croppedImg) => {
              if (croppedImg) {
                setSelectedImage(croppedImg);
              }
              setScreen("results");
            }}
            onBack={() => setScreen(cropOrigin)}
          />
        ) : screen === "results" ? (
          <ResultsView
            mode={mode}
            imageSrc={selectedImage}
            onBack={() => setScreen("home")}
          />
        ) : (
          <>
            {navTab === "home" && (
              <HomeScreen
                mode={mode}
                setMode={setMode}
                onCapture={() => {
                  setSelectedImage(null);
                  setScreen("camera");
                }}
                onSelectImage={handleSelectGalleryImage}
                onSnippetClick={() => setScreen("results")}
                onViewAllHistory={() => handleNavChange("historico")}
              />
            )}
            {navTab === "rapida" && (
              <QuickAnalysisHub onScan={() => setScreen("camera")} />
            )}
            {navTab === "aprofundada" && (
              <DeepAnalysisHub
                onScan={() => {
                  setMode("aprofundada");
                  setScreen("camera");
                }}
              />
            )}
            {navTab === "historico" && (
              <HistoryList onItemClick={() => setScreen("results")} />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation for Mobile */}
      {showNav && <BottomNav active={navTab} onChange={handleNavChange} />}
    </div>
  );
}
