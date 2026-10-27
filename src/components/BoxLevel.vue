<template>
    <div class="box-level" v-bind:class="'level-'+color">
        <div class="level-inner">{{level}}</div>
    </div>
</template>

<script>
    export default {
        name: 'BoxLevel',
        props: ['level', 'color']
    }
</script>

<style scoped>
    .box-level {
        width: 38px;
        height: 28px;
        position: relative;
        margin-left: 12px;
    }

    .box-level::before {
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

    .box-level.level-blue::before {
        background: transparent;
    }

    .box-level.level-green::before {
        background: transparent;
    }

    .box-level.level-orange::before {
        background: transparent;
    }

    .box-level.level-red::before {
        background: transparent;
    }

    .box-level.level-purple::before {
        background: transparent;
    }

    .box-level::after {
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

    .chat-message-element .box-level::after {
        background-color: #052139;
    }

    .box-level .level-inner {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 1px;
        left: 1px;
        font-size: 12px;
        font-weight: 700;
        color: #9e9e9e;
        background: rgba(158, 158, 158, 0.05);
        border-radius: 4px;
        z-index: 1;
        isolation: isolate;
    }

    .box-level.level-blue .level-inner {
        color: #1475e1;
        background: rgba(85, 158, 228, 0.05);
    }

    .box-level.level-green .level-inner {
        color: #00e701;
        background: rgba(184, 233, 45, 0.05);
    }

    .box-level.level-orange .level-inner {
        color: #fca311;
        background: rgba(252, 163, 17, 0.05);
    }

    .box-level.level-red .level-inner {
        color: #ff4e4e;
        background: rgba(255, 78, 78, 0.05);
    }

    .box-level.level-purple .level-inner {
        color: #2f4553;
        background: rgba(105, 83, 241, 0.05);
    }
</style>