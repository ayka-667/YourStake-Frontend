<template>
    <button v-on:click="modalsSetShow('Login')" class="auth-button">
        <div class="button-inner">
            Sign In
        </div>
    </button>
</template>

<script>
    import { mapActions } from 'vuex';
    import IconRoblox from '@/components/icons/IconRoblox';

    export default {
        name: 'AuthButton',
        components: {
            IconRoblox
        },
        methods: {
            ...mapActions(['modalsSetShow'])
        }
    }
</script>

<style scoped>
    button.auth-button {
        height: 50px;
        filter: none;
        transition: all;
    }

    .auth-button:hover {
        transition-duration: .1s;
        transform: translateY(-1px);
        opacity: 0.8;
    }
    .auth-button:active {
        transition-duration: .2s;
        transform: translateY(2px);
    }
    button.auth-button .button-inner {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 22px;
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        background: #00e701;
        border-radius: 4px;
        isolation: isolate;
    }

    button.auth-button .button-inner svg {
        margin-right: 11px;
        fill: #ffffff;
    }
</style>
