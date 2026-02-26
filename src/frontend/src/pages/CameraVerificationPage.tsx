import React, { useState, useEffect, useRef } from 'react';
import { useCamera } from '../camera/useCamera';
import { useBackendCalls } from '../hooks/useBackendCalls';
import { MonitorButton } from '../components/MonitorButton';
import { toast } from 'sonner';
import type { PageName } from '../App';

interface CameraVerificationPageProps {
  onNavigate: (page: PageName) => void;
  currentUsername: string;
  onAgeVerified: (age: number) => void;
}

const AGE_POOL = [10, 11, 12, 13, 14, 15, 16, 17, 18];

type Stage = 'ready' | 'scanning' | 'analyzed' | 'wrong-age';

export const CameraVerificationPage: React.FC<CameraVerificationPageProps> = ({
  onNavigate,
  currentUsername,
  onAgeVerified,
}) => {
  const { actor } = useBackendCalls();
  const [stage, setStage] = useState<Stage>('ready');
  const [guessedAge, setGuessedAge] = useState<number | null>(null);
  const [loadingDots, setLoadingDots] = useState('.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loadingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { isActive, isSupported, error, isLoading, startCamera, stopCamera, capturePhoto, videoRef, canvasRef } = useCamera({
    facingMode: 'user',
    width: 640,
    height: 480,
  });

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Animate loading dots
  useEffect(() => {
    if (stage === 'scanning') {
      loadingRef.current = setInterval(() => {
        setLoadingDots(d => d.length >= 3 ? '.' : d + '.');
      }, 400);
    } else {
      if (loadingRef.current) clearInterval(loadingRef.current);
    }
    return () => {
      if (loadingRef.current) clearInterval(loadingRef.current);
    };
  }, [stage]);

  const handleStartCamera = async () => {
    await startCamera();
  };

  const handleCapture = async () => {
    if (!isActive) return;
    setStage('scanning');

    // Capture photo (we don't actually analyze it)
    await capturePhoto();

    // Simulate AI processing for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Random age from pool
    const randomAge = AGE_POOL[Math.floor(Math.random() * AGE_POOL.length)];
    setGuessedAge(randomAge);
    setStage('analyzed');
  };

  const handleConfirmAge = async () => {
    if (guessedAge === null) return;
    setIsSubmitting(true);

    try {
      if (currentUsername && actor) {
        await actor.verifyAge(currentUsername, BigInt(guessedAge));
        await actor.updateCameraVerification(currentUsername, true);
      }
      onAgeVerified(guessedAge);
      toast.success(`AGE VERIFIED: ${guessedAge} YEARS OLD!`);
      onNavigate('display-name');
    } catch (err) {
      console.error(err);
      toast.error('VERIFICATION FAILED');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWrong = () => {
    setStage('wrong-age');
  };

  const handleContinueWithId = () => {
    onNavigate('id-verify');
  };

  const handleRetry = () => {
    setGuessedAge(null);
    setStage('ready');
  };

  return (
    <div className="min-h-screen flex flex-col page-enter">
      {/* Navbar */}
      <nav style={{
        background: 'linear-gradient(180deg, oklch(0.15 0.06 245) 0%, oklch(0.1 0.04 245) 100%)',
        borderBottom: '3px solid oklch(0.55 0.26 245)',
        padding: '0 16px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <MonitorButton variant="default" size="sm" onClick={() => { stopCamera(); onNavigate('settings'); }}>
          ← BACK
        </MonitorButton>
        <span className="pixel-text" style={{ fontSize: '9px', color: 'oklch(0.65 0.18 195)', textShadow: '0 0 8px oklch(0.65 0.18 195 / 0.6)' }}>
          FACE SCAN
        </span>
      </nav>

      <main style={{ flex: 1, padding: '24px 16px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <h1 className="pixel-text mb-2" style={{
          fontSize: '9px',
          color: 'oklch(0.97 0.01 265)',
          textShadow: '0 0 10px oklch(0.65 0.18 195 / 0.6)',
          lineHeight: '2',
          letterSpacing: '2px',
        }}>
          CAMERA AGE VERIFICATION
        </h1>
        <p style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '11px',
          color: 'oklch(0.55 0.08 265)',
          marginBottom: '20px',
        }}>
          Let us scan your face to estimate your age (10-18).
        </p>

        {/* Camera view */}
        <div style={{
          background: 'oklch(0.08 0.03 265)',
          border: '3px solid oklch(0.3 0.08 245)',
          boxShadow: '0 0 30px oklch(0.55 0.26 245 / 0.2)',
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: '4/3',
          maxWidth: '480px',
          margin: '0 auto 20px',
        }}>
          {/* Video element */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)',
              display: isActive ? 'block' : 'none',
            }}
          />

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Overlay states */}
          {!isActive && stage === 'ready' && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}>
              <div style={{ fontSize: '64px', opacity: 0.3 }}>📷</div>
              <p className="pixel-text" style={{ fontSize: '7px', color: 'oklch(0.55 0.1 265)', lineHeight: '2' }}>
                {isLoading ? 'STARTING CAMERA...' :
                 error ? `ERROR: ${error.message.toUpperCase()}` :
                 isSupported === false ? 'CAMERA NOT SUPPORTED' :
                 'CAMERA INACTIVE'}
              </p>
            </div>
          )}

          {/* Scanning overlay */}
          {stage === 'scanning' && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'oklch(0.55 0.26 245 / 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}>
              {/* Scanning lines */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, oklch(0.55 0.26 245 / 0.15) 0px, transparent 2px, transparent 20px)',
                animation: 'checkerboard-scroll 1s linear infinite',
              }} />

              {/* Face box */}
              <div style={{
                width: '120px',
                height: '140px',
                border: '2px solid oklch(0.65 0.22 195)',
                boxShadow: '0 0 15px oklch(0.65 0.22 195 / 0.5)',
                position: 'relative',
                zIndex: 1,
              }}>
                <div style={{ position: 'absolute', top: -2, left: -2, width: '16px', height: '16px', borderTop: '3px solid oklch(0.82 0.18 85)', borderLeft: '3px solid oklch(0.82 0.18 85)' }} />
                <div style={{ position: 'absolute', top: -2, right: -2, width: '16px', height: '16px', borderTop: '3px solid oklch(0.82 0.18 85)', borderRight: '3px solid oklch(0.82 0.18 85)' }} />
                <div style={{ position: 'absolute', bottom: -2, left: -2, width: '16px', height: '16px', borderBottom: '3px solid oklch(0.82 0.18 85)', borderLeft: '3px solid oklch(0.82 0.18 85)' }} />
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: '16px', height: '16px', borderBottom: '3px solid oklch(0.82 0.18 85)', borderRight: '3px solid oklch(0.82 0.18 85)' }} />
              </div>

              <p className="pixel-text" style={{
                fontSize: '7px',
                color: 'oklch(0.65 0.18 195)',
                textShadow: '0 0 8px oklch(0.65 0.18 195 / 0.8)',
                lineHeight: '2',
                position: 'relative',
                zIndex: 1,
              }}>
                ANALYZING{loadingDots}
              </p>
            </div>
          )}

          {/* Age result overlay */}
          {stage === 'analyzed' && guessedAge !== null && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'oklch(0.08 0.03 265 / 0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}>
              <p className="pixel-text" style={{ fontSize: '7px', color: 'oklch(0.65 0.08 265)', lineHeight: '2' }}>
                ESTIMATED AGE:
              </p>
              <div
                className="pixel-text"
                style={{
                  fontSize: '48px',
                  color: 'oklch(0.82 0.18 85)',
                  textShadow: '0 0 20px oklch(0.82 0.18 85 / 0.8)',
                  animation: 'age-reveal 0.5s ease-out forwards',
                  lineHeight: 1,
                }}
              >
                {guessedAge}
              </div>
              <p className="pixel-text" style={{ fontSize: '7px', color: 'oklch(0.55 0.08 265)', lineHeight: '2' }}>
                YEARS OLD
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>

          {/* Ready stage */}
          {stage === 'ready' && (
            <>
              {!isActive ? (
                <MonitorButton
                  variant="teal"
                  size="md"
                  onClick={handleStartCamera}
                  disabled={isLoading || isSupported === false}
                  icon={<span>📷</span>}
                >
                  {isLoading ? 'STARTING...' : 'START CAMERA'}
                </MonitorButton>
              ) : (
                <MonitorButton
                  variant="blue"
                  size="md"
                  onClick={handleCapture}
                  icon={<span>📸</span>}
                >
                  SCAN FACE
                </MonitorButton>
              )}

              {error && (
                <p className="pixel-text" style={{ fontSize: '7px', color: 'oklch(0.7 0.23 27)', lineHeight: '2' }}>
                  ⚠ {error.message.toUpperCase()}
                </p>
              )}

              {isSupported === false && (
                <div style={{ textAlign: 'center' }}>
                  <p className="pixel-text" style={{ fontSize: '7px', color: 'oklch(0.7 0.23 27)', lineHeight: '2', marginBottom: '12px' }}>
                    ⚠ CAMERA NOT SUPPORTED
                  </p>
                  <MonitorButton variant="gold" size="md" onClick={handleContinueWithId}>
                    VERIFY WITH ID INSTEAD
                  </MonitorButton>
                </div>
              )}
            </>
          )}

          {/* Analyzed stage */}
          {stage === 'analyzed' && guessedAge !== null && (
            <div style={{ textAlign: 'center' }}>
              <p className="pixel-text mb-4" style={{ fontSize: '7px', color: 'oklch(0.75 0.1 265)', lineHeight: '2' }}>
                IS THIS YOUR AGE?
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <MonitorButton
                  variant="teal"
                  size="md"
                  onClick={handleConfirmAge}
                  disabled={isSubmitting}
                  icon={<span>✓</span>}
                >
                  {isSubmitting ? 'SAVING...' : 'YES, CORRECT!'}
                </MonitorButton>
                <MonitorButton
                  variant="red"
                  size="md"
                  onClick={handleWrong}
                  icon={<span>✗</span>}
                >
                  NOT RIGHT
                </MonitorButton>
              </div>
            </div>
          )}

          {/* Wrong age stage */}
          {stage === 'wrong-age' && (
            <div style={{
              textAlign: 'center',
              background: 'oklch(0.12 0.04 265)',
              border: '2px solid oklch(0.35 0.1 265)',
              padding: '20px',
              width: '100%',
              maxWidth: '400px',
            }}>
              <p className="pixel-text mb-4" style={{ fontSize: '7px', color: 'oklch(0.75 0.1 265)', lineHeight: '2' }}>
                AGE GUESS WAS WRONG?
              </p>
              <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', color: 'oklch(0.55 0.08 265)', marginBottom: '16px' }}>
                You can verify your age with a government ID or payment card.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
                <MonitorButton
                  variant="gold"
                  size="md"
                  onClick={handleContinueWithId}
                  icon={<span>🪪</span>}
                >
                  CONTINUE WITH ID
                </MonitorButton>
                <MonitorButton
                  variant="default"
                  size="sm"
                  onClick={handleRetry}
                >
                  TRY AGAIN
                </MonitorButton>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CameraVerificationPage;
