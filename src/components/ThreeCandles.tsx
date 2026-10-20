import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CandleData } from '../types/index.ts';
import { FAMILY_CLOSING } from '../content/config.ts';
import { sound } from '../utils/audio.ts';
import { checkFamilyCandlesComplete, calculateCandleIllumination } from '../utils/logic.ts';
import { InteractiveSticker } from './InteractiveSticker.tsx';
import { VoiceNotePlayer } from './VoiceNotePlayer.tsx';
import { DEFAULT_CONFIG } from '../content/config.ts';
import { Sparkles, Wind, Heart } from 'lucide-react';

interface ThreeCandlesProps {
  candles: CandleData[];
  gifterName: string;
  recipientName: string;
  thirdPersonName: string;
  onLitCountChange?: (count: number) => void;
}

export const ThreeCandles: React.FC<ThreeCandlesProps> = ({
  candles,
  gifterName,
  recipientName,
  thirdPersonName,
  onLitCountChange,
}) => {
  const [litCandleIds, setLitCandleIds] = useState<string[]>([]);
  const [activeDialogue, setActiveDialogue] = useState<{
    name: string;
    quote: string;
    color: string;
  } | null>(null);

  const { isAllLit, litCount, total } = checkFamilyCandlesComplete(
    litCandleIds,
    candles.map((c) => c.id)
  );

  useEffect(() => {
    onLitCountChange?.(litCount);
  }, [litCount, onLitCountChange]);

  useEffect(() => {
    return () => onLitCountChange?.(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLightCandle = (candle: CandleData) => {
    if (litCandleIds.includes(candle.id)) return;

    sound.playChime();
    sound.playPop();

    const nextLit = [...litCandleIds, candle.id];
    setLitCandleIds(nextLit);

    setActiveDialogue({
      name: candle.name,
      quote: candle.quote,
      color: candle.hexColor,
    });

    if (nextLit.length === candles.length) {
      window.setTimeout(() => {
        sound.playFanfare();
        confetti({
          particleCount: 120,
          spread: 110,
          origin: { y: 0.45 },
          colors: ['#fbbf24', '#60a5fa', '#f472b6'],
        });
      }, 400);
    }
  };

  const handleBlowCandles = () => {
    sound.playCandleBlow();
    setLitCandleIds([]);
    setActiveDialogue(null);
  };

  const isBaLit = litCandleIds.includes('candle-ba');
  const isMeLit = litCandleIds.includes('candle-me');
  const isConLit = litCandleIds.includes('candle-con');

  const roleLabels: Record<CandleData['role'], string> = {
    ba: `Ba (${gifterName})`,
    me: `Mẹ (${recipientName})`,
    con: `Con (${thirdPersonName})`,
  };

  const candleStyles = {
    ba: {
      height: 'h-44 sm:h-52',
      width: 'w-20 sm:w-24',
      bodyGradient: 'from-amber-300 via-amber-400 to-amber-600',
      glowColor: 'rgba(251, 191, 36, 0.75)',
      character: 'ba' as const,
    },
    me: {
      height: 'h-40 sm:h-48',
      width: 'w-20 sm:w-24',
      bodyGradient: 'from-sky-300 via-blue-400 to-blue-600',
      glowColor: 'rgba(96, 165, 250, 0.75)',
      character: 'me' as const,
    },
    con: {
      height: 'h-32 sm:h-40',
      width: 'w-16 sm:w-20',
      bodyGradient: 'from-pink-300 via-pink-400 to-rose-500',
      glowColor: 'rgba(244, 114, 182, 0.75)',
      character: 'con' as const,
    },
  } as const;

  return (
    <section className="relative w-full max-w-3xl mx-auto px-3 sm:px-4 py-8 flex flex-col items-center select-none">
      {isAllLit && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-200 animate-firefly shadow-lg"
              style={{
                left: `${8 + ((i * 13) % 84)}%`,
                top: `${15 + ((i * 17) % 70)}%`,
                animationDelay: `${(i * 0.4) % 3}s`,
                animationDuration: `${3 + (i % 3)}s`,
                boxShadow: '0 0 10px 3px rgba(253, 224, 71, 0.9)',
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-800/80 text-amber-300 text-xs sm:text-sm font-bold mb-2 border border-amber-400/30 shadow-md">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Gia Đình 3 Người Trong Bóng Tối</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-md">
          Ba Cây Nến Lung Linh
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
          {isAllLit
            ? 'Cả căn phòng đã bừng sáng ấm áp!'
            : 'Chạm vào từng cây nến để thắp sáng cho cả nhà.'}
        </p>
      </div>

      <div className="relative z-10 mb-4 px-4 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 text-xs font-semibold text-slate-300 shadow-md flex items-center gap-2">
        <span>Đã thắp:</span>
        <span className="font-bold text-amber-400">
          {litCount}/{total} ngọn nến
        </span>
        {isAllLit && <span className="text-emerald-400 font-bold">✓ Cả nhà bừng sáng!</span>}
      </div>

      {activeDialogue && (
        <div
          className="relative z-10 mb-6 px-4 py-2 rounded-2xl bg-slate-900/90 border-2 shadow-2xl max-w-sm text-center animate-scale-up"
          style={{ borderColor: activeDialogue.color }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wider mb-0.5"
            style={{ color: activeDialogue.color }}
          >
            {activeDialogue.name}
          </p>
          <p className="text-xs sm:text-sm font-semibold text-white">
            &ldquo;{activeDialogue.quote}&rdquo;
          </p>
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 border-r-2 border-b-2 rotate-45"
            style={{ borderColor: activeDialogue.color }}
          />
        </div>
      )}

      <div className="relative z-10 w-full flex items-end justify-around sm:justify-center sm:gap-14 py-6 px-2 min-h-[300px]">
        {candles.map((candle) => {
          const isLit = litCandleIds.includes(candle.id);
          const ambient = calculateCandleIllumination(litCandleIds, candle.id);
          const style = candleStyles[candle.role];

          return (
            <div
              key={candle.id}
              data-testid={candle.id}
              onClick={() => handleLightCandle(candle)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleLightCandle(candle);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Thắp nến ${roleLabels[candle.role]}`}
              className="flex flex-col items-center cursor-pointer group select-none transition-transform duration-300 hover:scale-105 outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-2xl"
            >
              <div className="mb-2">
                <InteractiveSticker
                  character={style.character}
                  expression={isLit ? 'cuoi' : 'ngaongoc'}
                  ambientLight={ambient}
                  size="sm"
                  floatAnimation={isLit}
                />
              </div>

              <div className="h-12 flex items-end justify-center mb-1 relative">
                {isLit ? (
                  <div className="relative flex flex-col items-center animate-flame-flicker">
                    <div
                      className="w-4 sm:w-5 h-8 sm:h-9 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-white shadow-xl animate-pulse"
                      style={{ boxShadow: `0 0 28px 10px ${style.glowColor}` }}
                    />
                    <span className="absolute -top-3 text-[10px] animate-ping">✨</span>
                  </div>
                ) : (
                  <div className="w-1 h-3.5 bg-gray-500 rounded-t-sm" />
                )}
              </div>

              <div
                className={`${style.width} ${style.height} rounded-t-2xl rounded-b-lg bg-gradient-to-b ${style.bodyGradient} shadow-2xl border-t border-white/60 relative flex flex-col items-center justify-between p-2 transition-all duration-300`}
                style={{
                  filter: isLit ? 'brightness(1.1)' : `brightness(${0.68 + ambient * 0.27})`,
                }}
              >
                <div className="w-full flex justify-around">
                  <div className="w-2.5 h-4 bg-white/40 rounded-b-full" />
                  <div className="w-3.5 h-6 bg-white/50 rounded-b-full" />
                  <div className="w-2 h-3.5 bg-white/40 rounded-b-full" />
                </div>

                <div className="text-center px-1">
                  <span className="text-base sm:text-lg block drop-shadow-md">
                    {candle.role === 'ba' ? '👨' : candle.role === 'me' ? '👩' : '👶'}
                  </span>
                  <p className="text-[11px] sm:text-xs font-bold text-white tracking-wide drop-shadow-md">
                    {candle.name}
                  </p>
                </div>

                <div className="w-full text-center pb-1">
                  <span className="text-[10px] text-white/90 font-medium whitespace-nowrap">
                    {isLit ? '🔥 Đã sáng' : 'Chạm'}
                  </span>
                </div>
              </div>

              <div
                className="mt-3 px-3 py-1 rounded-xl text-xs font-bold border transition-all duration-500 shadow-sm"
                style={{
                  backgroundColor: isLit ? candle.hexColor : 'rgba(30, 41, 59, 0.8)',
                  color: isLit ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                  borderColor: isLit ? candle.hexColor : '#475569',
                  opacity: Math.max(0.68, ambient),
                }}
              >
                {roleLabels[candle.role]}
              </div>
            </div>
          );
        })}
      </div>

      {isAllLit && (
        <div className="relative z-10 mt-8 text-center animate-fade-in w-full max-w-md bg-slate-900/80 backdrop-blur-md rounded-3xl p-5 border border-pink-400/50 shadow-2xl">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold shadow-xs mb-3 border border-rose-500/40">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-400 animate-pulse" />
            <span>{FAMILY_CLOSING.line}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
            {FAMILY_CLOSING.subline}
          </p>

          <div className="flex items-center justify-center gap-8 my-3 py-1">
            <InteractiveSticker
              character="me"
              expression="tha-tim"
              size="sm"
              tilt={-6}
              floatAnimation
            />
            <InteractiveSticker
              character="con"
              expression="yeahhh"
              size="sm"
              tilt={6}
              floatAnimation
            />
          </div>

          <button
            type="button"
            onClick={handleBlowCandles}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 mx-auto touch-manipulation"
          >
            <Wind className="w-4 h-4" />
            <span>Phù! Thổi nến ước nguyện 💨</span>
          </button>
        </div>
      )}

      <div className="relative z-10 w-full mt-10">
        <VoiceNotePlayer
          title="Thông Điệp Tri Ân Gia Đình 3 Người 💛💙💗"
          senderLabel="🎧 Loa phát thanh gia đình nhỏ"
          audioUrl={DEFAULT_CONFIG.voiceNoteFamily.audioUrl}
          durationEstimate={DEFAULT_CONFIG.voiceNoteFamily.durationEstimate}
          darkMode
        />
      </div>

      <style>{`
        @keyframes flameFlicker {
          0%, 100% { transform: scale(1) rotate(-1deg); }
          50% { transform: scale(1.08, 0.94) rotate(1.5deg); }
        }
        .animate-flame-flicker {
          animation: flameFlicker 0.35s ease-in-out infinite alternate;
        }

        @keyframes fireflyDrift {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0.3; }
          50% { transform: translate(15px, -30px) scale(1.2); opacity: 0.9; }
          100% { transform: translate(-10px, -60px) scale(0.8); opacity: 0.2; }
        }
        .animate-firefly {
          animation: fireflyDrift linear infinite;
        }
      `}</style>
    </section>
  );
};
