import React from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio.ts';
import { Sparkles, Heart, Gift } from 'lucide-react';

interface OpeningScreenProps {
  gifter: string;
  recipient: string;
  thirdPerson: string;
  onStart: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({
  gifter,
  recipient,
  thirdPerson,
  onStart,
}) => {
  const handleStart = () => {
    sound.playPop();
    sound.playFanfare();
    sound.startBGM();

    // Trigger opening celebratory confetti
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ff85a2', '#fde047', '#93c5fd', '#f472b6'],
    });

    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-amber-100 px-4 text-center select-none overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-48 h-48 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />

      {/* Main card */}
      <div className="relative max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl border border-pink-200/60 flex flex-col items-center animate-fade-in">
        {/* Festive badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300/80 text-pink-700 font-semibold text-xs sm:text-sm tracking-wide mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-pink-500 animate-spin-slow" />
          <span>20/10 • Ngày Phụ Nữ Việt Nam</span>
        </div>

        {/* Animated gift box icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 animate-bounce">
            <Gift className="w-12 h-12" />
          </div>
          <span className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</span>
          <span className="absolute -bottom-1 -left-2 text-2xl animate-pulse">💖</span>
        </div>

        {/* Title & subtitle */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug mb-3">
          Món Quà Bất Ngờ Từ{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">
            {gifter}
          </span>
        </h1>

        <p className="text-base sm:text-lg font-medium text-pink-700 mb-2 flex items-center justify-center gap-1.5">
          <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
          Dành riêng cho <strong className="font-bold underline decoration-pink-300 underline-offset-4">{recipient}</strong>
          <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
        </p>

        <p className="text-xs sm:text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
          Cùng sự góp mặt đặc biệt của &quot;con gái nuôi&quot;{' '}
          <span className="font-semibold text-blue-600">{thirdPerson}</span> trong gia đình nhỏ 3 người!
        </p>

        {/* Start button */}
        <button
          onClick={handleStart}
          type="button"
          className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 w-full sm:w-auto rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold text-lg shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span>Chạm để bắt đầu</span>
          <span className="text-2xl group-hover:scale-125 transition-transform">🎁</span>
        </button>

        <p className="mt-4 text-xs text-gray-400 italic">
          Bật loa điện thoại để nghe nhạc và âm thanh vui nhộn nha!
        </p>
      </div>
    </div>
  );
};
