<template>
    <aside id="sidebar" v-bind:class="{ 'sidebar-open': generalSidebarMobile === 'Navbar' }">
        <div class="sidebar-head">
            <button v-on:click="generalSetSidebarMobile(generalSidebarMobile === 'Navbar' ? null : 'Navbar')" class="button-menu">
                <UiIcon name="menu" />
            </button>
            <router-link to="/" class="head-tab tab-active">Casino</router-link>
        </div>

        <div class="sidebar-scroll">
            <div class="sidebar-group">
                <router-link v-on:click.native="sidebarClose()" to="/" exact class="sidebar-link">
                    <UiIcon name="YourStake" />
                    <span>Home</span>
                </router-link>
                <router-link v-if="authUser.user !== null" v-on:click.native="sidebarClose()" to="/rewards" class="sidebar-link">
                    <UiIcon name="gift" />
                    <span>Rewards</span>
                </router-link>
                <router-link v-if="authUser.user !== null" v-on:click.native="sidebarClose()" to="/leaderboard" class="sidebar-link">
                    <UiIcon name="trophy" />
                    <span>Leaderboard</span>
                </router-link>
            </div>

            <div class="sidebar-group">
                <div class="group-title">Live Multiplayer</div>
                <router-link v-for="game in sidebarMultiplayer" v-bind:key="game.to" v-on:click.native="sidebarClose()" v-bind:to="game.to" class="sidebar-link">
                    <UiIcon v-bind:name="game.icon" />
                    <span>{{ game.name }}</span>
                    <span class="link-live"></span>
                </router-link>
            </div>

            <div class="sidebar-group">
                <div class="group-title">Originals</div>
                <router-link v-for="game in sidebarOriginals" v-bind:key="game.to" v-on:click.native="sidebarClose()" v-bind:to="game.to" class="sidebar-link">
                    <UiIcon v-bind:name="game.icon" />
                    <span>{{ game.name }}</span>
                </router-link>
            </div>

            <div v-if="authUser.user !== null" class="sidebar-group">
                <router-link v-on:click.native="sidebarClose()" to="/profile" class="sidebar-link">
                    <UiIcon name="user" />
                    <span>Profile</span>
                </router-link>
                <router-link v-on:click.native="sidebarClose()" to="/affiliates" class="sidebar-link">
                    <UiIcon name="affiliates" />
                    <span>Affiliates</span>
                </router-link>
                <router-link v-if="authUser.user.rank === 'admin'" v-on:click.native="sidebarClose()" to="/admin" class="sidebar-link">
                    <UiIcon name="shield" />
                    <span>Admin</span>
                </router-link>
            </div>
        </div>
    </aside>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import UiIcon from '@/components/UiIcon';

    export default {
        name: 'Sidebar',
        components: {
            UiIcon
        },
        data() {
            return {
                sidebarMultiplayer: [
                    { name: 'Crash', to: '/crash', icon: 'crash' },
                    { name: 'Roll', to: '/roll', icon: 'roll' },
                    { name: 'Blackjack', to: '/blackjack', icon: 'blackjack' },
                    { name: 'Dice Duels', to: '/duels', icon: 'duels' }
                ],
                sidebarOriginals: [
                    { name: 'Plinko', to: '/plinko', icon: 'plinko' },
                    { name: 'Dice', to: '/dice', icon: 'dice' },
                    { name: 'Flip', to: '/flip', icon: 'flip' },
                    { name: 'Roulette', to: '/roulette', icon: 'roulette' },
                    { name: 'Mines', to: '/mines', icon: 'mines' },
                    { name: 'Towers', to: '/towers', icon: 'towers' }
                ]
            }
        },
        methods: {
            ...mapActions(['generalSetSidebarMobile']),
            sidebarClose() {
                if(this.generalSidebarMobile === 'Navbar') { this.generalSetSidebarMobile(null); }
            }
        },
        computed: {
            ...mapGetters(['generalSidebarMobile', 'authUser'])
        }
    }
</script>

<style scoped>
    aside#sidebar {
        width: 240px;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        background: #0f212e;
        z-index: 60;
    }

    aside#sidebar .sidebar-head {
        height: 60px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 16px;
        flex-shrink: 0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    }

    aside#sidebar button.button-menu {
        width: 36px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        color: #b1bad3;
    }

    aside#sidebar button.button-menu:hover {
        color: #ffffff;
    }

    aside#sidebar .head-tab {
        flex: 1;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        background: linear-gradient(0deg, #1a5f9e 0%, #1475e1 100%);
    }

    aside#sidebar .sidebar-scroll {
        flex: 1;
        overflow-y: auto;
        padding: 16px 12px;
        scrollbar-width: thin;
        scrollbar-color: #2f4553 transparent;
    }

    aside#sidebar .sidebar-group {
        padding: 6px 0;
        margin-bottom: 12px;
        border-radius: 4px;
        background: #1a2c38;
    }

    aside#sidebar .group-title {
        padding: 10px 16px 6px 16px;
        font-size: 12px;
        font-weight: 600;
        color: #557086;
        text-transform: uppercase;
        letter-spacing: .04em;
    }

    aside#sidebar a.sidebar-link {
        height: 42px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 16px;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        transition: background .15s ease;
    }

    aside#sidebar a.sidebar-link .ui-icon {
        color: #b1bad3;
    }

    aside#sidebar a.sidebar-link:hover,
    aside#sidebar a.sidebar-link.router-link-active {
        background: #213743;
    }

    aside#sidebar a.sidebar-link.router-link-active .ui-icon {
        color: #ffffff;
    }

    aside#sidebar .link-live {
        width: 7px;
        height: 7px;
        margin-left: auto;
        border-radius: 50%;
        background: #00e701;
        box-shadow: 0 0 6px rgba(0, 231, 1, 0.7);
    }

    @media only screen and (max-width: 1100px) {

        aside#sidebar {
            transform: translateX(-100%);
            transition: transform .25s ease;
        }

        aside#sidebar.sidebar-open {
            transform: translateX(0);
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
        }

    }
</style>
