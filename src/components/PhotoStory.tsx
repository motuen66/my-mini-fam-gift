import React, { useState } from 'react';
import { PhotoMoment } from '../types/index.ts';
import { PHOTO_STORY_FINAL_LINE } from '../content/config.ts';
import { imageCandidates } from '../utils/assets.ts';
import { InteractiveSticker } from './InteractiveSticker.tsx';
import { Camera } from 'lucide-react';

interface PhotoStoryProps {
  moments: PhotoMoment[];
  recipientName: string;
  gifterName: string;
}

export const PhotoStory: React.FC<PhotoStoryProps> = ({
  moments,
  recipientName,
  gifterName,
}) => {
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
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Chạm vào sticker trên ảnh để nghe phản ứng hài hước nha!
        </p>
      </div>

      <div className="space-y-12 sm:space-y-16">
        {moments.map((moment, idx) => {
          const candidates = moment.imageSrc ? imageCandidates(moment.imageSrc) : [];
          const attempt = imageAttempts[moment.id] ?? 0;
          const currentSrc = candidates[attempt];
          const isImageMissing = !currentSrc || failedImages[moment.id];
          const isFinal = idx === moments.length - 1;

          return (
            <div
              key={moment.id}
              className="relative flex flex-col items-center group transition-all duration-300"
              style={{ transform: `rotate(${moment.tiltAngle}deg)` }}
            >
              <div
                className={`w-28 sm:w-32 h-6 -mb-3 z-20 ${moment.tapeColor} opacity-90 shadow-xs border-y border-white/60 transform rotate-[-2deg]`}
                style={{
                  clipPath:
                    'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)',
                }}
              />

              <div
                className={`relative w-full max-w-lg bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-pink-100/80 transition-transform duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl ${
                  isFinal ? 'ring-4 ring-pink-300/70' : ''
                }`}
              >
                <div
                  className={`relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br ${moment.bgGradient} flex items-center justify-center border border-black/5 shadow-inner`}
                >
                  {!isImageMissing ? (
                    <img
                      src={currentSrc}
                      alt={moment.altText}
                      onError={() => handleImageError(moment)}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      loading={idx < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                      <div className="absolute top-3 left-4 text-rose-300 opacity-60 text-xl">✨</div>
                      <div className="absolute bottom-4 right-5 text-amber-300 opacity-70 text-2xl">💖</div>
                      <div className="absolute top-4 right-4 text-blue-300 opacity-60 text-lg">🌸</div>

                      <div className="relative mb-2">
                        <InteractiveSticker
                          character={moment.stickerCharacter}
                          expression={moment.stickerExpression}
                          size="lg"
                          floatAnimation
                        />
                      </div>

                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-white/70 px-3 py-0.5 rounded-full backdrop-blur-xs">
                        Khoảnh Khắc #{moment.id}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 max-w-[200px] z-10 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-2xl shadow-md border border-pink-200 text-xs font-bold text-gray-800 animate-fade-in flex items-center gap-1.5">
                    <span className="text-base shrink-0">💬</span>
                    <span className="leading-tight">{moment.speechBubble}</span>
                  </div>

                  {!isImageMissing && (
                    <div className="absolute bottom-2 left-2 z-20">
                      <InteractiveSticker
                        character={moment.stickerCharacter}
                        expression={moment.stickerExpression}
                        size="sm"
                        tilt={idx % 2 === 0 ? -6 : 8}
                        floatAnimation
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 pb-2 px-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <p className="text-sm sm:text-base font-bold text-gray-800 leading-snug">
                      {moment.caption}
                    </p>
                  </div>

                  <span className="text-[11px] font-semibold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-xl shrink-0">
                    {moment.altText}
                  </span>
                </div>

                {isFinal && (
                  <div className="mt-4 pt-3 border-t border-rose-200/90 text-center">
                    <p className="text-xs sm:text-sm font-bold text-rose-600 italic leading-relaxed">
                      &ldquo;{PHOTO_STORY_FINAL_LINE}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
