import type React from "react";
import { useEffect, useState } from "react";

interface SonicSpriteProps {
  size?: "xs" | "sm" | "md";
  animate?: boolean;
}

export const SonicSprite: React.FC<SonicSpriteProps> = ({
  size = "sm",
  animate = true,
}) => {
  const [frame, setFrame] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [direction, setDirection] = useState(1);
  const [xPos, setXPos] = useState(50);

  const dims = { xs: 20, sm: 28, md: 40 };
  const d = dims[size];

  // Running animation frames
  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, 100);
    return () => clearInterval(interval);
  }, [animate]);

  // Blink occasionally
  useEffect(() => {
    if (!animate) return;
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      },
      3000 + Math.random() * 2000,
    );
    return () => clearInterval(blinkInterval);
  }, [animate]);

  // Patrol back and forth on the navbar
  useEffect(() => {
    if (!animate) return;
    const moveInterval = setInterval(() => {
      setXPos((prev) => {
        const next = prev + direction * 0.5;
        if (next > 90) {
          setDirection(-1);
          return prev;
        }
        if (next < 10) {
          setDirection(1);
          return prev;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(moveInterval);
  }, [animate, direction]);

  // Leg angles based on frame
  const legAngles = [
    { front: -30, back: 30 },
    { front: -10, back: 10 },
    { front: 30, back: -30 },
    { front: 10, back: -10 },
  ];
  const legs = legAngles[frame] || legAngles[0];

  const bodyY = Math.sin((frame * Math.PI) / 2) * 1.5;
  const flipX = direction < 0 ? "scaleX(-1)" : "scaleX(1)";

  return (
    <div
      style={{
        position: "absolute",
        left: `${xPos}%`,
        bottom: 0,
        transform: "translateX(-50%)",
        transition: "left 0.1s linear",
        zIndex: 10,
        display: "flex",
        alignItems: "flex-end",
      }}
      aria-hidden="true"
    >
      <svg
        width={d}
        height={d * 1.4}
        viewBox="0 0 28 40"
        style={{
          transform: `${flipX} translateY(${bodyY}px)`,
          overflow: "visible",
        }}
        aria-hidden="true"
        role="presentation"
      >
        {/* Shadow */}
        <ellipse cx="14" cy="38" rx="6" ry="2" fill="oklch(0 0 0 / 0.4)" />

        {/* Tail */}
        <path
          d="M 6 22 Q 2 18 4 14 Q 6 10 8 13"
          stroke="oklch(0.55 0.26 245)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Back leg */}
        <line
          x1="12"
          y1="28"
          x2={12 + Math.sin((legs.back * Math.PI) / 180) * 7}
          y2={28 + Math.cos((legs.back * Math.PI) / 180) * 7}
          stroke="oklch(0.55 0.26 245)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Back shoe */}
        <circle
          cx={12 + Math.sin((legs.back * Math.PI) / 180) * 7}
          cy={28 + Math.cos((legs.back * Math.PI) / 180) * 7}
          r="2.5"
          fill="oklch(0.6 0.23 27)"
        />

        {/* Body - blue sphere */}
        <circle cx="14" cy="20" r="9" fill="oklch(0.55 0.26 245)" />

        {/* Body highlight */}
        <ellipse cx="11" cy="17" rx="3" ry="2" fill="oklch(0.72 0.22 245)" />

        {/* Belly */}
        <ellipse cx="15" cy="23" rx="5" ry="4" fill="oklch(0.88 0.06 85)" />

        {/* Front leg */}
        <line
          x1="14"
          y1="28"
          x2={14 + Math.sin((legs.front * Math.PI) / 180) * 7}
          y2={28 + Math.cos((legs.front * Math.PI) / 180) * 7}
          stroke="oklch(0.55 0.26 245)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Front shoe */}
        <circle
          cx={14 + Math.sin((legs.front * Math.PI) / 180) * 7}
          cy={28 + Math.cos((legs.front * Math.PI) / 180) * 7}
          r="2.5"
          fill="oklch(0.6 0.23 27)"
        />

        {/* Head */}
        <circle cx="17" cy="11" r="8" fill="oklch(0.55 0.26 245)" />

        {/* Head highlight */}
        <ellipse cx="15" cy="8" rx="3" ry="2" fill="oklch(0.72 0.22 245)" />

        {/* Spines */}
        <path d="M 12 6 L 8 0 L 11 5" fill="oklch(0.55 0.26 245)" />
        <path d="M 15 4 L 13 -2 L 16 3" fill="oklch(0.55 0.26 245)" />
        <path d="M 18 5 L 18 -1 L 20 4" fill="oklch(0.55 0.26 245)" />

        {/* Eye white */}
        <circle cx="20" cy="9" r="3.5" fill="white" />

        {/* Eye iris */}
        <circle
          cx="20.5"
          cy="9"
          r="2"
          fill="oklch(0.35 0.15 195)"
          style={{
            transform: `scaleY(${isBlinking ? 0.1 : 1})`,
            transformOrigin: "20.5px 9px",
            transition: "transform 0.05s",
          }}
        />

        {/* Eye pupil */}
        <circle
          cx="21"
          cy="9"
          r="1"
          fill="black"
          style={{ opacity: isBlinking ? 0 : 1 }}
        />

        {/* Eye shine */}
        <circle
          cx="19.5"
          cy="7.5"
          r="0.8"
          fill="white"
          style={{ opacity: isBlinking ? 0 : 1 }}
        />

        {/* Nose */}
        <ellipse cx="23" cy="12" rx="1.2" ry="0.8" fill="oklch(0.3 0.1 340)" />

        {/* Mouth */}
        <path
          d="M 21 14 Q 23 16 25 14"
          stroke="oklch(0.3 0.1 340)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />

        {/* Speed lines when running */}
        {animate && frame % 2 === 0 && (
          <>
            <line
              x1="2"
              y1="18"
              x2="-4"
              y2="18"
              stroke="oklch(0.7 0.22 245 / 0.6)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="3"
              y1="21"
              x2="-3"
              y2="21"
              stroke="oklch(0.7 0.22 245 / 0.4)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="24"
              x2="-2"
              y2="24"
              stroke="oklch(0.7 0.22 245 / 0.3)"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </div>
  );
};

export default SonicSprite;
