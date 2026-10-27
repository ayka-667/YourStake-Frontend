<template>
    <div class="modal-privacy">
        <div class="privacy-header">
            <span class="gradient-green">PRIVACY POLICY</span>
            <p>This policy explains what information YourStake collects, why, and what you can do about it.</p>
        </div>
        <div class="privacy-list">

            <div class="list-element">
                <div class="element-title">1. Information we collect</div>
                <div class="element-text">
                    <p>When you create an account we store your username, email address and a hashed version of your password (never the password itself).</p>
                    <p>When you play we store your game history, balance changes, chat messages and the IP addresses used to connect, to run the games and prevent abuse.</p>
                </div>
            </div>
            <div class="list-element">
                <div class="element-title">2. How we use it</div>
                <div class="element-text">
                    <p>Your information is used only to operate YourStake: signing you in, running games, showing leaderboards and protecting the site against cheating and spam.</p>
                    <p>We do not sell or rent your information, and we do not send marketing emails.</p>
                </div>
            </div>
            <div class="list-element">
                <div class="element-title">3. Cookies and local storage</div>
                <div class="element-text">
                    <p>Your browser keeps a sign-in token and a few display preferences (such as sound volume). No advertising trackers are used.</p>
                    <p>Sign-up and some actions are protected by hCaptcha, which processes data according to its own privacy policy.</p>
                </div>
            </div>
            <div class="list-element">
                <div class="element-title">4. Public information</div>
                <div class="element-text">
                    <p>Your username, avatar, level and bets can be visible to other players in games, leaderboards and the chat. You can hide your statistics with Anonymous mode in your profile settings.</p>
                </div>
            </div>
            <div class="list-element">
                <div class="element-title">5. Your rights</div>
                <div class="element-text">
                    <p>You can ask us to access, correct or delete your account and its data at any time by writing to support@yourstake.fr.</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'ModalPrivacy'
    }
</script>

<style scoped>
    .modal-privacy {
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

    .modal-privacy .privacy-header {
        width: 100%;
        padding-bottom: 30px;
        border-bottom: 1px solid #335361;
    }

    .modal-privacy .privacy-header span  {
        font-size: 32px;
        font-weight: 700;
    }

    .modal-privacy .privacy-header p  {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #b1bad3;
    }

    .modal-privacy .privacy-list {
        width: 100%;
        height: 600px;
        padding: 30px 20px 30px 0;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .modal-privacy .privacy-list::-webkit-scrollbar {
        width: 5px;
        height: 0;
    }

    .modal-privacy .privacy-list::-webkit-scrollbar-track {
        margin: 30px 0;
        background-color: #062234;
    }

    .modal-privacy .privacy-list::-webkit-scrollbar-thumb {
        background-color: #1e5164;
    }

    .modal-privacy .list-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 25px;
    }

    .modal-privacy .list-element:first-child {
        margin-top: 0;
    }

    .modal-privacy .element-title {
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-privacy .element-text {
        width: 100%;
        margin-top: 15px;
        padding-left: 30px;
    }

    .modal-privacy .element-text p {
        margin-top: 15px;
        font-size: 14px;
        font-weight: 600;
        color: #b1bad3;
    }

    .modal-privacy .element-text p:first-child {
        margin-top: 0;
    }

    .modal-privacy .element-text ul {
        margin-top: 15px;
        padding-left: 50px;
    }

    @media only screen and (max-width: 1190px) {

        .modal-privacy {
            width: calc(100vw - 20px);
        }

    }

    @media only screen and (max-width: 700px) {

        .modal-privacy {
            padding: 80px 15px 0 15px;
        }

    }
</style>
