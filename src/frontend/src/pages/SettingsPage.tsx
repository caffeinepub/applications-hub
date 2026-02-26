import React from 'react';
import { MonitorButton } from '../components/MonitorButton';
import type { PageName } from '../App';
import type { UserProfile } from '../backend.d';

interface SettingsPageProps {
  onNavigate: (page: PageName) => void;
  currentUser: UserProfile | null;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate, currentUser }) => {
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
        <MonitorButton variant="default" size="sm" onClick={() => onNavigate('home')}>
          ← HOME
        </MonitorButton>
        <span className="pixel-text" style={{ fontSize: '9px', color: 'oklch(0.82 0.18 85)', textShadow: '0 0 8px oklch(0.82 0.18 85 / 0.6)' }}>
          OPTIONS
        </span>
      </nav>

      <main style={{ flex: 1, padding: '32px 16px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        {/* Player info */}
        {currentUser && (
          <div style={{
            background: 'oklch(0.13 0.04 265)',
            border: '2px solid oklch(0.35 0.1 245)',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 0 20px oklch(0.55 0.26 245 / 0.15)',
          }}>
            {/* Avatar */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, oklch(0.7 0.22 245), oklch(0.4 0.26 245))',
              border: '2px solid oklch(0.55 0.22 245)',
              boxShadow: '0 0 12px oklch(0.55 0.26 245 / 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '20px' }}>🦔</span>
            </div>
            <div>
              <div className="pixel-text" style={{ fontSize: '8px', color: 'oklch(0.82 0.18 85)', marginBottom: '4px' }}>
                {currentUser.displayName || currentUser.username}
              </div>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', color: 'oklch(0.55 0.12 265)' }}>
                @{currentUser.username}
              </div>
              {currentUser.ageVerified && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'oklch(0.35 0.15 130 / 0.3)',
                  border: '1px solid oklch(0.55 0.2 130)',
                  padding: '2px 6px',
                  marginTop: '4px',
                  fontSize: '8px',
                  fontFamily: 'Orbitron, sans-serif',
                  color: 'oklch(0.7 0.18 130)',
                  fontWeight: 700,
                  letterSpacing: '1px',
                }}>
                  ✓ AGE VERIFIED
                </div>
              )}
            </div>
          </div>
        )}

        <h1 className="pixel-text mb-6" style={{
          fontSize: '10px',
          color: 'oklch(0.97 0.01 265)',
          textShadow: '0 0 10px oklch(0.55 0.26 245 / 0.5)',
          lineHeight: '2',
          letterSpacing: '2px',
        }}>
          SETTINGS
        </h1>

        {/* Settings grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Use Camera */}
          <div style={{
            background: 'oklch(0.12 0.04 265)',
            border: '2px solid oklch(0.28 0.07 265)',
            padding: '20px',
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
                color: 'oklch(0.8 0.18 195)',
                letterSpacing: '2px',
                marginBottom: '4px',
              }}>
                📷 USE CAMERA
              </div>
              <p style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '11px',
                color: 'oklch(0.55 0.08 265)',
                margin: 0,
              }}>
                Verify your age with face scan
              </p>
            </div>
            <MonitorButton
              variant="teal"
              size="sm"
              onClick={() => onNavigate('camera-verify')}
            >
              ENABLE
            </MonitorButton>
          </div>

          {/* Parental Controls */}
          <div style={{
            background: 'oklch(0.12 0.04 265)',
            border: '2px solid oklch(0.28 0.07 265)',
            padding: '20px',
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
                color: 'oklch(0.8 0.18 85)',
                letterSpacing: '2px',
                marginBottom: '4px',
              }}>
                🛡️ PARENTAL CONTROLS
              </div>
              <p style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '11px',
                color: 'oklch(0.55 0.08 265)',
                margin: 0,
              }}>
                Content filters and age ratings
              </p>
            </div>
            <MonitorButton
              variant="gold"
              size="sm"
              onClick={() => onNavigate('parental-controls')}
            >
              MANAGE
            </MonitorButton>
          </div>

          {/* Display Name */}
          <div style={{
            background: 'oklch(0.12 0.04 265)',
            border: '2px solid oklch(0.28 0.07 265)',
            padding: '20px',
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
                color: 'oklch(0.8 0.18 245)',
                letterSpacing: '2px',
                marginBottom: '4px',
              }}>
                ✏️ DISPLAY NAME
              </div>
              <p style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '11px',
                color: 'oklch(0.55 0.08 265)',
                margin: 0,
              }}>
                {currentUser?.displayName ? `Current: ${currentUser.displayName}` : 'Set your display name'}
              </p>
            </div>
            <MonitorButton
              variant="blue"
              size="sm"
              onClick={() => onNavigate('display-name')}
            >
              EDIT
            </MonitorButton>
          </div>

          {/* Not logged in message */}
          {!currentUser && (
            <div style={{
              background: 'oklch(0.15 0.06 265 / 0.5)',
              border: '2px solid oklch(0.4 0.12 85)',
              padding: '16px',
              textAlign: 'center',
            }}>
              <p className="pixel-text" style={{ fontSize: '8px', color: 'oklch(0.82 0.18 85)', lineHeight: '2' }}>
                ⚠ SIGN IN TO SAVE SETTINGS
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '12px' }}>
                <MonitorButton variant="blue" size="sm" onClick={() => onNavigate('login')}>
                  SIGN IN
                </MonitorButton>
                <MonitorButton variant="gold" size="sm" onClick={() => onNavigate('register')}>
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
