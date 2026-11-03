class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private volume: number = 0.8;

  constructor() {
    const savedMuted = localStorage.getItem('tientu_muted');
    if (savedMuted !== null) {
      this.muted = savedMuted === 'true';
    }
    const savedVol = localStorage.getItem('tientu_volume');
    if (savedVol !== null) {
      this.volume = Math.max(0, Math.min(1, parseFloat(savedVol)));
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('tientu_muted', String(this.muted));
    return this.muted;
  }

  public setMuted(val: boolean) {
    this.muted = val;
    localStorage.setItem('tientu_muted', String(this.muted));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    localStorage.setItem('tientu_volume', String(this.volume));
  }

  // Kiếm khí vung lên (whoosh slash)
  public playSwordSlash() {
    if (this.muted || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);

    const master = 0.2 * this.volume;
    gain.gain.setValueAtTime(master, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01 * this.volume, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  // Chém trúng quái (hit impact)
  public playHit() {
    if (this.muted || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);

    const master = 0.25 * this.volume;
    gain.gain.setValueAtTime(master, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01 * this.volume, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  // Tiếng nhặt Linh Thạch / Vật phẩm (chime / ding)
  public playLootDing(bonus = false) {
    if (this.muted || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const freqs = bonus ? [1046, 1318, 1567] : [880, 1174];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      const master = 0.12 * this.volume;
      gain.gain.setValueAtTime(master, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001 * this.volume, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  // Triệu hồi kiếm bay quanh người
  public playSwordSummon() {
    if (this.muted || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    const master = 0.1 * this.volume;
    gain.gain.setValueAtTime(master, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001 * this.volume, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  // Khiên Chân Nguyên Hộ Thể đỡ đòn
  public playBarrierHit() {
    if (this.muted || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.1);

    const master = 0.18 * this.volume;
    gain.gain.setValueAtTime(master, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001 * this.volume, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  // Khiên Chân Nguyên vỡ
  public playBarrierShatter() {
    if (this.muted || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25);

    const master = 0.3 * this.volume;
    gain.gain.setValueAtTime(master, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001 * this.volume, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  // Thi triển công pháp
  public playSkillCast() {
    if (this.muted || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.2);

    const master = 0.25 * this.volume;
    gain.gain.setValueAtTime(master, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01 * this.volume, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  // Nâng Cấp / Đột Phá
  public playLevelUp() {
    if (this.muted || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      const master = 0.2 * this.volume;
      gain.gain.setValueAtTime(master, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001 * this.volume, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  // Tọa Thiền
  public playMeditate() {
    if (this.muted || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(329.63, ctx.currentTime + 0.5);

    const master = 0.15 * this.volume;
    gain.gain.setValueAtTime(master, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001 * this.volume, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }

  // Lôi Đình Thiên Kiếp
  public playThunder() {
    if (this.muted || this.volume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);

    const gain = ctx.createGain();
    const master = 0.45 * this.volume;
    gain.gain.setValueAtTime(master, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01 * this.volume, ctx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.5);
  }
}

export const sound = new SoundEngine();
