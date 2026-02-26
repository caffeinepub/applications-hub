import React, { useState } from 'react';
import { useBackendCalls } from '../hooks/useBackendCalls';
import { MonitorButton } from '../components/MonitorButton';
import { toast } from 'sonner';
import type { PageName } from '../App';
import type { UserProfile } from '../backend.d';

interface LoginPageProps {
  onNavigate: (page: PageName) => void;
  onLogin: (user: UserProfile) => void;
}

function hashPassword(pass: string): string {
  return btoa(pass + '_sonic_salt');
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLogin }) => {
  const { actor } = useBackendCalls();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!username.trim()) newErrors.username = 'USERNAME REQUIRED';
    if (!password) newErrors.password = 'PASSWORD REQUIRED';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const passwordHash = hashPassword(password);
      const result = await actor?.login(username, passwordHash);

      if (result) {
        toast.success('WELCOME BACK, PLAYER!');
        onLogin(result);
        onNavigate('settings');
      } else {
        setErrors({ general: 'INVALID USERNAME OR PASSWORD' });
        toast.error('LOGIN FAILED - CHECK CREDENTIALS');
      }
    } catch (err) {
      console.error(err);
      toast.error('CONNECTION ERROR');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'oklch(0.12 0.04 265)',
    border: '2px solid oklch(0.3 0.08 265)',
    color: 'oklch(0.97 0.01 265)',
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '13px',
    outline: 'none',
    borderRadius: '2px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '10px',
    fontWeight: 700,
    color: 'oklch(0.65 0.18 245)',
    letterSpacing: '2px',
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
  };

  const errorStyle: React.CSSProperties = {
    fontFamily: 'Press Start 2P, monospace',
    fontSize: '7px',
    color: 'oklch(0.7 0.23 27)',
    marginTop: '4px',
    letterSpacing: '1px',
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
        <MonitorButton variant="default" size="sm" onClick={() => onNavigate('home')}>
          ← BACK
        </MonitorButton>
        <span className="pixel-text" style={{ fontSize: '9px', color: 'oklch(0.82 0.18 85)', textShadow: '0 0 8px oklch(0.82 0.18 85 / 0.6)' }}>
          CONTINUE GAME
        </span>
      </nav>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: 'oklch(0.11 0.03 265)',
          border: '2px solid oklch(0.3 0.08 265)',
          boxShadow: '0 0 40px oklch(0.55 0.26 245 / 0.2)',
          padding: '32px',
          position: 'relative',
        }}>
          {/* Corner decorations */}
          <div style={{ position: 'absolute', top: '-1px', left: '-1px', width: '12px', height: '12px', borderTop: '3px solid oklch(0.55 0.26 245)', borderLeft: '3px solid oklch(0.55 0.26 245)' }} />
          <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '12px', height: '12px', borderTop: '3px solid oklch(0.55 0.26 245)', borderRight: '3px solid oklch(0.55 0.26 245)' }} />
          <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '12px', height: '12px', borderBottom: '3px solid oklch(0.55 0.26 245)', borderLeft: '3px solid oklch(0.55 0.26 245)' }} />
          <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '12px', height: '12px', borderBottom: '3px solid oklch(0.55 0.26 245)', borderRight: '3px solid oklch(0.55 0.26 245)' }} />

          {/* Sonic spinning ring decoration */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '4px solid oklch(0.82 0.18 85)',
              boxShadow: '0 0 20px oklch(0.82 0.18 85 / 0.6), inset 0 0 10px oklch(0.82 0.18 85 / 0.2)',
              animation: 'star-ring-spin 2s linear infinite',
              background: 'linear-gradient(135deg, oklch(0.82 0.18 85 / 0.1) 0%, transparent 100%)',
            }} />
          </div>

          <h1 className="pixel-text text-center mb-6" style={{
            fontSize: '10px',
            color: 'oklch(0.97 0.01 265)',
            textShadow: '0 0 15px oklch(0.55 0.26 245 / 0.7)',
            lineHeight: '2',
            letterSpacing: '2px',
          }}>
            PLAYER SELECT
          </h1>

          {errors.general && (
            <div style={{
              background: 'oklch(0.15 0.08 27)',
              border: '2px solid oklch(0.6 0.23 27)',
              padding: '10px',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              <p style={errorStyle}>{errors.general}</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="login-username" style={labelStyle}>USERNAME</label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="YOUR USERNAME"
                style={inputStyle}
                autoComplete="username"
                onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
              />
              {errors.username && <p style={errorStyle}>{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="login-password" style={labelStyle}>PASSWORD</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                autoComplete="current-password"
                onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
              />
              {errors.password && <p style={errorStyle}>{errors.password}</p>}
            </div>

            <div className="flex justify-center mt-2">
              <MonitorButton
                variant="blue"
                size="lg"
                onClick={handleSubmit}
                disabled={isLoading}
                icon={isLoading ? <span style={{ fontSize: '16px' }}>⟳</span> : <span style={{ fontSize: '16px' }}>→</span>}
              >
                {isLoading ? 'LOADING...' : 'PRESS START'}
            </MonitorButton>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => onNavigate('register')}
                style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: '11px',
                  color: 'oklch(0.55 0.18 245)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                New player? Create account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
