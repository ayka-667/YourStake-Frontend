<template>
    <div class="modal-faq">
        <div class="faq-header">
            <span class="gradient-green">Questions and answers</span>
            <p>Answers to the most common questions. Can't find yours? Contact support@yourstake.fr.</p>
        </div>
        <div class="faq-list">

            <FaqElement title="What is YourStake?" text="YourStake is a free casino-style gaming website: Crash, Roulette, Blackjack, Dice Duels, Mines, Towers and more, all played with play money." />
            <FaqElement title="Are the coins real money?" text="No. Coins are play money with no real-world value. They cannot be bought, sold or withdrawn." />
            <FaqElement title="How do I get coins?" text="Claim your rewards, join the chat rain, or redeem a bonus code in your Wallet." />
            <FaqElement title="Can I withdraw my winnings?" text="No. Since coins have no value, there is nothing to withdraw: winnings only count for fun, levels and leaderboards." />
            <FaqElement title="How do I know the games are fair?" text="Every game is provably fair. You can verify any result with the Provably Fair tool at the bottom of the website." />
            <FaqElement title="What happens if I disconnect during a Crash round?" text="Your auto cashout still works on the server, even if you are offline. Use it if your connection is unstable." />
            <FaqElement title="Is there a maximum bet?" text="Yes, each game has a minimum and maximum bet, shown inside the game." />
            <FaqElement title="How does the leaderboard work?" text="The weekly race ranks players by how much they wager during the week. The top 10 share the prize pool when the timer ends." />
            <FaqElement title="Can I send coins to another player?" text="Yes, click on a player in the chat and use the Tip button." />
            <FaqElement title="How do referrals work?" text="Share your referral code from the Affiliates page. You earn 0.5% of every bet placed by the players you referred." />
            <FaqElement title="I found a bug, what should I do?" text="Please report it to support@yourstake.fr. Abusing a bug instead of reporting it may lead to a ban." />

        </div>
    </div>
</template>

<script>
    import FaqElement from '@/components/faq/FaqElement';

    export default {
        name: 'ModalFaq',
        components: {
            FaqElement
        }
    }
</script>

<style scoped>
    .modal-faq {
        width: 100%;
        max-width: 1000px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px 30px 0 30px;
        border-radius: 15px;
        background: #2f4553;
    }

    .modal-faq .faq-header {
        width: 100%;
        padding-bottom: 30px;
        border-bottom: 1px solid #335361;
    }

    .modal-faq .faq-header span  {
        font-size: 32px;
        font-weight: 700;
    }

    .modal-faq .faq-header p  {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #b1bad3;
    }

    .modal-faq .faq-list {
        width: 100%;
        height: 600px;
        padding: 30px 10px 30px 0;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .modal-faq .faq-list::-webkit-scrollbar {
        width: 5px;
        height: 0;
    }

    .modal-faq .faq-list::-webkit-scrollbar-track {
        margin: 30px 0;
        background-color: #062234;
    }

    .modal-faq .faq-list::-webkit-scrollbar-thumb {
        background-color: #1e5164;
    }

    @media only screen and (max-width: 1190px) {

        .modal-faq {
            width: calc(100vw - 20px);
        }

    }

    @media only screen and (max-width: 700px) {

        .modal-faq {
            padding: 80px 15px 0 15px;
        }

    }
</style>
