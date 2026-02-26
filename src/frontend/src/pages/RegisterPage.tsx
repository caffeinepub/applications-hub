import React, { useState } from 'react';
import { UpdateUserProfileResponse } from '../backend.d';
import { useBackendCalls } from '../hooks/useBackendCalls';
import { MonitorButton } from '../components/MonitorButton';
import { toast } from 'sonner';
import type { PageName } from '../App';

interface RegisterPageProps {
  onNavigate: (page: PageName) => void;
  onRegister: (username: string) => void;
}

function hashPassword(pass: string): string {
  return btoa(pass + '_sonic_salt');
}

function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegister }) => {
  const { actor } = useBackendCalls();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) newErrors.username = 'USERNAME REQUIRED';
    else if (username.length < 3) newErrors.username = 'MIN 3 CHARACTERS';
    else if (!/^[a-zA-Z0-9_]+$/.test(username)) newErrors.username = 'LETTERS, NUMBERS, _ ONLY';

    if (!password) newErrors.password = 'PASSWORD REQUIRED';
    else if (password.length < 6) newErrors.password = 'MIN 6 CHARACTERS';

    if (password !== confirmPassword) newErrors.confirmPassword = 'PASSWORDS DO NOT MATCH';

    if (!dob) {
      newErrors.dob = 'DATE OF BIRTH REQUIRED';
    } else {
      const age = calculateAge(new Date(dob));
      if (age < 10) newErrors.dob = 'MUST BE AT LEAST 10 YEARS OLD';
      if (age > 18) newErrors.dob = 'MUST BE 18 OR YOUNGER';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const dobDate = new Date(dob);
      const dobBigInt = BigInt(dobDate.getTime());
      const passwordHash = hashPassword(password);

      const result = await actor?.register(username, passwordHash, dobBigInt);

      if (result === UpdateUserProfileResponse.success) {
        toast.success('ACCOUNT CREATED! PRESS START');
        onRegister(username);
        onNavigate('settings');
      } else if (result === UpdateUserProfileResponse.usernameAlreadyExists) {
        setErrors({ username: 'USERNAME TAKEN - TRY ANOTHER' });
        toast.error('USERNAME ALREADY EXISTS');
      } else if (!result) {
        toast.error('REGISTRATION FAILED - ACTOR NOT READY');
      } else {
        toast.error('REGISTRATION FAILED - TRY AGAIN');
      }
    } catch (err) {
      console.error(err);
      toast.error('CONNECTION ERROR - CHECK NETWORK');
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
    transition: 'border-color 0.2s, box-shadow 0.2s',
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
          CREATE ACCOUNT
        </span>
      </nav>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'oklch(0.11 0.03 265)',
          border: '2px solid oklch(0.3 0.08 265)',
          boxShadow: '0 0 40px oklch(0.55 0.26 245 / 0.2), 0 0 80px oklch(0.55 0.26 245 / 0.05)',
          padding: '32px',
          position: 'relative',
        }}>
          {/* Corner decorations */}
          <div style={{ position: 'absolute', top: '-1px', left: '-1px', width: '12px', height: '12px', borderTop: '3px solid oklch(0.82 0.18 85)', borderLeft: '3px solid oklch(0.82 0.18 85)' }} />
          <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '12px', height: '12px', borderTop: '3px solid oklch(0.82 0.18 85)', borderRight: '3px solid oklch(0.82 0.18 85)' }} />
          <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '12px', height: '12px', borderBottom: '3px solid oklch(0.82 0.18 85)', borderLeft: '3px solid oklch(0.82 0.18 85)' }} />
          <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '12px', height: '12px', borderBottom: '3px solid oklch(0.82 0.18 85)', borderRight: '3px solid oklch(0.82 0.18 85)' }} />

          <h1 className="pixel-text text-center mb-6" style={{
            fontSize: '10px',
            color: 'oklch(0.97 0.01 265)',
            textShadow: '0 0 15px oklch(0.55 0.26 245 / 0.7)',
            lineHeight: '2',
            letterSpacing: '2px',
          }}>
            NEW PLAYER
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Username */}
            <div>
              <label htmlFor="reg-username" style={labelStyle}>USERNAME</label>
              <input
                id="reg-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="ENTER USERNAME"
                style={inputStyle}
                autoComplete="username"
              />
              {errors.username && <p style={errorStyle}>{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" style={labelStyle}>PASSWORD</label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                autoComplete="new-password"
              />
              {errors.password && <p style={errorStyle}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" style={labelStyle}>CONFIRM PASSWORD</label>
              <input
                id="reg-confirm"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="reg-dob" style={labelStyle}>DATE OF BIRTH</label>
              <input
                id="reg-dob"
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                style={inputStyle}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dob && <p style={errorStyle}>{errors.dob}</p>}
              <p style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '10px',
                color: 'oklch(0.5 0.08 265)',
                marginTop: '4px',
              }}>
                Ages 10-18 welcome
              </p>
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-2">
              <MonitorButton
                variant="gold"
                size="lg"
                onClick={handleSubmit}
                disabled={isLoading}
                icon={isLoading ? <span style={{ fontSize: '16px' }}>⟳</span> : <span style={{ fontSize: '16px' }}>✦</span>}
              >
                {isLoading ? 'CREATING...' : 'START GAME'}
              </MonitorButton>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => onNavigate('login')}
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
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
