import React, { useState } from 'react';
import { useBackendCalls } from '../hooks/useBackendCalls';
import { MonitorButton } from '../components/MonitorButton';
import { toast } from 'sonner';
import type { PageName } from '../App';
import type { UserProfile } from '../backend.d';

interface ParentalControlsPageProps {
  onNavigate: (page: PageName) => void;
  currentUsername: string;
  currentUser: UserProfile | null;
  onParentalControlsUpdate: (contentFilter: boolean, maxRating: number) => void;
}

type AgeRating = 'G' | 'PG' | 'PG-13' | 'R';

const ratingToNumber: Record<AgeRating, number> = {
  G: 0,
  PG: 1,
  'PG-13': 2,
  R: 3,
};

const ratingDescriptions: Record<AgeRating, string> = {
  G: 'All ages - completely safe content',
  PG: 'Parental guidance suggested',
  'PG-13': 'Parents strongly cautioned',
  R: 'Restricted - mature content',
};

export const ParentalControlsPage: React.FC<ParentalControlsPageProps> = ({
  onNavigate,
  currentUsername,
  currentUser,
  onParentalControlsUpdate,
}) => {
  const initialFilter = currentUser?.parentalControls?.contentFilterEnabled ?? true;
  const initialRating = (currentUser?.parentalControls?.maxAgeRating ?? BigInt(1)) as bigint;
  const ratingKeys = Object.keys(ratingToNumber) as AgeRating[];
  const initialRatingKey = ratingKeys[Number(initialRating)] ?? 'PG';

  const { actor } = useBackendCalls();
  const [contentFilter, setContentFilter] = useState(initialFilter);
  const [maxRating, setMaxRating] = useState<AgeRating>(initialRatingKey);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setIsSaved(false);

    try {
      if (currentUsername && actor) {
        await actor.updateParentalControls(
          currentUsername,
          contentFilter,
          BigInt(ratingToNumber[maxRating])
        );
      }
      onParentalControlsUpdate(contentFilter, ratingToNumber[maxRating]);
      setIsSaved(true);
      toast.success('PARENTAL CONTROLS SAVED!');
    } catch (err) {
      console.error(err);
      toast.error('FAILED TO SAVE SETTINGS');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDone = () => {
    onNavigate('home');
  };

  const ratings: AgeRating[] = ['G', 'PG', 'PG-13', 'R'];

  const ratingColors: Record<AgeRating, string> = {
    G: 'oklch(0.65 0.18 130)',
    PG: 'oklch(0.75 0.18 175)',
    'PG-13': 'oklch(0.8 0.18 85)',
    R: 'oklch(0.65 0.23 27)',
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
        <MonitorButton variant="default" size="sm" onClick={() => onNavigate('settings')}>
          ← BACK
        </MonitorButton>
        <span className="pixel-text" style={{ fontSize: '9px', color: 'oklch(0.82 0.18 85)', textShadow: '0 0 8px oklch(0.82 0.18 85 / 0.6)' }}>
          PARENTAL CONTROLS
        </span>
      </nav>

      <main style={{ flex: 1, padding: '24px 16px', maxWidth: '520px', margin: '0 auto', width: '100%' }}>
        <h1 className="pixel-text mb-2" style={{
          fontSize: '9px',
          color: 'oklch(0.97 0.01 265)',
          textShadow: '0 0 10px oklch(0.55 0.26 245 / 0.5)',
          lineHeight: '2',
          letterSpacing: '2px',
        }}>
          PARENTAL CONTROLS
        </h1>
        <p style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '11px',
          color: 'oklch(0.55 0.08 265)',
          marginBottom: '24px',
        }}>
          Configure content restrictions for your account.
        </p>

        {/* Content Filter Toggle */}
        <div style={{
          background: 'oklch(0.12 0.04 265)',
          border: '2px solid oklch(0.28 0.07 265)',
          padding: '20px',
          marginBottom: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap' as const,
          }}>
            <div>
              <div className="orbitron-text" style={{
                fontSize: '12px',
                fontWeight: 700,
                color: contentFilter ? 'oklch(0.65 0.18 130)' : 'oklch(0.6 0.1 265)',
                letterSpacing: '2px',
                marginBottom: '4px',
              }}>
                🛡️ CONTENT FILTER
              </div>
              <p style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '11px',
                color: 'oklch(0.5 0.07 265)',
                margin: 0,
              }}>
                {contentFilter ? 'Filtering is ON' : 'Filtering is OFF'}
              </p>
            </div>

            {/* Toggle switch */}
            <button
              type="button"
              onClick={() => setContentFilter(!contentFilter)}
              style={{
                width: '60px',
                height: '30px',
                borderRadius: '15px',
                background: contentFilter
                  ? 'linear-gradient(90deg, oklch(0.5 0.18 130), oklch(0.65 0.2 130))'
                  : 'oklch(0.2 0.04 265)',
                border: `2px solid ${contentFilter ? 'oklch(0.65 0.18 130)' : 'oklch(0.35 0.08 265)'}`,
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s',
                boxShadow: contentFilter ? '0 0 12px oklch(0.65 0.18 130 / 0.4)' : 'none',
                flexShrink: 0,
              }}
              aria-label={contentFilter ? 'Disable content filter' : 'Enable content filter'}
            >
              <div style={{
                position: 'absolute',
                top: '3px',
                left: contentFilter ? 'calc(100% - 27px)' : '3px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: contentFilter ? 'white' : 'oklch(0.5 0.08 265)',
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px oklch(0 0 0 / 0.4)',
              }} />
            </button>
          </div>
        </div>

        {/* Max Age Rating */}
        <div style={{
          background: 'oklch(0.12 0.04 265)',
          border: '2px solid oklch(0.28 0.07 265)',
          padding: '20px',
          marginBottom: '16px',
        }}>
          <div className="orbitron-text" style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'oklch(0.82 0.18 85)',
            letterSpacing: '2px',
            marginBottom: '8px',
          }}>
            🎬 MAX AGE RATING
          </div>
          <p style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '11px',
            color: 'oklch(0.5 0.07 265)',
            marginBottom: '16px',
          }}>
            {ratingDescriptions[maxRating]}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {ratings.map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => setMaxRating(rating)}
                style={{
                  background: maxRating === rating
                    ? `${ratingColors[rating]} / 0.2`
                    : 'oklch(0.09 0.02 265)',
                  border: `2px solid ${maxRating === rating ? ratingColors[rating] : 'oklch(0.25 0.06 265)'}`,
                  padding: '12px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s',
                  boxShadow: maxRating === rating ? `0 0 12px ${ratingColors[rating]} / 0.3` : 'none',
                }}
              >
                <span className="pixel-text" style={{
                  fontSize: '10px',
                  color: maxRating === rating ? ratingColors[rating] : 'oklch(0.55 0.07 265)',
                  textShadow: maxRating === rating ? `0 0 8px ${ratingColors[rating]}` : 'none',
                }}>
                  {rating}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{
          background: 'oklch(0.13 0.05 265 / 0.5)',
          border: '1px solid oklch(0.3 0.08 265)',
          padding: '14px 16px',
          marginBottom: '20px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap' as const,
        }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: 'oklch(0.55 0.1 265)', letterSpacing: '2px', fontWeight: 700 }}>
              CURRENT SETTINGS
            </span>
            <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap' as const }}>
              <span style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '11px',
                color: contentFilter ? 'oklch(0.65 0.18 130)' : 'oklch(0.6 0.18 27)',
              }}>
                Filter: {contentFilter ? 'ON' : 'OFF'}
              </span>
              <span style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '11px',
                color: ratingColors[maxRating],
              }}>
                Max: {maxRating}
              </span>
            </div>
          </div>
          {isSaved && (
            <div style={{
              fontFamily: 'Press Start 2P, monospace',
              fontSize: '7px',
              color: 'oklch(0.65 0.18 130)',
              textShadow: '0 0 8px oklch(0.65 0.18 130 / 0.6)',
              letterSpacing: '1px',
            }}>
              ✓ SAVED
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
          <MonitorButton
            variant="blue"
            size="md"
            onClick={handleSave}
            disabled={isLoading}
            icon={isLoading ? <span>⟳</span> : <span>💾</span>}
          >
            {isLoading ? 'SAVING...' : 'SAVE'}
          </MonitorButton>
          <MonitorButton
            variant="gold"
            size="md"
            onClick={handleDone}
            icon={<span>🏁</span>}
          >
            DONE
          </MonitorButton>
        </div>
      </main>
    </div>
  );
};

export default ParentalControlsPage;
