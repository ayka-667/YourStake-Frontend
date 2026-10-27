// Casino sound effects, synthesised with the Web Audio API (no audio files).
// Everything goes through one bus: master gain -> compressor -> speakers, with a
// small generated room reverb so the sounds sit together like in a real room.
// Volume follows the profile setting (localStorage 'soundVolume').

let ctx = null;
let master = null;
let room = null;
let noiseBuffer = null;

function volume() {
    try {
        const value = localStorage.getItem('soundVolume');
        return value === null ? 0.6 : Math.max(0, Math.min(1, Number(value)));
    } catch(err) {
        return 0.6;
    }
}

function audio() {
    if(ctx !== null) { return ctx; }

    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(Ctx === undefined) { return null; }

    ctx = new Ctx();

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.ratio.value = 4;
    compressor.connect(ctx.destination);

    master = ctx.createGain();
    master.connect(compressor);

    // Short decaying stereo noise as impulse response: a soft, small room.
    const length = Math.floor(ctx.sampleRate * 1.1);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for(let channel = 0; channel < 2; channel++) {
        const data = impulse.getChannelData(channel);
        for(let i = 0; i < length; i++) { data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3.2); }
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    room = ctx.createGain();
    room.gain.value = 0.16;
    room.connect(convolver);
    convolver.connect(master);

    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const noise = noiseBuffer.getChannelData(0);
    for(let i = 0; i < noise.length; i++) { noise[i] = Math.random() * 2 - 1; }

    return ctx;
}

// Browsers keep audio suspended until the first user gesture.
if(typeof window !== 'undefined') {
    const unlock = () => {
        const c = audio();
        if(c !== null && c.state === 'suspended') { c.resume(); }
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);
}

function ready() {
    const c = audio();
    if(c === null || c.state !== 'running') { return null; }

    const level = volume();
    if(level <= 0) { return null; }
    master.gain.value = level * 1.6;
    return c;
}

function out(node, wet) {
    node.connect(master);
    if(wet > 0) {
        const send = ctx.createGain();
        send.gain.value = wet;
        node.connect(send);
        send.connect(room);
    }
}

// A single enveloped oscillator note.
function tone({ freq, to = null, type = 'sine', start = 0, attack = 0.005, decay = 0.4, gain = 0.3, wet = 0.4, detune = 0 }) {
    const t = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if(to !== null) { osc.frequency.exponentialRampToValueAtTime(to, t + attack + decay); }
    osc.detune.value = detune;

    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(gain, t + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);

    osc.connect(env);
    out(env, wet);
    osc.start(t);
    osc.stop(t + attack + decay + 0.05);
}

// Filtered noise burst, optionally sweeping the filter.
function noise({ start = 0, attack = 0.002, decay = 0.08, gain = 0.3, filter = 'bandpass', freq = 2000, to = null, q = 1, wet = 0.25 }) {
    const t = ctx.currentTime + start;
    const src = ctx.createBufferSource();
    const bq = ctx.createBiquadFilter();
    const env = ctx.createGain();

    src.buffer = noiseBuffer;
    bq.type = filter;
    bq.frequency.setValueAtTime(freq, t);
    if(to !== null) { bq.frequency.exponentialRampToValueAtTime(to, t + attack + decay); }
    bq.Q.value = q;

    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(gain, t + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);

    src.connect(bq);
    bq.connect(env);
    out(env, wet);
    src.start(t, Math.random() * 0.5);
    src.stop(t + attack + decay + 0.05);
}

// Bell-like note: fundamental plus inharmonic partials, like a struck metal bar.
function bell(freq, start, gain = 0.16, decay = 0.9) {
    tone({ freq, start, decay, gain, wet: 0.5 });
    tone({ freq: freq * 2.01, start, decay: decay * 0.55, gain: gain * 0.35, wet: 0.5 });
    tone({ freq: freq * 3.98, start, decay: decay * 0.3, gain: gain * 0.12, wet: 0.5 });
}

const jitter = (amount) => 1 + (Math.random() * 2 - 1) * amount;

function chipAt(start, gain = 1) {
    // Clay chip on felt: a dull knock with a short bright click on top.
    const pitch = jitter(0.08);
    noise({ start, decay: 0.035, gain: 0.22 * gain, freq: 3200 * pitch, q: 2.5, wet: 0.15 });
    tone({ freq: 2350 * pitch, start, attack: 0.001, decay: 0.05, gain: 0.07 * gain, type: 'triangle', wet: 0.15 });
    tone({ freq: 3900 * pitch, start, attack: 0.001, decay: 0.03, gain: 0.035 * gain, wet: 0.15 });
}

const sfx = {
    // Betting: one chip, or a short stack landing.
    chip() {
        if(ready() === null) { return; }
        chipAt(0);
    },
    chips(count = 3) {
        if(ready() === null) { return; }
        for(let i = 0; i < count; i++) { chipAt(i * (0.045 + Math.random() * 0.02), 1 - i * 0.12); }
    },

    // Card slid out of the shoe onto the felt.
    deal(start = 0) {
        if(ready() === null) { return; }
        noise({ start, attack: 0.02, decay: 0.12, gain: 0.2, freq: 4200 * jitter(0.1), to: 1400, q: 0.9, wet: 0.2 });
        noise({ start: start + 0.11, decay: 0.04, gain: 0.12, filter: 'lowpass', freq: 900, wet: 0.1 });
    },

    // Hole card turned over.
    flip(start = 0) {
        if(ready() === null) { return; }
        noise({ start, attack: 0.004, decay: 0.05, gain: 0.18, filter: 'highpass', freq: 2600, wet: 0.2 });
        noise({ start: start + 0.05, decay: 0.03, gain: 0.1, freq: 1800, q: 1.5, wet: 0.1 });
    },

    // Reel / wheel tick. `pitch` lets a sequence rise or fall.
    tick(pitch = 1) {
        if(ready() === null) { return; }
        tone({ freq: 1900 * pitch, attack: 0.001, decay: 0.03, gain: 0.08, type: 'square', wet: 0.05 });
        noise({ decay: 0.015, gain: 0.08, filter: 'highpass', freq: 5000, wet: 0 });
    },

    // Safe tile / gem: pitch climbs with each step so a streak builds up.
    gem(step = 0) {
        if(ready() === null) { return; }
        const scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
        const freq = 880 * Math.pow(2, scale[Math.min(step, scale.length - 1)] / 12);
        bell(freq, 0, 0.13, 0.5);
        tone({ freq: freq * 1.5, start: 0.06, decay: 0.35, gain: 0.05, wet: 0.6 });
    },

    // Standard win: quick major arpeggio and a coin shimmer.
    win() {
        if(ready() === null) { return; }
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => bell(freq, i * 0.07, 0.13, 0.8));
        for(let i = 0; i < 6; i++) { tone({ freq: 2800 + Math.random() * 1800, start: 0.25 + i * 0.05, attack: 0.001, decay: 0.12, gain: 0.03, wet: 0.6 }); }
    },

    // Big win / blackjack: arpeggio, held chord and a longer sparkle.
    bigWin() {
        if(ready() === null) { return; }
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => bell(freq, i * 0.075, 0.13, 1));
        [523.25, 659.25, 783.99].forEach((freq) => {
            tone({ freq, start: 0.4, attack: 0.08, decay: 1.4, gain: 0.05, type: 'triangle', wet: 0.7, detune: -6 });
            tone({ freq: freq * 2, start: 0.4, attack: 0.08, decay: 1.4, gain: 0.03, type: 'triangle', wet: 0.7, detune: 6 });
        });
        for(let i = 0; i < 14; i++) { tone({ freq: 2600 + Math.random() * 2600, start: 0.35 + i * 0.06, attack: 0.001, decay: 0.15, gain: 0.025, wet: 0.7 }); }
    },
    blackjack() {
        sfx.bigWin();
    },

    // Loss: two soft falling notes, deliberately quiet and not punishing.
    lose() {
        if(ready() === null) { return; }
        tone({ freq: 392, start: 0, attack: 0.01, decay: 0.35, gain: 0.1, type: 'triangle', wet: 0.4 });
        tone({ freq: 311.13, start: 0.16, attack: 0.01, decay: 0.6, gain: 0.1, type: 'triangle', wet: 0.4 });
    },

    // Push / refund: one neutral double tap.
    push() {
        if(ready() === null) { return; }
        bell(659.25, 0, 0.08, 0.35);
        bell(659.25, 0.12, 0.06, 0.4);
    },

    // Cash-out: register-style coin cascade.
    cashout() {
        if(ready() === null) { return; }
        bell(1318.5, 0, 0.1, 0.5);
        bell(1975.5, 0.06, 0.08, 0.5);
        for(let i = 0; i < 8; i++) { chipAt(0.1 + i * 0.035, 0.6); }
    },

    // Crash rocket going up.
    launch() {
        if(ready() === null) { return; }
        noise({ attack: 0.3, decay: 0.6, gain: 0.08, freq: 400, to: 3000, q: 0.7, wet: 0.3 });
        tone({ freq: 220, to: 660, attack: 0.3, decay: 0.5, gain: 0.04, type: 'sawtooth', wet: 0.3 });
    },

    // Crash / mine: a low thump with a short burst, not a full explosion.
    boom() {
        if(ready() === null) { return; }
        tone({ freq: 140, to: 38, attack: 0.005, decay: 0.55, gain: 0.45, wet: 0.3 });
        noise({ attack: 0.003, decay: 0.45, gain: 0.3, filter: 'lowpass', freq: 2400, to: 160, wet: 0.4 });
    },

    // Rare drop reveal (cases): rising sweep into a bell.
    reveal() {
        if(ready() === null) { return; }
        noise({ attack: 0.25, decay: 0.15, gain: 0.07, freq: 600, to: 5000, q: 1.2, wet: 0.4 });
        bell(1046.5, 0.32, 0.14, 1.1);
        bell(1567.98, 0.32, 0.08, 1.1);
    }
};

export default sfx;
