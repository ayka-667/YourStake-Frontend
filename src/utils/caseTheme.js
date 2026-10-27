// Material palettes for the cases. Every place that draws a case (art, card glow,
// header) reads its colours from here so a case looks the same everywhere.
//   light / base / shade: the three tones of the case body
//   trim: latches, emblem and edge light
//   glow: the coloured light behind the case

const THEMES = {
    graphite: { label: 'Graphite', light: '#7d8b9c', base: '#4a5868', shade: '#232e39', trim: '#c9d3df', glow: '#8aa0b8' },
    platinum: { label: 'Platinum', light: '#eef2f7', base: '#aab6c4', shade: '#5b6878', trim: '#ffffff', glow: '#cfd9e6' },
    gold: { label: 'Gold', light: '#ffe6a3', base: '#e0a93a', shade: '#8a5a12', trim: '#fff3cf', glow: '#f5b70a' },
    sapphire: { label: 'Sapphire', light: '#9fd3ff', base: '#2f7de1', shade: '#173a7a', trim: '#e3f2ff', glow: '#3b9bff' },
    amethyst: { label: 'Amethyst', light: '#e2c6ff', base: '#9254de', shade: '#45207a', trim: '#f4e9ff', glow: '#a86bff' },
    crimson: { label: 'Crimson', light: '#ffb3c1', base: '#e5395c', shade: '#7a1530', trim: '#ffe3ea', glow: '#ff4d6d' },
    emerald: { label: 'Emerald', light: '#b4f5c8', base: '#1fb45a', shade: '#0d5a2e', trim: '#e3ffec', glow: '#22d36b' },
    ember: { label: 'Ember', light: '#ffd0a8', base: '#ec7a2c', shade: '#7c3410', trim: '#fff0e3', glow: '#ff8a3d' },
    frost: { label: 'Frost', light: '#d9fbff', base: '#5cc8e0', shade: '#1d5d72', trim: '#f2feff', glow: '#6be3ff' }
};

// Known cases; anything else gets a stable palette picked from its name.
const BY_SLUG = {
    'starter-case': 'graphite',
    'silver-case': 'platinum',
    'gold-case': 'gold',
    'gem-case': 'sapphire',
    'royal-case': 'amethyst',
    'whale-case': 'crimson',
    'clovers-case': 'emerald',
    'autumn-case': 'ember',
    'carnival-case': 'ember',
    'frosty-case': 'frost',
    'risky-case': 'crimson',
    'wings-case': 'platinum'
};

const ORDER = Object.keys(THEMES);

export function caseTheme(slug) {
    const key = slug === undefined || slug === null ? '' : String(slug).toLowerCase();
    if(BY_SLUG[key] !== undefined) { return THEMES[BY_SLUG[key]]; }

    let hash = 0;
    for(let i = 0; i < key.length; i++) { hash = (hash * 31 + key.charCodeAt(i)) >>> 0; }
    return THEMES[ORDER[hash % ORDER.length]];
}

// Static version of the CaseArt drawing, as an image URL (for places that
// need an <img>/<image>, like the home tiles). Same geometry as CaseArt.vue.
export function caseImageUrl(slug) {
    const t = caseTheme(slug);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="22 34 208 200">
<defs>
<linearGradient id="top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.light}"/><stop offset="1" stop-color="${t.base}"/></linearGradient>
<linearGradient id="front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.base}"/><stop offset="1" stop-color="${t.shade}"/></linearGradient>
<linearGradient id="side" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.shade}"/><stop offset="1" stop-color="#0b1720"/></linearGradient>
<linearGradient id="trim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.trim}"/><stop offset="1" stop-color="${t.base}"/></linearGradient>
<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
</defs>
<ellipse cx="126" cy="204" rx="84" ry="11" fill="#000" fill-opacity=".55" filter="url(#blur)"/>
<g stroke-linejoin="round" stroke-width="8">
<polygon points="172,104 204,80 204,164 172,190" fill="url(#side)" stroke="${t.shade}"/>
<polygon points="52,104 172,104 204,80 84,80" fill="url(#top)" stroke="${t.base}"/>
<polygon points="52,104 172,104 172,190 52,190" fill="url(#front)" stroke="${t.base}"/>
</g>
<path d="M50 125 H174 L206 101" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2.5"/>
<path d="M112 93 q16 -13 32 0" fill="none" stroke="${t.shade}" stroke-width="7" stroke-linecap="round"/>
<rect x="68" y="115" width="15" height="21" rx="3.5" fill="url(#trim)"/><rect x="141" y="115" width="15" height="21" rx="3.5" fill="url(#trim)"/>
<circle cx="112" cy="160" r="16" fill="#000" fill-opacity=".22" stroke="${t.trim}" stroke-opacity=".45" stroke-width="1.5"/>
<path d="M112 149 L120 160 L112 171 L104 160 Z" fill="url(#trim)"/>
<path d="M57 104 H170" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
