import React, { useState, useEffect } from 'react';
import {
  DEFAULT_CONFIG,
  PHOTO_MOMENTS,
  INITIAL_WHEEL_PRIZES,
  INITIAL_REASONS,
  INITIAL_CANDLES,
  INITIAL_GIFT_LAYERS,
  TAB_INVITE,
} from './content/config.ts';
import { OpeningScreen } from './components/OpeningScreen.tsx';
import { HeaderNav } from './components/HeaderNav.tsx';
import { FloatingParticles } from './components/FloatingParticles.tsx';
import { FamilyGlow } from './components/FamilyGlow.tsx';
import { RunawayGiftBox } from './components/RunawayGiftBox.tsx';
import { PhotoStory } from './components/PhotoStory.tsx';
import { RiggedWheel } from './components/RiggedWheel.tsx';
import { LoveReasonsGrid } from './components/LoveReasonsGrid.tsx';
import { VoiceNotePlayer } from './components/VoiceNotePlayer.tsx';
import { ThreeCandles } from './components/ThreeCandles.tsx';
import { LayeredFamilyGift } from './components/LayeredFamilyGift.tsx';
import { sound } from './utils/audio.ts';
import { Heart } from 'lucide-react';

type Tab = 'boyfriend' | 'family';

export default function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('autostart') === '1';
  });

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tab') === 'family' ? 'family' : 'boyfriend';
  });
  const [isMuted, setIsMuted] = useState(false);
  const [familyLitCount, setFamilyLitCount] = useState(0);

  const names = DEFAULT_CONFIG.names;
  const isDarkTab = activeTab === 'family';
  const familyAllLit = familyLitCount >= 3;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autostart') === '1') {
      sound.startBGM();
    }
  }, []);

  // Đổi màu body để không bị viền kem khi ở tab tối / khi overscroll.
  useEffect(() => {
    document.body.style.backgroundColor = isDarkTab
      ? familyAllLit
        ? '#1a1208'
        : '#060814'
      : '#fffaf0';
    document.documentElement.style.colorScheme = isDarkTab ? 'dark' : 'light';
  }, [isDarkTab, familyAllLit]);

  const handleToggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    sound.setMuted(nextState);
  };

  const handleTabChange = (tab: Tab) => {
    sound.playPop();
    if (tab !== 'family') setFamilyLitCount(0);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`relative min-h-[100dvh] font-sans selection:bg-pink-200 selection:text-pink-900 overflow-x-hidden safe-pb transition-colors duration-1000 ease-out ${
        isDarkTab
          ? familyAllLit
            ? 'bg-[#1a1208] text-slate-100'
            : 'bg-[#060814] text-slate-100'
          : 'bg-[#fffaf0] text-gray-800'
      }`}
    >
      <FamilyGlow litCount={familyLitCount} visible={isDarkTab} />

      {/* Hoa rơi ở tab 1, đom đóm ở tab 2 */}
      <FloatingParticles darkMode={isDarkTab} />

      {/* Màn hình mở đầu */}
      {!hasStarted && (
        <OpeningScreen
          gifter={names.gifter}
          recipient={names.recipient}
          thirdPerson={names.thirdPerson}
          onStart={() => setHasStarted(true)}
        />
      )}

      <HeaderNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        recipientName={names.recipient}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-12">
        {activeTab === 'boyfriend' ? (
          /* TAB 1: DÀNH CHO EM TRÒN */
          <div className="space-y-16 animate-fade-in">
            <RunawayGiftBox
              recipientName={names.recipient}
              gifterName={names.gifter}
            />

            <PhotoStory
              moments={PHOTO_MOMENTS}
              recipientName={names.recipient}
              gifterName={names.gifter}
            />

            <RiggedWheel
              prizes={INITIAL_WHEEL_PRIZES}
              recipientName={names.recipient}
            />

            <LoveReasonsGrid
              reasons={INITIAL_REASONS}
              recipientName={names.recipient}
              gifterName={names.gifter}
            />

            <VoiceNotePlayer
              title={`Lời Chúc Chân Thành Từ ${names.gifter}`}
              senderLabel={`🎧 Giọng đọc độc quyền của ${names.gifter}`}
              audioUrl={DEFAULT_CONFIG.voiceNoteBoyfriend.audioUrl}
              durationEstimate={DEFAULT_CONFIG.voiceNoteBoyfriend.durationEstimate}
              transcript={DEFAULT_CONFIG.voiceNoteBoyfriend.transcript}
            />

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleTabChange('family')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/80 border border-pink-200 text-pink-600 font-bold text-sm shadow-sm hover:bg-white hover:shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>{TAB_INVITE}</span>
              </button>
            </div>
          </div>
        ) : (
          /* TAB 2: GIA ĐÌNH NHỎ CỦA TỤI MÌNH */
          <div className="space-y-14 animate-fade-in">
            <ThreeCandles
              candles={INITIAL_CANDLES}
              gifterName={names.gifter}
              recipientName={names.recipient}
              thirdPersonName={names.thirdPerson}
              onLitCountChange={setFamilyLitCount}
            />

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

      <footer
        className={`relative z-10 max-w-4xl mx-auto px-4 py-12 text-center text-xs border-t mt-16 space-y-2 transition-colors duration-1000 ${
          isDarkTab
            ? 'border-slate-800 text-slate-500'
            : 'border-pink-100/80 text-gray-400'
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 font-semibold text-sm flex-wrap">
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
    </div>
  );
}
