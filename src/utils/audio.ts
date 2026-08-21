// Web Audio API ambient acoustic chord progression & romantic melody synthesizer
// Guarantees zero-network-dependency playback with smooth looping and volume fade.

class WeddingAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;

  // Gentle romantic chord notes (frequencies in Hz)
  // Canon in D / Romance progression: D - A - Bm - F#m - G - D - G - A
  private chordProgression = [
    // D Major
    { bass: 146.83, chords: [293.66, 369.99, 440.00, 587.33] },
    // A Major
    { bass: 110.00, chords: [277.18, 329.63, 440.00, 554.37] },
    // B minor
    { bass: 123.47, chords: [293.66, 369.99, 493.88, 587.33] },
    // F# minor
    { bass: 92.50, chords: [277.18, 369.99, 440.00, 554.37] },
    // G Major
    { bass: 98.00, chords: [293.66, 392.00, 493.88, 587.33] },
    // D Major
    { bass: 146.83, chords: [293.66, 369.99, 440.00, 587.33] },
    // G Major
    { bass: 98.00, chords: [293.66, 392.00, 493.88, 587.33] },
    // A Major
    { bass: 110.00, chords: [277.18, 329.63, 440.00, 659.25] },
  ];

  private step = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, duration: number, time: number, type: OscillatorType = 'sine', gainVal = 0.08) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    // Smooth envelope (gentle attack, bell-like decay)
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.exponentialRampToValueAtTime(gainVal, time + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(gainVal * 0.4, time + duration * 0.4);
    noteGain.gain.exponentialRampToValueAtTime(0.00001, time + duration);

    osc.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.1);
  }

  private playBar() {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    const barData = this.chordProgression[this.step % this.chordProgression.length];
    const barDuration = 2.4; // seconds per chord

    // Deep warm bass note (triangle wave)
    this.playTone(barData.bass, barDuration * 0.95, now, 'triangle', 0.12);

    // Arpeggiated gentle high harmonics (like music box / acoustic harp)
    barData.chords.forEach((noteFreq, idx) => {
      const offset = (idx * (barDuration / 4)) * 0.85;
      this.playTone(noteFreq, 1.6, now + offset, 'sine', 0.07);
    });

    this.step++;
  }

  public start() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.playBar();
    this.timerId = window.setInterval(() => {
      this.playBar();
    }, 2400);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }
}

export const weddingAudio = new WeddingAudioPlayer();
