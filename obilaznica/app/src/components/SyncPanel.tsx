import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Check, X, RefreshCw } from 'lucide-react';

interface SyncPanelProps {
  open: boolean;
  onClose: () => void;
  syncUUID: string;
  onImport: (code: string) => Promise<boolean>;
}

const C = {
  bg: '#0d1b2a',
  card: '#112240',
  border: '#1d3461',
  text: '#e2eaf4',
  muted: '#5a7fa8',
  accent: '#3b82f6',
};

export function SyncPanel({ open, onClose, syncUUID, onImport }: SyncPanelProps) {
  const [copied, setCopied] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(syncUUID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = async () => {
    setImportError('');
    setImportSuccess(false);
    setImporting(true);
    const ok = await onImport(importCode);
    setImporting(false);
    if (ok) {
      setImportSuccess(true);
      setImportCode('');
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 1500);
    } else {
      setImportError('Nevažeći kod ili nema podataka za taj kod.');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 z-[600]"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="absolute z-[601]"
            style={{
              bottom: 80,
              right: 16,
              width: 300,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          >
            {/* Header */}
            <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw size={14} color={C.accent} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: '0.04em' }}>SINKRONIZACIJA</span>
              </div>
              <button onClick={onClose} style={{ color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '14px 16px' }}>
              {/* Moj kod */}
              <p style={{ fontSize: 11, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tvoj sync kod</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <div style={{
                  flex: 1,
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '7px 10px',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  color: C.text,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {syncUUID}
                </div>
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? '#166534' : C.accent,
                    border: 'none',
                    borderRadius: 8,
                    padding: '7px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    flexShrink: 0,
                    transition: 'background 0.2s',
                  }}
                >
                  {copied ? <Check size={14} color="#fff" /> : <Copy size={14} color="#fff" />}
                  <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>
                    {copied ? 'Kopirano' : 'Kopiraj'}
                  </span>
                </button>
              </div>

              {/* Uvezi tuđi kod */}
              <p style={{ fontSize: 11, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Uvezi kod s drugog uređaja</p>
              <input
                type="text"
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                placeholder="Zalijepi sync kod ovdje..."
                style={{
                  width: '100%',
                  background: C.bg,
                  border: `1px solid ${importError ? '#ef4444' : C.border}`,
                  borderRadius: 8,
                  padding: '7px 10px',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  color: C.text,
                  marginBottom: 8,
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
                onKeyDown={(e) => e.key === 'Enter' && importCode && handleImport()}
              />
              {importError && (
                <p style={{ fontSize: 11, color: '#ef4444', marginBottom: 8 }}>{importError}</p>
              )}
              {importSuccess && (
                <p style={{ fontSize: 11, color: '#4ade80', marginBottom: 8 }}>✓ Podatci uvezeni!</p>
              )}
              <button
                onClick={handleImport}
                disabled={!importCode || importing}
                style={{
                  width: '100%',
                  background: importing || !importCode ? C.border : C.accent,
                  border: 'none',
                  borderRadius: 8,
                  padding: '9px',
                  cursor: importing || !importCode ? 'not-allowed' : 'pointer',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'background 0.2s',
                }}
              >
                {importing ? 'Učitavam...' : 'Uvezi i primjeni'}
              </button>

              <p style={{ fontSize: 10, color: C.muted, marginTop: 12, textAlign: 'center', lineHeight: 1.4 }}>
                Kopiraj svoj kod i zalijepi ga na drugom uređaju da dobiješ iste posjete.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
