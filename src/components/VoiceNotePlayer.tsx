import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio.ts';
import { Headphones, Square, Play, Volume2, AlertCircle } from 'lucide-react';

interface VoiceNotePlayerProps {
  title: string;
  senderLabel: string;
  audioUrl: string;
  durationEstimate: string;
  transcript: string[];
  darkMode?: boolean;
  compact?: boolean;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  title,
  senderLabel,
  audioUrl,
  durationEstimate,
  transcript,
  darkMode = false,
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [isSimulatedPlayback, setIsSimulatedPlayback] = useState(false);

  const voiceControllerRef = useRef<{ stop: () => void } | null>(null);
  const transcriptTimerRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (voiceControllerRef.current) {
        voiceControllerRef.current.stop();
        voiceControllerRef.current = null;
      }
      if (transcriptTimerRef.current) {
        window.clearInterval(transcriptTimerRef.current);
        transcriptTimerRef.current = null;
      }
    };
  }, []);

  const clearTimer = () => {
    if (transcriptTimerRef.current) {
      window.clearInterval(transcriptTimerRef.current);
      transcriptTimerRef.current = null;
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (voiceControllerRef.current) {
        voiceControllerRef.current.stop();
        voiceControllerRef.current = null;
      }
      clearTimer();
      setIsPlaying(false);
      setIsSimulatedPlayback(false);
      return;
    }

    sound.playPop();
    setIsPlaying(true);
    setActiveLineIndex(0);
    setNoticeMessage(null);
    setIsSimulatedPlayback(false);

    const controller = sound.playVoiceNote(
      audioUrl,
      () => {
        if (!isMountedRef.current) return;
        setIsPlaying(false);
        setIsSimulatedPlayback(false);
        clearTimer();
      },
      (errorMsg) => {
        if (!isMountedRef.current) return;
        setNoticeMessage(errorMsg);
        setIsSimulatedPlayback(true);

        // Nếu chưa có file ghi âm: chạy phụ đề như một bản đọc nhẹ nhàng.
        clearTimer();
        let line = 0;
        transcriptTimerRef.current = window.setInterval(() => {
          line++;
          if (line >= transcript.length) {
            clearTimer();
            setIsPlaying(false);
            setIsSimulatedPlayback(false);
          } else {
            setActiveLineIndex(line);
          }
        }, 3800);
      }
    );

    voiceControllerRef.current = controller;
  };

  const showTranscript = !compact || isPlaying;

  return (
    <section className="relative w-full max-w-xl mx-auto px-4 py-8">
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col items-center text-center transition-all duration-700 ${
          darkMode
            ? 'bg-slate-900/90 backdrop-blur-md border-slate-700 text-white shadow-slate-950/60'
            : 'bg-white/90 backdrop-blur-md border-pink-200/90 shadow-xl'
        }`}
      >
        <div
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs mb-3 shadow-xs ${
            darkMode
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'bg-pink-100 text-pink-700'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>{senderLabel}</span>
        </div>

        <h3
          className={`text-xl sm:text-2xl font-bold mb-1 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          {title}
        </h3>
        <p className={`text-xs mb-5 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          {durationEstimate} • Nhạc nền tự nhỏ xuống khi phát
        </p>

        <button
          type="button"
          onClick={handleTogglePlay}
          className={`min-h-[48px] px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-lg transition-all duration-200 cursor-pointer touch-manipulation ${
            isPlaying
              ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-300'
              : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 active:scale-95 shadow-pink-400/40'
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-4 h-4 fill-white" />
              <span>Dừng lại</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>🎧 Nghe lời chúc</span>
            </>
          )}
        </button>

        <div
          aria-hidden="true"
          className="flex items-center justify-center gap-1.5 h-12 my-5 select-none"
        >
          {Array.from({ length: 18 }, (_, i) => {
            const delays = [0.1, 0.3, 0.5, 0.2, 0.4, 0.6, 0.2, 0.5, 0.3];
            const delay = delays[i % delays.length];
            return (
              <span
                key={i}
                style={{
                  animationDuration: isPlaying ? '0.7s' : '0s',
                  animationDelay: `${delay}s`,
                }}
                className={`w-1.5 rounded-full transition-all duration-200 ${
                  isPlaying
                    ? 'bg-gradient-to-t from-pink-500 to-rose-400 animate-soundwave'
                    : 'bg-pink-200 h-2'
                }`}
              />
            );
          })}
        </div>

        {noticeMessage && (
          <div
            className={`mb-4 p-3 rounded-2xl text-xs flex items-start gap-2 text-left ${
              darkMode
                ? 'bg-amber-400/10 border border-amber-400/30 text-amber-200'
                : 'bg-amber-50 border border-amber-200 text-amber-800'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                {isSimulatedPlayback ? 'Đang đọc phụ đề thay cho bản ghi âm:' : 'Lưu ý:'}
              </p>
              <p className="text-[11px] opacity-90">{noticeMessage}</p>
            </div>
          </div>
        )}

        {showTranscript ? (
          <div
            className={`w-full border rounded-2xl p-4 text-left shadow-inner transition-colors duration-500 ${
              darkMode
                ? 'bg-slate-950/70 border-slate-800 text-slate-200'
                : 'bg-pink-50/70 border-pink-100 text-gray-700'
            }`}
          >
            <div
              className={`flex items-center justify-between text-[11px] font-bold mb-2 ${
                darkMode ? 'text-slate-400' : 'text-gray-500'
              }`}
            >
              <span>Phụ Đề Lời Chúc:</span>
              {isPlaying && (
                <span className="text-rose-400 flex items-center gap-1 animate-pulse">
                  <Volume2 className="w-3.5 h-3.5" /> Đang phát
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
              {transcript.map((line, idx) => (
                <p
                  key={idx}
                  className={`p-1.5 rounded-lg transition-all ${
                    isPlaying && activeLineIndex === idx
                      ? darkMode
                        ? 'bg-amber-400/20 text-amber-200 font-bold scale-[1.01] border border-amber-400/30'
                        : 'bg-rose-200/80 text-rose-900 font-bold scale-[1.01]'
                      : darkMode
                      ? 'text-slate-300'
                      : 'text-gray-600'
                  }`}
                >
                  &ldquo;{line}&rdquo;
                </p>
              ))}
            </div>
          </div>
        ) : (
          <p className={`text-xs italic ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Bấm để nghe lời chúc của cả nhà nha 🎧
          </p>
        )}
      </div>

      <style>{`
        @keyframes soundwave {
          0%, 100% { height: 8px; }
          50% { height: 38px; }
        }
        .animate-soundwave {
          animation: soundwave ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
