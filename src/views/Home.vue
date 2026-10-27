<template>
    <div class="home">
        <div class="home-hero">
            <div class="hero-card hero-welcome">
                <div class="card-text">
                    <h1 v-if="authUser.user !== null">Welcome back, <span v-html="authUser.user.username"></span></h1>
                    <h1 v-else>Play with friends</h1>
                    <p>Live games, chat and leaderboards. 100% play money.</p>
                    <button v-if="authUser.user === null" v-on:click="modalsSetShow('Login')" class="button-primary">Create an Account</button>
                    <router-link v-else to="/crash" class="button-primary">Play Crash</router-link>
                </div>
                <div class="card-art art-crash">
                    <svg viewBox="0 0 200 120" preserveAspectRatio="none">
                        <path d="M0 115 C 70 112, 120 90, 190 10" />
                    </svg>
                    <span class="art-multiplier">2.47×</span>
                </div>
            </div>
            <div class="hero-card hero-promo">
                <div class="card-text">
                    <span class="card-tag">Promo</span>
                    <h2>Daily Rewards</h2>
                    <p>Claim your bonuses and level up as you play.</p>
                    <router-link to="/rewards" class="button-secondary">View Rewards</router-link>
                </div>
            </div>
        </div>

        <div class="home-search">
            <UiIcon name="search" />
            <input v-model="homeSearch" type="text" placeholder="Search your game" />
        </div>

        <section v-if="homeFiltered(homeMultiplayer).length" class="home-section">
            <div class="section-title">
                <UiIcon name="fire" />
                Live Multiplayer
            </div>
            <div class="section-grid">
                <router-link v-for="game in homeFiltered(homeMultiplayer)" v-bind:key="game.to" v-bind:to="game.to" class="game-tile" v-bind:style="{ '--tile-a': game.colors[0], '--tile-b': game.colors[1] }">
                    <div class="tile-art">
                        <span class="tile-live">LIVE</span>
                        <UiIcon v-bind:name="game.icon" />
                        <div class="tile-name">{{ game.name }}</div>
                        <div class="tile-brand">ORIGINALS</div>
                    </div>
                </router-link>
            </div>
        </section>

        <section v-if="homeFiltered(homeOriginals).length" class="home-section">
            <div class="section-title">
                <UiIcon name="star" />
                Originals
            </div>
            <div class="section-grid">
                <router-link v-for="game in homeFiltered(homeOriginals)" v-bind:key="game.to" v-bind:to="game.to" class="game-tile" v-bind:style="{ '--tile-a': game.colors[0], '--tile-b': game.colors[1] }">
                    <div class="tile-art">
                        <UiIcon v-bind:name="game.icon" />
                        <div class="tile-name">{{ game.name }}</div>
                        <div class="tile-brand">ORIGINALS</div>
                    </div>
                </router-link>
            </div>
        </section>

        <Bets />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import Bets from '@/components/bets/Bets';
    import UiIcon from '@/components/UiIcon';

    export default {
        name: 'Home',
        metaInfo: {
            title: 'YourStake'
        },
        components: {
            Bets,
            UiIcon
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

    .home .home-hero {
        display: grid;
        grid-template-columns: 3fr 2fr;
        gap: 16px;
    }

    .home .hero-card {
        min-height: 220px;
        position: relative;
        display: flex;
        padding: 28px 32px;
        border-radius: 8px;
        overflow: hidden;
    }

    .home .hero-welcome {
        background: linear-gradient(120deg, #213743 0%, #1a2c38 60%, #0f3b2c 100%);
    }

    .home .hero-promo {
        background: linear-gradient(135deg, #1475e1 0%, #0b3f8a 100%);
    }

    .home .card-text {
        max-width: 360px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        z-index: 1;
    }

    .home .card-text h1 {
        font-size: 28px;
        font-weight: 800;
        line-height: 1.15;
        color: #ffffff;
    }

    .home .card-text h2 {
        font-size: 22px;
        font-weight: 800;
        color: #ffffff;
    }

    .home .card-text p {
        margin: 10px 0 20px 0;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5;
        color: #b1bad3;
    }

    .home .hero-promo .card-text p {
        color: rgba(255, 255, 255, 0.8);
    }

    .home .card-tag {
        margin-bottom: 8px;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        color: #0f212e;
        background: #ffffff;
    }

    .home .button-primary,
    .home .button-secondary {
        height: 44px;
        display: inline-flex;
        align-items: center;
        padding: 0 22px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 700;
        transition: filter .15s ease;
    }

    .home .button-primary {
        color: #05080a;
        background: #00e701;
    }

    .home .button-secondary {
        color: #0f212e;
        background: #ffffff;
    }

    .home .button-primary:hover,
    .home .button-secondary:hover {
        filter: brightness(1.1);
    }

    .home .card-art {
        width: 45%;
        position: absolute;
        top: 24px;
        right: 24px;
        bottom: 24px;
    }

    .home .card-art svg {
        width: 100%;
        height: 100%;
        fill: none;
        stroke: #00e701;
        stroke-width: 3;
        filter: drop-shadow(0 0 8px rgba(0, 231, 1, 0.5));
    }

    .home .art-multiplier {
        position: absolute;
        right: 6px;
        bottom: 0;
        font-size: 42px;
        font-weight: 800;
        color: #ffffff;
        opacity: .9;
    }

    .home .home-search {
        height: 44px;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 24px;
        padding: 0 16px;
        border-radius: 999px;
        border: 2px solid #2f4553;
        background: #0f212e;
        color: #b1bad3;
        transition: border-color .15s ease;
    }

    .home .home-search:focus-within {
        border-color: #557086;
    }

    .home .home-search input {
        flex: 1;
        height: 100%;
        background: transparent;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .home .home-search input::placeholder {
        color: #557086;
    }

    .home .home-section {
        margin-top: 32px;
    }

    .home .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 14px;
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
    }

    .home .section-title .ui-icon {
        color: #b1bad3;
    }

    .home .section-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 14px;
    }

    .home a.game-tile {
        display: block;
        transition: transform .2s ease;
    }

    .home a.game-tile:hover {
        transform: translateY(-6px);
    }

    .home .tile-art {
        aspect-ratio: 3 / 4;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background:
            radial-gradient(120% 70% at 50% 0%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%),
            linear-gradient(160deg, var(--tile-a) 0%, var(--tile-b) 100%);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        overflow: hidden;
    }

    .home .tile-art .ui-icon {
        width: 56px;
        height: 56px;
        margin-bottom: 18px;
        color: #ffffff;
        stroke-width: 1.6;
        filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
    }

    .home .tile-name {
        font-size: 20px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .02em;
        color: #ffffff;
    }

    .home .tile-brand {
        position: absolute;
        bottom: 12px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .16em;
        color: rgba(255, 255, 255, 0.7);
    }

    .home .tile-live {
        position: absolute;
        top: 10px;
        left: 10px;
        padding: 2px 7px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 800;
        color: #05080a;
        background: #00e701;
    }

    @media only screen and (max-width: 900px) {

        .home .home-hero {
            grid-template-columns: 1fr;
        }

        .home .card-art {
            display: none;
        }

    }
</style>
