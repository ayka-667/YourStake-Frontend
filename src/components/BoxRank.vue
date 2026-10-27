<template>
    <div class="box-rank" v-bind:class="'rank-' + rank">
        <div class="rank-inner">
            <img v-bind:src="require('@/assets/img/ranks/' + rank + '.svg')" />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BoxRank',
        props: ['rank']
    }
</script>

<style scoped>
    .box-rank {
        width: 38px;
        height: 28px;
        position: relative;
        margin-left: 5px;
    }

    .box-rank.rank-partner,
    .box-rank.rank-mod,
    .box-rank.rank-admin {
        margin-left: 12px;
    }

    .rewards-rakeback .box-rank {
        width: 29px;
        height: 22px;
        margin-left: 0;
    }

    .box-rank::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: transparent;
        border-radius: 4px;
        isolation: isolate;
    }

    .box-rank.rank-silver::before {
        background: transparent;
    }

    .box-rank.rank-gold::before {
        background: transparent;
    }

    .box-rank.rank-platinum::before {
        background: transparent;
    }

    .box-rank.rank-titanium::before {
        background: transparent;
    }

    .box-rank.rank-partner::before,
    .box-rank.rank-mod::before {
        background: transparent;
    }

    .box-rank.rank-admin::before {
        background: transparent;
    }

    .box-rank::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #063141;
        border-radius: 4px;
        isolation: isolate;
    }

    .chat-message-element .box-rank:after {
        background-color: #052139;
    }

    .rewards-rakeback .box-rank:after {
        background: #121f24;
    }

    .box-rank .rank-inner {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 1px;
        left: 1px;
        background: rgb(151, 119, 91, 0.05);
        border-radius: 4px;
        z-index: 1;
        isolation: isolate;
    }

    .box-rank.rank-silver .rank-inner {
        background: rgb(169, 169, 169, 0.05);
    }

    .box-rank.rank-gold .rank-inner {      
        background: linear-gradient(270deg, rgba(246, 138, 37, 0.05) 15%, rgba(255, 189, 89, 0.05) 100%);
    }

    .box-rank.rank-platinum .rank-inner {
        background: linear-gradient(270deg, rgba(85, 158, 228, 0.05) 15%, rgba(163, 163, 180, 0.05) 100%);
    }

    .box-rank.rank-titanium .rank-inner {
        background: linear-gradient(270deg, rgba(105, 83, 241, 0.05) 15%, rgba(163, 163, 180, 0.05) 100%);
    }

    .box-rank.rank-partner .rank-inner,
    .box-rank.rank-mod .rank-inner {
        background: rgb(252, 163, 17, 0.05);
    }

    .box-rank.rank-admin .rank-inner {
        background: linear-gradient(180deg, rgba(0, 231, 1, 0.05) 0%, rgba(0, 231, 1, 0.05) 100%);
    }

    .box-rank.rank-mod .rank-inner img {
        width: 15px;
        height: 15px;
    }

    .rewards-rakeback .box-rank .rank-inner img {
        width: 13px;
        height: 13px;
    }
</style>