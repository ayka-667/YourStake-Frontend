<template>
    <div class="affiliates-code">
        <div class="code-block">
            <div class="block-label">Your referral link</div>
            <div class="block-link">
                <span class="link-text">https://yourstake.fr/?a={{ affiliatesData.data !== null && affiliatesData.data.code !== undefined ? affiliatesData.data.code : '' }}</span>
                <button v-if="affiliatesData.data !== null && affiliatesData.data.code !== undefined" v-on:click="affiliatesCopyButton" class="button-copy" title="Copy link">
                    <IconCopy />
                </button>
            </div>
        </div>
        <div class="code-block">
            <div class="block-label">Referral code</div>
            <div class="block-input">
                <input v-model="affiliatesCode" v-on:keyup.enter="affiliatesCodeButton" type="text" placeholder="Choose a code" />
                <button v-on:click="affiliatesCodeButton" class="button-code" v-bind:disabled="socketSendLoading !== null">
                    <transition name="fade" mode="out-in">
                        <ButtonLoading v-if="socketSendLoading === 'AffiliatesCode'" key="loading" />
                        <span v-else key="content">Save</span>
                    </transition>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconCopy from '@/components/icons/IconCopy';
    import ButtonLoading from '@/components/ButtonLoading';

    export default {
        name: 'AffiliatesCode',
        components: {
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
                el.value = 'https://yourstake.fr/?a=' + (this.affiliatesData.data !== null && this.affiliatesData.data.code !== undefined ? this.affiliatesData.data.code : '');
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
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 20px;
        padding: 22px 24px;
        border-radius: 12px;
        background: #213743;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    .affiliates-code .block-label {
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
    }

    .affiliates-code .block-link,
    .affiliates-code .block-input {
        height: 44px;
        display: flex;
        align-items: center;
        border-radius: 6px;
        border: 2px solid #2f4553;
        background: #0f212e;
        overflow: hidden;
        transition: border-color .2s ease;
    }

    .affiliates-code .block-input:focus-within { border-color: #557086; }

    .affiliates-code .link-text {
        flex: 1;
        min-width: 0;
        padding: 0 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .affiliates-code button.button-copy {
        width: 44px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #2f4553;
        color: #b1bad3;
        transition: background .15s ease, color .15s ease;
    }

    .affiliates-code button.button-copy:hover { background: #3d5564; color: #ffffff; }
    .affiliates-code button.button-copy svg { width: 16px; height: 16px; fill: currentColor; }

    .affiliates-code input {
        flex: 1;
        min-width: 0;
        height: 100%;
        padding: 0 14px;
        background: transparent;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .affiliates-code input::placeholder { color: #557086; }

    .affiliates-code button.button-code {
        height: 100%;
        padding: 0 22px;
        background: #1475e1;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        transition: filter .15s ease;
    }

    .affiliates-code button.button-code:hover:not(:disabled) { filter: brightness(1.1); }
    .affiliates-code button.button-code:disabled { opacity: .6; }

    @media only screen and (max-width: 800px) {
        .affiliates-code { grid-template-columns: 1fr; padding: 18px; }
    }
</style>
