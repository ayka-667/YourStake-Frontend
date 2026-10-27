<template>
    <div class="modal-link">
        <div class="link-title">
            <span class="gradient-green">Link email</span>
        </div>
        <div class="link-element">
            <div class="element-title">Email</div>
            <div class="element-content">
                <input v-model="modalEmail" type="text" placeholder="ENTER EMAIL..." />
            </div>
        </div>
        <div class="link-element">
            <div class="element-title">Password</div>
            <div class="element-content">
                <input v-model="modalPassword" type="password" placeholder="Password" />
            </div>
        </div>
        <div class="link-element">
            <div class="element-title">Repeat Password</div>
            <div class="element-content">
                <input v-model="modalPasswordConfirm" type="password" placeholder="Password" />
            </div>
        </div>
        <button v-on:click="modalLinkButton()" class="button-link" v-bind:disabled="authSendLoginLoading">
            <div class="button-inner">Link email</div>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'ModalLink',
        data() {
            return {
                modalEmail: null,
                modalPassword: null,
                modalPasswordConfirm: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow',
                'modalsSetData',
                'authSendCredentialsLink'
            ]),
            modalLinkButton() {
                if(this.modalEmail === null || this.modalEmail.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered email is invalid.' });
                    return;
                }

                if(this.modalPassword === null || this.modalPassword.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered password is invalid.' });
                    return;
                }

                if(this.modalPassword !== this.modalPasswordConfirm) {
                    this.notificationShow({ type: 'error', message: 'Your entered passwords does not match.' });
                    return;
                }

                const data = { email: this.modalEmail, password: this.modalPassword };
                this.authSendCredentialsLink(data);
            }
        },
        computed: {
            ...mapGetters([
                'authSendLoginLoading', 
                'modalsData'
            ])

        }
    }
</script>

<style scoped>
    .modal-link {
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

    .modal-link .link-title {
        text-align: center;
        font-size: 32px;
        font-weight: 700;
    }

    .modal-link .link-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 35px;
    }

    .modal-link .element-title {
        font-size: 14px;
        font-weight: 700;
        color: #b1bad3;
    }

    .modal-link .element-content {
        width: 100%;
        height: 72px;
        position: relative;
        margin-top: 20px;
        padding: 1px;
    }

    .modal-link .element-content::before {
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

    .modal-link .element-content input {
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

    .modal-link .element-content input::placeholder {
        color: #557086;
    }

    .modal-link button.button-link {
        width: 300px;
        height: 54px;
        margin-top: 35px;
    }

    .modal-link button.button-link .button-inner {
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

        .modal-link {
            width: calc(100vw - 20px);
            padding: 35px 10px 48px 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .modal-link {
            padding: 55px 10px 48px 10px;
        }

        .modal-link button.button-reset {
            width: 100%;
        }

    }
</style>