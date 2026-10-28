<template>
    <div class="rewards">
        <div class="rewards-banner">
            <RewardsCode />
            <RewardsRakeback />
        </div>
    </div>
</template>

<script>
    import RewardsCode from '@/components/rewards/RewardsCode';
    import RewardsRakeback from '@/components/rewards/RewardsRakeback';

    export default {
        name: 'Rewards',
        metaInfo: {
            title: 'Rewards - YourStake.fr'
        },
        components: {
            RewardsCode,
            RewardsRakeback
        },
    }
</script>

<style scoped>
    .rewards {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 45px 10px;
    }

    .rewards .rewards-banner {
        width: 100%;
        max-width: 1250px;
        display: flex;
        /* font-family: Rubik; */
    }

    .rewards .rewards-boxes {
        width: 100%;
        max-width: 1250px;
        position: relative;
        margin-top: 66px;
    }

    .rewards .rewards-boxes:before {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(90deg, rgba(26, 44, 56, 0) 0%, #f8a216 50%, rgba(26, 44, 56, 0) 100%);
    }

    .rewards .boxes-title {
        width: 220px;
        height: 40px;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: -20px;
        left: 50%;
        transform: translate(-50%, 0);
        /* font-family: Rubik; */
        font-size: 20px;
        font-weight: 700;
        color: #ffffff;
        background: #fca311;
        border-radius: 4px;
        isolation: isolate;
    }

    .rewards .boxes-content {
        width: 100%;
        margin-top: 63px;
    }

    .rewards .content-loading,
    .rewards .content-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .rewards .content-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .rewards .content-loading.fade-leave-to {
        opacity: 0;
    }

    .rewards .loading-placeholder {
        width: calc(14.28% - 7.7px);
        height: 220px;
        position: relative;
        margin-bottom: 10px;
        margin-right: 9px;
        background: linear-gradient(223deg, rgba(15, 33, 46, 0.35) 0%, rgba(31, 99, 153, 0.09) 50%, rgba(15, 33, 46, 0.35) 100%);
        border: 1px solid #1a2c38;
        overflow: hidden;
    }

    .rewards .loading-placeholder:after {
        width: 100%;
        height: 100%;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        animation-name: loading_animation;
        animation-duration: 1s;
        animation-timing-function: ease;
        animation-iteration-count: infinite;
        background: linear-gradient(to right, #ffffff00 0%, rgba(255, 255, 255, 0.1) 50%, #ffffff00 100%);
    }

    .rewards .loading-placeholder:nth-child(7n) {
        margin-right: 0;
    }

    .rewards .content-empty {
        width: 100%;
        height: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: #557086;
    }

    .rewards .content-list.fade-enter-active,
    .rewards .content-empty.fade-enter-active {
        transition: opacity 0.5s;
    }

    .rewards .content-list.fade-enter-from,
    .rewards .content-empty.fade-enter-from {
        opacity: 0;
    }

    @keyframes loading_animation {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(100%); }
    }

    @media only screen and (max-width: 1270px) {

        .rewards .rewards-banner {
            width: 100%;
        }

        .rewards .rewards-boxes {
            width: 100%;
        }

    }

    @media only screen and (max-width: 1150px) {

        .rewards .rewards-banner {
            flex-direction: column;
        }

    }
</style>