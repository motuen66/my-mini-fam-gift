import React, { useState, useEffect } from 'react';
import {
  DEFAULT_CONFIG,
  PHOTO_MOMENTS,
  INITIAL_WHEEL_PRIZES,
  INITIAL_REASONS,
  INITIAL_CANDLES,
  INITIAL_GIFT_LAYERS,
} from './content/config.ts';
import { OpeningScreen } from './components/OpeningScreen.tsx';
import { HeaderNav } from './components/HeaderNav.tsx';
import { FloatingParticles } from './components/FloatingParticles.tsx';
import { RunawayGiftBox } from './components/RunawayGiftBox.tsx';
import { PhotoStory } from './components/PhotoStory.tsx';
import { RiggedWheel } from './components/RiggedWheel.tsx';
import { LoveReasonsGrid } from './components/LoveReasonsGrid.tsx';
import { VoiceNotePlayer } from './components/VoiceNotePlayer.tsx';
import { ThreeCandles } from './components/ThreeCandles.tsx';
import { LayeredFamilyGift } from './components/LayeredFamilyGift.tsx';
import { GuideModal } from './components/GuideModal.tsx';
import { sound } from './utils/audio.ts';
import { Heart } from 'lucide-react';

export default function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    // Check ?autostart=1 query param for testing & direct jump
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('autostart') === '1';
  });

  const [activeTab, setActiveTab] = useState<'boyfriend' | 'family'>('boyfriend');
  const [isMuted, setIsMuted] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Dynamic names state (defaulting to A mỏ, em tròn, Hoành con)
  const [names, setNames] = useState(DEFAULT_CONFIG.names);

  useEffect(() => {
    // If autostart query param is present, start BGM automatically
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autostart') === '1') {
      sound.startBGM();
    }
  }, []);

  const handleToggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    sound.setMuted(nextState);
  };

  const handleUpdateNames = (gifter: string, recipient: string, thirdPerson: string) => {
    setNames({
      gifter,
      recipient,
      thirdPerson,
    });
  };

  const isDarkTab = activeTab === 'family';

  return (
    <div
      className={`relative min-h-screen font-sans selection:bg-pink-200 selection:text-pink-900 overflow-x-hidden safe-pb transition-colors duration-1000 ease-out ${
        isDarkTab ? 'bg-[#060814] text-slate-100' : 'bg-[#fffaf0] text-gray-800'
      }`}
    >
      {/* Falling floating petals or starry fireflies in dark mode */}
      <FloatingParticles darkMode={isDarkTab} />

      {/* Opening Screen (visible until user taps to begin) */}
      {!hasStarted && (
        <OpeningScreen
          gifter={names.gifter}
          recipient={names.recipient}
          thirdPerson={names.thirdPerson}
          onStart={() => setHasStarted(true)}
        />
      )}

      {/* Main Experience Header */}
      <HeaderNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          sound.playPop();
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        recipientName={names.recipient}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-12">
        {activeTab === 'boyfriend' ? (
          /* TAB 1: DÀNH CHO EM TRÒN */
          <div className="space-y-16 animate-fade-in">
            {/* 1. Hộp quà chạy trốn */}
            <RunawayGiftBox
              recipientName={names.recipient}
              gifterName={names.gifter}
            />

            {/* 2. Dải ảnh Photo Story (5-6 khung lớn, chữ cực ngắn < 10 từ) */}
            <PhotoStory
              moments={PHOTO_MOMENTS}
              recipientName={names.recipient}
              gifterName={names.gifter}
            />

            {/* 3. Vòng quay may mắn "ăn gian" */}
            <RiggedWheel
              prizes={INITIAL_WHEEL_PRIZES}
              recipientName={names.recipient}
            />

            {/* 4. 20 thẻ lý do yêu thương (ngắn gọn, dí dỏm < 12 từ) */}
            <LoveReasonsGrid
              reasons={INITIAL_REASONS}
              recipientName={names.recipient}
              gifterName={names.gifter}
            />

            {/* 5. Lời chúc ghi âm của A mỏ */}
            <VoiceNotePlayer
              title={`Lời Chắn Nhủ Chân Thành Từ ${names.gifter}`}
              senderLabel={`🎧 Giọng đọc độc quyền của ${names.gifter}`}
              audioUrl={DEFAULT_CONFIG.voiceNoteBoyfriend.audioUrl}
              durationEstimate={DEFAULT_CONFIG.voiceNoteBoyfriend.durationEstimate}
              transcript={DEFAULT_CONFIG.voiceNoteBoyfriend.transcript}
            />
          </div>
        ) : (
          /* TAB 2: GIA ĐÌNH NHỎ CỦA TỤI MÌNH (Không khí tắt đèn & Ánh nến vật lý) */
          <div className="space-y-14 animate-fade-in">
            {/* 1. Ba cây nến biểu tượng gia đình với ánh sáng vật lý + Sticker nhân vật + Lời chúc ghi âm gia đình */}
            <ThreeCandles
              candles={INITIAL_CANDLES}
              gifterName={names.gifter}
              recipientName={names.recipient}
              thirdPersonName={names.thirdPerson}
            />

            {/* 2. Mở quà gia đình nhiều lớp (thiết kế tinh tế dạng xếp gọn) */}
            <LayeredFamilyGift
              layers={INITIAL_GIFT_LAYERS}
              gifterName={names.gifter}
              recipientName={names.recipient}
              thirdPersonName={names.thirdPerson}
              darkMode
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`relative z-10 max-w-4xl mx-auto px-4 py-12 text-center text-xs border-t mt-16 space-y-2 transition-colors duration-1000 ${
          isDarkTab
            ? 'border-slate-800 text-slate-500'
            : 'border-pink-100/80 text-gray-400'
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 font-semibold text-sm">
          <span className={isDarkTab ? 'text-amber-400' : 'text-pink-500'}>Made with</span>
          <Heart
            className={`w-4 h-4 animate-pulse ${
              isDarkTab ? 'fill-rose-400 text-rose-400' : 'fill-pink-500 text-pink-500'
            }`}
          />
          <span className={isDarkTab ? 'text-slate-300' : 'text-pink-500'}>
            bởi {names.gifter} gửi tặng {names.recipient} & {names.thirdPerson}
          </span>
        </div>
        <p className={`text-[11px] ${isDarkTab ? 'text-slate-500' : 'text-gray-400'}`}>
          Chúc mừng Ngày Phụ Nữ Việt Nam 20/10 • Mãi mãi vui vẻ và hạnh phúc nhé!
        </p>
      </footer>

      {/* Customizer / Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        gifterName={names.gifter}
        recipientName={names.recipient}
        thirdPersonName={names.thirdPerson}
        onUpdateNames={handleUpdateNames}
      />
    </div>
  );
}
