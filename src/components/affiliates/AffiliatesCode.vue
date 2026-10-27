<template>
    <div class="affiliates-code">
        <div class="code-icons">
            <IconShare />
            <IconShare />
        </div>
        <div class="code-inner">
            <div class="inner-info">
                <div class="info-text">
                    <span class="gradient-green">Copy and share your referral code</span>
                    <div class="text-link">
                        https://YourStake.fr/?a={{ affiliatesData.data !== null && affiliatesData.data.code !== undefined ? affiliatesData.data.code : '' }}
                        <button v-if="affiliatesData.data !== null && affiliatesData.data.code !== undefined" v-on:click="affiliatesCopyButton" class="button-copy">
                            <IconCopy />
                        </button>
                    </div>
                </div>
            </div>
            <div class="inner-input">
                <input v-model="affiliatesCode" type="text" placeholder="SET YOUR REFERRAL CODE" />
                <button v-on:click="affiliatesCodeButton" class="button-code" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">
                        <transition name="fade" mode="out-in">
                            <ButtonLoading v-if="socketSendLoading === 'AffiliatesCode'" key="loading" />
                            <div v-else class="inner-content" key="content">Set Code</div>
                        </transition>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconShare from '@/components/icons/IconShare';
    import IconCopy from '@/components/icons/IconCopy';
    import ButtonLoading from '@/components/ButtonLoading';

    export default {
        name: 'AffiliatesCode',
        components: {
            IconShare,
            IconCopy,
            ButtonLoading
        },
        data() {
           return {
               affiliatesCode: ''
           }
       },
       methods: {
            ...mapActions(['notificationShow', 'affiliatesSendCodeSocket']),
            affiliatesCopyButton() {
                const el = document.createElement('textarea');
                el.value = ' https://YourStake.fr/?a=' + (this.affiliatesData.data !== null && this.affiliatesData.data.code !== undefined ? this.affiliatesData.data.code : '');
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);

                this.notificationShow({ type: 'success', message: 'Copied to your clipboard.' });
            },
            affiliatesCodeButton() {
                if(this.affiliatesCode === null || this.affiliatesCode.trim() === '' || this.affiliatesCode.trim().length < 2) {
                    this.notificationShow({ type: 'error', message: 'Your entered affiliate code is invalid.' });
                    return;
                }

                const data = { code: this.affiliatesCode };
                this.affiliatesSendCodeSocket(data);
            }
        },
        computed: {
            ...mapGetters(['socketSendLoading', 'affiliatesData'])
        },
        watch: {
            'affiliatesData.data': {
                handler(data, oldData) {
                    if(this.affiliatesData.data !== null) {
                        this.affiliatesCode = this.affiliatesData.data.code !== undefined ? this.affiliatesData.data.code : '';
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
    .affiliates-code {
        width: 955px;
        height: 111px;
        position: relative;
        margin-top: 25px;
        padding: 1px;
    }

    .affiliates-code::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 15px;
        background: transparent;
        z-index: -1;
    }

    .affiliates-code::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 15px;
        background: #213743;
        z-index: -1;
    }

    .affiliates-code .code-icons {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 15px;
        overflow: hidden;
        z-index: 0;
    }

    .affiliates-code .code-icons svg:nth-child(1) {
        width: 144px;
        height: 153px;
        position: absolute;
        top: 50%;
        left: -30px;
        transform: translate(0, -50%);
        fill: rgba(22, 59, 87, 0.08);
    }

    .affiliates-code .code-icons svg:nth-child(2) {
        position: absolute;
        top: 50%;
        left: 35px;
        transform: translate(0, -50%);
        fill: url(#icon-share-gradient-1);
    }

    .affiliates-code .code-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 35px 0 121px;
        border-radius: 15px;
    }

    .affiliates-code .inner-info {
        display: flex;
        align-items: center;
    }

    .affiliates-code .info-text span {
        font-size: 14px;
        font-weight: 700;
    }

    .affiliates-code .text-link {
        height: 21px;
        display: flex;
        align-items: center;
        margin-top: 10px;
        font-size: 14px;
        font-weight: 400;
        color: #557086;
        z-index: 2;
    }

    .affiliates-code .text-link button.button-copy {
        margin-left: 12px;
        z-index: 1;
    }

    .affiliates-code .text-link button.button-copy svg {
        fill: #557086;
        transition: fill 0.3s ease;
    }

    .affiliates-code .text-link button.button-copy:hover svg {
        fill: #ffffff;
    }

    .affiliates-code .inner-input {
        width: 380px;
        height: 61px;
        position: relative;
        padding: 1px;
    }

    .affiliates-code .inner-input::before {
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

    .affiliates-code .inner-input input {
        width: 100%;
        height: 100%;
        padding: 0 83px 0 15px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background-color: #1a2c38;
        border-radius: 4px;
        isolation: isolate;
    }

    .affiliates-code .inner-input input::placeholder {
        font-size: 11px;
        color: #557086;
    }

    .affiliates-code .inner-input button.button-code {
        width: 77px;
        height: 33px;
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
        filter: none;
        transition: all .2s;
    }
    .affiliates-code .inner-input button.button-code:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .affiliates-code .inner-input button.button-code:active {
        transition-duration: .2s;
        scale: .9;
    }


    .affiliates-code .inner-input button.button-code:disabled {
        cursor: not-allowed;
    }

    .affiliates-code .inner-input button.button-code .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #00e701;
        border-radius: 4px;
        isolation: isolate;
    }

    .affiliates-code .inner-input button.button-code .button-loading.fade-leave-active {
        transition: opacity 0.5s;
    }

    .affiliates-code .inner-input button.button-code .button-loading.fade-leave-to {
        opacity: 0;
    }

    .affiliates-code .inner-input button.button-code .inner-content {
        font-size: 12px;
        font-weight: 700;
        color: #ffffff;
    }

    .affiliates-code .inner-input button.button-code .inner-content.fade-enter-active {
        transition: opacity 0.5s;
    }

    .affiliates-code .inner-input button.button-code .inner-content.fade-enter-from {
        opacity: 0;
    }

    @media only screen and (max-width: 975px) {

        .affiliates-code {
            width: 100%;
        }

    }

    @media only screen and (max-width: 925px) {

        .affiliates-code {
            height: auto;
        }

        .affiliates-code .code-inner {
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 15px 10px 121px;
        }

        .affiliates-code .inner-input {
            width: 100%;
            margin-top: 20px;
        }

    }

    @media only screen and (max-width: 500px) {

        .affiliates-code .code-icons svg:nth-child(2) {
            display: none;
        }

        .affiliates-code .code-inner {
            padding: 10px 20px;
        }

    }
</style>
