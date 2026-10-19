import React from 'react';
import { Volume2, VolumeX, Sliders } from 'lucide-react';

interface HeaderNavProps {
  activeTab: 'boyfriend' | 'family';
  onTabChange: (tab: 'boyfriend' | 'family') => void;
  recipientName: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenGuide: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
  recipientName,
  isMuted,
  onToggleMute,
  onOpenGuide,
}) => {
  const isDark = activeTab === 'family';

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-1000 shadow-xs ${
        isDark
          ? 'bg-slate-950/75 border-b border-slate-800/80 text-white'
          : 'bg-white/80 border-b border-pink-100/80 text-gray-800'
      }`}
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Two main tabs */}
        <div
          className={`flex items-center gap-1.5 sm:gap-2 p-1 rounded-2xl border transition-colors duration-700 overflow-hidden ${
            isDark
              ? 'bg-slate-900/90 border-slate-800'
              : 'bg-pink-100/70 border-pink-200/60'
          }`}
        >
          <button
            type="button"
            onClick={() => onTabChange('boyfriend')}
            className={`px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'boyfriend'
                ? 'bg-white text-pink-600 shadow-sm shadow-pink-200/50 scale-[1.02]'
                : isDark
                ? 'text-slate-400 hover:text-pink-300 hover:bg-slate-800/60'
                : 'text-gray-600 hover:text-pink-500 hover:bg-white/40'
            }`}
          >
            <span>💖</span>
            <span className="truncate max-w-[110px] sm:max-w-none">
              Dành cho {recipientName}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('family')}
            className={`px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'family'
                ? 'bg-slate-800 text-amber-300 shadow-md shadow-amber-500/20 scale-[1.02] border border-amber-400/30'
                : 'text-gray-600 hover:text-blue-500 hover:bg-white/40'
            }`}
          >
            <span>🕯️</span>
            <span className="truncate max-w-[110px] sm:max-w-none">
              Gia đình nhỏ
            </span>
          </button>
        </div>

        {/* Right utility buttons: Sound & Guide */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio toggle button */}
          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isMuted
                ? isDark
                  ? 'bg-slate-900 text-slate-500 border-slate-800'
                  : 'bg-gray-100 text-gray-400 border-gray-200'
                : isDark
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-xs animate-pulse'
                : 'bg-pink-50 text-pink-600 border-pink-200 shadow-xs animate-pulse'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Guide & Customizer button */}
          <button
            type="button"
            onClick={onOpenGuide}
            title="Hướng dẫn & Tùy biến"
            aria-label="Hướng dẫn và tùy biến nội dung"
            className={`px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
              isDark
                ? 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
                : 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100'
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            <span className="hidden sm:inline">Tùy biến</span>
          </button>
        </div>
      </div>
    </header>
  );
};
