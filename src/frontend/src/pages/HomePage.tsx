import React from 'react';
import { MonitorButton } from '../components/MonitorButton';
import { SonicSprite } from '../components/SonicSprite';
import type { PageName } from '../App';

interface HomePageProps {
  onNavigate: (page: PageName) => void;
}

const signInProviders = [
  { name: 'GOOGLE', icon: '🔍', variant: 'blue' as const },
  { name: 'APPLE', icon: '🍎', variant: 'default' as const },
  { name: 'MICROSOFT', icon: '⊞', variant: 'teal' as const },
  { name: 'EPIC GAMES', icon: '🎮', variant: 'red' as const },
  { name: 'YAHOO', icon: '📧', variant: 'gold' as const },
  { name: 'HOTMAIL', icon: '📩', variant: 'blue' as const },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
      {/* ===== NAVBAR ===== */}
      <nav
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, oklch(0.15 0.06 245) 0%, oklch(0.1 0.04 245) 100%)',
          borderBottom: '3px solid oklch(0.55 0.26 245)',
          boxShadow: '0 4px 20px oklch(0.55 0.26 245 / 0.4)',
          height: '64px',
        }}
      >
        {/* Checkerboard strip */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '8px',
          backgroundImage: 'repeating-conic-gradient(oklch(0.4 0.12 245) 0% 25%, oklch(0.15 0.05 245) 0% 50%)',
          backgroundSize: '8px 8px',
        }} />

        {/* Speed lines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(-45deg, transparent, transparent 20px, oklch(0.55 0.26 245 / 0.03) 20px, oklch(0.55 0.26 245 / 0.03) 21px)',
          pointerEvents: 'none',
        }} />

        <div className="relative flex items-center justify-between h-full px-4" style={{ paddingBottom: '8px' }}>
          {/* Logo / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Ring icon */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '3px solid oklch(0.82 0.18 85)',
              boxShadow: '0 0 12px oklch(0.82 0.18 85 / 0.8), inset 0 0 8px oklch(0.82 0.18 85 / 0.2)',
              background: 'transparent',
              flexShrink: 0,
            }} />
            <span
              className="pixel-text"
              style={{
                fontSize: '11px',
                color: 'oklch(0.97 0.01 265)',
                textShadow: '0 0 10px oklch(0.55 0.26 245 / 0.8), 2px 2px 0 oklch(0.05 0.01 265)',
                letterSpacing: '2px',
                lineHeight: 1,
              }}
            >
              APPLICATIONS
            </span>
          </div>

          {/* Sonic sprite running on the bar */}
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '40px',
          }}>
            <SonicSprite size="sm" animate />
          </div>

          {/* Auth buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <MonitorButton
              variant="blue"
              size="sm"
              onClick={() => onNavigate('login')}
            >
              SIGN IN
            </MonitorButton>
            <MonitorButton
              variant="gold"
              size="sm"
              onClick={() => onNavigate('register')}
            >
              JOIN
            </MonitorButton>
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 page-enter">
        {/* Hero section */}
        <section style={{
          background: 'linear-gradient(180deg, oklch(0.09 0.02 265) 0%, oklch(0.12 0.04 265) 50%, oklch(0.09 0.02 265) 100%)',
          padding: '40px 16px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background stars */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(oklch(0.82 0.18 85 / 0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0',
            animation: 'star-twinkle 3s ease-in-out infinite',
          }} />

          {/* Speed lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(-15deg, transparent, transparent 30px, oklch(0.55 0.26 245 / 0.04) 30px, oklch(0.55 0.26 245 / 0.04) 31px)',
            pointerEvents: 'none',
          }} />

          <div className="relative max-w-2xl mx-auto text-center">
            {/* Ring count HUD */}
            <div className="hud-text mb-4" style={{ color: 'oklch(0.82 0.18 85)', fontSize: '8px', letterSpacing: '4px' }}>
              ★ ★ ★ ★ ★ RINGS: 99 ★ ★ ★ ★ ★
            </div>

            {/* Main title */}
            <h1
              className="pixel-text mb-3"
              style={{
                fontSize: 'clamp(14px, 4vw, 22px)',
                lineHeight: '2',
                color: 'oklch(0.97 0.01 265)',
                textShadow: '0 0 20px oklch(0.55 0.26 245 / 0.8), 0 0 40px oklch(0.55 0.26 245 / 0.4), 3px 3px 0 oklch(0.05 0.01 265)',
                letterSpacing: '3px',
              }}
            >
              APPLICATIONS HUB
            </h1>

            <p className="orbitron-text mb-8" style={{
              fontSize: '12px',
              color: 'oklch(0.65 0.12 245)',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}>
              SELECT YOUR DESTINATION
            </p>

            {/* Big action buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <MonitorButton
                href="https://scrambler-prh.caffeine.xyz/"
                variant="red"
                size="lg"
                icon={<span style={{ fontSize: '24px' }}>🌀</span>}
              >
                GO TO SCRAMBLER
              </MonitorButton>

              <MonitorButton
                href="https://scrambly-08a.caffeine.xyz/"
                variant="gold"
                size="lg"
                icon={<span style={{ fontSize: '24px' }}>⚡</span>}
              >
                SCRAMBLY
              </MonitorButton>
            </div>

            {/* Zone indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: 'oklch(0.5 0.08 265)',
              fontSize: '8px',
              fontFamily: 'Press Start 2P, monospace',
              letterSpacing: '2px',
            }}>
              <span>━━━━━</span>
              <span style={{ color: 'oklch(0.62 0.22 245)' }}>ZONE 1 ACT 1</span>
              <span>━━━━━</span>
            </div>
          </div>
        </section>

        {/* Sign In section */}
        <section style={{
          background: 'oklch(0.11 0.03 265)',
          borderTop: '2px solid oklch(0.25 0.06 265)',
          borderBottom: '2px solid oklch(0.25 0.06 265)',
          padding: '32px 16px',
          position: 'relative',
        }}>
          <div className="checkerboard-bg-animated" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            opacity: 0.6,
          }} />
          <div className="checkerboard-bg-animated" style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            opacity: 0.6,
          }} />

          <div className="max-w-2xl mx-auto">
            <h2
              className="pixel-text text-center mb-6"
              style={{
                fontSize: '9px',
                color: 'oklch(0.82 0.18 85)',
                textShadow: '0 0 10px oklch(0.82 0.18 85 / 0.6)',
                letterSpacing: '3px',
                lineHeight: '2',
              }}
            >
              SIGN IN WITH
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 justify-items-center">
              {signInProviders.map((provider) => (
                <MonitorButton
                  key={provider.name}
                  variant={provider.variant}
                  size="sm"
                  onClick={() => onNavigate('login')}
                  icon={<span>{provider.icon}</span>}
                  className="w-full"
                >
                  {provider.name}
                </MonitorButton>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <MonitorButton
                variant="blue"
                size="sm"
                onClick={() => onNavigate('register')}
                icon={<span>✦</span>}
              >
                CREATE ACCOUNT
              </MonitorButton>
              <MonitorButton
                variant="teal"
                size="sm"
                onClick={() => onNavigate('login')}
                icon={<span>→</span>}
              >
                SIGN IN
              </MonitorButton>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: 'oklch(0.08 0.02 265)',
        borderTop: '2px solid oklch(0.2 0.05 265)',
        padding: '16px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '11px',
          color: 'oklch(0.45 0.06 265)',
        }}>
          © 2026. Built with{' '}
          <span style={{ color: 'oklch(0.6 0.23 27)' }}>♥</span>
          {' '}using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'oklch(0.62 0.22 245)', textDecoration: 'none' }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
