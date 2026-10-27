<template>
    <div class="modal-reset">
        <div class="reset-title">
            <span class="gradient-green">Reset Password</span>
        </div>
        <div class="reset-element">
            <div class="element-title">New password</div>
            <div class="element-content">
                <input v-model="modalPassword" type="password" placeholder="Password" />
            </div>
        </div>
        <div class="reset-element">
            <div class="element-title">Repeat Password</div>
            <div class="element-content">
                <input v-model="modalPasswordConfirm" type="password" placeholder="Password" />
            </div>
        </div>
        <button v-on:click="modalResetButton()" class="button-reset">
            <div class="button-inner">Set new password</div>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'ModalReset',
        data() {
            return {
                modalPassword: null,
                modalPasswordConfirm: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow',
                'modalsSetData'
            ]),
            modalResetButton() {
                if(this.modalPassword === null || this.modalPassword.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered password is invalid.' });
                    return;
                }

                if(this.modalPassword !== this.modalPasswordConfirm) {
                    this.notificationShow({ type: 'error', message: 'Your entered passwords does not match.' });
                    return;
                }

                this.modalsSetData({ typeCaptcha: 'credentialsReset', data: { ...this.modalsData, password: this.modalPassword } });
                this.modalsSetShow(null);

                setTimeout(() => { this.modalsSetShow('Captcha'); }, 200);
            }
        },
        computed: {
            ...mapGetters([ 
                'modalsData'
            ])

        }
    }
</script>

<style scoped>
    .modal-reset {
        width: 773px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 80px 48px 80px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% 0%, rgba(0, 231, 1, 0.2) 0%, rgba(7, 38, 61, 0) 80%), 
                    #213743;
    }

    .modal-reset .reset-title {
        text-align: center;
        font-size: 32px;
        font-weight: 700;
    }

    .modal-reset .reset-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 35px;
    }

    .modal-reset .element-title {
        font-size: 14px;
        font-weight: 700;
        color: #b1bad3;
    }

    .modal-reset .element-content {
        width: 100%;
        height: 72px;
        position: relative;
        margin-top: 20px;
        padding: 1px;
    }

    .modal-reset .element-content::before {
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

    .modal-reset .element-content input {
        width: 100%;
        height: 100%;
        padding: 0 15px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #1a2c38;
        border-radius: 4px;
        isolation: isolate;
    }

    .modal-reset .element-content input::placeholder {
        color: #557086;
    }

    .modal-reset button.button-reset {
        width: 300px;
        height: 54px;
        margin-top: 35px;
    }

    .modal-reset button.button-reset .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        background: #00e701;
        border-radius: 4px;
        isolation: isolate;
    }

    @media only screen and (max-width: 793px) {

        .modal-reset {
            width: calc(100vw - 20px);
            padding: 35px 10px 48px 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .modal-reset {
            padding: 55px 10px 48px 10px;
        }

        .modal-reset button.button-reset {
            width: 100%;
        }

    }
</style>