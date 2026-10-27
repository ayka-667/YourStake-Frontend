<template>
    
    <div class="login-credentials">

        <div v-if="tab === 'register'" class="credentials-element">
            <div class="credentials-element">
                <div class="element-title">Username</div>
                <div class="element-input">
                    <input v-model="loginUsername" type="text" placeholder="Username" />
                </div>
            </div>
        </div>

        <div class="credentials-element">
            <div class="element-title">Email</div>
            <div class="element-input">
                <input v-model="loginEmail" type="text" placeholder="you@example.com" />
            </div>
        </div>
        <div class="credentials-element">
            <div class="element-title">Password</div>
            <div class="element-input">
                <input v-model="loginPassword" type="password" placeholder="Password" />
                <button v-if="tab === 'login'" v-on:click="$parent.modalSetTab('forgot')" class="button-forgot">
                    <div class="button-inner">
                        <span>Forgot?</span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                            <!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                            <path d="M224 64c44.2 0 80 35.8 80 80v48H144V144c0-44.2 35.8-80 80-80zM80 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H368V144C368 64.5 303.5 0 224 0S80 64.5 80 144zM256 320v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V320c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
                        </svg>
                    </div>
                </button>
            </div>
        </div>


        <div v-if="tab === 'register'" class="credentials-element">
            
            <div class="element-title">Confirm Password</div>
            <div class="element-input">
                <input v-model="loginPasswordConfirm" type="password" placeholder="Repeat password" />
            </div>
        </div>
        <div class="credentials-info">
            Private site for fun, play money only. By continuing you agree to the <button v-on:click="loginTermsButton()" class="button-terms">terms</button>.
        </div>
        <div class="credentials-buttons">
            <button v-on:click="$parent.modalSetTab(tab === 'login' ? 'register' : 'login')" class="button-toggle" v-bind:class="{ 'button-active': tab === 'register' }">
                <div class="button-inner">{{ tab === 'login' ? 'Create an Account' : 'I already have an account' }}</div>
            </button>
            <button v-on:click="loginActionButton()" class="button-action" v-bind:disabled="authSendLoginLoading === true">
                <div class="button-inner">{{ tab === 'login' ? 'Sign In' : 'Register' }}</div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'LoginCredentials',
        props: ['tab'],
        data() {
            return {
                loginUsername: null,
                loginEmail: null,
                loginPassword: null,
                loginPasswordConfirm: null
            }
        },
        methods: {
            ...mapActions([
                'modalsSetShow',
                'modalsSetData',
                'notificationShow',
                'authSendCredentialsLogin',
                'authSendCredentialsRegister'
            ]),
            loginActionButton() {
                if(this.loginEmail === null || this.loginEmail.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered email is invalid.' });
                    return;
                }

                if(this.loginPassword === null || this.loginPassword.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered password is invalid.' });
                    return;
                }

                if(this.tab === 'register') {
                    if(this.loginPassword !== this.loginPasswordConfirm) {
                        this.notificationShow({ type: 'error', message: 'Your entered passwords does not match.' });
                        return;
                    }
                    this.modalsSetData({ typeCaptcha: 'credentialsRegister', data: { username: this.loginUsername, email: this.loginEmail, password: this.loginPassword } });
                } else {
                    this.modalsSetData({ typeCaptcha: 'credentialsLogin', data: { username: this.loginUsername, email: this.loginEmail, password: this.loginPassword } });
                }

                setTimeout(() => { this.modalsSetShow('Captcha'); }, 200);
            },
            loginTermsButton() {
                this.modalsSetShow(null);
                setTimeout(() => { this.modalsSetShow('Terms'); }, 300);
            }
        },
        computed: {
            ...mapGetters([ 
                'authSendLoginLoading'
            ])
        }
    }
</script>

<style scoped>
    .login-credentials {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .login-credentials .credentials-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 35px;
    }

    .login-credentials .credentials-element:first-child {
        margin-top: 0;
    }

    .login-credentials .element-title {
        font-size: 14px;
        font-weight: 700;
        color: #b1bad3;
    }

    .login-credentials .element-input {
        width: 100%;
        height: 78px;
        position: relative;
        margin-top: 20px;
        padding: 1px;
        filter: none;
    }

    .login-credentials .element-input::before {
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

    .login-credentials .element-input input {
        width: 100%;
        height: 100%;
        padding: 0 177px 0 25px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #1a2c38;
        border-radius: 4px;
        isolation: isolate;
    }

    .login-credentials .element-input input::placeholder {
        color: #557086;
    }

    .login-credentials button.button-forgot {
        height: 46px;
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
        transition: all .2s;
    }
    .login-credentials button.button-forgot:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .login-credentials button.button-forgot:active {
        transition-duration: .2s;
        scale: .9;
    }

    .login-credentials button.button-forgot::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #2f4553;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .login-credentials button.button-forgot::after {
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

    .login-credentials button.button-forgot .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 15px;
        background: #2f4553;
        border-radius: 4px;
        isolation: isolate;
    }

    .login-credentials button.button-forgot .button-inner span {
        font-size: 13px;
        font-weight: 700;
        color: #b1bad3;
    }

    .login-credentials button.button-forgot .button-inner svg {
        width: 17px;
        height: 17px;
        display: none;
        fill: #b1bad3;
    }

    .login-credentials .credentials-info {
        width: 100%;
        margin-top: 35px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #557086;
    }

    .login-credentials .credentials-info button.button-terms {
        text-decoration: underline;
        font-size: 14px;
        font-weight: 700;
        color: #db7d48;
    }

    .login-credentials .credentials-buttons {
        display: flex;
        align-items: center;
        margin-top: 35px;
    }

    .login-credentials button.button-toggle {
        width: 200px;
        height: 54px;
        position: relative;
        margin-right: 20px;
        padding: 1px;
        filter: none;
        transition: filter 0.3s ease;
        z-index: 1;
        transition: all .2s;
    }
    .button-toggle:hover {
        transition-duration: .1s;
        transform: translateY(-1px);
        opacity: 0.8;
    }
    .button-toggle:active {
        transition-duration: .2s;
        transform: translateY(2px);
    }

    .login-credentials button.button-toggle.button-active {
        filter: none;
    }

    .login-credentials button.button-action {
        width: 180px;
        height: 54px;
        position: relative;
        filter: none;
        transition: all .2s;
    }

    .button-action:hover {
        transition-duration: .1s;
        transform: translateY(-1px);
        opacity: 0.8;
    }
    .button-action:active {
        transition-duration: .2s;
        transform: translateY(2px);
    }

    .login-credentials button.button-toggle::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #2f4553;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .login-credentials button.button-toggle.button-active::before {
        background: transparent;
    }

    .login-credentials button.button-toggle::after {
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

    .login-credentials button.button-toggle .button-inner,
    .login-credentials button.button-action .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 700;
        border-radius: 4px;
        isolation: isolate;
    }

    .login-credentials button.button-toggle .button-inner {
        color: #b1bad3;
        background-color: #2f4553;
    }

    .login-credentials button.button-toggle.button-active .button-inner {
        color: #00e701;
        background: #2f4553;
    }

    .login-credentials button.button-action .button-inner {
        color: #ffffff;
        background: #00e701;
    }

    @media only screen and (max-width: 430px) {

        .login-credentials .element-input input {
            padding: 0 62px 0 25px;
        isolation: isolate;
    }


        .login-credentials button.button-forgot .button-inner span {
            display: none;
        }

        .login-credentials button.button-forgot .button-inner svg {
            display: block;
        }

        .login-credentials .credentials-buttons {
            width: 100%;
            flex-direction: column;
        }

        .login-credentials button.button-toggle,
        .login-credentials button.button-action {
            width: 100%;
            transition: all;
            transition-duration: 0.2s;
        }

        .button-action:hover {
            opacity: 0.8;
        }
        .button-action:focus {
            scale: 0.95;
        }

        .login-credentials button.button-toggle {
            margin-bottom: 10px;
            margin-right: 0;
        }

    }
</style>