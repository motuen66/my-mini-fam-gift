import React, { useState } from 'react';
import { sound } from '../utils/audio.ts';

export type CharacterType = 'ba' | 'me' | 'con';
export type ExpressionType =
  | 'ok-luon'
  | 'hi-hi-hi'
  | 'dinh-luon'
  | 'kho-chiu'
  | 'oi-troi-oi'
  | 'hehe'
  | 'vo-duyen'
  | 'muon-chat'
  | 'um'
  | 'buon-ngu'
  | 'di-thoi'
  | 'tra-sua'
  | 'yeahhh'
  | 'binh-thuong'
  | 'kinh-ram'
  | 'om-tho'
  | 'cuoi'
  | 'quau'
  | 'doian'
  | 'chumom'
  | 'hahe'
  | 'tha-tim'
  | 'ngaongoc';

interface InteractiveStickerProps {
  character: CharacterType;
  expression?: ExpressionType;
  customImageSrc?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  tilt?: number;
  floatAnimation?: boolean;
  ambientLight?: number; // 0 (dark) to 1 (full brightness) for family tab
  className?: string;
  label?: string;
  onClick?: () => void;
}

export const InteractiveSticker: React.FC<InteractiveStickerProps> = ({
  character,
  expression = 'cuoi',
  customImageSrc,
  size = 'md',
  speechBubble,
  tilt = 0,
  floatAnimation = false,
  ambientLight = 1,
  className = '',
  label,
  onClick,
}) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showQuickReaction, setShowQuickReaction] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-32 sm:h-32',
    xl: 'w-36 h-36 sm:w-44 sm:h-44',
  }[size];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playBoing();
    setIsBouncing(true);
    setShowQuickReaction(true);

    if (onClick) onClick();

    setTimeout(() => setIsBouncing(false), 500);
    setTimeout(() => setShowQuickReaction(false), 1500);
  };

  // Multiple filename candidates: tron_*.png / hinh2.png for Tròn (Hình 2), hoanh_*.png / hinh1.png for Hoành con (Hình 1)
  const candidateFileNames = customImageSrc
    ? [customImageSrc]
    : character === 'me'
    ? [
        `/assets/stickers/tron_${expression}.png`,
        `/assets/stickers/hinh2.png`,
        `/assets/stickers/hinh_2.png`,
        `/assets/stickers/tron.png`,
        `/assets/stickers/me_${expression}.png`,
        `/assets/stickers/me.png`,
      ]
    : character === 'con'
    ? [
        `/assets/stickers/hoanh_${expression}.png`,
        `/assets/stickers/hinh1.png`,
        `/assets/stickers/hinh_1.png`,
        `/assets/stickers/hoanh.png`,
        `/assets/stickers/con_${expression}.png`,
        `/assets/stickers/con.png`,
      ]
    : [
        `/assets/stickers/ba_${expression}.png`,
        `/assets/stickers/ba.png`,
      ];

  const [candidateIdx, setCandidateIdx] = useState(0);
  const resolvedFileName = candidateFileNames[candidateIdx] || '';

  // Character quotes based directly on the user's uploaded stickers
  const tronQuotes: Record<string, string> = {
    'ok-luon': 'OK luôn! ⭐',
    'hi-hi-hi': 'Hí hí hí! 💖',
    'dinh-luon': 'Đỉnh luôn! ✨',
    'kho-chiu': 'Khó chịu quá đi! 💢',
    'oi-troi-oi': 'Ôi trời ơi! 😲',
    'hehe': 'Hehe... 💕',
    'vo-duyen': 'Vô duyên cò lẹ! 💨',
    'muon-chat': 'Muốn chat với ai đó 📱',
    'um': 'Ủm... 🤔',
    'buon-ngu': 'Buồn ngủ... zzz 💤',
    'di-thoi': 'Đi thôi 🌸',
    'doian': 'Trà sữa trân châu nha! 🧋',
    'tha-tim': 'Yêu A mỏ nhất! ❤️',
    'cuoi': 'Em tròn đáng yêu số 1! 🥰',
  };

  const hoanhQuotes: Record<string, string> = {
    'tra-sua': 'Trà sữa là chân ái! 🧋',
    'yeahhh': 'Yeahhh! 🎉',
    'binh-thuong': 'Bình thường! 😒',
    'kinh-ram': 'Ngầu lòi chưa! 😎',
    'om-tho': 'Thỏ bông cưng xỉu! 🐰',
    'vo-duyen': 'Vô duyên cò lẹ! 😜',
    'hahe': 'Cười xỉu với ba mẹ! 👶',
    'cuoi': 'Hoành con vô tội nha! ✨',
  };

  const baQuotes: Record<string, string> = {
    'cuoi': 'A mỏ nè! 😎',
    'quau': 'Ai dám chọc em tròn?! 😤',
    'chumom': 'Ngoan ba chở đi ăn! 🍕',
  };

  const getReactionText = (): string => {
    if (character === 'me') {
      return tronQuotes[expression] || tronQuotes['cuoi'];
    }
    if (character === 'con') {
      return hoanhQuotes[expression] || hoanhQuotes['cuoi'];
    }
    return baQuotes[expression] || baQuotes['cuoi'];
  };

  // Colors & Themes
  const theme = {
    ba: {
      bg: 'bg-amber-100',
      border: 'border-amber-300',
      badge: 'bg-amber-500 text-white',
      name: 'A mỏ (Ba)',
      shadow: 'rgba(245, 158, 11, 0.4)',
    },
    me: {
      bg: 'bg-rose-100',
      border: 'border-rose-300',
      badge: 'bg-rose-500 text-white',
      name: 'Em tròn',
      shadow: 'rgba(244, 63, 94, 0.4)',
    },
    con: {
      bg: 'bg-sky-100',
      border: 'border-sky-300',
      badge: 'bg-sky-500 text-white',
      name: 'Hoành con',
      shadow: 'rgba(56, 189, 248, 0.4)',
    },
  }[character];

  return (
    <div
      onClick={handleClick}
      style={{
        transform: `rotate(${tilt}deg) ${isBouncing ? 'scale(1.25) rotate(-6deg)' : 'scale(1)'}`,
        opacity: Math.max(0.12, ambientLight),
        filter:
          ambientLight < 0.8
            ? `brightness(${0.2 + ambientLight * 0.8}) contrast(${0.8 + ambientLight * 0.2})`
            : 'none',
        transition:
          'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease, filter 0.8s ease',
      }}
      className={`relative inline-flex flex-col items-center cursor-pointer select-none group touch-manipulation ${
        floatAnimation ? 'animate-gentle-float' : ''
      } ${className}`}
      title={`Chạm vào ${label || theme.name}!`}
    >
      {/* Speech bubble or tap reaction pop */}
      {(showQuickReaction || speechBubble) && (
        <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap px-3 py-1 bg-white text-gray-800 text-[11px] sm:text-xs font-bold rounded-xl shadow-xl border border-pink-200 animate-scale-up pointer-events-none">
          <span>{showQuickReaction ? getReactionText() : speechBubble}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-pink-200 rotate-45" />
        </div>
      )}

      {/* Main Sticker Surface */}
      <div
        className={`${sizeClasses} relative rounded-3xl p-1 flex items-center justify-center transition-all duration-300 group-hover:scale-110 drop-shadow-md`}
      >
        {!imgError ? (
          <img
            src={resolvedFileName}
            alt={label || theme.name}
            onError={() => {
              if (candidateIdx < candidateFileNames.length - 1) {
                setCandidateIdx((prev) => prev + 1);
              } else {
                setImgError(true);
              }
            }}
            className="w-full h-full object-contain filter drop-shadow-md pointer-events-none"
            loading="lazy"
          />
        ) : (
          /* High-Fidelity SVG Chibi matching user's uploaded sticker character sheets */
          <div className="w-full h-full relative flex items-center justify-center">
            {/* TRÒN (Hình 2): Long dark hair, EYEGLASSES, dark hoodie or white cami with pink necklace */}
            {character === 'me' && (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Background glow circle */}
                <circle cx="50" cy="50" r="46" fill="#fff5f5" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
                
                {/* Back hair */}
                <path d="M 22 45 C 16 70, 18 90, 26 95 C 32 95, 34 82, 34 75 Z" fill="#1e1b18" />
                <path d="M 78 45 C 84 70, 82 90, 74 95 C 68 95, 66 82, 66 75 Z" fill="#1e1b18" />
                
                {/* Outfit: Navy blue jacket with white inner */}
                <path d="M 28 85 Q 50 78 72 85 L 75 100 L 25 100 Z" fill="#1e293b" />
                <path d="M 40 82 Q 50 88 60 82 L 60 100 L 40 100 Z" fill="#f8fafc" />
                
                {/* Pink crystal necklace */}
                <path d="M 43 82 Q 50 88 57 82" stroke="#cbd5e1" strokeWidth="1" fill="none" />
                <circle cx="50" cy="86" r="2.5" fill="#f43f5e" />

                {/* Head / Skin */}
                <circle cx="50" cy="50" r="34" fill="#fff1f2" />

                {/* Front Hair with bangs and side strands */}
                <path d="M 18 46 C 18 16, 82 16, 82 46 C 72 26, 60 22, 50 25 C 40 22, 28 26, 18 46 Z" fill="#2d2424" />
                <path d="M 18 42 C 16 60, 24 72, 26 75 C 27 68, 22 55, 23 44 Z" fill="#2d2424" />
                <path d="M 82 42 C 84 60, 76 72, 74 75 C 73 68, 78 55, 77 44 Z" fill="#2d2424" />

                {/* Blushing cheeks */}
                <ellipse cx="32" cy="60" rx="6" ry="4" fill="#fb7185" opacity="0.65" />
                <ellipse cx="68" cy="60" rx="6" ry="4" fill="#fb7185" opacity="0.65" />

                {/* Eyes - Sparkly Anime Eyes */}
                {expression === 'kho-chiu' || expression === 'vo-duyen' ? (
                  <>
                    {/* Grumpy / Angry pouty eyes */}
                    <path d="M 32 48 L 42 52" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 68 48 L 58 52" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="38" cy="54" r="3.5" fill="#1e293b" />
                    <circle cx="62" cy="54" r="3.5" fill="#1e293b" />
                  </>
                ) : expression === 'hi-hi-hi' || expression === 'hehe' ? (
                  <>
                    {/* Smiling crescent eyes */}
                    <path d="M 32 54 Q 38 46 44 54" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M 56 54 Q 62 46 68 54" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    {/* Big bright sparkly eyes */}
                    <ellipse cx="38" cy="52" rx="4" ry="5.5" fill="#1e293b" />
                    <circle cx="36.5" cy="50" r="1.8" fill="#ffffff" />
                    <ellipse cx="62" cy="52" rx="4" ry="5.5" fill="#1e293b" />
                    <circle cx="60.5" cy="50" r="1.8" fill="#ffffff" />
                  </>
                )}

                {/* ICONIC TRÒN GLASSES (Thin stylish metal wire frames) */}
                <rect x="28" y="44" width="18" height="15" rx="5" fill="none" stroke="#d97706" strokeWidth="2.2" />
                <rect x="54" y="44" width="18" height="15" rx="5" fill="none" stroke="#d97706" strokeWidth="2.2" />
                <line x1="46" y1="50" x2="54" y2="50" stroke="#d97706" strokeWidth="2.2" />
                {/* Glass shine reflections */}
                <line x1="32" y1="47" x2="36" y2="47" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                <line x1="58" y1="47" x2="62" y2="47" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

                {/* Mouth expressions */}
                {expression === 'kho-chiu' || expression === 'vo-duyen' ? (
                  <path d="M 46 65 Q 50 60 54 65" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                ) : expression === 'oi-troi-oi' ? (
                  <ellipse cx="50" cy="65" rx="3.5" ry="5" fill="#be123c" />
                ) : expression === 'ok-luon' || expression === 'dinh-luon' ? (
                  <path d="M 44 63 Q 50 71 56 63" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" fill="#fda4af" />
                ) : (
                  <path d="M 45 63 Q 50 70 55 63" stroke="#e11d48" strokeWidth="2.2" strokeLinecap="round" fill="#fecdd3" />
                )}

                {/* Little cute accessory badge for Tròn */}
                <text x="80" y="24" fontSize="11" textAnchor="middle">✨</text>
              </svg>
            )}

            {/* HOÀNH CON (Hình 1): Long silky black hair, NO glasses, floral outfit, boba / bunny / peace */}
            {character === 'con' && (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Background glow circle */}
                <circle cx="50" cy="50" r="46" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />

                {/* Back Hair */}
                <path d="M 20 46 C 14 72, 16 92, 24 96 C 30 96, 32 84, 32 76 Z" fill="#18181b" />
                <path d="M 80 46 C 86 72, 84 92, 76 96 C 70 96, 68 84, 68 76 Z" fill="#18181b" />

                {/* Outfit: Purple floral sleepwear */}
                <path d="M 28 85 Q 50 80 72 85 L 75 100 L 25 100 Z" fill="#c084fc" />
                {/* Floral little print spots */}
                <circle cx="36" cy="90" r="1.5" fill="#fdf4ff" />
                <circle cx="64" cy="90" r="1.5" fill="#fdf4ff" />
                <circle cx="50" cy="94" r="1.5" fill="#fdf4ff" />

                {/* Head / Skin */}
                <circle cx="50" cy="50" r="34" fill="#faf5ff" />

                {/* Front Hair parted in middle */}
                <path d="M 18 45 C 18 16, 82 16, 82 45 C 72 26, 56 22, 50 28 C 44 22, 28 26, 18 45 Z" fill="#27272a" />
                <path d="M 18 42 C 16 62, 24 74, 25 76 C 26 70, 22 56, 23 44 Z" fill="#27272a" />
                <path d="M 82 42 C 84 62, 76 74, 75 76 C 74 70, 78 56, 77 44 Z" fill="#27272a" />

                {/* Rosy Cheeks */}
                <ellipse cx="32" cy="58" rx="6.5" ry="4.5" fill="#f472b6" opacity="0.7" />
                <ellipse cx="68" cy="58" rx="6.5" ry="4.5" fill="#f472b6" opacity="0.7" />

                {/* Eyes: No glasses! Big lively sparkle eyes or wink */}
                {expression === 'kinh-ram' ? (
                  /* Black Sunglasses */
                  <g>
                    <polygon points="26,46 46,44 44,58 28,58" fill="#09090b" rx="2" />
                    <polygon points="54,44 74,46 72,58 56,58" fill="#09090b" rx="2" />
                    <line x1="46" y1="48" x2="54" y2="48" stroke="#09090b" strokeWidth="2.5" />
                    <line x1="30" y1="48" x2="40" y2="52" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
                    <line x1="58" y1="48" x2="68" y2="52" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
                  </g>
                ) : expression === 'yeahhh' || expression === 'hahe' ? (
                  <>
                    {/* Happy laughing wink */}
                    <path d="M 30 52 Q 36 44 42 52" stroke="#18181b" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M 58 52 Q 64 44 70 52" stroke="#18181b" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    <ellipse cx="38" cy="50" rx="4.5" ry="6" fill="#18181b" />
                    <circle cx="36.5" cy="48" r="2" fill="#ffffff" />
                    <ellipse cx="62" cy="50" rx="4.5" ry="6" fill="#18181b" />
                    <circle cx="60.5" cy="48" r="2" fill="#ffffff" />
                  </>
                )}

                {/* Mouth: Big grin or boba cup */}
                {expression === 'tra-sua' ? (
                  <g>
                    {/* Boba milk tea cup held up */}
                    <rect x="42" y="62" width="16" height="20" rx="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />
                    <line x1="50" y1="56" x2="50" y2="76" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="46" cy="74" r="1.5" fill="#18181b" />
                    <circle cx="50" cy="76" r="1.5" fill="#18181b" />
                    <circle cx="54" cy="74" r="1.5" fill="#18181b" />
                    {/* Drinking mouth */}
                    <circle cx="50" cy="58" r="3" fill="#e11d48" />
                  </g>
                ) : expression === 'binh-thuong' ? (
                  <path d="M 44 64 L 56 64" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
                ) : (
                  <path d="M 42 60 Q 50 74 58 60 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
                )}

                <text x="78" y="22" fontSize="12" textAnchor="middle">🧋</text>
              </svg>
            )}

            {/* BA (A mỏ): Quirky guy with glasses and cute messy hair */}
            {character === 'ba' && (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <circle cx="50" cy="50" r="42" fill="#fed7aa" stroke="#f97316" strokeWidth="2.5" />
                <path d="M 20 42 C 20 18, 80 18, 80 42 C 72 26, 40 22, 20 42 Z" fill="#451a03" />
                <path d="M 45 22 Q 52 14 58 20" stroke="#451a03" strokeWidth="4" strokeLinecap="round" fill="none" />
                <rect x="26" y="40" width="20" height="15" rx="4" fill="none" stroke="#1f2937" strokeWidth="2.5" />
                <rect x="54" y="40" width="20" height="15" rx="4" fill="none" stroke="#1f2937" strokeWidth="2.5" />
                <line x1="46" y1="46" x2="54" y2="46" stroke="#1f2937" strokeWidth="2.5" />
                <circle cx="36" cy="47" r="2.5" fill="#111827" />
                <circle cx="64" cy="47" r="2.5" fill="#111827" />
                <circle cx="28" cy="58" r="5" fill="#fca5a5" opacity="0.6" />
                <circle cx="72" cy="58" r="5" fill="#fca5a5" opacity="0.6" />
                {expression === 'chumom' ? (
                  <ellipse cx="50" cy="62" rx="4" ry="5" fill="#ef4444" />
                ) : expression === 'quau' ? (
                  <path d="M 43 65 Q 50 58 57 65" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                ) : (
                  <path d="M 42 60 Q 50 72 58 60" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" fill="#fecaca" />
                )}
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Label under sticker if provided */}
      {label && (
        <span
          className={`mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs whitespace-nowrap ${theme.badge}`}
        >
          {label}
        </span>
      )}

      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) rotate(${tilt}deg); }
          50% { transform: translateY(-6px) rotate(${tilt + 2}deg); }
        }
        .animate-gentle-float {
          animation: gentleFloat 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
