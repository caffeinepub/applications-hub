import type React from "react";
import type { PageName } from "../App";
import type { UserProfile } from "../backend.d";
import { MonitorButton } from "../components/MonitorButton";

interface SettingsPageProps {
  onNavigate: (page: PageName) => void;
  currentUser: UserProfile | null;
  volume: number;
  setVolume: (vol: number) => void;
  isMuted: boolean;
}

const SpeakerIcon: React.FC<{ muted: boolean }> = ({ muted }) => {
  if (muted) {
    // Speaker with X (muted) - red/orange tint
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        role="img"
      >
        <title>Muted</title>
        {/* Speaker body */}
        <path
          d="M3 9v6h4l5 5V4L7 9H3z"
          fill="oklch(0.65 0.22 35)"
          stroke="oklch(0.65 0.22 35)"
          strokeWidth="0.5"
        />
        {/* X lines */}
        <line
          x1="16"
          y1="9"
          x2="22"
          y2="15"
          stroke="oklch(0.7 0.25 27)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="9"
          x2="16"
          y2="15"
          stroke="oklch(0.7 0.25 27)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  // Normal speaker with sound waves - white/light
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
      role="img"
    >
      <title>Playing</title>
      {/* Speaker body */}
      <path
        d="M3 9v6h4l5 5V4L7 9H3z"
        fill="oklch(0.85 0.04 265)"
        stroke="oklch(0.85 0.04 265)"
        strokeWidth="0.5"
      />
      {/* Sound waves */}
      <path
        d="M16.5 7.5a5 5 0 010 9"
        stroke="oklch(0.7 0.18 195)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19.07 4.93a9 9 0 010 14.14"
        stroke="oklch(0.6 0.15 195)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
};

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onNavigate,
  currentUser,
  volume,
  setVolume,
  isMuted,
}) => {
  return (
    <div className="min-h-screen flex flex-col page-enter">
      {/* Navbar */}
      <nav
        style={{
          background:
            "linear-gradient(180deg, oklch(0.15 0.06 245) 0%, oklch(0.1 0.04 245) 100%)",
          borderBottom: "3px solid oklch(0.55 0.26 245)",
          padding: "0 16px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <MonitorButton
          variant="default"
          size="sm"
          onClick={() => onNavigate("home")}
        >
          ← HOME
        </MonitorButton>
        <span
          className="pixel-text"
          style={{
            fontSize: "9px",
            color: "oklch(0.82 0.18 85)",
            textShadow: "0 0 8px oklch(0.82 0.18 85 / 0.6)",
          }}
        >
          OPTIONS
        </span>
      </nav>

      <main
        style={{
          flex: 1,
          padding: "32px 16px",
          maxWidth: "600px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Player info */}
        {currentUser && (
          <div
            style={{
              background: "oklch(0.13 0.04 265)",
              border: "2px solid oklch(0.35 0.1 245)",
              padding: "16px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 0 20px oklch(0.55 0.26 245 / 0.15)",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 35% 35%, oklch(0.7 0.22 245), oklch(0.4 0.26 245))",
                border: "2px solid oklch(0.55 0.22 245)",
                boxShadow: "0 0 12px oklch(0.55 0.26 245 / 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "20px" }}>🦔</span>
            </div>
            <div>
              <div
                className="pixel-text"
                style={{
                  fontSize: "8px",
                  color: "oklch(0.82 0.18 85)",
                  marginBottom: "4px",
                }}
              >
                {currentUser.displayName || currentUser.username}
              </div>
              <div
                style={{
                  fontFamily: "Share Tech Mono, monospace",
                  fontSize: "11px",
                  color: "oklch(0.55 0.12 265)",
                }}
              >
                @{currentUser.username}
              </div>
              {currentUser.ageVerified && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "oklch(0.35 0.15 130 / 0.3)",
                    border: "1px solid oklch(0.55 0.2 130)",
                    padding: "2px 6px",
                    marginTop: "4px",
                    fontSize: "8px",
                    fontFamily: "Orbitron, sans-serif",
                    color: "oklch(0.7 0.18 130)",
                    fontWeight: 700,
                    letterSpacing: "1px",
                  }}
                >
                  ✓ AGE VERIFIED
                </div>
              )}
            </div>
          </div>
        )}

        <h1
          className="pixel-text mb-6"
          style={{
            fontSize: "10px",
            color: "oklch(0.97 0.01 265)",
            textShadow: "0 0 10px oklch(0.55 0.26 245 / 0.5)",
            lineHeight: "2",
            letterSpacing: "2px",
          }}
        >
          SETTINGS
        </h1>

        {/* Settings grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Use Camera */}
          <div
            style={{
              background: "oklch(0.12 0.04 265)",
              border: "2px solid oklch(0.28 0.07 265)",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap" as const,
            }}
          >
            <div>
              <div
                className="orbitron-text"
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "oklch(0.8 0.18 195)",
                  letterSpacing: "2px",
                  marginBottom: "4px",
                }}
              >
                📷 USE CAMERA
              </div>
              <p
                style={{
                  fontFamily: "Share Tech Mono, monospace",
                  fontSize: "11px",
                  color: "oklch(0.55 0.08 265)",
                  margin: 0,
                }}
              >
                Verify your age with face scan
              </p>
            </div>
            <MonitorButton
              variant="teal"
              size="sm"
              onClick={() => onNavigate("camera-verify")}
            >
              ENABLE
            </MonitorButton>
          </div>

          {/* Parental Controls */}
          <div
            style={{
              background: "oklch(0.12 0.04 265)",
              border: "2px solid oklch(0.28 0.07 265)",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap" as const,
            }}
          >
            <div>
              <div
                className="orbitron-text"
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "oklch(0.8 0.18 85)",
                  letterSpacing: "2px",
                  marginBottom: "4px",
                }}
              >
                🛡️ PARENTAL CONTROLS
              </div>
              <p
                style={{
                  fontFamily: "Share Tech Mono, monospace",
                  fontSize: "11px",
                  color: "oklch(0.55 0.08 265)",
                  margin: 0,
                }}
              >
                Content filters and age ratings
              </p>
            </div>
            <MonitorButton
              variant="gold"
              size="sm"
              onClick={() => onNavigate("parental-controls")}
            >
              MANAGE
            </MonitorButton>
          </div>

          {/* Display Name */}
          <div
            style={{
              background: "oklch(0.12 0.04 265)",
              border: "2px solid oklch(0.28 0.07 265)",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap" as const,
            }}
          >
            <div>
              <div
                className="orbitron-text"
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "oklch(0.8 0.18 245)",
                  letterSpacing: "2px",
                  marginBottom: "4px",
                }}
              >
                ✏️ DISPLAY NAME
              </div>
              <p
                style={{
                  fontFamily: "Share Tech Mono, monospace",
                  fontSize: "11px",
                  color: "oklch(0.55 0.08 265)",
                  margin: 0,
                }}
              >
                {currentUser?.displayName
                  ? `Current: ${currentUser.displayName}`
                  : "Set your display name"}
              </p>
            </div>
            <MonitorButton
              variant="blue"
              size="sm"
              onClick={() => onNavigate("display-name")}
            >
              EDIT
            </MonitorButton>
          </div>

          {/* Music Settings */}
          <div
            style={{
              background: "oklch(0.12 0.04 265)",
              border: "2px solid oklch(0.28 0.07 265)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              className="orbitron-text"
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "oklch(0.7 0.18 195)",
                letterSpacing: "2px",
              }}
            >
              🎵 MUSIC
            </div>

            {/* Background Music row */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    fontFamily: "Share Tech Mono, monospace",
                    fontSize: "11px",
                    color: "oklch(0.65 0.08 265)",
                    letterSpacing: "1px",
                  }}
                >
                  BACKGROUND MUSIC
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <SpeakerIcon muted={isMuted} />
                  <span
                    style={{
                      fontFamily: "Orbitron, sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: isMuted
                        ? "oklch(0.65 0.22 35)"
                        : "oklch(0.7 0.18 195)",
                      letterSpacing: "1px",
                      minWidth: "64px",
                      textAlign: "right",
                    }}
                  >
                    {isMuted ? "MUTED" : `VOL: ${volume}`}
                  </span>
                </div>
              </div>

              {/* Volume slider */}
              <div style={{ position: "relative", paddingTop: "4px" }}>
                <input
                  data-ocid="settings.music.input"
                  type="range"
                  min={1}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  style={{
                    width: "100%",
                    height: "6px",
                    appearance: "none",
                    WebkitAppearance: "none",
                    background: `linear-gradient(to right, oklch(0.7 0.18 195) 0%, oklch(0.7 0.18 195) ${((volume - 1) / 99) * 100}%, oklch(0.22 0.05 265) ${((volume - 1) / 99) * 100}%, oklch(0.22 0.05 265) 100%)`,
                    borderRadius: "3px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                  className="music-volume-slider"
                  aria-label="Background music volume"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "Share Tech Mono, monospace",
                    fontSize: "9px",
                    color: "oklch(0.4 0.05 265)",
                  }}
                >
                  MUTE
                </span>
                <span
                  style={{
                    fontFamily: "Share Tech Mono, monospace",
                    fontSize: "9px",
                    color: "oklch(0.4 0.05 265)",
                  }}
                >
                  MAX
                </span>
              </div>
            </div>
          </div>

          {/* Not logged in message */}
          {!currentUser && (
            <div
              style={{
                background: "oklch(0.15 0.06 265 / 0.5)",
                border: "2px solid oklch(0.4 0.12 85)",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <p
                className="pixel-text"
                style={{
                  fontSize: "8px",
                  color: "oklch(0.82 0.18 85)",
                  lineHeight: "2",
                }}
              >
                ⚠ SIGN IN TO SAVE SETTINGS
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                  marginTop: "12px",
                }}
              >
                <MonitorButton
                  variant="blue"
                  size="sm"
                  onClick={() => onNavigate("login")}
                >
                  SIGN IN
                </MonitorButton>
                <MonitorButton
                  variant="gold"
                  size="sm"
                  onClick={() => onNavigate("register")}
                >
                  REGISTER
                </MonitorButton>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
