<template>
    <div class="rewards-code">
        <div class="card-icon"><UiIcon name="gift" /></div>
        <h3>Redeem a code</h3>
        <p>Got an affiliate code from a friend? Redeem it to receive free coins.</p>
        <div class="code-field">
            <input v-model="rewardsCode" v-on:keyup.enter="rewardsClaimButton()" type="text" placeholder="Enter a code" />
            <button v-on:click="rewardsClaimButton()" class="button-claim">Redeem</button>
        </div>
        <div class="code-hint">Codes are shared in the chat and on our socials.</div>
    </div>
</template>

<script>
    import UiIcon from '@/components/UiIcon';
    import { mapActions } from 'vuex';

    export default {
        name: 'RewardsCode',
        components: {
            UiIcon
        },
        data() {
            return {
                rewardsCode: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'modalsSetShow', 
                'modalsSetData'
            ]),
            rewardsClaimButton() {
                if(this.rewardsCode === null || this.rewardsCode.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered code is invalid.' });
                    return;
                }

                this.modalsSetData({ typeCaptcha: 'affiliatesClaim', data: { code: this.rewardsCode } });
                this.modalsSetShow('Captcha');
            }
        }
    }
</script>

<style scoped>
    .rewards-code {
        flex: 1 1 0;
        min-width: 300px;
        position: relative;
        padding: 26px 28px;
        border-radius: 12px;
        background: radial-gradient(90% 120% at 100% 0%, rgba(0, 231, 1, 0.12) 0%, rgba(0, 0, 0, 0) 60%), #213743;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        overflow: hidden;
    }

    .rewards-code .card-icon {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        border-radius: 10px;
        background: rgba(0, 231, 1, 0.12);
        color: #00e701;
    }

    .rewards-code .card-icon .ui-icon { width: 22px; height: 22px; }

    .rewards-code h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 20px;
        font-weight: 700;
        color: #ffffff;
    }

    .rewards-code p {
        margin: 8px 0 20px 0;
        max-width: 420px;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.55;
        color: #b1bad3;
    }

    .rewards-code p span { color: #ffffff; font-weight: 700; }

    .rewards-code .code-field {
        display: flex;
        max-width: 420px;
        border-radius: 6px;
        border: 2px solid #2f4553;
        background: #0f212e;
        overflow: hidden;
        transition: border-color .2s ease;
    }

    .rewards-code .code-field:focus-within { border-color: #557086; }

    .rewards-code input {
        flex: 1;
        min-width: 0;
        height: 44px;
        padding: 0 14px;
        background: transparent;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .rewards-code input::placeholder { color: #557086; }

    .rewards-code button.button-claim {
        padding: 0 22px;
        background: #00e701;
        font-size: 14px;
        font-weight: 700;
        color: #05080a;
        transition: filter .15s ease;
    }

    .rewards-code button.button-claim:hover { filter: brightness(1.1); }

    .rewards-code .code-hint {
        margin-top: 10px;
        font-size: 12px;
        font-weight: 500;
        color: #557086;
    }
</style>