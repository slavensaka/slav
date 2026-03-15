import type { ReactNode } from 'react';
import type { KontrolnaTocka, Podrucje } from '../types';
import { Mountain, Zap, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface PopupCardProps {
  tocka: KontrolnaTocka;
  podrucje?: Podrucje;
}

// Mapiranje područja ID na ikonu
const podrucjeIconMap: Record<number, string> = {
  1: 'slavonija.png',
  2: 'moslavina.png',
  3: 'zagorje.png',
  4: 'zagreb.png',
  5: 'prigorje.png',
  6: 'karlovac.png',
  7: 'kordun.png',
  8: 'gorski_kotar.png',
  9: 'hrvatsko_primorje.png',
  10: 'istra.png',
  11: 'lika.png',
  12: 'lika.png',
  13: 'lika.png',
  14: 'lika.png',
  15: 'kvarner.png',
  16: 'dalmacija.png',
  17: 'sjeverna_dalmacija.png',
  18: 'dalmacija.png',
  19: 'dalmacija.png',
  20: 'dalmacija.png',
  21: 'hrvatska.png',
};

const tezinaConfig = {
  lako: {
    label: 'Lako',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-600'
  },
  srednje: {
    label: 'Srednje',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600'
  },
  tesko: {
    label: 'Teško',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600'
  },
};

function InfoRow({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 px-3 py-2 bg-gray-50/50 hover:bg-gray-100/50 rounded-lg border border-gray-100 transition-colors"
    >
      {children}
    </motion.div>
  );
}

export function PopupCard({ tocka, podrucje }: PopupCardProps) {
  const tezina = tocka.tezina ? tezinaConfig[tocka.tezina] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white w-[280px] rounded-lg overflow-hidden shadow-xl"
    >
      {/* Header s slikom ili gradient */}
      {tocka.slikaUrl ? (
        <div className="h-32 w-full relative">
          <img
            src={tocka.slikaUrl}
            alt={tocka.naziv}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ) : (
        <div
          className="h-6 w-full"
          style={{
            background: podrucje
              ? `linear-gradient(135deg, ${podrucje.boja}99, ${podrucje.boja})`
              : 'linear-gradient(135deg, #667eea, #764ba2)'
          }}
        />
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-extrabold text-lg text-gray-900 leading-tight tracking-tight">
          {tocka.id}. {tocka.naziv}
        </h3>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3" />

        {/* Info Grid */}
        <div className="space-y-2 text-sm">
          {/* Područje */}
          {podrucje && (
            <InfoRow delay={0.1}>
              <img
                src={`/ikone/${podrucjeIconMap[podrucje.id] || 'hrvatska.png'}`}
                alt={podrucje.naziv}
                className="w-8 h-8 rounded-md object-cover flex-shrink-0 shadow-sm"
              />
              <span className="text-gray-700 text-sm font-medium">{podrucje.naziv}</span>
            </InfoRow>
          )}

          {/* Nadmorska visina */}
          {tocka.nadmorskaVisina && (
            <InfoRow delay={0.15}>
              <Mountain className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 text-sm font-medium">{tocka.nadmorskaVisina} m n.v.</span>
            </InfoRow>
          )}

          {/* Težina */}
          {tezina && (
            <InfoRow delay={0.2}>
              <Zap className={`w-4 h-4 flex-shrink-0 ${tezina.iconColor}`} />
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${tezina.bgColor} ${tezina.textColor} ${tezina.borderColor}`}>
                {tezina.label}
              </span>
            </InfoRow>
          )}
        </div>

        {/* Opis */}
        {tocka.opis && (
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">
            {tocka.opis}
          </p>
        )}

        {/* Buttons */}
        {tocka.linkVanjski && (
          <div className="mt-4">
            <motion.a
              href={tocka.linkVanjski}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Detaljnije
            </motion.a>
          </div>
        )}
      </div>
    </motion.div>
  );
}
