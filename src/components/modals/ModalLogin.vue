<template>
    <div class="modal-login">
        <div class="login-content">
            <div class="content-title">
                <span>{{ modalTab === 'forgot' ? 'Forgot Password' : (modalTab === 'register' ? 'Create an Account' : 'Sign In') }}</span>
            </div>
            <div v-if="['login', 'register'].includes(modalTab) === true" class="content-auth">
                <LoginCredentials v-bind:tab="modalTab" />

            </div>
            <LoginForgot v-else />
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import LoginCredentials from '@/components/login/LoginCredentials';
    import LoginForgot from '@/components/login/LoginForgot';

    export default {
        name: 'ModalLogin',
        components: {
            LoginCredentials,
            LoginForgot
        },  
        data() {
            return {
                modalTab: 'login'
            }
        },
        methods: {
            ...mapActions([
                'modalsSetShow'
            ]),
            modalSetTab(tab) {
                this.modalTab = tab;
            },
            modalTermsButton() {
                this.modalsSetShow(null);
                setTimeout(() => { this.modalsSetShow('Terms'); }, 300);
            }
        },
        computed: {
            ...mapGetters(['modalsData'])
        },
        created() {
            if(this.modalsData !== null && this.modalsData.tab !== undefined) {
                this.modalTab = this.modalsData.tab;
            }
        }
    }
</script>

<style scoped>
    .modal-login {
        width: 610px;
        border-radius: 15px;
        background: #2f4553;
    }

    .modal-login .login-sidebar {
        width: 237px;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        top: 0;
        left: 0;
        border-radius: 15px 0 0 15px;
        background: #2f4553;
    }

    .modal-login .login-sidebar img:nth-of-type(1) {
        width: 143px;
        margin-top: 45px;
    }

    .modal-login .login-sidebar img:nth-of-type(2) {
        position: absolute;
        bottom: -45px;
    }

    .modal-login .sidebar-text {
        width: 100%;
        position: relative;
        margin-top: 42px;
        padding: 15px 30px;
        text-align: center;
        background: linear-gradient(255deg, rgba(0, 231, 1, 0.05) 0%, rgba(0, 231, 1, 0.05) 100%);
    }

    .modal-login .sidebar-text::before {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(255deg, rgba(0, 231, 1, 0.5) 0%, rgba(0, 231, 1, 0.5) 100%), #18486d;
    }

    .modal-login .sidebar-text::after {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 0;
        background: linear-gradient(255deg, rgba(0, 231, 1, 0.5) 0%, rgba(0, 231, 1, 0.5) 100%), #18486d;
    }

    .modal-login .sidebar-text span {
        /* font-family: 'Rubik'; */
        line-height: 28px;
        font-size: 18px;
        font-weight: 700;
        text-shadow: 0px 0px 50px rgba(0, 231, 1, 0.25);
    }

    .modal-login .login-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 45px 30px 58px 57px;
    }

    .modal-login .content-title {
        text-align: center;
        font-size: 32px;
        font-weight: 700;
    }

    .modal-login .content-auth {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 35px;
    }

    .modal-login .auth-seperator {
        width: 530px;
        position: relative;
        margin-top: 35px;
        text-align: center;
        font-size: 18px;
        font-weight: 700;
        color: #557086;
    }

    .modal-login .auth-seperator:before,
    .modal-login .auth-seperator:after {
        content: '';
        width: calc(50% - 110px);
        height: 1px;
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        background: #18486d;
        opacity: 0.5;
    }

    .modal-login .auth-seperator:before {
        left: 0;
    }

    .modal-login .auth-seperator:after {
        right: 0;
    }

    .modal-login button.button-credentials,
    .modal-login button.button-roblox {
        width: 100%; 
        height: 54px;
        margin-top: 35px;
        transition: all;
        transition-duration: 0.2s;
    }

    .button-credentials:hover, .button-roblox:hover {
        opacity: 0.8;   
        scale: 0.99;
    }

    .button-credentials{

    }
    .modal-login button.button-credentials .button-inner,
    .modal-login button.button-roblox .button-inner {
        width: 100%; 
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: 600;
        color: #ffffff;
        background: #2f4553;
        border-radius: 4px;
        isolation: isolate;
    }

    .modal-login button.button-roblox .button-inner {
        background: #4178ca;
    }

    .modal-login button.button-roblox .button-inner svg {
        margin-right: 14px;
        fill: #ffffff;
    }

    @media only screen and (max-width: 1030px) {

        .modal-login {
            width: calc(100vw - 20px);
        }

    }

    @media only screen and (max-width: 950px) {

        .modal-login .login-sidebar {
            display: none;
        }

        .modal-login .login-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 85px 15px 48px 15px;
        }

    }

    @media only screen and (max-width: 560px) {

        .modal-login .auth-seperator {
            width: 100%;
        }

    }
</style>
