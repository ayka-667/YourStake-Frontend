<template>
    <div class="modal-remove">
        <div class="remove-title">
            <span class="gradient-green">Remove message</span>
        </div>
        <div class="remove-message">
            <div class="message-inner">{{modalsData.message.message}}</div>
        </div>
        <button v-on:click="modalRemoveButton()" class="button-remove" v-bind:disabled="socketSendLoading === 'ChatRemove'">
            <div class="button-inner">Remove message</div>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';
    import BoxLevel from '@/components/BoxLevel';
    import BoxRank from '@/components/BoxRank';
    import ButtonLoading from '@/components/ButtonLoading';

    export default {
        name: 'ModalRemove',
        components: {
            AvatarImage,
            BoxLevel,
            BoxRank,
            ButtonLoading
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'chatSendRemoveSocket'
            ]),
            modalRemoveButton() {
                const data = { messageId: this.modalsData.message._id };
                this.chatSendRemoveSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'modalsData'
            ])
        }
    }
</script>

<style scoped>
    .modal-remove {
        width: 773px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 0 48px 0;
        border-radius: 15px;
        background: #2f4553;
    }

    .modal-remove .remove-title {
        text-align: center;
        font-size: 32px;
        font-weight: 700;
    }

    .modal-remove .remove-message {
        width: 448px;
        position: relative;
        margin-top: 35px;
        padding: 1px;
    }

    .modal-remove .remove-message::before {
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

    .modal-remove .message-inner {
        width: 100%;
        padding: 24px 20px 24px 20px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #1a2c38;
        border-radius: 4px;
        isolation: isolate;
    }

    .modal-remove button.button-remove {
        width: 170px;
        height: 48px;
        margin-top: 20px;
        filter: none;
    }

    .modal-remove button.button-remove .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        background: #00e701;
        border-radius: 4px;
        isolation: isolate;
    }

    @media only screen and (max-width: 793px) {

        .modal-remove {
            width: calc(100vw - 20px);
        }

    }
</style>