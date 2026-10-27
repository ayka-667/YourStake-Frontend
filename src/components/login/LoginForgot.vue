<template>
    <div class="login-forgot">
        <div class="forgot-element">
            <div class="element-title">Email</div>
            <div class="element-input">
                <input v-model="loginEmail" type="email" placeholder="ENTER EMAIL" />
                <button v-on:click="$parent.modalSetTab('login')" class="button-forgot">
                    <div class="button-inner">
                        <span>Forgot password</span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                            <!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                            <path d="M224 64c44.2 0 80 35.8 80 80v48H144V144c0-44.2 35.8-80 80-80zM80 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H368V144C368 64.5 303.5 0 224 0S80 64.5 80 144zM256 320v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V320c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
                        </svg>
                    </div>
                </button>
            </div>
        </div>
        <button v-on:click="modalResetButton()" class="button-reset" v-bind:disabled="authSendLoginLoading === true">
            <div class="button-inner">Reset Password</div>
        </button>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'LoginForgot',
        data() {
            return {
                loginEmail: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow',
                'modalsSetData'
            ]),
            modalResetButton() {
                if(this.loginEmail === null || this.loginEmail.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered email is invalid.' });
                    return;
                }

                setTimeout(() => {
                    this.modalsSetData({ typeCaptcha: 'credentialsRequest', data: { type: 'reset', email: this.loginEmail } });
                    this.modalsSetShow('Captcha');
                }, 200);
            }
        }
    }
</script>

<style scoped>
    .login-forgot {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 35px;
    }

    .login-forgot .forgot-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .login-forgot .element-title {
        font-size: 14px;
        font-weight: 700;
        color: #b1bad3;
    }

    .login-forgot .element-input {
        width: 100%;
        height: 78px;
        position: relative;
        margin-top: 20px;
        padding: 1px;
        filter: none;
    }

    .login-forgot .element-input::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #213743;
        border-radius: 4px;
        isolation: isolate;
    }

    .login-forgot .element-input input {
        width: 100%;
        height: 100%;
        padding: 0 115px 0 25px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #1a2c38;
        border-radius: 4px;
        isolation: isolate;
    }

    .login-forgot .element-input input::placeholder {
        color: #557086;
    }

    .login-forgot button.button-forgot {
        height: 46px;
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
        z-index: 1;
        transition: all .2s;
    }

    .login-forgot button.button-forgot:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .login-forgot button.button-forgot:active {
        transition-duration: .2s;
        scale: .9;
    }

    .login-forgot button.button-forgot::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: transparent;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .login-forgot button.button-forgot::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #1a2c38;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .login-forgot button.button-forgot .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 15px;
        background: #2f4553;
        border-radius: 4px;
        isolation: isolate;
    }

    .login-forgot button.button-forgot .button-inner span {
        font-size: 13px;
        font-weight: 700;
        color: #00e701;
    }

    .login-forgot button.button-forgot .button-inner svg {
        width: 17px;
        height: 17px;
        display: none;
        fill: #00e701;
    }

    .login-forgot button.button-reset {
        width: 300px;
        height: 54px;
        position: relative;
        margin-top: 35px;
        filter: none;
        transition: all .2s;
    }

    .login-forgot button.button-reset:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .login-forgot button.button-reset:active {
        transition-duration: .2s;
        scale: .9;
    }


    .login-forgot button.button-reset .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        background: #00e701;
        border-radius: 4px;
        isolation: isolate;
    }

    @media only screen and (max-width: 430px) {

        .login-forgot .element-input input {
            padding: 0 62px 0 25px;
        isolation: isolate;
    }


        .login-forgot button.button-forgot .button-inner span {
            display: none;
        }

        .login-forgot button.button-forgot .button-inner svg {
            display: block;
        }

    }
</style>