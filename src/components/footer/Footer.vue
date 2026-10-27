<template>
    <footer id="footer">
        <div class="footer-inner">
            <div class="footer-columns">
                <div class="footer-column">
                    <div class="column-title">YourStake</div>
                    <router-link to="/crash">Crash</router-link>
                    <router-link to="/roll">Roulette</router-link>
                    <router-link to="/blackjack">Blackjack</router-link>
                    <router-link to="/duels">Dice Duels</router-link>
                    <router-link to="/mines">Mines</router-link>
                </div>
                <div class="footer-column">
                    <div class="column-title">Community</div>
                    <router-link to="/leaderboard">Leaderboard</router-link>
                    <router-link to="/rewards">Rewards</router-link>
                    <router-link to="/affiliates">Affiliates</router-link>
                </div>
                <div class="footer-column">
                    <div class="column-title">Support</div>
                    <button v-on:click="modalsSetShow('Fair')">Provably Fair</button>
                    <button v-on:click="modalsSetShow('Faq')">FAQ</button>
                    <button v-on:click="modalsSetShow('Terms')">Terms</button>
                    <button v-on:click="modalsSetShow('Privacy')">Privacy</button>
                </div>
            </div>

            <div class="footer-bottom">
                <span class="bottom-logo">YourStake</span>
                <p>Private site, for fun only. No real money is wagered, deposited or withdrawn: all balances are play money.</p>
            </div>
        </div>
    </footer>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'Footer',
        methods: {
            ...mapActions([
                'modalsSetShow'
            ])
        }
    }
</script>

<style scoped>
    footer#footer {
        width: 100%;
        margin-top: 48px;
        padding: 48px 24px 32px 24px;
        background: #0f212e;
    }

    footer#footer .footer-inner {
        max-width: 1200px;
        margin: 0 auto;
    }

    footer#footer .footer-columns {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        padding-bottom: 32px;
        border-bottom: 1px solid #213743;
    }

    footer#footer .footer-column {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    footer#footer .column-title {
        margin-bottom: 4px;
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
    }

    footer#footer .footer-column a,
    footer#footer .footer-column button {
        padding: 0;
        font-size: 14px;
        font-weight: 500;
        color: #b1bad3;
        transition: color .15s ease;
    }

    footer#footer .footer-column a:hover,
    footer#footer .footer-column button:hover {
        color: #ffffff;
    }

    footer#footer .footer-bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding-top: 28px;
        text-align: center;
    }

    footer#footer .bottom-logo {
        font-size: 24px;
        font-weight: 800;
        font-style: italic;
        letter-spacing: -0.03em;
        color: #ffffff;
    }

    footer#footer .footer-bottom p {
        max-width: 560px;
        font-size: 12px;
        font-weight: 500;
        line-height: 1.6;
        color: #557086;
    }

    @media only screen and (max-width: 650px) {

        footer#footer .footer-columns {
            grid-template-columns: 1fr 1fr;
        }

    }
</style>
