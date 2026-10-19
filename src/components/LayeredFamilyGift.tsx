import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { GiftLayer } from '../types/index.ts';
import { sound } from '../utils/audio.ts';
import { calculateGiftLayerProgress } from '../utils/logic.ts';
import { Gift, Sparkles, Award, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { InteractiveSticker } from './InteractiveSticker.tsx';

interface LayeredFamilyGiftProps {
  layers: GiftLayer[];
  gifterName: string;
  recipientName: string;
  thirdPersonName: string;
  darkMode?: boolean;
}

export const LayeredFamilyGift: React.FC<LayeredFamilyGiftProps> = ({
  layers,
  gifterName,
  recipientName,
  thirdPersonName,
  darkMode = true,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const totalLayers = layers.length;

  const currentLayer = layers.find((l) => l.step === currentStep) || layers[layers.length - 1];
  const { isCompleted, remaining } = calculateGiftLayerProgress(currentStep, totalLayers);

  const handleUnwrapNext = () => {
    sound.playPop();

    if (currentStep < totalLayers) {
      sound.playFlip();
      setCurrentStep((prev) => prev + 1);

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.65 },
      });
    } else {
      sound.playFanfare();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#ec4899', '#60a5fa'],
      });
    }
  };

  const handleReset = () => {
    sound.playPop();
    setCurrentStep(1);
  };

  return (
    <section className="relative w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Collapsible Trigger to keep Candle view serene */}
      <button
        type="button"
        onClick={() => {
          sound.playPop();
          setIsExpanded((prev) => !prev);
        }}
        className={`px-5 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
          darkMode
            ? 'bg-slate-900/90 text-amber-300 border-amber-400/30 hover:bg-slate-800'
            : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
        }`}
      >
        <Gift className="w-4 h-4 text-amber-400" />
        <span>Hộp Quà Gia Đình Nhiều Lớp Bí Mật</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isExpanded && (
        <div className="w-full mt-6 animate-scale-up flex flex-col items-center">
          {/* Progress Pills */}
          <div className="flex items-center gap-2 mb-4">
            {layers.map((l) => (
              <span
                key={l.step}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  l.step < currentStep
                    ? 'bg-emerald-400 scale-105'
                    : l.step === currentStep
                    ? 'bg-amber-400 scale-125 ring-2 ring-amber-300'
                    : 'bg-slate-700'
                }`}
              />
            ))}
            <span className="text-xs font-bold text-slate-400 ml-2">
              {currentLayer.badge}
            </span>
          </div>

          {/* Gift Box Card */}
          <div
            className={`relative w-full rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col items-center text-center ${
              darkMode
                ? 'bg-slate-900/95 border-slate-700 text-white'
                : 'bg-white/95 border-amber-200 text-gray-800'
            }`}
          >
            {!isCompleted ? (
              <>
                <div
                  className="w-28 h-28 rounded-3xl mb-4 shadow-lg flex items-center justify-center text-white relative transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: currentLayer.wrappingColor }}
                >
                  <Gift className="w-14 h-14 opacity-90 animate-pulse" />
                  <div className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-md border border-slate-700">
                    Còn {remaining} lớp
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold mb-2">
                  {currentLayer.boxTitle}
                </h3>

                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 mb-5 max-w-sm text-xs text-amber-200 italic leading-relaxed">
                  &ldquo;{currentLayer.dialogue}&rdquo;
                </div>

                <button
                  type="button"
                  onClick={handleUnwrapNext}
                  className="px-7 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
                >
                  {currentLayer.buttonLabel}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center animate-scale-up">
                <div className="w-20 h-20 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
                  <Award className="w-12 h-12" />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 border border-amber-400/30 px-3 py-1 rounded-full mb-2">
                  Chiến Lợi Phẩm Hoàn Hảo! 🏆
                </span>

                <h3 className="text-lg sm:text-xl font-bold mb-1">
                  CHỨNG NHẬN GIA ĐÌNH 3 NGƯỜI VÔ ĐỊCH
                </h3>

                {/* Page 2 Feature: Tròn + Hoành con celebrating together */}
                <div className="flex items-center justify-center gap-6 my-2">
                  <InteractiveSticker
                    character="me"
                    expression="dinh-luon"
                    size="sm"
                    tilt={-6}
                    speechBubble="Đỉnh luôn gia đình mình! ⭐"
                  />
                  <InteractiveSticker
                    character="con"
                    expression="tra-sua"
                    size="sm"
                    tilt={6}
                    speechBubble="Ba khao trà sữa nha! 🧋"
                  />
                </div>

                <div className="bg-slate-800/90 border border-amber-400/40 rounded-2xl p-4 my-3 text-xs text-slate-200 leading-relaxed max-w-md shadow-inner text-left space-y-2">
                  <p>
                    🎖️ <strong>Mẹ ({recipientName}):</strong> Xinh đẹp, đảm đang, quyền lực tối cao, luôn được yêu thương chiều chuộng nhất nhà!
                  </p>
                  <p>
                    🎖️ <strong>Con ({thirdPersonName}):</strong> &quot;Con nuôi&quot; đáng yêu, bạn thân kim cương, bảo hiểm hòa giải mọi trận drama!
                  </p>
                  <p>
                    🎖️ <strong>Ba ({gifterName}):</strong> Tài xế kiêm bảo vệ, cam kết luôn yêu thương mẹ và chăm lo cho cả nhà!
                  </p>
                  <p className="pt-2 font-bold text-amber-300 text-center border-t border-slate-700">
                    🎫 Tặng Voucher: 1 Buổi Ăn Uống Thả Ga 3 Người (A Mỏ Quẹt Thẻ)!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-2 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Gói lại bóc tiếp cho vui</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
