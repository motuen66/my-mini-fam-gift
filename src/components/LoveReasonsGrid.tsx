import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { LoveReason } from '../types/index.ts';
import { sound } from '../utils/audio.ts';
import { calculateReasonsProgress } from '../utils/logic.ts';
import { InteractiveSticker } from './InteractiveSticker.tsx';
import { Heart, Sparkles, MailOpen, Lock } from 'lucide-react';


interface LoveReasonsGridProps {
  reasons: LoveReason[];
  recipientName: string;
  gifterName: string;
}

export const LoveReasonsGrid: React.FC<LoveReasonsGridProps> = ({
  reasons,
  recipientName,
  gifterName,
}) => {
  const [openedCardIds, setOpenedCardIds] = useState<number[]>([]);
  const [showLoveLetter, setShowLoveLetter] = useState(false);

  const { openedCount, percent, isComplete } = calculateReasonsProgress(openedCardIds, reasons.length);

  const handleCardClick = (id: number) => {
    sound.playFlip();

    setOpenedCardIds((prev) => {
      if (prev.includes(id)) {
        // Toggle card back if desired
        return prev.filter((item) => item !== id);
      } else {
        const next = [...prev, id];
        // If just completed all 20!
        if (next.length === reasons.length) {
          setTimeout(() => {
            sound.playFanfare();
            confetti({
              particleCount: 120,
              spread: 100,
              origin: { y: 0.5 },
              colors: ['#ff85a2', '#f43f5e', '#ec4899', '#fde047'],
            });
            setShowLoveLetter(true);
          }, 600);
        }
        return next;
      }
    });
  };

  const handleOpenAll = () => {
    sound.playFanfare();
    const all = reasons.map((r) => r.id);
    setOpenedCardIds(all);
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });
    setShowLoveLetter(true);
  };

  return (
    <section className="relative w-full max-w-4xl mx-auto px-4 py-14 flex flex-col items-center">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs sm:text-sm font-bold mb-2 shadow-xs">
          <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
          <span>20 Thẻ Bài Bí Mật</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          20 Điều Khiến {gifterName} Thương <span className="text-rose-500">{recipientName}</span> Nhất
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Chạm từng thẻ để lật mở bí mật. Mở đủ 20 thẻ để mở khóa Bức Thư Tình Cảm! 💌
        </p>
      </div>

      {/* Progress & Quick Action Bar */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xs rounded-2xl p-4 mb-8 border border-pink-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
            <span>Tiến độ mở thẻ:</span>
            <span className="text-rose-600">{openedCount}/{reasons.length} thẻ ({percent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-pink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-300 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {openedCount < reasons.length && (
          <button
            type="button"
            onClick={handleOpenAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-200 transition-all cursor-pointer whitespace-nowrap"
          >
            Mở nhanh tất cả ✨
          </button>
        )}
      </div>

      {/* 20 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full">
        {reasons.map((item) => {
          const isFlipped = openedCardIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item.id)}
              className="h-44 sm:h-48 cursor-pointer perspective-1000 select-none group"
            >
              <div
                className={`relative w-full h-full duration-500 preserve-3d rounded-2xl shadow-sm group-hover:shadow-md transition-transform ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Face (Face-down card) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl p-3 flex flex-col items-center justify-between bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 text-white border-2 border-white/60 shadow-md">
                  <div className="w-full flex justify-between items-center text-[11px] opacity-80 font-bold">
                    <span>#20/10</span>
                    <span>💖</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg font-bold shadow-inner mb-1 border border-white/30 group-hover:scale-110 transition-transform">
                      {item.id}
                    </div>
                    <span className="text-[11px] font-medium tracking-wide opacity-90">
                      Chạm để lật
                    </span>
                  </div>

                  <span className="text-[10px] text-white/70 italic">
                    Lý do số {item.id}
                  </span>
                </div>

                {/* Back Face (Revealed Reason) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl p-3.5 flex flex-col justify-between bg-white border-2 border-rose-200 text-gray-800 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-100 text-rose-600">
                      {item.tag}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-medium leading-snug text-gray-700 text-center my-auto">
                    {item.reason}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-pink-50">
                    <span>Thẻ #{item.id}</span>
                    <span className="text-rose-400">Đã mở ✓</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secret Love Letter Modal / Unlock */}
      {isComplete && (
        <div className="w-full mt-12 bg-gradient-to-br from-rose-100 via-pink-50 to-amber-100 rounded-3xl p-6 sm:p-8 border-2 border-rose-300 shadow-xl text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500 text-white font-bold text-xs sm:text-sm mb-4 shadow-sm animate-bounce">
            <MailOpen className="w-4 h-4" />
            <span>Mở Khóa Bức Thư Tình Đặc Biệt!</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            Gửi {recipientName} - Người Anh Thương Nhất Quả Đất 💌
          </h3>

          <div className="flex justify-center gap-4 mb-4">
            <InteractiveSticker
              character="me"
              expression="hi-hi-hi"
              size="sm"
              tilt={-6}
              speechBubble="Hí hí hí! Tròn vui quá nè! 💖"
            />
            <InteractiveSticker
              character="me"
              expression="tha-tim"
              size="sm"
              tilt={6}
              speechBubble="A mỏ ngoan nè! 🥰"
            />
          </div>

          <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-xs rounded-2xl p-5 sm:p-6 text-sm sm:text-base text-gray-700 leading-relaxed text-left border border-rose-200/80 shadow-inner space-y-3">
            <p>
              Em tròn ơi, 20 lý do trên thật ra mới chỉ là một phần rất nhỏ trong hàng vạn điều khiến A mỏ say mê em mỗi ngày.
            </p>
            <p>
              Cảm ơn em vì đã đến và làm cho thế giới của anh trở nên rực rỡ sắc màu. Dù mai này có bận rộn hay già đi, anh vẫn sẽ luôn ở đây, cùng em ăn những món em thích và nắm tay em thật chặt.
            </p>
            <p className="font-bold text-rose-600 text-right pt-2">
              Chúc em ngày 20/10 ngập tràn niềm vui! Yêu em nhiều! ❤️
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

