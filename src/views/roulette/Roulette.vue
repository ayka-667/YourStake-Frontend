<template>
    <div class="roulette">
        <router-view />
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'Roulette',
        metaInfo: {
            title: 'Roulette - YourStake.fr'
        },
        methods: {
            ...mapActions([
                'socketConnectRoulette',
                'socketDisconnectRoulette'
            ])
        },
        created() {
            this.socketConnectRoulette();
        },
        beforeRouteLeave(to, from, next) {
            this.socketDisconnectRoulette();
            next();
        }
    }
</script>

<style scoped>
    .roulette {
        width: 100%;
    }
</style>
