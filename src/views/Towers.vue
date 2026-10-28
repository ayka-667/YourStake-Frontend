<template>
    <div class="towers">
        <div class="towers-container">
            <div class="container-game" v-bind:class="['game-' + towersRisk]">
                <TowersRow v-for="row in 8" v-bind:key="row" v-bind:row="row - 1" />
            </div>
            <TowersControls />
        </div>
        
        <Bets />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import Bets from '@/components/bets/Bets';
    import TowersRow from '@/components/towers/TowersRow';
    import TowersControls from '@/components/towers/TowersControls';

    export default {
        name: 'Towers',
        metaInfo: {
            title: 'Towers - YourStake.fr'
        },
        components: {
            Bets,
            TowersRow,
            TowersControls
        },
        methods: {
            ...mapActions([
                'socketConnectTowers', 
                'socketDisconnectTowers'
            ])
        },
        computed: {
            ...mapGetters([
                'towersRisk'
            ]),
        },
        created() {
            this.socketConnectTowers();
        },
        beforeRouteLeave(to, from, next) {
            this.socketDisconnectTowers();
            next();
        }
    }
</script>

<style scoped>
    .towers {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 45px 10px;
    }

    .towers .towers-container {
        width: 525px;
        padding-top: 22px;
        border-radius: 12px;
        background: var(--bg-darkest);
        overflow: hidden;
    }

    .towers .container-game {
        width: 100%;
        display: flex;
        flex-direction: column-reverse;
    }

    @media only screen and (max-width: 1150px) {

        .towers {
            padding: 25px 10px 45px 10px;
        }

    }

    @media only screen and (max-width: 950px) {

        .towers {
            padding: 25px 10px 45px 10px;
        }

        /* Bets docks itself to the bottom on small screens and overlapped the controls */
        .towers .bets {
            position: static;
            margin-top: 30px;
        }

    }

    @media only screen and (max-width: 545px) {

        .towers .towers-container {
            width: 100%;
        }

    }
</style>