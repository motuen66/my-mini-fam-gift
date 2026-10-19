import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio.ts';
import { getNextEscapePosition, MAX_ESCAPE_ATTEMPTS } from '../utils/logic.ts';
import { InteractiveSticker } from './InteractiveSticker.tsx';
import { Gift, ChevronDown, Sparkles } from 'lucide-react';


interface RunawayGiftBoxProps {
  recipientName: string;
  gifterName: string;
  onBoxOpened?: () => void;
}

export const RunawayGiftBox: React.FC<RunawayGiftBoxProps> = ({
  recipientName,
  gifterName,
  onBoxOpened,
}) => {
  const [attempts, setAttempts] = useState(0);
  const [btnOffset, setBtnOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dialogue, setDialogue] = useState<string>('Bấm nút bên dưới để mở quà 20/10 nha!');
  const [isOpened, setIsOpened] = useState(false);
  const [isLidFlying, setIsLidFlying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEvade = (e: React.MouseEvent | React.TouchEvent) => {
    if (isOpened) return;
    if (attempts >= MAX_ESCAPE_ATTEMPTS - 1) {
      // Don't evade on the final attempt
      return;
    }

    e.preventDefault();
    sound.playEvade();

    const rect = containerRef.current?.getBoundingClientRect();
    const width = rect?.width || 340;
    const height = 180;

    const nextPos = getNextEscapePosition(attempts, width, height, 130, 48);
    setAttempts((prev) => prev + 1);
    setBtnOffset({ x: nextPos.x, y: nextPos.y });
    setDialogue(nextPos.dialogue);
  };

  const handleOpenGift = () => {
    if (isOpened) return;

    sound.playPop();
    sound.playFanfare();
    setIsLidFlying(true);

    // Blast celebratory confetti
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ff85a2', '#f43f5e', '#fde047', '#a855f7'],
    });

    setTimeout(() => {
      setIsOpened(true);
      if (onBoxOpened) onBoxOpened();
    }, 600);
  };

  const scrollToNext = () => {
    const nextElem = document.getElementById('story-journey-section');
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full max-w-xl mx-auto px-4 py-8 text-center flex flex-col items-center">
      {/* Decorative header message */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 text-rose-700 text-xs sm:text-sm font-bold mb-4 shadow-xs">
        <Sparkles className="w-4 h-4 text-rose-500" />
        <span>Hộp Quà Thách Thức Sự Kiên Nhẫn</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
        Món Quà Bí Mật Dành Cho <span className="text-rose-500">{recipientName}</span>
      </h2>

      {/* Comic dialogue bubble */}
      <div className="relative mb-6 px-4 py-2.5 bg-amber-100 border border-amber-300 rounded-2xl text-amber-900 font-medium text-sm sm:text-base max-w-xs sm:max-w-sm shadow-sm transition-all duration-300 animate-bounce">
        <span>{dialogue}</span>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-100 border-r border-b border-amber-300 rotate-45" />
      </div>

      {/* Interactive Gift Container */}
      <div
        ref={containerRef}
        className="relative w-72 sm:w-80 h-72 bg-gradient-to-b from-rose-50 to-pink-100/80 rounded-3xl border-2 border-dashed border-rose-200 p-6 flex flex-col items-center justify-center shadow-inner overflow-hidden select-none"
      >
        {!isOpened ? (
          <div className="flex flex-col items-center">
            {/* Gift Box Graphic */}
            <div className="relative mb-6">
              {/* Lid */}
              <div
                className={`w-36 h-10 bg-rose-500 rounded-t-xl border-b-4 border-rose-600 shadow-md flex items-center justify-center transition-all duration-700 ${
                  isLidFlying ? '-translate-y-24 rotate-12 opacity-0' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-300 border-2 border-white shadow-xs -mt-6 flex items-center justify-center text-xs font-bold text-amber-900">
                  🎀
                </div>
              </div>
              {/* Box Base */}
              <div className="w-32 h-24 bg-gradient-to-b from-rose-400 to-rose-500 rounded-b-xl shadow-lg relative flex items-center justify-center">
                <div className="w-6 h-full bg-amber-300/80 absolute" />
                <div className="w-full h-6 bg-amber-300/80 absolute" />
                <Gift className="w-10 h-10 text-white/90 z-10" />
              </div>
            </div>

            {/* Runaway Button Container */}
            <div className="relative w-full h-16 flex items-center justify-center">
              <button
                type="button"
                onMouseEnter={handleEvade}
                onTouchStart={handleEvade}
                onClick={handleOpenGift}
                style={{
                  transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
                  transition: attempts < MAX_ESCAPE_ATTEMPTS - 1 ? 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.3s ease',
                }}
                className={`px-6 py-2.5 rounded-2xl font-bold text-white shadow-lg cursor-pointer text-sm sm:text-base flex items-center gap-2 ${
                  attempts >= MAX_ESCAPE_ATTEMPTS - 1
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-105 animate-pulse shadow-emerald-400/40'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-pink-500/50'
                }`}
              >
                <span>{attempts >= MAX_ESCAPE_ATTEMPTS - 1 ? 'Mở Thật Nè! 🎁' : 'Mở quà ngay 🎁'}</span>
              </button>
            </div>
            {attempts > 0 && attempts < MAX_ESCAPE_ATTEMPTS - 1 && (
              <span className="text-xs text-rose-400 mt-2">
                Hộp quà đã né: {attempts}/{MAX_ESCAPE_ATTEMPTS - 1} lần 😂
              </span>
            )}
          </div>
        ) : (
          /* Opened Gift State */
          <div className="flex flex-col items-center justify-center animate-scale-up text-center p-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <InteractiveSticker
                character="me"
                expression="ok-luon"
                size="sm"
                tilt={-8}
                speechBubble="OK luôn! ⭐"
              />
              <InteractiveSticker
                character="me"
                expression="hi-hi-hi"
                size="sm"
                tilt={8}
                speechBubble="Hí hí hí! 💖"
              />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-rose-600 mb-1">
              Ú òa! Mở quà thành công!
            </h3>
            <p className="text-xs text-gray-600 mb-3 max-w-[220px]">
              Gửi ngàn lời yêu thương từ {gifterName} đến {recipientName}!
            </p>
            <button
              type="button"
              onClick={scrollToNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 text-white font-semibold text-xs shadow-md hover:bg-rose-600 transition-all cursor-pointer animate-pulse"
            >
              <span>Xem Photo Story</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Playful side sticker decoration - TRÒN ONLY on Page 1 */}
      <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2">
        <InteractiveSticker
          character="me"
          expression="dinh-luon"
          size="sm"
          tilt={10}
          speechBubble="Đỉnh luôn! ✨"
          floatAnimation
        />
      </div>
    </section>
  );
};


