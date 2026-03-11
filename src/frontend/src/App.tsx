import { Toaster } from "@/components/ui/sonner";
import React, { useState } from "react";
import type { UserProfile } from "./backend.d";
import { useMusicPlayer } from "./hooks/useMusicPlayer";
import { CameraVerificationPage } from "./pages/CameraVerificationPage";
import { DisplayNamePage } from "./pages/DisplayNamePage";
import { HomePage } from "./pages/HomePage";
import { IDVerificationPage } from "./pages/IDVerificationPage";
import { LoginPage } from "./pages/LoginPage";
import { ParentalControlsPage } from "./pages/ParentalControlsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SettingsPage } from "./pages/SettingsPage";

export type PageName =
  | "home"
  | "login"
  | "register"
  | "settings"
  | "camera-verify"
  | "id-verify"
  | "display-name"
  | "parental-controls";

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("home");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [tempUsername, setTempUsername] = useState<string>("");
  const [verifiedAge, setVerifiedAge] = useState<number | null>(null);
  const { volume, setVolume, isMuted } = useMusicPlayer();

  const navigate = (page: PageName) => {
    setCurrentPage(page);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegister = (username: string) => {
    setTempUsername(username);
    // Create minimal user profile for UI state
    setCurrentUser({
      username,
      displayName: "",
      dob: BigInt(0),
      ageVerified: false,
      cameraVerification: false,
      passwordHash: "",
      parentalControls: {
        contentFilterEnabled: true,
        maxAgeRating: BigInt(1),
      },
    });
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setTempUsername(user.username);
  };

  const handleAgeVerified = (age: number) => {
    setVerifiedAge(age);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        ageVerified: true,
        verifiedAge: BigInt(age),
      });
    }
  };

  const handleDisplayNameSet = (name: string) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, displayName: name });
    }
  };

  const handleParentalControlsUpdate = (
    contentFilter: boolean,
    maxRating: number,
  ) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        parentalControls: {
          contentFilterEnabled: contentFilter,
          maxAgeRating: BigInt(maxRating),
        },
      });
    }
  };

  const activeUsername = currentUser?.username || tempUsername;

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={navigate} />;

      case "register":
        return (
          <RegisterPage onNavigate={navigate} onRegister={handleRegister} />
        );

      case "login":
        return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;

      case "settings":
        return (
          <SettingsPage
            onNavigate={navigate}
            currentUser={currentUser}
            volume={volume}
            setVolume={setVolume}
            isMuted={isMuted}
          />
        );

      case "camera-verify":
        return (
          <CameraVerificationPage
            onNavigate={navigate}
            currentUsername={activeUsername}
            onAgeVerified={handleAgeVerified}
          />
        );

      case "id-verify":
        return (
          <IDVerificationPage
            onNavigate={navigate}
            currentUsername={activeUsername}
            onAgeVerified={handleAgeVerified}
          />
        );

      case "display-name":
        return (
          <DisplayNamePage
            onNavigate={navigate}
            currentUsername={activeUsername}
            onDisplayNameSet={handleDisplayNameSet}
          />
        );

      case "parental-controls":
        return (
          <ParentalControlsPage
            onNavigate={navigate}
            currentUsername={activeUsername}
            currentUser={currentUser}
            onParentalControlsUpdate={handleParentalControlsUpdate}
          />
        );

      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  // Suppress the unused variable warning - verifiedAge is used for state tracking
  void verifiedAge;

  return (
    <>
      {renderPage()}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.13 0.04 265)",
            border: "2px solid oklch(0.35 0.12 245)",
            color: "oklch(0.97 0.01 265)",
            fontFamily: "Share Tech Mono, monospace",
            fontSize: "12px",
          },
        }}
      />
    </>
  );
}

export default App;
