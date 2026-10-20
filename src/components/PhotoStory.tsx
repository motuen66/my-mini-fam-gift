import React, { useState } from 'react';
import { PhotoMoment } from '../types/index.ts';
import { imageCandidates } from '../utils/assets.ts';
import { InteractiveSticker } from './InteractiveSticker.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';
import { Camera } from 'lucide-react';

interface PhotoStoryProps {
  moments: PhotoMoment[];
  recipientName: string;
  gifterName: string;
}

export const PhotoStory: React.FC<PhotoStoryProps> = ({ moments, recipientName }) => {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [imageAttempts, setImageAttempts] = useState<Record<number, number>>({});

  const handleImageError = (moment: PhotoMoment) => {
    const candidates = moment.imageSrc ? imageCandidates(moment.imageSrc) : [];
    const attempt = imageAttempts[moment.id] ?? 0;

    if (attempt < candidates.length - 1) {
      setImageAttempts((prev) => ({ ...prev, [moment.id]: attempt + 1 }));
    } else {
      setFailedImages((prev) => ({ ...prev, [moment.id]: true }));
    }
  };

  return (
    <section id="photo-story-section" className="relative w-full max-w-2xl mx-auto px-3 sm:px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold mb-2 shadow-xs">
          <Camera className="w-4 h-4 text-rose-500" />
          <span>Khoảnh Khắc Đáng Nhớ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Photo Story Cùng <span className="text-rose-500">{recipientName}</span> 📸
        </h2>
      </div>

      <div className="space-y-12 sm:space-y-16">
        {moments.map((moment, idx) => {
          const candidates = moment.imageSrc ? imageCandidates(moment.imageSrc) : [];
          const attempt = imageAttempts[moment.id] ?? 0;
          const currentSrc = candidates[attempt];
          const isImageMissing = !currentSrc || failedImages[moment.id];

          return (
            <ScrollReveal key={moment.id} delay={(idx % 2) * 90}>
              <div
                className="relative flex flex-col items-center"
                style={{ transform: `rotate(${moment.tiltAngle}deg)` }}
              >
                <div
                  className={`w-28 sm:w-32 h-6 -mb-3 z-20 ${moment.tapeColor} opacity-90 shadow-xs border-y border-white/60 transform rotate-[-2deg]`}
                  style={{
                    clipPath:
                      'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)',
                  }}
                />

                <div className="relative w-full max-w-lg bg-white rounded-3xl p-3 sm:p-4 shadow-xl border border-pink-100/80">
                  <div
                    className={`relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br ${moment.bgGradient} flex items-center justify-center border border-black/5 shadow-inner`}
                  >
                    {!isImageMissing ? (
                      <img
                        src={currentSrc}
                        alt={moment.altText}
                        onError={() => handleImageError(moment)}
                        className="w-full h-full object-cover"
                        loading={idx < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full relative flex items-center justify-center select-none overflow-hidden">
                        <div className="absolute top-3 left-4 text-rose-300 opacity-60 text-xl">✨</div>
                        <div className="absolute bottom-4 right-5 text-amber-300 opacity-70 text-2xl">💖</div>
                        <div className="absolute top-4 right-4 text-blue-300 opacity-60 text-lg">🌸</div>

                        <InteractiveSticker
                          character={moment.stickerCharacter}
                          expression={moment.stickerExpression}
                          size="lg"
                          floatAnimation
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
