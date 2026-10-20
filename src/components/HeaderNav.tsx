import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface HeaderNavProps {
  activeTab: 'boyfriend' | 'family';
  onTabChange: (tab: 'boyfriend' | 'family') => void;
  recipientName: string;
  isMuted: boolean;
  onToggleMute: () => void;
  /** Hoành con chỉ thấy tab Gia đình nhỏ. */
  showBoyfriendTab?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
  recipientName,
  isMuted,
  onToggleMute,
  showBoyfriendTab = true,
}) => {
  const isDark = activeTab === 'family';

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-1000 shadow-xs safe-pt ${
        isDark
          ? 'bg-slate-950/75 border-b border-slate-800/80 text-white'
          : 'bg-white/80 border-b border-pink-100/80 text-gray-800'
      }`}
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
        <div
          className={`flex items-center gap-1 sm:gap-2 p-1 rounded-2xl border transition-colors duration-700 overflow-hidden ${
            isDark
              ? 'bg-slate-900/90 border-slate-800'
              : 'bg-pink-100/70 border-pink-200/60'
          }`}
        >
          {showBoyfriendTab && (
            <button
              type="button"
              onClick={() => onTabChange('boyfriend')}
              className={`min-h-[44px] px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'boyfriend'
                  ? 'bg-white text-pink-600 shadow-sm shadow-pink-200/50 scale-[1.02]'
                  : isDark
                  ? 'text-slate-400 hover:text-pink-300 hover:bg-slate-800/60'
                  : 'text-gray-600 hover:text-pink-500 hover:bg-white/40'
              }`}
            >
              <span>💖</span>
              <span className="sm:hidden">{recipientName}</span>
              <span className="hidden sm:inline">Dành cho {recipientName}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onTabChange('family')}
            className={`min-h-[44px] px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'family'
                ? 'bg-slate-800 text-amber-300 shadow-md shadow-amber-500/20 scale-[1.02] border border-amber-400/30'
                : isDark
                ? 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60'
                : 'text-gray-600 hover:text-blue-500 hover:bg-white/40'
            }`}
          >
            <span>🕯️</span>
            <span>Gia đình nhỏ</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleMute}
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          className={`min-w-[44px] min-h-[44px] p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
            isMuted
              ? isDark
                ? 'bg-slate-900 text-slate-500 border-slate-800'
                : 'bg-gray-100 text-gray-400 border-gray-200'
              : isDark
              ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-xs'
              : 'bg-pink-50 text-pink-600 border-pink-200 shadow-xs'
          }`}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
