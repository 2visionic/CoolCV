import React from 'react';
import Icon from './Icon';
import type { LiveCryptoProbeData } from '../types/cv';

export interface CryptoShowcaseProps {
  probePlaintext: string;
  setProbePlaintext: (val: string) => void;
  liveCryptoProbe: LiveCryptoProbeData | null;
  onRunCryptoProbe: () => void;
  onOpenBackoffice: () => void;
  t: (key: string) => string;
  innerCard: string;
  secondaryText: string;
}

// Live showcase of encryption on PHP backend (AES-256-CBC + HMAC) and API token
export default function CryptoShowcase({
  probePlaintext,
  setProbePlaintext,
  liveCryptoProbe,
  onRunCryptoProbe,
  onOpenBackoffice,
  t,
  innerCard,
  secondaryText,
}: CryptoShowcaseProps): React.ReactElement {
  return (
    <section id="sec-security" className="space-y-8 no-print">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400 mb-2">
            {t('crypto_badge')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('crypto_title')}</h2>
          <p className={`text-xs sm:text-sm mt-2 max-w-3xl ${secondaryText}`}>{t('crypto_sub')}</p>
        </div>

        <button
          type="button"
          onClick={onOpenBackoffice}
          className="px-6 py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-fuchsia-500 to-indigo-500 shadow-lg flex items-center gap-2 shrink-0"
        >
          <Icon name="lock_open" className="text-base" />
          <span>Otevřít plný React + TS Backoffice &amp; CRUD Editor</span>
        </button>
      </div>

      <div className={`rounded-3xl p-7 sm:p-9 space-y-6 ${innerCard}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={probePlaintext}
            onChange={(e) => setProbePlaintext(e.target.value)}
            placeholder="Zadejte libovolný text nebo payload k zašifrování na PHP backendu..."
            className="flex-1 px-4 py-3.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-mono focus:outline-none focus:border-purple-500"
          />
          <button
            type="button"
            onClick={onRunCryptoProbe}
            className="px-6 py-3.5 rounded-2xl font-bold text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 flex items-center gap-2 shrink-0"
          >
            <Icon name="encrypted" className="text-lg" />
            <span>Zašifrovat na Backendu (POST api.php?route=crypto/inspect)</span>
          </button>
        </div>

        {liveCryptoProbe && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-black/35 border border-white/10 space-y-2">
              <div className="text-purple-400 font-bold uppercase">1. Algoritmus &amp; IV (128-bit)</div>
              <div className="text-slate-300 break-all">{liveCryptoProbe.encryption_process?.algorithm}</div>
              <div className="text-slate-400">{`IV (Hex): ${liveCryptoProbe.encryption_process?.iv_hex}`}</div>
            </div>

            <div className="p-5 rounded-2xl bg-black/35 border border-white/10 space-y-2">
              <div className="text-fuchsia-400 font-bold uppercase">2. AES-256 Ciphertext &amp; HMAC-SHA256</div>
              <div className="text-slate-300 break-all">
                {`Cipher: ${liveCryptoProbe.encryption_process?.ciphertext_base64}`}
              </div>
              <div className="text-slate-400 break-all">
                {`HMAC: ${liveCryptoProbe.encryption_process?.hmac_sha256_hex}`}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-black/35 border border-emerald-500/25 space-y-2">
              <div className="text-emerald-400 font-bold uppercase">3. Backend Dešifrování &amp; Verifikace</div>
              <div className="text-emerald-300">
                {`HMAC Integrity: ${
                  liveCryptoProbe.decryption_verify?.verified_hmac ? 'VERIFIED (OK)' : 'FAILED'
                }`}
              </div>
              <div className="text-slate-300 break-all">
                {`Výstup: "${liveCryptoProbe.decryption_verify?.decrypted_raw}"`}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
