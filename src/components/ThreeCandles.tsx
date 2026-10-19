import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CandleData } from '../types/index.ts';
import { sound } from '../utils/audio.ts';
import { checkFamilyCandlesComplete, calculateCandleIllumination } from '../utils/logic.ts';
import { InteractiveSticker } from './InteractiveSticker.tsx';
import { VoiceNotePlayer } from './VoiceNotePlayer.tsx';
import { DEFAULT_CONFIG } from '../content/config.ts';
import { Flame, Wind, Sparkles, Heart, Mic, MicOff, Star } from 'lucide-react';

interface ThreeCandlesProps {
  candles: CandleData[];
  gifterName: string;
  recipientName: string;
  thirdPersonName: string;
}

export const ThreeCandles: React.FC<ThreeCandlesProps> = ({
  candles,
  gifterName,
  recipientName,
  thirdPersonName,
}) => {
  const [litCandleIds, setLitCandleIds] = useState<string[]>([]);
  const [activeDialogue, setActiveDialogue] = useState<{ name: string; quote: string; color: string } | null>(null);
  const [isMicListening, setIsMicListening] = useState(false);
  const [micVolume, setMicVolume] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const { isAllLit, litCount, total } = checkFamilyCandlesComplete(
    litCandleIds,
    candles.map((c) => c.id)
  );

  const handleLightCandle = (candle: CandleData) => {
    if (litCandleIds.includes(candle.id)) return;

    sound.playChime();
    sound.playPop();

    const nextLit = [...litCandleIds, candle.id];
    setLitCandleIds(nextLit);

    // Keep dialogue short (< 8 words)
    setActiveDialogue({
      name: candle.name,
      quote: candle.quote,
      color: candle.hexColor,
    });

    // When all 3 candles are lit -> Trigger WOW celebration
    if (nextLit.length === candles.length) {
      setTimeout(() => {
        sound.playFanfare();

        // 3-color family confetti explosion (Yellow, Blue, Pink)
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

  // Optional microphone blowing detection
  const toggleMicrophoneBlow = async () => {
    if (isMicListening) {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      setIsMicListening(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsMicListening(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setMicVolume(avg);

        if (avg > 65) {
          handleBlowCandles();
        }

        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch {
      alert('Không thể kết nối mic. Bạn có thể bấm nút "Phù! Thổi nến" thay thế nhé!');
      setIsMicListening(false);
    }
  };

  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const isBaLit = litCandleIds.includes('candle-ba');
  const isMeLit = litCandleIds.includes('candle-me');
  const isConLit = litCandleIds.includes('candle-con');

  // Build physical lighting layers based on which candles are burning
  // Ba position ~ 20%, Mẹ position ~ 50%, Con position ~ 80%
  const getLightingGradients = () => {
    const layers: string[] = [];

    if (isAllLit) {
      // 3 candles lit: Light blossoms to fill entire room warmly + vignette
      layers.push(
        'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(254, 243, 199, 0.45) 0%, rgba(253, 230, 138, 0.3) 35%, rgba(244, 114, 182, 0.2) 65%, rgba(96, 165, 250, 0.15) 85%, transparent 100%)'
      );
      layers.push(
        'radial-gradient(circle 420px at 20% 50%, rgba(251, 191, 36, 0.5) 0%, transparent 80%)'
      );
      layers.push(
        'radial-gradient(circle 420px at 50% 48%, rgba(96, 165, 250, 0.5) 0%, transparent 80%)'
      );
      layers.push(
        'radial-gradient(circle 420px at 80% 52%, rgba(244, 114, 182, 0.5) 0%, transparent 80%)'
      );
    } else {
      // 1 or 2 candles lit: localized soft pools of light with additive blending
      if (isBaLit) {
        layers.push(
          'radial-gradient(circle 320px at 20% 50%, rgba(251, 191, 36, 0.6) 0%, rgba(251, 191, 36, 0.3) 40%, rgba(251, 191, 36, 0.08) 70%, transparent 95%)'
        );
      }
      if (isMeLit) {
        layers.push(
          'radial-gradient(circle 320px at 50% 48%, rgba(96, 165, 250, 0.6) 0%, rgba(96, 165, 250, 0.3) 40%, rgba(96, 165, 250, 0.08) 70%, transparent 95%)'
        );
      }
      if (isConLit) {
        layers.push(
          'radial-gradient(circle 300px at 80% 52%, rgba(244, 114, 182, 0.6) 0%, rgba(244, 114, 182, 0.3) 40%, rgba(244, 114, 182, 0.08) 70%, transparent 95%)'
        );
      }
    }

    if (layers.length === 0) {
      return 'none';
    }
    return layers.join(', ');
  };

  return (
    <section className="relative w-full max-w-3xl mx-auto px-3 sm:px-4 py-8 flex flex-col items-center select-none">
      {/* Dynamic Lighting Overlay Layer */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-1000 ease-out -z-10"
        style={{
          background: getLightingGradients(),
          opacity: litCount > 0 ? 1 : 0,
        }}
      />

      {/* Floating Fireflies / Sparks when all 3 lit */}
      {isAllLit && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-200 animate-firefly shadow-lg"
              style={{
                left: `${8 + (i * 13) % 84}%`,
                top: `${15 + (i * 17) % 70}%`,
                animationDelay: `${(i * 0.4) % 3}s`,
                animationDuration: `${3 + (i % 3)}s`,
                boxShadow: '0 0 10px 3px rgba(253, 224, 71, 0.9)',
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-800/80 text-amber-300 text-xs sm:text-sm font-bold mb-2 border border-amber-400/30 shadow-md">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Gia Đình 3 Người Trong Bóng Tối</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-md">
          Ba Cây Nến Lung Linh 💛💙💗
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
          {isAllLit
            ? 'Cả căn phòng đã bừng sáng ấm áp!'
            : 'Chạm vào từng cây nến để thắp sáng quầng lửa quanh mỗi người!'}
        </p>
      </div>

      {/* Lighting Status Indicator */}
      <div className="mb-4 px-4 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 text-xs font-semibold text-slate-300 shadow-md flex items-center gap-2">
        <span>Đã thắp:</span>
        <span className="font-bold text-amber-400">
          {litCount}/{total} ngọn nến
        </span>
        {isAllLit && <span className="text-emerald-400 font-bold">✓ Cả nhà bừng sáng!</span>}
      </div>

      {/* Speech dialogue bubble when a candle is clicked (Strictly short < 8 words) */}
      {activeDialogue && (
        <div
          className="relative mb-6 px-4 py-2 rounded-2xl bg-slate-900/90 border-2 shadow-2xl max-w-sm text-center animate-scale-up"
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

      {/* The Three Candles & Character Stickers Stage */}
      <div className="w-full flex items-end justify-around sm:justify-center sm:gap-14 py-6 px-2 min-h-[300px]">
        {candles.map((candle) => {
          const isLit = litCandleIds.includes(candle.id);
          const ambient = calculateCandleIllumination(litCandleIds, candle.id);

          // Config per role
          const candleStyles = {
            ba: {
              height: 'h-44 sm:h-52',
              width: 'w-18 sm:w-22',
              bodyGradient: 'from-amber-300 via-amber-400 to-amber-600',
              glowColor: 'rgba(251, 191, 36, 0.75)',
              character: 'ba' as const,
              characterLabel: 'Ba (A mỏ)',
            },
            me: {
              height: 'h-38 sm:h-46',
              width: 'w-18 sm:w-22',
              bodyGradient: 'from-sky-300 via-blue-400 to-blue-600',
              glowColor: 'rgba(96, 165, 250, 0.75)',
              character: 'me' as const,
              characterLabel: 'Mẹ (Em tròn)',
            },
            con: {
              height: 'h-32 sm:h-38',
              width: 'w-16 sm:w-20',
              bodyGradient: 'from-pink-300 via-pink-400 to-rose-500',
              glowColor: 'rgba(244, 114, 182, 0.75)',
              character: 'con' as const,
              characterLabel: 'Hoành con',
            },
          }[candle.role];

          return (
            <div
              key={candle.id}
              data-testid={candle.id}
              onClick={() => handleLightCandle(candle)}
              className="flex flex-col items-center cursor-pointer group select-none transition-transform duration-300 hover:scale-105"
            >
              {/* Character Sticker above or beside candle - illuminates as light touches it! */}
              <div className="mb-2">
                <InteractiveSticker
                  character={candleStyles.character}
                  expression={isLit ? 'cuoi' : 'ngaongoc'}
                  ambientLight={ambient}
                  size="sm"
                  floatAnimation={isLit}
                />
              </div>

              {/* Flame area with realistic flicker */}
              <div className="h-12 flex items-end justify-center mb-1 relative">
                {isLit ? (
                  <div className="relative flex flex-col items-center animate-flame-flicker">
                    {/* Flame core */}
                    <div
                      className="w-4 sm:w-5 h-8 sm:h-9 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-white shadow-xl animate-pulse"
                      style={{
                        boxShadow: `0 0 28px 10px ${candleStyles.glowColor}`,
                      }}
                    />
                    {/* Micro spark */}
                    <span className="absolute -top-3 text-[10px] animate-ping">✨</span>
                  </div>
                ) : (
                  /* Unlit wick standing in darkness */
                  <div className="w-1 h-3.5 bg-gray-500 rounded-t-sm" />
                )}
              </div>

              {/* Candle Body */}
              <div
                className={`${candleStyles.width} ${candleStyles.height} rounded-t-2xl rounded-b-lg bg-gradient-to-b ${candleStyles.bodyGradient} shadow-2xl border-t border-white/60 relative flex flex-col items-center justify-between p-2 transition-all duration-300`}
                style={{
                  filter: isLit ? 'brightness(1.1)' : `brightness(${0.4 + ambient * 0.4})`,
                }}
              >
                {/* Wax drippings */}
                <div className="w-full flex justify-around">
                  <div className="w-2.5 h-4 bg-white/40 rounded-b-full" />
                  <div className="w-3.5 h-6 bg-white/50 rounded-b-full" />
                  <div className="w-2 h-3.5 bg-white/40 rounded-b-full" />
                </div>

                {/* Candle Name and Role */}
                <div className="text-center px-1">
                  <span className="text-base sm:text-lg block drop-shadow-md">
                    {candle.role === 'ba' ? '👨' : candle.role === 'me' ? '👩' : '👶'}
                  </span>
                  <p className="text-[11px] sm:text-xs font-bold text-white tracking-wide drop-shadow-md">
                    {candle.name}
                  </p>
                </div>

                {/* Bottom status hint */}
                <div className="w-full text-center pb-1">
                  <span className="text-[10px] text-white/90 font-medium">
                    {isLit ? '🔥 Đã sáng' : 'Chạm để thắp'}
                  </span>
                </div>
              </div>

              {/* Bottom Role Label Tag */}
              <div
                className="mt-3 px-3 py-1 rounded-xl text-xs font-bold border transition-all duration-500 shadow-sm"
                style={{
                  backgroundColor: isLit ? candle.hexColor : 'rgba(30, 41, 59, 0.8)',
                  color: isLit ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                  borderColor: isLit ? candle.hexColor : '#475569',
                  opacity: Math.max(0.3, ambient),
                }}
              >
                {candleStyles.characterLabel}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Final Word when all 3 lit: Exactly "Gia đình bé nhỏ của tụi mình 💛💙💗" */}
      {isAllLit && (
        <div className="mt-8 text-center animate-fade-in w-full max-w-md bg-slate-900/80 backdrop-blur-md rounded-3xl p-5 border border-pink-400/50 shadow-2xl">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold shadow-xs mb-3 border border-rose-500/40">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-400 animate-pulse" />
            <span>Gia đình bé nhỏ của tụi mình 💛💙💗</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
            Cảm ơn {recipientName} và {thirdPersonName} đã luôn là những mảnh ghép tuyệt vời nhất!
          </p>

          {/* Celebratory Duo on Page 2: Tròn (Hình 2) + Hoành con (Hình 1) */}
          <div className="flex items-center justify-center gap-6 my-3 py-1">
            <InteractiveSticker
              character="me"
              expression="tha-tim"
              size="sm"
              tilt={-6}
              speechBubble="Tròn yêu cả nhà! 💖"
              floatAnimation
            />
            <InteractiveSticker
              character="con"
              expression="yeahhh"
              size="sm"
              tilt={6}
              speechBubble="Yeahhh gia đình số 1! 🎉"
              floatAnimation
            />
          </div>

          {/* Blow out candle actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleBlowCandles}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Wind className="w-4 h-4" />
              <span>Phù! Thổi nến ước nguyện 💨</span>
            </button>

            <button
              type="button"
              onClick={toggleMicrophoneBlow}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
                isMicListening
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-rose-500/50'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isMicListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              <span>{isMicListening ? `Đang nghe thổi (${Math.round(micVolume)})` : 'Thổi bằng Mic 🎙️'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Embedded Family Voice Note Player in the warm candlelight */}
      <div className="w-full mt-10">
        <VoiceNotePlayer
          title="Thông Điệp Tri Ân Gia Đình 3 Người 💛💙💗"
          senderLabel="🎧 Loa phát thanh gia đình nhỏ"
          audioUrl={DEFAULT_CONFIG.voiceNoteFamily.audioUrl}
          durationEstimate={DEFAULT_CONFIG.voiceNoteFamily.durationEstimate}
          transcript={DEFAULT_CONFIG.voiceNoteFamily.transcript}
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
