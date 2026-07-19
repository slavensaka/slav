import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mountain, Loader2 } from 'lucide-react';

interface AuthGateProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
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
  borderRadius: 10,
  padding: '11px 12px',
  fontSize: 14,
  color: C.text,
  marginBottom: 10,
  boxSizing: 'border-box',
  outline: 'none',
};

/** Puni ekran prijave — aplikacija je dostupna samo ulogiranim korisnicima. */
export function AuthGate({ onLogin, onRegister }: AuthGateProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email || !password || busy) return;
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await onLogin(email, password);
      else await onRegister(email, password);
    } catch (e) {
      setError((e as Error).message || 'Greška. Pokušaj ponovo.');
      setBusy(false);
    }
    // uspjeh → App se sam prebacuje na mapu (loggedIn state)
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center px-4"
      style={{ background: C.bg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 32 }}
        style={{
          width: '100%',
          maxWidth: 360,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
          padding: '32px 28px',
        }}
      >
        {/* Logo + naslov */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #166534, #22c55e)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Mountain size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: C.text, letterSpacing: '0.02em', margin: 0 }}>
            Osobna Obilaznica
          </h1>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
            HPO Planinska obilaznica
          </p>
        </div>

        <p style={{ fontSize: 11, color: C.muted, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
          {mode === 'login' ? 'Prijavi se za nastavak' : 'Napravi svoj račun'}
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          style={inputStyle}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'register' ? 'Lozinka (min. 4 znaka)' : 'Lozinka'}
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          style={{ ...inputStyle, border: `1px solid ${error ? '#ef4444' : C.border}` }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />

        {error && (
          <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 10 }}>{error}</p>
        )}

        <button
          onClick={submit}
          disabled={!email || !password || busy}
          style={{
            width: '100%',
            background: !email || !password || busy ? C.border : C.accent,
            border: 'none',
            borderRadius: 10,
            padding: '12px',
            cursor: !email || !password || busy ? 'not-allowed' : 'pointer',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {busy && <Loader2 size={15} className="animate-spin" />}
          {mode === 'login' ? 'Prijavi se' : 'Registriraj se'}
        </button>

        <button
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            marginTop: 14,
            cursor: 'pointer',
            color: C.muted,
            fontSize: 13,
          }}
        >
          {mode === 'login' ? 'Nemaš račun? Registriraj se' : 'Imaš račun? Prijavi se'}
        </button>
      </motion.div>
    </div>
  );
}
