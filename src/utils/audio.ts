/**
 * Audio engine:
 * - Nhạc nền: ưu tiên file thật (mp3/m4a/wav), luôn có nhạc tổng hợp dự phòng.
 * - Voice note: chỉ 1 bản phát 1 lúc, tự giảm nhạc nền khi nói.
 * - SFX: tổng hợp bằng Web Audio, không cần file.
 */

import { audioCandidates } from './assets.ts';

interface VoiceSession {
  audio: HTMLAudioElement;
  onEnded: () => void;
  onError: (message: string) => void;
  settled: boolean;
}

const FRIENDLY_VOICE_ERROR =
  'Bản ghi âm đang được cập nhật, nghe tạm nhạc nền nha 🎧';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private isMuted = false;
  private isBgmPlaying = false;
  private isDucked = false;

  private bgmInterval: number | null = null;
  private bgmAudioElement: HTMLAudioElement | null = null;
  private bgmAttempt = 0;

  private currentVoice: VoiceSession | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.bgmGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(0.45, this.ctx.currentTime);

        this.bgmGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.applyBgmVolume();
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(muted ? 0 : 0.45, this.ctx.currentTime, 0.05);
    }
    if (this.currentVoice) {
      this.currentVoice.audio.muted = muted;
    }
  }

  private bgmTargetVolume(): number {
    if (this.isMuted) return 0;
    return this.isDucked ? 0.08 : 0.3;
  }

  private applyBgmVolume() {
    if (this.ctx && this.bgmGain) {
      this.bgmGain.gain.setTargetAtTime(
        this.bgmTargetVolume(),
        this.ctx.currentTime,
        0.12
      );
    }
    if (this.bgmAudioElement) {
      this.bgmAudioElement.muted = this.isMuted;
      this.bgmAudioElement.volume = this.isDucked ? 0.1 : 0.4;
    }
  }

  public startBGM() {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.bgmAttempt = 0;

    // Luôn có nhạc ngay từ đầu. Nếu có file thật, file sẽ thay thế sau.
    this.startProceduralBGM();
    this.tryBgmFile();
  }

  private tryBgmFile() {
    const urls = audioCandidates('/audio/bgm.mp3');
    if (!this.isBgmPlaying || this.bgmAttempt >= urls.length) return;

    const url = urls[this.bgmAttempt++];
    const audio = new Audio();
    audio.src = url;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = this.isDucked ? 0.1 : 0.4;
    audio.muted = this.isMuted;

    let handled = false;

    const next = () => {
      if (handled) return;
      handled = true;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      if (this.isBgmPlaying) this.tryBgmFile();
    };

    audio.addEventListener('error', next, { once: true });

    const playPromise = audio.play();
    if (playPromise) {
      playPromise
        .then(() => {
          if (handled) return;
          if (!this.isBgmPlaying) {
            audio.pause();
            return;
          }
          handled = true;
          this.bgmAudioElement = audio;
          this.fadeOutProcedural();
          this.applyBgmVolume();
        })
        .catch(next);
    } else {
      next();
    }
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmAudioElement) {
      this.bgmAudioElement.pause();
      this.bgmAudioElement.currentTime = 0;
      this.bgmAudioElement = null;
    }
    this.stopProceduralBGM();
  }

  public toggleBGM(): boolean {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    }
    this.startBGM();
    return true;
  }

  /** Nhạc tổng hợp dự phòng: vòng hợp âm ấm, nhẹ, lặp lại. */
  private startProceduralBGM() {
    if (!this.ctx || !this.bgmGain) return;
    if (this.bgmInterval) return;

    this.bgmGain.gain.setTargetAtTime(this.bgmTargetVolume(), this.ctx.currentTime, 0.2);

    const chords = [
      [261.63, 329.63, 392.0, 523.25],
      [220.0, 261.63, 329.63, 440.0],
      [174.61, 220.0, 261.63, 349.23],
      [196.0, 246.94, 293.66, 392.0],
    ];

    let chordIdx = 0;
    let step = 0;

    const playStep = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain || this.isMuted) return;

      const currentChord = chords[chordIdx];
      const freq = currentChord[step % currentChord.length];

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.05, now + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc.connect(noteGain);
      noteGain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + 0.8);

      step++;
      if (step >= 8) {
        step = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    };

    playStep();
    this.bgmInterval = window.setInterval(playStep, 520);
  }

  private fadeOutProcedural() {
    if (!this.ctx || !this.bgmGain) return;
    this.bgmGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
    if (this.bgmInterval) {
      window.clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  private stopProceduralBGM() {
    if (this.bgmInterval) {
      window.clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  private duckBgm(duck: boolean) {
    this.isDucked = duck;
    this.applyBgmVolume();
  }

  /**
   * Phát voice note. Tự dừng bản trước và báo cho component cũ reset UI.
   */
  public playVoiceNote(
    audioUrl: string,
    onEnded: () => void,
    onError: (message: string) => void
  ): { stop: () => void } {
    this.initContext();
    this.stopCurrentVoice(true);
    this.duckBgm(true);

    const audio = new Audio();
    audio.setAttribute('playsinline', 'true');
    audio.preload = 'auto';
    audio.muted = this.isMuted;

    const session: VoiceSession = {
      audio,
      onEnded,
      onError,
      settled: false,
    };
    this.currentVoice = session;

    const finish = (ended: boolean) => {
      if (session.settled) return;
      session.settled = true;

      if (this.currentVoice === session) {
        this.currentVoice = null;
        this.duckBgm(false);
      }

      if (ended) onEnded();
    };

    const urls = audioCandidates(audioUrl);
    let index = 0;

    const tryNext = () => {
      if (session.settled) return;
      if (index >= urls.length) {
        finish(false);
        onError(FRIENDLY_VOICE_ERROR);
        return;
      }

      audio.src = urls[index++];
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          if (!session.settled) tryNext();
        });
      } else {
        tryNext();
      }
    };

    audio.addEventListener('ended', () => finish(true), { once: true });

    tryNext();

    return {
      stop: () => {
        if (this.currentVoice === session) {
          this.stopCurrentVoice(true);
        } else {
          audio.pause();
        }
      },
    };
  }

  private stopCurrentVoice(notify: boolean) {
    const session = this.currentVoice;
    if (!session) return;

    this.currentVoice = null;
    session.settled = true;
    session.audio.pause();
    session.audio.currentTime = 0;

    this.duckBgm(false);

    if (notify) session.onEnded();
  }

  // -------------------- SFX --------------------

  public playPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.08);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  public playFlip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(820, now + 0.07);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  public playTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.035);
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.13, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(start);
      osc.stop(start + 0.45);
    });
  }

  public playChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.25);

    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.65);
  }

  public playEvade() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(250, now + 0.12);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playCandleBlow() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.35);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  public playBoing() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.22);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.32);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }
}

export const sound = new SoundEngine();
