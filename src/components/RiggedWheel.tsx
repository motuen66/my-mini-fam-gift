import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WheelPrize } from '../types/index.ts';
import { sound } from '../utils/audio.ts';
import { calculateRiggedWheelResult } from '../utils/logic.ts';
import { InteractiveSticker } from './InteractiveSticker.tsx';
import { Award, Sparkles, RotateCw, CheckCircle2, X } from 'lucide-react';


interface RiggedWheelProps {
  prizes: WheelPrize[];
  recipientName: string;
}

export const RiggedWheel: React.FC<RiggedWheelProps> = ({
  prizes,
  recipientName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [winningPrize, setWinningPrize] = useState<WheelPrize | null>(null);
  const [wonPrizes, setWonPrizes] = useState<WheelPrize[]>(() => {
    try {
      const saved = localStorage.getItem('won_prizes_2010');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [needleTick, setNeedleTick] = useState(false);

  // Draw the wheel onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 12;
    const total = prizes.length;
    const sliceAngle = (2 * Math.PI) / total;

    ctx.clearRect(0, 0, size, size);

    // Draw outer golden border
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = 'rgba(234, 179, 8, 0.4)';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();

    // Draw slices
    prizes.forEach((prize, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Text label & emoji
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = prize.textColor;
      ctx.font = 'bold 12px "Quicksand", sans-serif';

      // Draw emoji and text
      ctx.fillText(`${prize.icon} ${prize.label}`, radius - 20, 4);
      ctx.restore();
    });

    // Draw center peg
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f472b6';
    ctx.stroke();

    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💖', center, center);
  }, [prizes]);

  const handleSpin = () => {
    if (isSpinning) return;

    sound.playPop();
    setIsSpinning(true);
    setWinningPrize(null);

    const result = calculateRiggedWheelResult(prizes, spinCount, currentRotation);

    // Play periodic tick sounds during rotation
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      sound.playTick();
      setNeedleTick((prev) => !prev);
      tickCount++;
      if (tickCount > 25) {
        clearInterval(tickInterval);
      }
    }, 120);

    setCurrentRotation(result.targetRotationDegrees);

    // After animation ends (approx 3.5 seconds)
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setSpinCount((prev) => prev + 1);
      setWinningPrize(result.selectedPrize);

      if (!result.selectedPrize.isTroll) {
        sound.playFanfare();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff85a2', '#fde047', '#60a5fa', '#34d399'],
        });

        setWonPrizes((prev) => {
          const updated = [result.selectedPrize, ...prev];
          try {
            localStorage.setItem('won_prizes_2010', JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      } else {
        sound.playPop();
      }
    }, 3500);
  };

  return (
    <section className="relative w-full max-w-2xl mx-auto px-4 py-12 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-bold mb-2 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Vòng Quay May Mắn &quot;Ăn Gian&quot;</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Vòng Quay Yêu Thương Của <span className="text-rose-500">{recipientName}</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Cam kết 100% trúng quà xịn, quay là trúng, không có cửa xui đâu nhé! 😉
        </p>
      </div>

      {/* Wheel Container */}
      <div className="relative flex flex-col items-center justify-center p-4">
        {/* Needle pointer with tick bounce animation */}
        <div
          className={`absolute top-1 z-20 w-8 h-10 transition-transform duration-75 flex flex-col items-center pointer-events-none ${
            needleTick ? 'scale-110 -translate-y-0.5' : 'scale-100'
          }`}
        >
          <div className="w-5 h-7 bg-red-600 rounded-b-full shadow-lg border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
            ▼
          </div>
        </div>

        {/* Canvas Wheel */}
        <div className="relative rounded-full shadow-2xl p-2 bg-gradient-to-tr from-amber-200 via-pink-200 to-rose-200">
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            style={{
              transform: `rotate(${currentRotation}deg)`,
              transition: isSpinning
                ? 'transform 3.5s cubic-bezier(0.15, 0.95, 0.35, 1)'
                : 'none',
            }}
            className="rounded-full max-w-[290px] max-h-[290px] sm:max-w-[340px] sm:max-h-[340px]"
          />
        </div>

        {/* Spin Action Button */}
        <button
          type="button"
          disabled={isSpinning}
          onClick={handleSpin}
          className={`mt-6 px-8 py-3.5 rounded-2xl font-bold text-base sm:text-lg shadow-xl flex items-center gap-2 cursor-pointer transition-all duration-200 ${
            isSpinning
              ? 'bg-gray-400 text-white cursor-not-allowed opacity-80'
              : 'bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white hover:scale-105 active:scale-95 shadow-rose-400/40 animate-pulse'
          }`}
        >
          <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Đang quay tít thò lò...' : 'QUAY NGAY 🎯'}</span>
        </button>

        {/* Cheering Mascot Sticker */}
        <div className="hidden sm:block absolute -left-8 bottom-6">
          <InteractiveSticker
            character="me"
            expression="doian"
            size="sm"
            tilt={-10}
            speechBubble="Cầu trúng đồ ăn! 🍕"
            floatAnimation
          />
        </div>
      </div>


      {/* Prize Dialog / Modal */}
      {winningPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-sm w-full bg-white rounded-3xl p-6 text-center shadow-2xl border-2 border-pink-300 animate-scale-up">
            <button
              type="button"
              onClick={() => setWinningPrize(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center mb-3">
              <InteractiveSticker
                character="me"
                expression={winningPrize.isTroll ? 'kho-chiu' : 'tha-tim'}
                size="md"
                speechBubble={winningPrize.isTroll ? 'Khó chịu quá đi! Trượt rồi 💢' : 'Trúng quà xịn rồi! 🎉'}
              />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
              {winningPrize.isTroll ? 'Troll Một Chút Thôi 😜' : 'Chúc Mừng Em Tròn! 🎉'}
            </span>


            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mt-3 mb-2 leading-snug">
              {winningPrize.fullTitle}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 mb-6 bg-pink-50/60 p-3 rounded-2xl border border-pink-100">
              {winningPrize.description}
            </p>

            <button
              type="button"
              onClick={() => {
                setWinningPrize(null);
                if (winningPrize.isTroll) {
                  setTimeout(() => handleSpin(), 200);
                }
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {winningPrize.isTroll ? 'Quay lại lần nữa nha! 🔄' : 'Nhận giải & Chụp màn hình 📸'}
            </button>
          </div>
        </div>
      )}

      {/* Won Prizes Voucher Shelf */}
      {wonPrizes.length > 0 && (
        <div className="w-full mt-8 bg-white/80 backdrop-blur-xs rounded-3xl p-5 border border-pink-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm font-bold text-gray-800">
                Kho Voucher Em Đã Trúng ({wonPrizes.length})
              </h4>
            </div>
            <span className="text-[11px] text-gray-400 italic">
              Chụp màn hình đòi A mỏ nhé!
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {wonPrizes.map((p, idx) => (
              <div
                key={`${p.id}-${idx}`}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-pink-50/70 border border-pink-100 text-left"
              >
                <span className="text-xl shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">
                    {p.fullTitle}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {p.description}
                  </p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
