import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, User, LogOut, Loader2 } from 'lucide-react';

interface AuthPanelProps {
  open: boolean;
  onClose: () => void;
  email: string | null;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

const C = {
  bg: '#0d1b2a',
  card: '#112240',
  border: '#1d3461',
  text: '#e2eaf4',
  muted: '#5a7fa8',
  accent: '#3b82f6',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: C.bg,
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  padding: '8px 10px',
  fontSize: 13,
  color: C.text,
  marginBottom: 8,
  boxSizing: 'border-box',
  outline: 'none',
};

export function AuthPanel({ open, onClose, email, onLogin, onRegister, onLogout }: AuthPanelProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!formEmail || !formPassword || busy) return;
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await onLogin(formEmail, formPassword);
      else await onRegister(formEmail, formPassword);
      setFormEmail('');
      setFormPassword('');
      onClose();
    } catch (e) {
      setError((e as Error).message || 'Greška. Pokušaj ponovo.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    try { await onLogout(); onClose(); } finally { setBusy(false); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-[600]"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="absolute z-[601]"
            style={{
              top: 64,
              right: 16,
              width: 300,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          >
            {/* Header */}
            <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={14} color={C.accent} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: '0.04em' }}>
                  {email ? 'MOJ RAČUN' : mode === 'login' ? 'PRIJAVA' : 'REGISTRACIJA'}
                </span>
              </div>
              <button onClick={onClose} style={{ color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '14px 16px' }}>
              {email ? (
                <>
                  <p style={{ fontSize: 11, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prijavljen kao</p>
                  <div style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: '8px 10px',
                    fontSize: 13,
                    color: C.text,
                    marginBottom: 14,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {email}
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={busy}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: '9px',
                      cursor: busy ? 'not-allowed' : 'pointer',
                      color: '#f87171',
                      fontSize: 13,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    {busy ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                    Odjavi se
                  </button>
                  <p style={{ fontSize: 10, color: C.muted, marginTop: 12, textAlign: 'center', lineHeight: 1.4 }}>
                    Posjećeni vrhovi spremaju se na tvoj račun i sinkroniziraju na svim uređajima.
                  </p>
                </>
              ) : (
                <>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Email"
                    autoComplete="email"
                    style={inputStyle}
                  />
                  <input
                    type="password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'Lozinka (min. 4 znaka)' : 'Lozinka'}
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    style={{ ...inputStyle, border: `1px solid ${error ? '#ef4444' : C.border}` }}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                  />
                  {error && (
                    <p style={{ fontSize: 11, color: '#ef4444', marginBottom: 8 }}>{error}</p>
                  )}
                  <button
                    onClick={submit}
                    disabled={!formEmail || !formPassword || busy}
                    style={{
                      width: '100%',
                      background: !formEmail || !formPassword || busy ? C.border : C.accent,
                      border: 'none',
                      borderRadius: 8,
                      padding: '9px',
                      cursor: !formEmail || !formPassword || busy ? 'not-allowed' : 'pointer',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    {busy && <Loader2 size={14} className="animate-spin" />}
                    {mode === 'login' ? 'Prijavi se' : 'Registriraj se'}
                  </button>

                  <button
                    onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      marginTop: 10,
                      cursor: 'pointer',
                      color: C.muted,
                      fontSize: 12,
                    }}
                  >
                    {mode === 'login' ? 'Nemaš račun? Registriraj se' : 'Imaš račun? Prijavi se'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
