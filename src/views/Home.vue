<template>
    <div class="home">
        <HeroSlider class="home-reveal" />

        <div class="home-search home-reveal">
            <UiIcon name="search" />
            <input v-model="homeSearch" type="text" placeholder="Search your game" />
            <button v-if="homeSearch" v-on:click="homeSearch = ''" class="search-clear" aria-label="Clear search">&times;</button>
        </div>

        <transition-group name="row" tag="div">
            <GameRow v-if="homeFiltered(homeMultiplayer).length" key="multiplayer" title="Live Multiplayer" icon="fire" v-bind:games="homeFiltered(homeMultiplayer)" v-bind:live="true" />
            <GameRow v-if="homeFiltered(homeOriginals).length" key="originals" title="Originals" icon="star" v-bind:games="homeFiltered(homeOriginals)" />
            <div v-if="homeSearch && !homeFiltered(homeMultiplayer).length && !homeFiltered(homeOriginals).length" key="empty" class="home-empty">
                No game matches "{{ homeSearch }}".
            </div>
        </transition-group>

        <Bets class="home-reveal" />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import Bets from '@/components/bets/Bets';
    import UiIcon from '@/components/UiIcon';
    import HeroSlider from '@/components/home/HeroSlider';
    import GameRow from '@/components/home/GameRow';

    export default {
        name: 'Home',
        metaInfo: {
            title: 'YourStake'
        },
        components: {
            Bets,
            UiIcon,
            HeroSlider,
            GameRow
        },
        data() {
            return {
                homeSearch: '',
                homeMultiplayer: [
                    { name: 'Crash', to: '/crash', icon: 'crash', colors: ['#ff8a00', '#e1306c'] },
                    { name: 'Roulette', to: '/roll', icon: 'roll', colors: ['#00c74d', '#007a3d'] },
                    { name: 'Blackjack', to: '/blackjack', icon: 'blackjack', colors: ['#7b5cff', '#4a2fd1'] },
                    { name: 'Duels', to: '/duels', icon: 'duels', colors: ['#00b4ff', '#0062d6'] },
                    { name: 'Battles', to: '/battles', icon: 'battles', colors: ['#ff4d4d', '#b3122e'] }
                ],
                homeOriginals: [
                    { name: 'Mines', to: '/mines', icon: 'mines', colors: ['#1fd1a5', '#0b7d76'] },
                    { name: 'Towers', to: '/towers', icon: 'towers', colors: ['#ffbe0b', '#e07a00'] },
                    { name: 'Cases', to: '/unbox', icon: 'unbox', colors: ['#c13cff', '#7a12c4'] },
                    { name: 'Upgrader', to: '/upgrader', icon: 'upgrader', colors: ['#3d7bff', '#1d3fbf'] }
                ]
            }
        },
        methods: {
            ...mapActions(['modalsSetShow']),
            homeFiltered(games) {
                const query = this.homeSearch.trim().toLowerCase();
                return query === '' ? games : games.filter((game) => game.name.toLowerCase().includes(query));
            }
        },
        computed: {
            ...mapGetters(['authUser'])
        }
    }
</script>

<style scoped>
    .home {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 32px 24px 40px 24px;
    }

    /* staggered entrance of the page blocks */
    .home-reveal {
        opacity: 0;
        animation: home-reveal .7s cubic-bezier(.22, 1, .36, 1) forwards;
    }

    .home-reveal:nth-child(1) { animation-delay: .05s; }
    .home-reveal:nth-child(2) { animation-delay: .15s; }
    .home .bets.home-reveal { animation-delay: .35s; }

    .home .home-search {
        height: 46px;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 24px;
        padding: 0 16px;
        border-radius: 999px;
        border: 2px solid #2f4553;
        background: #0f212e;
        color: #b1bad3;
        transition: border-color .2s ease, box-shadow .25s ease;
    }

    .home .home-search:focus-within {
        border-color: #557086;
        box-shadow: 0 0 0 4px rgba(85, 112, 134, 0.18);
    }

    .home .home-search input {
        flex: 1;
        height: 100%;
        background: transparent;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .home .home-search input::placeholder { color: #557086; }

    .home .search-clear {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #213743;
        font-size: 18px;
        line-height: 1;
        color: #b1bad3;
    }

    .home .search-clear:hover { background: #2f4553; color: #ffffff; }

    .home .home-empty {
        margin-top: 40px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        color: #557086;
    }

    /* rows appearing / disappearing while searching */
    .home .row-enter-active,
    .home .row-leave-active { transition: opacity .3s ease, transform .35s cubic-bezier(.22, 1, .36, 1); }
    .home .row-enter,
    .home .row-leave-to { opacity: 0; transform: translateY(10px); }
    .home .row-leave-active { position: absolute; width: calc(100% - 48px); max-width: 1152px; }

    @keyframes home-reveal {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: none; }
    }
</style>
