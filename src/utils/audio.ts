/**
 * Comprehensive Audio Engine with Web Audio API synthesizer + MP3 file support.
 * Guarantees zero silence even before the user puts their own MP3 files in public/audio/!
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmInterval: number | null = null;
  private currentVoiceAudio: HTMLAudioElement | null = null;
  private isDucked: boolean = false;
  private bgmAudioElement: HTMLAudioElement | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

        this.bgmGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(muted ? 0 : this.isDucked ? 0.08 : 0.35, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(muted ? 0 : 0.5, this.ctx.currentTime);
    }
    if (this.bgmAudioElement) {
      this.bgmAudioElement.muted = muted;
    }
    if (this.currentVoiceAudio) {
      this.currentVoiceAudio.muted = muted;
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  /**
   * Starts BGM: tries public/audio/bgm.mp3 first. If not found or errors,
   * falls back to lovely generated procedural music!
   */
  public startBGM() {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    // Check if an external bgm element exists and can play
    const audio = new Audio('/audio/bgm.mp3');
    audio.loop = true;
    audio.volume = this.isMuted ? 0 : 0.4;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.bgmAudioElement = audio;
        })
        .catch(() => {
          // External mp3 not present or blocked, fallback to Web Audio procedural lofi melody!
          this.startProceduralBGM();
        });
    } else {
      this.startProceduralBGM();
    }
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmAudioElement) {
      this.bgmAudioElement.pause();
      this.bgmAudioElement.currentTime = 0;
      this.bgmAudioElement = null;
    }
    if (this.bgmInterval) {
      window.clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public toggleBGM(): boolean {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  /**
   * Synthesized cheerful background chord progression (C - Am - F - G) with warm chime tones.
   */
  private startProceduralBGM() {
    if (!this.ctx || !this.bgmGain) return;
    if (this.bgmInterval) window.clearInterval(this.bgmInterval);

    // Warm chords frequencies (Hz):
    // Cmaj7: C4 (261.6), E4 (329.6), G4 (392.0), B4 (493.8)
    // Am7:   A3 (220.0), C4 (261.6), E4 (329.6), G4 (392.0)
    // Fmaj7: F3 (174.6), A3 (220.0), C4 (261.6), E4 (329.6)
    // G7:    G3 (196.0), B3 (246.9), D4 (293.7), F4 (349.2)
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
      noteGain.gain.exponentialRampToValueAtTime(0.06, now + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(noteGain);
      noteGain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + 0.75);

      step++;
      if (step >= 8) {
        step = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    };

    playStep();
    this.bgmInterval = window.setInterval(playStep, 500);
  }

  /**
   * Handles voice notes with Ducking (auto-lowers BGM during speech).
   */
  public playVoiceNote(
    audioUrl: string,
    onEnded: () => void,
    onError: (message: string) => void
  ): { stop: () => void } {
    this.initContext();

    // Stop existing voice if any
    if (this.currentVoiceAudio) {
      this.currentVoiceAudio.pause();
      this.currentVoiceAudio = null;
    }

    this.duckBgm(true);

    const audio = new Audio(audioUrl);
    audio.muted = this.isMuted;
    this.currentVoiceAudio = audio;

    const handleEnd = () => {
      this.duckBgm(false);
      this.currentVoiceAudio = null;
      onEnded();
    };

    audio.onended = handleEnd;
    audio.onerror = () => {
      this.duckBgm(false);
      this.currentVoiceAudio = null;
      onError('Chưa có file ghi âm thực tế tại ' + audioUrl + '. Bạn có thể đặt file vào thư mục public/audio/ nhé!');
    };

    audio.play().catch(() => {
      this.duckBgm(false);
      this.currentVoiceAudio = null;
      onError('Chưa có file ghi âm thực tế tại ' + audioUrl + '. Bạn có thể đặt file vào thư mục public/audio/ nhé!');
    });

    return {
      stop: () => {
        audio.pause();
        handleEnd();
      },
    };
  }

  private duckBgm(duck: boolean) {
    this.isDucked = duck;
    if (this.ctx && this.bgmGain) {
      const targetGain = this.isMuted ? 0 : duck ? 0.08 : 0.35;
      this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, this.ctx.currentTime);
      this.bgmGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.5);
    }
    if (this.bgmAudioElement) {
      this.bgmAudioElement.volume = this.isMuted ? 0 : duck ? 0.1 : 0.4;
    }
  }

  // --- Sound Effects ---

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

    gain.gain.setValueAtTime(0.18, now);
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

    gain.gain.setValueAtTime(0.15, now);
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

    gain.gain.setValueAtTime(0.05, now);
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

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.15, start);
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

    gain.gain.setValueAtTime(0.15, now);
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

    gain.gain.setValueAtTime(0.08, now);
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

    // Soft breath noise simulation
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.35);

    gain.gain.setValueAtTime(0.12, now);
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

    // Playful cartoon spring "boing" / wobble
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.22);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.32);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }
}


export const sound = new SoundEngine();
