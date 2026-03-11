import type React from "react";
import { useCallback, useRef, useState } from "react";

interface MonitorButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: "blue" | "gold" | "red" | "teal" | "default";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  disabled?: boolean;
}

const variantStyles = {
  blue: {
    frame: "from-[oklch(0.2_0.08_245)] to-[oklch(0.15_0.05_245)]",
    screen: "from-[oklch(0.1_0.05_245)] to-[oklch(0.08_0.03_245)]",
    glow: "#1e6fd4",
    glowOklch: "oklch(0.55 0.26 245)",
    label: "text-[oklch(0.7_0.22_245)]",
    frameColor: "oklch(0.28 0.1 245)",
    highlight: "oklch(0.55 0.22 245)",
  },
  gold: {
    frame: "from-[oklch(0.25_0.08_85)] to-[oklch(0.15_0.04_85)]",
    screen: "from-[oklch(0.12_0.05_85)] to-[oklch(0.08_0.02_85)]",
    glow: "#d4a017",
    glowOklch: "oklch(0.82 0.18 85)",
    label: "text-[oklch(0.82_0.18_85)]",
    frameColor: "oklch(0.4 0.12 85)",
    highlight: "oklch(0.82 0.18 85)",
  },
  red: {
    frame: "from-[oklch(0.22_0.08_27)] to-[oklch(0.14_0.04_27)]",
    screen: "from-[oklch(0.1_0.05_27)] to-[oklch(0.08_0.02_27)]",
    glow: "#c44",
    glowOklch: "oklch(0.6 0.23 27)",
    label: "text-[oklch(0.75_0.2_27)]",
    frameColor: "oklch(0.35 0.15 27)",
    highlight: "oklch(0.7 0.2 27)",
  },
  teal: {
    frame: "from-[oklch(0.2_0.08_195)] to-[oklch(0.14_0.04_195)]",
    screen: "from-[oklch(0.1_0.05_195)] to-[oklch(0.08_0.02_195)]",
    glow: "#1dd4d4",
    glowOklch: "oklch(0.65 0.18 195)",
    label: "text-[oklch(0.65_0.18_195)]",
    frameColor: "oklch(0.35 0.12 195)",
    highlight: "oklch(0.65 0.18 195)",
  },
  default: {
    frame: "from-[oklch(0.22_0.06_265)] to-[oklch(0.15_0.04_265)]",
    screen: "from-[oklch(0.1_0.04_265)] to-[oklch(0.08_0.02_265)]",
    glow: "#5588bb",
    glowOklch: "oklch(0.55 0.15 265)",
    label: "text-[oklch(0.8_0.1_265)]",
    frameColor: "oklch(0.35 0.08 265)",
    highlight: "oklch(0.6 0.15 265)",
  },
};

const sizeClasses = {
  sm: {
    outer: "p-[4px]",
    checker: "p-[4px]",
    screen: "min-h-[44px] px-3 py-2",
    text: "text-[7px]",
  },
  md: {
    outer: "p-[5px]",
    checker: "p-[5px]",
    screen: "min-h-[60px] px-4 py-3",
    text: "text-[8px]",
  },
  lg: {
    outer: "p-[6px]",
    checker: "p-[6px]",
    screen: "min-h-[80px] px-6 py-4",
    text: "text-[10px]",
  },
};

export const MonitorButton: React.FC<MonitorButtonProps> = ({
  onClick,
  children,
  className = "",
  href,
  variant = "blue",
  size = "md",
  icon,
  disabled = false,
}) => {
  const [animState, setAnimState] = useState<"idle" | "breaking" | "restoring">(
    "idle",
  );
  const [isHovered, setIsHovered] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const v = variantStyles[variant];
  const s = sizeClasses[size];

  const triggerBreak = useCallback(() => {
    if (disabled || animState !== "idle") return;

    setAnimState("breaking");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      // Trigger the actual action
      if (href) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else if (onClick) {
        onClick();
      }
      // Restore the monitor
      setAnimState("restoring");
      timeoutRef.current = setTimeout(() => {
        setAnimState("idle");
      }, 400);
    }, 600);
  }, [disabled, animState, href, onClick]);

  const handleMouseUp = useCallback(() => {
    // Peelout animation is handled by CSS hover state
  }, []);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    display: "inline-block",
  };

  const frameStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${v.frameColor}, oklch(0.12 0.03 265))`,
    border: `3px solid ${v.frameColor}`,
    boxShadow:
      isHovered && animState === "idle"
        ? `inset 3px 3px 0 oklch(0.5 0.1 265), inset -3px -3px 0 oklch(0.08 0.02 265), 4px 4px 0 oklch(0.04 0.01 265), 0 0 25px ${v.glowOklch} / 0.5, 0 0 50px ${v.glowOklch} / 0.2`
        : `inset 3px 3px 0 oklch(0.5 0.1 265), inset -3px -3px 0 oklch(0.08 0.02 265), 4px 4px 0 oklch(0.04 0.01 265), 0 0 15px ${v.glowOklch} / 0.3`,
    transition: "transform 0.15s ease, box-shadow 0.2s ease",
    transform:
      isHovered && animState === "idle" ? "translateY(-2px)" : "translateY(0)",
    animation:
      animState === "breaking"
        ? "monitor-break 0.6s ease-in forwards"
        : animState === "restoring"
          ? "monitor-restore 0.4s ease-out forwards"
          : "none",
  };

  const checkerStyle: React.CSSProperties = {
    backgroundImage: `repeating-conic-gradient(${v.frameColor} 0% 25%, oklch(0.12 0.03 265) 0% 50%)`,
    backgroundSize: "8px 8px",
    padding: s.checker.includes("4px")
      ? "4px"
      : s.checker.includes("5px")
        ? "5px"
        : "6px",
    border: "2px solid oklch(0.1 0.02 265)",
  };

  const screenStyle: React.CSSProperties = {
    background:
      "linear-gradient(160deg, oklch(0.12 0.04 265) 0%, oklch(0.08 0.02 265) 100%)",
    border: "2px solid oklch(0.15 0.03 265)",
    boxShadow: `inset 0 0 20px oklch(0 0 0 / 0.6), inset 0 0 10px ${v.glowOklch} / 0.1`,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "4px",
  };

  const ballStyle: React.CSSProperties = {
    position: "absolute",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle at 35% 35%, oklch(0.7 0.2 245), oklch(0.35 0.25 245))",
    boxShadow: "0 0 12px oklch(0.55 0.26 245 / 0.9)",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    pointerEvents: "none",
    opacity: animState === "breaking" ? undefined : 0,
    animation:
      animState === "breaking" ? "spindash-zoom 0.5s ease-in forwards" : "none",
  };

  return (
    <button
      className={className}
      style={containerStyle}
      onClick={triggerBreak}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseUp();
      }}
      onMouseUp={handleMouseUp}
      disabled={disabled}
      aria-label={typeof children === "string" ? children : undefined}
      type="button"
    >
      <div ref={frameRef} style={frameStyle}>
        <div style={checkerStyle}>
          <div
            ref={ballRef as React.RefObject<HTMLDivElement>}
            style={ballStyle}
          >
            {/* Sonic eye */}
            <div
              style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "white",
                top: "4px",
                right: "5px",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#111",
                top: "5px",
                right: "7px",
              }}
            />
          </div>

          {/* Flash overlay on break */}
          {animState === "breaking" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "oklch(1 0 0 / 0.4)",
                animation: "monitor-flash 0.15s ease-in-out 2",
                zIndex: 5,
                pointerEvents: "none",
              }}
            />
          )}

          <div style={screenStyle} className={`${s.screen}`}>
            {/* Scanlines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(0 0 0 / 0.12) 3px, oklch(0 0 0 / 0.12) 4px)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
            {/* Screen shine */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "35%",
                background:
                  "linear-gradient(180deg, oklch(1 0 0 / 0.07) 0%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />

            {/* Content */}
            <div
              style={{
                position: "relative",
                zIndex: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {icon && (
                <div
                  style={{
                    fontSize:
                      size === "lg" ? "20px" : size === "md" ? "16px" : "12px",
                    marginBottom: "2px",
                  }}
                >
                  {icon}
                </div>
              )}
              <div
                className={`pixel-text ${v.label} ${s.text} text-center leading-relaxed`}
                style={{
                  textShadow: `0 0 8px ${v.glow}88, 1px 1px 0 #000`,
                  letterSpacing: "0.5px",
                  lineHeight: "1.8",
                }}
              >
                {children}
              </div>
            </div>
          </div>

          {/* Bottom LED strip */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "4px",
              padding: "3px 0 0 0",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "6px",
                  height: "4px",
                  borderRadius: "1px",
                  background: i === 1 ? v.glowOklch : "oklch(0.25 0.05 265)",
                  boxShadow: i === 1 ? `0 0 6px ${v.glow}` : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </button>
  );
};

export default MonitorButton;
