<template>
    <div class="app-maintenance">
        <img src="@/assets/img/new-loader.png" class="maintenance-logo" />
        <div class="maintenance-text">
            <span class="gradient-green">Under Maintenance</span>
            Oops! We’re currently under maintenance and are working towards getting you back as soon as possible.
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AppMaintenance'
    }
</script>

<style scoped>
    .app-maintenance {
        width: 100%;
        padding: 75px 250px 25px 175px;
        /* font-family: 'Rubik'; */
    }

    .app-maintenance img {
        width: 320px;
        max-width: 80vw;
    }

    .app-maintenance .maintenance-text {
        width: 750px;
        display: flex;
        flex-direction: column;
        margin-top: 90px;
        font-size: 18px;
        font-weight: 300;
        color: #b1bad3;
    }

    .app-maintenance .maintenance-text span {
        margin-bottom: 25px;
        font-size: 64px;
        font-weight: 700;
    }

    .app-maintenance .maintenance-socials {
        width: 750px;
        display: flex;
        align-items: center;
        margin-top: 30px;
        padding-top: 30px;
        border-top: 1px solid rgba(47, 69, 83, 0.5);
    }

    .app-maintenance .maintenance-socials a {
        width: 52px;
        height: 37px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 15px;
        background-color: #133552;
        border-radius: 4px;
        isolation: isolate;
    }

    .app-maintenance .maintenance-socials a:last-of-type {
        margin-right: 0;
    }

    .app-maintenance .maintenance-socials a svg {
        fill: #2e71a8;
        transition: fill 0.3s ease;
    }

    .app-maintenance .maintenance-socials a:hover svg {
        fill: #ffffff;
    }

    .app-maintenance .maintenance-bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 50px;
    }

    .app-maintenance .maintenance-bottom img:nth-child(1) {
        width: 550px;
    }

    .app-maintenance .maintenance-bottom img:nth-child(2) {
        width: 390px;
    }

    @media only screen and (max-width: 1600px) {

        .app-maintenance {
            width: 100%;
            padding: 75px 100px 25px 100px;
            /* font-family: 'Rubik'; */
        }

    }

    @media only screen and (max-width: 1400px) {

        .app-maintenance .maintenance-bottom img:nth-child(2) {
            display: none;
        }

    }

    @media only screen and (max-width: 950px) {

        .app-maintenance {
            padding: 75px 50px 25px 50px;
        }

        .app-maintenance .maintenance-text {
            width: 100%;
        }

        .app-maintenance .maintenance-text span {
            font-size: 50px;
        }

        .app-maintenance .maintenance-socials {
            width: 100%;
        }

        .app-maintenance .maintenance-bottom img:nth-child(1) {
            width: 400px;
        }

    }

    @media only screen and (max-width: 700px) {

        .app-maintenance {
            padding: 50px 50px 25px 50px;
        }

        .app-maintenance .maintenance-text {
            font-size: 16px;
        }

        .app-maintenance .maintenance-text span {
            font-size: 38px;
        }

    }

    @media only screen and (max-width: 550px) {

        .app-maintenance {
            padding: 50px 25px 25px 25px;
        }

        .app-maintenance img {
            width: 180px;
        }

        .app-maintenance .maintenance-text {
            font-size: 15px;
        }

        .app-maintenance .maintenance-text span {
            font-size: 34px;
        }

        .app-maintenance .maintenance-bottom img:nth-child(1) {
            width: 100%;
        }

    }

    @media only screen and (max-width: 450px) {

        .app-maintenance img {
            width: 150px;
        }

        .app-maintenance .maintenance-text {
            font-size: 13px;
        }

        .app-maintenance .maintenance-text span {
            margin-bottom: 15px;
            font-size: 28px;
        }

    }
</style>
