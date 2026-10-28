<template>
    <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <g v-html="iconPaths[name] || ''"></g>
    </svg>
</template>

<script>
    // Monochrome line icons used by the shell (sidebar, navbar, home tiles)
    const iconPaths = {
        YourStake: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.3" fill="currentColor"/>',
        crash: '<path d="M3 20h18"/><path d="M4 17c5 0 9-3 12-11"/><path d="m13 6 3 0 0 3"/>',
        roll: '<rect x="2.5" y="7" width="5" height="10" rx="1.2"/><rect x="9.5" y="5" width="5" height="14" rx="1.2"/><rect x="16.5" y="7" width="5" height="10" rx="1.2"/><path d="M12 1.5v2M12 20.5v2"/>',
        roulette: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
        blackjack: '<rect x="3" y="4" width="11" height="16" rx="2"/><path d="M14 6.5 19.5 8a1.6 1.6 0 0 1 1.1 2l-3 11"/><path d="M8.5 9.5 7 12h3l-1.5 2.5"/>',
        duels: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/><circle cx="7" cy="7" r=".8" fill="currentColor"/><circle cx="17" cy="17" r=".8" fill="currentColor"/><path d="M14 5h5v5M10 19H5v-5"/>',
        mines: '<circle cx="12" cy="13" r="7"/><path d="M12 2v4M5 6l1.5 1.5M19 6l-1.5 1.5"/><circle cx="9.5" cy="11" r="1.2" fill="currentColor"/>',
        towers: '<rect x="4" y="15" width="16" height="5" rx="1"/><rect x="6" y="9.5" width="12" height="5" rx="1"/><rect x="8" y="4" width="8" height="5" rx="1"/>',
        user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
        vault: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M12 8.5V7M12 17v-1.5M18 9v6"/>',
        calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>',
        gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9"/><path d="M12 8c-2-4-6-4-6-1.5S9 8 12 8c3 0 6-1 6-1.5S14 4 12 8"/>',
        affiliates: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M16 4a4 4 0 0 1 0 8M22 21c0-3-1.5-5-4-5.7"/>',
        trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
        shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
        logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
        chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/>',
        menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
        wallet: '<path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-2"/><path d="M15 12h6v5h-6a2.5 2.5 0 0 1 0-5z"/>',
        search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
        star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3l-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>',
        fire: '<path d="M12 21c4 0 7-2.7 7-6.8 0-4.6-4-6.6-5-11.2-2.7 2.1-3.4 4.5-3.5 6.4C9.3 8.3 8.6 7.2 8.4 6 6.4 8 5 10.6 5 14.2 5 18.3 8 21 12 21z"/>',
        plinko: '<circle cx="12" cy="4.5" r="1.6" fill="currentColor"/><circle cx="8" cy="10" r="1.2" fill="currentColor"/><circle cx="16" cy="10" r="1.2" fill="currentColor"/><circle cx="4.5" cy="15.5" r="1.2" fill="currentColor"/><circle cx="12" cy="15.5" r="1.2" fill="currentColor"/><circle cx="19.5" cy="15.5" r="1.2" fill="currentColor"/><path d="M3 20.5h18"/>',
        dice: '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/>',
        flip: '<ellipse cx="12" cy="12" rx="5" ry="9"/><path d="M12 3c3 0 7 4 7 9s-4 9-7 9"/>',
        expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
        shrink: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
        gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8v13M12 8S10.5 3.5 8 3.5a2.25 2.25 0 0 0 0 4.5M12 8s1.5-4.5 4-4.5a2.25 2.25 0 0 1 0 4.5"/>',
        play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l5.5-3.5z" fill="currentColor"/>',
        undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
        trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
        coin: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>'
    };

    export default {
        name: 'UiIcon',
        props: ['name'],
        data() {
            return { iconPaths };
        }
    }
</script>

<style scoped>
    .ui-icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
    }
</style>
