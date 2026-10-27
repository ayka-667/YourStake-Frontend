<template>
    <div class="modal-terms">
        <div class="terms-header">
            <span class="gradient-green">Terms of service</span>
            <p>Welcome to YourStake! By creating an account or using the website, you agree to the following terms. Please read them carefully.</p>
        </div>
        <div class="terms-list">

            <div class="list-element">
                <div class="element-title">1. About YourStake</div>
                <div class="element-text">
                    <p>YourStake is a free-to-play entertainment website. Every game is played with coins that are <strong>play money only</strong>: they have no real-world value and cannot be bought, sold, exchanged or withdrawn.</p>
                    <p>No deposit or payment of any kind is accepted, and no prize with monetary value is ever awarded.</p>
                </div>
            </div>
            <div class="list-element">
                <div class="element-title">2. Eligibility</div>
                <div class="element-text">
                    <p>The games on YourStake simulate casino games. You must be at least 18 years old, or the age of majority where you live, to create an account.</p>
                    <p>One account per person. Accounts created to abuse rewards, rain or bonus codes may be closed.</p>
                </div>
            </div>
            <div class="list-element">
                <div class="element-title">3. Your account</div>
                <div class="element-text">
                    <p>You are responsible for keeping your password safe. YourStake will never ask for the password of another website or service.</p>
                    <p>Your username must not be offensive or impersonate another person.</p>
                </div>
            </div>
            <div class="list-element">
                <div class="element-title">4. Fair play</div>
                <div class="element-text">
                    <p>Game outcomes are provably fair and can be verified with the Provably Fair tool at the bottom of the website.</p>
                    <p>Using exploits, scripts or automated tools, or creating multiple accounts, is not allowed. Please report any bug you find; we may correct or reset balances affected by a bug.</p>
                </div>
            </div>
            <div class="list-element">
                <div class="element-title">5. Community and simulated activity</div>
                <div class="element-text">
                    <p>Please follow the chat rules. Moderators may remove messages, mute or ban accounts that break them.</p>
                    <p>To keep the site lively, some of the players and chat activity you see may be simulated.</p>
                </div>
            </div>
            <div class="list-element">
                <div class="element-title">6. Service changes</div>
                <div class="element-text">
                    <p>YourStake is provided "as is", for entertainment. We may change, pause or reset games, balances, rewards or the website at any time.</p>
                    <p>These terms may be updated; continuing to use the website means you accept the latest version.</p>
                </div>
            </div>
            <div class="list-element">
                <div class="element-title">7. Contact</div>
                <div class="element-text">
                    <p>For any question about these terms, contact us at support@yourstake.fr.</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'ModalTerms'
    }
</script>

<style scoped>
    .modal-terms {
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

    .modal-terms .terms-header {
        width: 100%;
        padding-bottom: 30px;
        border-bottom: 1px solid #335361;
    }

    .modal-terms .terms-header span  {
        font-size: 32px;
        font-weight: 700;
    }

    .modal-terms .terms-header p  {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #b1bad3;
    }

    .modal-terms .terms-list {
        width: 100%;
        height: 600px;
        padding: 30px 20px 30px 0;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .modal-terms .terms-list::-webkit-scrollbar {
        width: 5px;
        height: 0;
    }

    .modal-terms .terms-list::-webkit-scrollbar-track {
        margin: 30px 0;
        background-color: #062234;
    }

    .modal-terms .terms-list::-webkit-scrollbar-thumb {
        background-color: #1e5164;
    }

    .modal-terms .list-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 25px;
    }

    .modal-terms .list-element:first-child {
        margin-top: 0;
    }

    .modal-terms .element-title {
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-terms .element-text {
        width: 100%;
        margin-top: 15px;
        padding-left: 30px;
    }

    .modal-terms .element-text p {
        margin-top: 15px;
        font-size: 14px;
        font-weight: 600;
        color: #b1bad3;
    }

    .modal-terms .element-text p:first-child {
        margin-top: 0;
    }

    .modal-terms .element-text ul {
        margin-top: 15px;
        padding-left: 50px;
    }

    @media only screen and (max-width: 1190px) {

        .modal-terms {
            width: calc(100vw - 20px);
        }

    }

    @media only screen and (max-width: 700px) {

        .modal-terms {
            padding: 80px 15px 0 15px;
        }

    }
</style>
