import React, { useState, useEffect } from 'react';
import { StoryChapter } from '../types/index.ts';
import { Sparkles, Utensils, Laugh, Users, HeartHandshake, Heart, BookOpen } from 'lucide-react';

interface StoryJourneyProps {
  chapters: StoryChapter[];
  recipientName: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Utensils,
  Laugh,
  Users,
  HeartHandshake,
  Heart,
};

export const StoryJourney: React.FC<StoryJourneyProps> = ({
  chapters,
  recipientName,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById('story-journey-section');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalHeight = container.scrollHeight - window.innerHeight;
      const currentScroll = -rect.top;

      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
        setScrollProgress(progress);

        // Calculate active chapter index
        const idx = Math.min(
          chapters.length - 1,
          Math.max(0, Math.floor((progress / 100) * chapters.length))
        );
        setActiveChapterIndex(idx);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapters.length]);

  return (
    <section
      id="story-journey-section"
      className="relative w-full max-w-4xl mx-auto px-4 py-16"
    >
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold mb-3 shadow-xs">
          <BookOpen className="w-4 h-4 text-rose-500" />
          <span>Hành Trình Tình Yêu Của Tụi Mình</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Những Thước Phim Đáng Nhớ Cùng <span className="text-rose-500">{recipientName}</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Cuộn chậm rãi để cùng ôn lại những khoảnh khắc ngọt ngào và hài hước nha 💖
        </p>
      </div>

      {/* Main container with Side Progress Indicator */}
      <div className="relative flex flex-col md:flex-row gap-6">
        {/* Sticky Journey Progress Bar */}
        <aside className="sticky top-20 z-20 self-start w-full md:w-48 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-pink-200/80 shadow-md">
          <div className="flex md:flex-col items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛤️</span>
              <span className="text-xs font-bold text-gray-700">Hành Trình</span>
            </div>

            {/* Vertical/Horizontal Progress Track */}
            <div className="relative flex-1 md:h-48 md:w-3 bg-pink-100 rounded-full overflow-hidden h-2.5 w-full">
              <div
                className="bg-gradient-to-r md:bg-gradient-to-b from-pink-400 via-rose-500 to-amber-400 transition-all duration-300 rounded-full h-full"
                style={{
                  width: window.innerWidth < 768 ? `${scrollProgress}%` : '100%',
                  height: window.innerWidth < 768 ? '100%' : `${scrollProgress}%`,
                }}
              />
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
              <span>{Math.round(scrollProgress)}%</span>
            </div>
          </div>

          {/* Quick Chapter Jump Pills */}
          <div className="hidden md:flex flex-col gap-1.5 mt-4 pt-3 border-t border-pink-100">
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  const target = document.getElementById(`chapter-${ch.id}`);
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-left text-xs px-2.5 py-1.5 rounded-xl transition-all truncate cursor-pointer ${
                  activeChapterIndex === idx
                    ? 'bg-rose-500 text-white font-bold shadow-xs'
                    : 'text-gray-500 hover:bg-pink-50 hover:text-rose-600'
                }`}
              >
                {ch.chapterNumber}: {ch.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Story Chapters List */}
        <div className="flex-1 space-y-12 sm:space-y-16">
          {chapters.map((chapter, idx) => {
            const IconComponent = iconMap[chapter.iconName] || Heart;
            const isFinalChapter = idx === chapters.length - 1;

            return (
              <article
                key={chapter.id}
                id={`chapter-${chapter.id}`}
                className={`relative rounded-3xl p-6 sm:p-10 shadow-lg border transition-all duration-500 ${
                  isFinalChapter
                    ? 'bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50/80 border-rose-300 shadow-rose-200/50'
                    : 'bg-white/95 border-pink-100/90 hover:shadow-xl'
                }`}
              >
                {/* Chapter badge & emotion tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
                    {chapter.chapterNumber}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    {chapter.emotion}
                  </span>
                </div>

                {/* Chapter Header */}
                <div className="flex items-start gap-3.5 mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: `${chapter.accentColor}20`, color: chapter.accentColor }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-800 leading-snug">
                      {chapter.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-pink-600 mt-0.5">
                      {chapter.subtitle}
                    </p>
                  </div>
                </div>

                {/* Chapter Content Lines */}
                <div className="space-y-3.5 text-gray-700 text-sm sm:text-base leading-relaxed bg-pink-50/40 p-4 sm:p-5 rounded-2xl border border-pink-100/60">
                  {chapter.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{paragraph}</span>
                    </p>
                  ))}
                </div>

                {/* Sincere touch for the final chapter */}
                {isFinalChapter && (
                  <div className="mt-6 pt-4 border-t border-rose-200/80 flex items-center justify-between text-xs sm:text-sm text-rose-700 italic">
                    <span>Mãi mãi thương em tròn ❤️</span>
                    <span className="font-bold">A mỏ</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
