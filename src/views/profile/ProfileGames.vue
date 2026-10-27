<template>
    <div class="profile-games">
        <div class="games-head">
            <div class="head-date">Date</div>
            <div class="head-game">Game</div>
            <div class="head-verify">Verify</div>
            <div class="head-amount">Amount</div>
        </div>
        <div class="games-content">
            <transition name="fade" mode="out-in">
                <div v-if="userBetsData.bets === null || userBetsData.loading === true" class="content-loading" key="loading">
                    <LoadingAnimation />
                </div>
                <div v-else-if="userBetsData.bets.length > 0" class="content-list" key="data">

                    <ProfileGamesElement v-for="bet in userBetsData.bets" v-bind:key="bet._id" v-bind:bet="bet" />

                </div>
                <div v-else class="content-empty" key="empty">No bets found.</div>
            </transition>
        </div>
        <div class="games-pagination">
            <button v-on:click="profileSetPage(userBetsData.page - 1)" class="button-prev" v-bind:disabled="userBetsData.page <= 1">
                <div class="button-inner">
                    <IconLeftGradient />
                </div>
            </button>
            <div class="pagination-info">
                Page <span class="gradient-green">{{userBetsData.page}}</span> / {{Math.ceil(userBetsData.count / 8) <= 0 ? '1' : Math.ceil(userBetsData.count / 8)}}
            </div>
            <button v-on:click="profileSetPage(userBetsData.page + 1)" class="button-next" v-bind:disabled="userBetsData.page >= Math.ceil(userBetsData.count / 8)">
                <div class="button-inner">
                    <IconRightGradient />
                </div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import LoadingAnimation from '@/components/LoadingAnimation';
    import IconLeftGradient from '@/components/icons/IconLeftGradient';
    import IconRightGradient from '@/components/icons/IconRightGradient';
    import ProfileGamesElement from '@/components/profile/ProfileGamesElement';

    export default {
        name: 'ProfileGames',
        components: {
            LoadingAnimation,
            IconLeftGradient,
            IconRightGradient,
            ProfileGamesElement
        },
        methods: {
            ...mapActions(['userSetBetsDataPage', 'userGetBetsSocket']),
            profileSetPage(page) {
                if(this.userBetsData.page === page) { return; }
                if(page < 1 || page > Math.ceil(this.userBetsData.count / 8)) { return; }

                this.userSetBetsDataPage(page);

                const data = { page: this.userBetsData.page };
                this.userGetBetsSocket(data);
            }
        },
        computed: {
            ...mapGetters(['userBetsData'])
        },
        created() {
            if(this.userBetsData.loading === false) {
             const data = { page: this.userBetsData.page };
                this.userGetBetsSocket(data);
            }
        }
    }
</script>

<style scoped>
    .profile-games {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .profile-games .games-head {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 20px;
    }

    .profile-games .head-date {
        width: 35%;
        font-size: 13px;
        font-weight: 700;
        color: #557086;
    }

    .profile-games .head-game {
        width: 25%;
        font-size: 13px;
        font-weight: 700;
        color: #557086;
    }

    .profile-games .head-verify {
        width: 20%;
        font-size: 13px;
        font-weight: 700;
        color: #557086;
    }

    .profile-games .head-amount {
        width: 20%;
        text-align: right;
        font-size: 13px;
        font-weight: 700;
        color: #557086;
    }

    .profile-games .games-content {
        width: 100%;
        margin-top: 15px;
        padding-bottom: 25px;
        border-bottom: 1px solid rgba(47, 69, 83, 0.5);
    }

    .profile-games .content-loading {
        width: 100%;
        height: 330px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .profile-games .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .profile-games .content-loading.fade-leave-to {
        opacity: 0;
    }

    .profile-games .content-list {
        width: 100%;
    }

    .profile-games .content-empty {
        width: 100%;
        height: 192px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: #557086;
    }

    .profile-games .content-list.fade-enter-active,
    .profile-games .content-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .profile-games .content-list.fade-enter-from,
    .profile-games .content-empty.fade-enter-from {
        opacity: 0;
    }

    .profile-games .games-pagination {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;
    }

    .profile-games .games-pagination button {
        width: 52px;
        height: 37px;
        position: relative;
        padding: 1px;
        z-index: 1;
    }

    .profile-games .games-pagination button:disabled {
        cursor: not-allowed;
    }

    .profile-games .games-pagination button:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #00e701;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .profile-games .games-pagination button:disabled:before {
        background: transparent;
    }

    .profile-games .games-pagination button:after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #07253c;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .profile-games .games-pagination button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, rgba(0, 231, 1, 0.1) 0%, rgba(0, 231, 1, 0.1) 100%), rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        isolation: isolate;
    }

    .profile-games .games-pagination button:disabled .button-inner {
        background: rgba(15, 33, 46, 0.27);
        box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.35);
    }

    .profile-games .games-pagination button.button-prev .button-inner svg {
        fill: url(#icon-left-gradient-1);
    }

    .profile-games .games-pagination button.button-next .button-inner svg {
        fill: url(#icon-right-gradient-1);
    }

    .profile-games .games-pagination button:disabled .button-inner svg {
        fill: #b1bad3;
    }

    .profile-games .pagination-info {
        font-size: 12px;
        font-weight: 700;
        color: #557086;
    }

    @media only screen and (max-width: 725px) {

        .profile-games .games-head {
            padding-bottom: 0;
        }

        .profile-games .head-date,
        .profile-games .head-game,
        .profile-games .head-verify,
        .profile-games .head-amount {
            display: none;
        }

        .profile-games .games-content {            
            margin-top: 0;
        }
    } 
</style>