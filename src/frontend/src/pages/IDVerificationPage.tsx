import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { PageName } from "../App";
import { MonitorButton } from "../components/MonitorButton";
import { useBackendCalls } from "../hooks/useBackendCalls";

interface IDVerificationPageProps {
  onNavigate: (page: PageName) => void;
  currentUsername: string;
  onAgeVerified: (age: number) => void;
}

type IDType = "debit" | "credit" | "state-id";

const AGE_POOL = [10, 11, 12, 13, 14, 15, 16, 17, 18];

export const IDVerificationPage: React.FC<IDVerificationPageProps> = ({
  onNavigate,
  currentUsername,
  onAgeVerified,
}) => {
  const [selectedType, setSelectedType] = useState<IDType | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [state, setState] = useState("");
  const [fullName, setFullName] = useState("");
  const { actor } = useBackendCalls();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedType) {
      newErrors.type = "SELECT ID TYPE";
    } else if (selectedType === "debit" || selectedType === "credit") {
      if (
        !cardNumber.replace(/\s/g, "") ||
        cardNumber.replace(/\s/g, "").length < 16
      )
        newErrors.cardNumber = "ENTER VALID CARD NUMBER";
      if (!expiry || expiry.length < 5) newErrors.expiry = "ENTER VALID EXPIRY";
      if (!nameOnCard.trim()) newErrors.nameOnCard = "ENTER NAME ON CARD";
    } else {
      if (!idNumber.trim()) newErrors.idNumber = "ENTER ID NUMBER";
      if (!state.trim()) newErrors.state = "ENTER STATE";
      if (!fullName.trim()) newErrors.fullName = "ENTER FULL NAME";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const randomAge = AGE_POOL[Math.floor(Math.random() * AGE_POOL.length)];

      if (currentUsername && actor) {
        await actor.verifyAge(currentUsername, BigInt(randomAge));
      }

      onAgeVerified(randomAge);
      toast.success(`ID VERIFIED! AGE: ${randomAge}`);
      onNavigate("display-name");
    } catch (err) {
      console.error(err);
      toast.error("VERIFICATION FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "oklch(0.12 0.04 265)",
    border: "2px solid oklch(0.3 0.08 265)",
    color: "oklch(0.97 0.01 265)",
    fontFamily: "Share Tech Mono, monospace",
    fontSize: "13px",
    outline: "none",
    borderRadius: "2px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "Orbitron, sans-serif",
    fontSize: "10px",
    fontWeight: 700,
    color: "oklch(0.65 0.18 245)",
    letterSpacing: "2px",
    marginBottom: "6px",
    textTransform: "uppercase" as const,
  };

  const errorStyle: React.CSSProperties = {
    fontFamily: "Press Start 2P, monospace",
    fontSize: "7px",
    color: "oklch(0.7 0.23 27)",
    marginTop: "4px",
    letterSpacing: "1px",
  };

  const idTypes: {
    type: IDType;
    label: string;
    icon: string;
    desc: string;
    variant: "blue" | "gold" | "teal";
  }[] = [
    {
      type: "debit",
      label: "DEBIT CARD",
      icon: "💳",
      desc: "Bank debit card",
      variant: "blue",
    },
    {
      type: "credit",
      label: "CREDIT CARD",
      icon: "💳",
      desc: "Credit card",
      variant: "gold",
    },
    {
      type: "state-id",
      label: "STATE ID",
      icon: "🪪",
      desc: "Driver's license or state ID",
      variant: "teal",
    },
  ];

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
          onClick={() => onNavigate("camera-verify")}
        >
          ← BACK
        </MonitorButton>
        <span
          className="pixel-text"
          style={{
            fontSize: "9px",
            color: "oklch(0.82 0.18 85)",
            textShadow: "0 0 8px oklch(0.82 0.18 85 / 0.6)",
          }}
        >
          ID VERIFICATION
        </span>
      </nav>

      <main
        style={{
          flex: 1,
          padding: "24px 16px",
          maxWidth: "500px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h1
          className="pixel-text mb-2"
          style={{
            fontSize: "9px",
            color: "oklch(0.97 0.01 265)",
            textShadow: "0 0 10px oklch(0.55 0.26 245 / 0.5)",
            lineHeight: "2",
            letterSpacing: "2px",
          }}
        >
          VERIFY WITH ID
        </h1>
        <p
          style={{
            fontFamily: "Share Tech Mono, monospace",
            fontSize: "11px",
            color: "oklch(0.55 0.08 265)",
            marginBottom: "20px",
          }}
        >
          Select a verification method below.
        </p>

        {/* ID type selection */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          {idTypes.map(({ type, label, icon, desc, variant }) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              style={{
                background:
                  selectedType === type
                    ? `oklch(0.18 0.06 ${variant === "blue" ? "245" : variant === "gold" ? "85" : "195"})`
                    : "oklch(0.12 0.04 265)",
                border: `2px solid ${
                  selectedType === type
                    ? `oklch(0.6 0.2 ${variant === "blue" ? "245" : variant === "gold" ? "85" : "195"})`
                    : "oklch(0.28 0.07 265)"
                }`,
                padding: "12px 8px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                boxShadow:
                  selectedType === type
                    ? `0 0 15px oklch(0.55 0.2 ${variant === "blue" ? "245" : variant === "gold" ? "85" : "195"} / 0.3)`
                    : "none",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: "24px" }}>{icon}</span>
              <span
                className="pixel-text"
                style={{
                  fontSize: "6px",
                  color:
                    selectedType === type
                      ? "oklch(0.9 0.1 265)"
                      : "oklch(0.65 0.08 265)",
                  lineHeight: "1.8",
                  textAlign: "center",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "Share Tech Mono, monospace",
                  fontSize: "9px",
                  color: "oklch(0.45 0.06 265)",
                  textAlign: "center",
                }}
              >
                {desc}
              </span>
            </button>
          ))}
        </div>

        {errors.type && <p style={errorStyle}>{errors.type}</p>}

        {/* Card form */}
        {(selectedType === "debit" || selectedType === "credit") && (
          <div
            style={{
              background: "oklch(0.11 0.03 265)",
              border: "2px solid oklch(0.28 0.07 265)",
              padding: "20px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div>
              <label htmlFor="card-number" style={labelStyle}>
                CARD NUMBER
              </label>
              <input
                id="card-number"
                type="text"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(formatCardNumber(e.target.value))
                }
                placeholder="•••• •••• •••• ••••"
                style={inputStyle}
                maxLength={19}
                autoComplete="cc-number"
              />
              {errors.cardNumber && (
                <p style={errorStyle}>{errors.cardNumber}</p>
              )}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "12px",
              }}
            >
              <div>
                <label htmlFor="card-expiry" style={labelStyle}>
                  EXPIRY
                </label>
                <input
                  id="card-expiry"
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  style={inputStyle}
                  maxLength={5}
                  autoComplete="cc-exp"
                />
                {errors.expiry && <p style={errorStyle}>{errors.expiry}</p>}
              </div>
              <div>
                <label htmlFor="name-on-card" style={labelStyle}>
                  NAME ON CARD
                </label>
                <input
                  id="name-on-card"
                  type="text"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value.toUpperCase())}
                  placeholder="FULL NAME"
                  style={inputStyle}
                  autoComplete="cc-name"
                />
                {errors.nameOnCard && (
                  <p style={errorStyle}>{errors.nameOnCard}</p>
                )}
              </div>
            </div>
            <p
              style={{
                fontFamily: "Share Tech Mono, monospace",
                fontSize: "10px",
                color: "oklch(0.45 0.06 265)",
                margin: 0,
              }}
            >
              ⚠ For age verification only. No charges made.
            </p>
          </div>
        )}

        {/* State ID form */}
        {selectedType === "state-id" && (
          <div
            style={{
              background: "oklch(0.11 0.03 265)",
              border: "2px solid oklch(0.28 0.07 265)",
              padding: "20px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div>
              <label htmlFor="id-number" style={labelStyle}>
                ID NUMBER
              </label>
              <input
                id="id-number"
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="ID / LICENSE NUMBER"
                style={inputStyle}
                autoComplete="off"
              />
              {errors.idNumber && <p style={errorStyle}>{errors.idNumber}</p>}
            </div>
            <div>
              <label htmlFor="id-state" style={labelStyle}>
                STATE
              </label>
              <input
                id="id-state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                placeholder="E.G. CA, TX, NY"
                style={inputStyle}
                maxLength={2}
                autoComplete="address-level1"
              />
              {errors.state && <p style={errorStyle}>{errors.state}</p>}
            </div>
            <div>
              <label htmlFor="id-name" style={labelStyle}>
                FULL NAME
              </label>
              <input
                id="id-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="FULL LEGAL NAME"
                style={inputStyle}
                autoComplete="name"
              />
              {errors.fullName && <p style={errorStyle}>{errors.fullName}</p>}
            </div>
          </div>
        )}

        {/* Submit */}
        {selectedType && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MonitorButton
              variant="gold"
              size="lg"
              onClick={handleSubmit}
              disabled={isLoading}
              icon={isLoading ? <span>⟳</span> : <span>🔒</span>}
            >
              {isLoading ? "VERIFYING..." : "VERIFY AGE"}
            </MonitorButton>
          </div>
        )}
      </main>
    </div>
  );
};

export default IDVerificationPage;
