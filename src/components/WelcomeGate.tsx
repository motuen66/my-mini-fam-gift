import React from 'react';
import { Sparkles, Heart, Gift, ChevronRight } from 'lucide-react';

export type Viewer = 'tron' | 'hoanh';

interface WelcomeGateProps {
  gifter: string;
  recipient: string;
  thirdPerson: string;
  onSelect: (viewer: Viewer) => void;
}

/**
 * Bước rẽ nhánh đầu tiên: hỏi ai đang mở web.
 * - em Tròn: xem cả 2 tab.
 * - Hoành con: chỉ xem tab Gia đình nhỏ.
 */
export const WelcomeGate: React.FC<WelcomeGateProps> = ({
  gifter,
  recipient,
  thirdPerson,
  onSelect,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center bg-gradient-to-br from-pink-100 via-rose-50 to-amber-100 px-4 text-center overflow-y-auto"
      style={{
        paddingTop: 'max(2rem, env(safe-area-inset-top))',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-48 h-48 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-md w-full bg-white/85 backdrop-blur-md rounded-3xl p-7 sm:p-9 shadow-2xl border border-pink-200/60 flex flex-col items-center animate-fade-in my-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300/80 text-pink-700 font-semibold text-xs sm:text-sm tracking-wide mb-5 shadow-sm">
          <Sparkles className="w-4 h-4 text-pink-500 animate-spin-slow" />
          <span>20/10 • Ngày Phụ Nữ Việt Nam</span>
        </div>

        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 animate-bounce">
            <Gift className="w-10 h-10" />
          </div>
          <span className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</span>
          <span className="absolute -bottom-1 -left-2 text-2xl animate-pulse">💖</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug mb-2 text-balance">
          Ai đang mở quà đây?
        </h1>
        <p className="text-sm text-gray-500 mb-7 max-w-xs leading-relaxed">
          Chọn đúng người để mở đúng phần quà nha. Món quà nhỏ từ {gifter} gửi cả nhà!
        </p>

        <div className="w-full space-y-3">
          <button
            type="button"
            onClick={() => onSelect('tron')}
            className="group w-full min-h-[64px] px-4 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold text-left shadow-lg shadow-pink-500/25 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-3"
          >
            <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
              💖
            </span>
            <span className="flex-1">
              <span className="block text-base">{recipient}</span>
              <span className="block text-[11px] font-medium text-white/80">
                Mẹ vào xem cả hai tab
              </span>
            </span>
            <ChevronRight className="w-5 h-5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => onSelect('hoanh')}
            className="group w-full min-h-[64px] px-4 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 text-white font-bold text-left shadow-lg shadow-blue-400/25 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-3"
          >
            <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
              🧋
            </span>
            <span className="flex-1">
              <span className="block text-base">{thirdPerson}</span>
              <span className="block text-[11px] font-medium text-white/80">
                Con vào xem quà gia đình
              </span>
            </span>
            <ChevronRight className="w-5 h-5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <p className="mt-6 text-[11px] text-gray-500 leading-relaxed flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400 shrink-0" />
          <span>🔊 Bật âm lượng và tắt công tắc im lặng trên iPhone để nghe nhạc nha.</span>
        </p>
      </div>
    </div>
  );
};
