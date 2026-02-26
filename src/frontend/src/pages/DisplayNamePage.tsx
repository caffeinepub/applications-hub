import React, { useState } from 'react';
import { useBackendCalls } from '../hooks/useBackendCalls';
import { MonitorButton } from '../components/MonitorButton';
import { toast } from 'sonner';
import type { PageName } from '../App';

interface DisplayNamePageProps {
  onNavigate: (page: PageName) => void;
  currentUsername: string;
  onDisplayNameSet: (name: string) => void;
}

export const DisplayNamePage: React.FC<DisplayNamePageProps> = ({
  onNavigate,
  currentUsername,
  onDisplayNameSet,
}) => {
  const { actor } = useBackendCalls();
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      setError('DISPLAY NAME REQUIRED');
      return;
    }
    if (displayName.length < 2) {
      setError('MIN 2 CHARACTERS');
      return;
    }
    if (displayName.length > 20) {
      setError('MAX 20 CHARACTERS');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (currentUsername && actor) {
        await actor.updateDisplayName(currentUsername, displayName);
      }
      onDisplayNameSet(displayName);
      toast.success(`DISPLAY NAME SET: ${displayName}!`);
      onNavigate('parental-controls');
    } catch (err) {
      console.error(err);
      toast.error('FAILED TO SAVE NAME');
      setError('SAVE FAILED - TRY AGAIN');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onNavigate('parental-controls');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    background: 'oklch(0.12 0.04 265)',
    border: '2px solid oklch(0.35 0.12 245)',
    color: 'oklch(0.97 0.01 265)',
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '16px',
    outline: 'none',
    borderRadius: '2px',
    textAlign: 'center' as const,
    letterSpacing: '2px',
  };

  const suggestions = ['SPEEDRUNNER', 'BLAZER', 'RINGMASTER', 'HEDGEHOG', 'ZAPPER'];

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
        <MonitorButton variant="default" size="sm" onClick={() => onNavigate('settings')}>
          ← BACK
        </MonitorButton>
        <span className="pixel-text" style={{ fontSize: '9px', color: 'oklch(0.82 0.18 85)', textShadow: '0 0 8px oklch(0.82 0.18 85 / 0.6)' }}>
          PLAYER NAME
        </span>
      </nav>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'oklch(0.11 0.03 265)',
          border: '2px solid oklch(0.35 0.12 245)',
          boxShadow: '0 0 40px oklch(0.55 0.26 245 / 0.2)',
          padding: '32px',
          position: 'relative',
        }}>
          {/* Corner decorations */}
          <div style={{ position: 'absolute', top: '-1px', left: '-1px', width: '12px', height: '12px', borderTop: '3px solid oklch(0.82 0.18 85)', borderLeft: '3px solid oklch(0.82 0.18 85)' }} />
          <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '12px', height: '12px', borderTop: '3px solid oklch(0.82 0.18 85)', borderRight: '3px solid oklch(0.82 0.18 85)' }} />
          <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '12px', height: '12px', borderBottom: '3px solid oklch(0.82 0.18 85)', borderLeft: '3px solid oklch(0.82 0.18 85)' }} />
          <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '12px', height: '12px', borderBottom: '3px solid oklch(0.82 0.18 85)', borderRight: '3px solid oklch(0.82 0.18 85)' }} />

          {/* Trophy icon */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '48px' }}>🦔</span>
          </div>

          <h1 className="pixel-text text-center mb-2" style={{
            fontSize: '9px',
            color: 'oklch(0.97 0.01 265)',
            textShadow: '0 0 15px oklch(0.55 0.26 245 / 0.7)',
            lineHeight: '2',
            letterSpacing: '2px',
          }}>
            CHOOSE YOUR
          </h1>
          <h1 className="pixel-text text-center mb-6" style={{
            fontSize: '11px',
            color: 'oklch(0.82 0.18 85)',
            textShadow: '0 0 15px oklch(0.82 0.18 85 / 0.7)',
            lineHeight: '2',
            letterSpacing: '2px',
          }}>
            DISPLAY NAME
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Input */}
            <div>
              <label htmlFor="display-name-input" style={{
                display: 'block',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                color: 'oklch(0.65 0.18 245)',
                letterSpacing: '2px',
                marginBottom: '8px',
                textTransform: 'uppercase' as const,
              }}>
                PLAYER NAME
              </label>
              <input
                id="display-name-input"
                type="text"
                value={displayName}
                onChange={e => {
                  setDisplayName(e.target.value);
                  setError('');
                }}
                placeholder="ENTER NAME..."
                style={inputStyle}
                maxLength={20}
                autoComplete="nickname"
                onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
              />
              {error && (
                <p style={{
                  fontFamily: 'Press Start 2P, monospace',
                  fontSize: '7px',
                  color: 'oklch(0.7 0.23 27)',
                  marginTop: '6px',
                  letterSpacing: '1px',
                }}>
                  {error}
                </p>
              )}

              {/* Character count */}
              <div style={{ textAlign: 'right', marginTop: '4px' }}>
                <span style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: '10px',
                  color: displayName.length > 16 ? 'oklch(0.7 0.23 27)' : 'oklch(0.45 0.06 265)',
                }}>
                  {displayName.length}/20
                </span>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <p style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '9px',
                fontWeight: 700,
                color: 'oklch(0.5 0.08 265)',
                letterSpacing: '2px',
                marginBottom: '8px',
                textTransform: 'uppercase' as const,
              }}>
                SUGGESTIONS
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                {suggestions.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setDisplayName(s); setError(''); }}
                    style={{
                      background: 'oklch(0.15 0.05 265)',
                      border: '1px solid oklch(0.3 0.08 245)',
                      padding: '4px 10px',
                      cursor: 'pointer',
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: '11px',
                      color: 'oklch(0.65 0.15 245)',
                      borderRadius: '2px',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLButtonElement).style.background = 'oklch(0.2 0.07 245)';
                      (e.target as HTMLButtonElement).style.borderColor = 'oklch(0.55 0.18 245)';
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLButtonElement).style.background = 'oklch(0.15 0.05 265)';
                      (e.target as HTMLButtonElement).style.borderColor = 'oklch(0.3 0.08 245)';
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <MonitorButton
                variant="gold"
                size="md"
                onClick={handleSubmit}
                disabled={isLoading}
                icon={isLoading ? <span>⟳</span> : <span>✦</span>}
              >
                {isLoading ? 'SAVING...' : 'CONFIRM'}
              </MonitorButton>
              <MonitorButton
                variant="default"
                size="sm"
                onClick={handleSkip}
              >
                SKIP
              </MonitorButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DisplayNamePage;
