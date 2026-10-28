<template>
    <div class="plinko-board" ref="board">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
    import sfx from '@/utils/sfx';

    // Edge (red) to centre (yellow) slot colours.
    const SLOT_EDGE = [255, 0, 63];
    const SLOT_MID = [255, 192, 0];

    export default {
        name: 'PlinkoBoard',
        props: {
            rows: { type: Number, required: true },
            table: { type: Array, required: true }
        },
        data() {
            return {
                boardBalls: [],
                boardPegHits: {},
                boardSlotHits: {},
                boardLayout: null,
                boardFrame: null,
                boardObserver: null,
                boardLastPeg: 0
            }
        },
        methods: {
            boardMeasure() {
                const board = this.$refs.board;
                const canvas = this.$refs.canvas;
                if(board === undefined || canvas === undefined) { return; }

                const ratio = window.devicePixelRatio || 1;
                const width = board.clientWidth;
                const height = board.clientHeight;

                canvas.width = Math.floor(width * ratio);
                canvas.height = Math.floor(height * ratio);
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';

                const top = 46;
                const bottom = height - 64;
                const rowGap = (bottom - top) / (this.rows - 1);
                const spacing = Math.min((width - 32) / (this.rows + 2), rowGap * 1.3);

                this.boardLayout = {
                    ratio: ratio,
                    width: width,
                    height: height,
                    cx: width / 2,
                    top: top,
                    rowGap: rowGap,
                    spacing: spacing,
                    peg: Math.max(2.2, spacing * 0.11),
                    ball: Math.max(4, spacing * 0.24),
                    slotY: bottom + rowGap * 0.55 + 8,
                    slotW: spacing * 0.88,
                    slotH: Math.max(22, Math.min(34, spacing * 0.78))
                };

                this.boardDraw();
            },
            boardPegX(row, peg) {
                const L = this.boardLayout;
                return L.cx + (peg - (row + 2) / 2) * L.spacing;
            },
            boardRowY(row) {
                return this.boardLayout.top + row * this.boardLayout.rowGap;
            },
            boardSlotColor(slot, alpha) {
                const d = Math.abs(slot - this.rows / 2) / (this.rows / 2);
                const c = SLOT_MID.map((mid, i) => Math.round(mid + (SLOT_EDGE[i] - mid) * Math.pow(d, 0.8)));
                return 'rgba(' + c.join(',') + ',' + alpha + ')';
            },
            // Drops a ball along the server path. Resolves when it lands.
            boardDrop(path) {
                return new Promise((resolve) => {
                    const segment = Math.max(95, 1750 / (path.length + 1));
                    this.boardBalls.push({ path: path, start: performance.now(), segment: segment, resolve: resolve, wobble: (Math.random() - 0.5) * 0.3 });
                    this.boardLoop();
                });
            },
            boardBallPosition(ball, now) {
                const L = this.boardLayout;
                const elapsed = now - ball.start;
                const first = ball.segment * 0.8;

                // Falling from the top onto the first peg.
                const contact = (row) => this.boardRowY(row) - L.peg - L.ball;
                if(elapsed < first) {
                    const t = elapsed / first;
                    return { x: L.cx + ball.wobble, y: (L.top - L.rowGap * 0.9) + (contact(0) - (L.top - L.rowGap * 0.9)) * t * t, step: -1 };
                }

                const step = Math.floor((elapsed - first) / ball.segment);
                const t = ((elapsed - first) % ball.segment) / ball.segment;
                const rows = ball.path.length;
                if(step >= rows) { return null; }

                const rights = (n) => ball.path.slice(0, n).reduce((a, b) => a + b, 0);
                const xAt = (n) => L.cx + (rights(n) - n / 2) * L.spacing;

                const xa = step === 0 ? L.cx + ball.wobble : xAt(step);
                const xb = xAt(step + 1);
                const ya = contact(step);
                const yb = step + 1 >= rows ? L.slotY - L.slotH / 2 - L.ball * 0.4 : contact(step + 1);
                const hop = L.rowGap * 0.42;

                return { x: xa + (xb - xa) * t, y: ya + (yb - ya) * t * t - hop * 4 * t * (1 - t) * 0.5, step: step };
            },
            boardLoop() {
                if(this.boardFrame !== null) { return; }

                const tick = () => {
                    const now = performance.now();

                    for(const ball of this.boardBalls.slice()) {
                        const position = this.boardBallPosition(ball, now);

                        // Register peg contacts as the ball enters each new segment.
                        const step = position === null ? ball.path.length : position.step;
                        while((ball.hit === undefined ? -1 : ball.hit) < step && (ball.hit === undefined ? -1 : ball.hit) < ball.path.length - 1) {
                            ball.hit = ball.hit === undefined ? 0 : ball.hit + 1;
                            const peg = ball.path.slice(0, ball.hit).reduce((a, b) => a + b, 0) + 1;
                            this.boardPegHits[ball.hit + '-' + peg] = now;
                            if(now - this.boardLastPeg > 35) { sfx.peg(1 + ball.hit * 0.035); this.boardLastPeg = now; }
                        }

                        if(position === null) {
                            const slot = ball.path.reduce((a, b) => a + b, 0);
                            this.boardSlotHits[slot] = now;
                            this.boardBalls.splice(this.boardBalls.indexOf(ball), 1);
                            ball.resolve(slot);
                        }
                    }

                    this.boardDraw(now);

                    const active = this.boardBalls.length > 0
                        || Object.values(this.boardPegHits).some((time) => now - time < 300)
                        || Object.values(this.boardSlotHits).some((time) => now - time < 400);

                    this.boardFrame = active === true ? requestAnimationFrame(tick) : null;
                };

                this.boardFrame = requestAnimationFrame(tick);
            },
            boardDraw(now = performance.now()) {
                const L = this.boardLayout;
                const canvas = this.$refs.canvas;
                if(L === null || canvas === undefined) { return; }

                const ctx = canvas.getContext('2d');
                ctx.setTransform(L.ratio, 0, 0, L.ratio, 0, 0);
                ctx.clearRect(0, 0, L.width, L.height);

                // Pegs, with a short glow after a ball touches them.
                for(let row = 0; row < this.rows; row++) {
                    for(let peg = 0; peg < row + 3; peg++) {
                        const x = this.boardPegX(row, peg);
                        const y = this.boardRowY(row);
                        const hit = this.boardPegHits[row + '-' + peg];
                        const glow = hit !== undefined ? Math.max(0, 1 - (now - hit) / 300) : 0;

                        if(glow > 0) {
                            ctx.beginPath();
                            ctx.arc(x, y, L.peg * (1.8 + glow * 1.6), 0, Math.PI * 2);
                            ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.18 * glow) + ')';
                            ctx.fill();
                        }

                        ctx.beginPath();
                        ctx.arc(x, y, L.peg, 0, Math.PI * 2);
                        ctx.fillStyle = glow > 0 ? '#ffffff' : '#e3e9f0';
                        ctx.fill();
                    }
                }

                // Multiplier slots.
                const font = Math.max(9, Math.min(13, L.slotW * 0.3));
                ctx.font = '800 ' + font + 'px Inter, system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                for(let slot = 0; slot <= this.rows; slot++) {
                    const hit = this.boardSlotHits[slot];
                    const bounce = hit !== undefined ? Math.max(0, 1 - (now - hit) / 400) : 0;
                    const x = L.cx + (slot - this.rows / 2) * L.spacing;
                    const y = L.slotY + Math.sin(bounce * Math.PI) * 6;
                    const w = L.slotW;
                    const h = L.slotH;

                    ctx.fillStyle = this.boardSlotColor(slot, 0.35);
                    this.boardRoundRect(ctx, x - w / 2, y - h / 2 + 3, w, h, 4);
                    ctx.fill();

                    ctx.fillStyle = this.boardSlotColor(slot, 1);
                    this.boardRoundRect(ctx, x - w / 2, y - h / 2, w, h, 4);
                    ctx.fill();

                    if(bounce > 0) {
                        ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.35 * bounce) + ')';
                        this.boardRoundRect(ctx, x - w / 2, y - h / 2, w, h, 4);
                        ctx.fill();
                    }

                    const value = this.table[slot];
                    const label = value >= 100 ? Math.round(value) + '' : value + (w > 34 ? '×' : '');
                    ctx.fillStyle = '#1a0a00';
                    ctx.fillText(label, x, y + 0.5, w - 2);
                }

                // Balls.
                for(const ball of this.boardBalls) {
                    const position = this.boardBallPosition(ball, now);
                    if(position === null) { continue; }

                    ctx.beginPath();
                    ctx.arc(position.x, position.y, L.ball * 1.9, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 45, 85, 0.16)';
                    ctx.fill();

                    const gradient = ctx.createRadialGradient(position.x - L.ball * 0.35, position.y - L.ball * 0.35, L.ball * 0.1, position.x, position.y, L.ball);
                    gradient.addColorStop(0, '#ff8aa4');
                    gradient.addColorStop(1, '#ff1f4f');
                    ctx.beginPath();
                    ctx.arc(position.x, position.y, L.ball, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            },
            boardRoundRect(ctx, x, y, w, h, r) {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.arcTo(x + w, y, x + w, y + h, r);
                ctx.arcTo(x + w, y + h, x, y + h, r);
                ctx.arcTo(x, y + h, x, y, r);
                ctx.arcTo(x, y, x + w, y, r);
                ctx.closePath();
            }
        },
        watch: {
            rows() { this.$nextTick(this.boardMeasure); },
            table() { this.boardDraw(); }
        },
        mounted() {
            this.boardMeasure();
            if(window.ResizeObserver !== undefined) {
                this.boardObserver = new ResizeObserver(() => this.boardMeasure());
                this.boardObserver.observe(this.$refs.board);
            }
        },
        beforeDestroy() {
            if(this.boardObserver !== null) { this.boardObserver.disconnect(); }
            if(this.boardFrame !== null) { cancelAnimationFrame(this.boardFrame); }
            for(const ball of this.boardBalls) { ball.resolve(ball.path.reduce((a, b) => a + b, 0)); }
        }
    }
</script>

<style scoped>
    .plinko-board {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .plinko-board canvas {
        position: absolute;
        inset: 0;
        display: block;
    }
</style>
