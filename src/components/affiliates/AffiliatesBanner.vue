<template>
    <div class="affiliates-banner">
        <div class="banner-text">
            <span class="banner-tag">Affiliates</span>
            <h2>Invite your friends, earn on every bet</h2>
            <p>Share your referral code. You receive 10% of every bet the players you invite make, win or lose, forever.</p>
        </div>
        <div class="banner-art" aria-hidden="true">
            <div class="art-node node-main"><UiIcon name="user" /></div>
            <div class="art-node node-a"><UiIcon name="user" /></div>
            <div class="art-node node-b"><UiIcon name="user" /></div>
            <div class="art-node node-c"><UiIcon name="user" /></div>
            <svg class="art-links" viewBox="0 0 200 160"><path d="M100 80 L36 34 M100 80 L170 46 M100 80 L150 140"/></svg>
        </div>
    </div>
</template>

<script>
    import UiIcon from '@/components/UiIcon';

    export default {
        name: 'AffiliatesBanner',
        components: {
            UiIcon
        }
    }
</script>

<style scoped>
    .affiliates-banner {
        min-height: 190px;
        position: relative;
        display: flex;
        align-items: center;
        padding: 30px 36px;
        border-radius: 12px;
        background: radial-gradient(80% 140% at 85% 50%, rgba(20, 117, 225, 0.35) 0%, rgba(20, 117, 225, 0) 65%), linear-gradient(120deg, #213743 0%, #1a2c38 100%);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        overflow: hidden;
    }

    .banner-text { max-width: 520px; position: relative; z-index: 1; }

    .banner-tag {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(20, 117, 225, 0.2);
        font-size: 12px;
        font-weight: 700;
        color: #7cc0ff;
    }

    .banner-text h2 {
        margin: 12px 0 8px 0;
        font-size: 28px;
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: -0.02em;
        color: #ffffff;
    }

    .banner-text p {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.55;
        color: #b1bad3;
    }

    .banner-art {
        width: 240px;
        height: 170px;
        position: absolute;
        right: 40px;
        top: 50%;
        transform: translateY(-50%);
    }

    .art-links {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }

    .art-links path {
        fill: none;
        stroke: #1475e1;
        stroke-width: 2;
        stroke-dasharray: 4 5;
        animation: dash 1.6s linear infinite;
    }

    .art-node {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #0f212e;
        color: #7cc0ff;
        box-shadow: 0 0 0 2px rgba(20, 117, 225, 0.5);
        z-index: 1;
    }

    .art-node .ui-icon { width: 55%; height: 55%; }
    .node-main { width: 64px; height: 64px; left: calc(50% - 32px); top: calc(50% - 32px); background: #1475e1; color: #ffffff; box-shadow: 0 0 30px rgba(20, 117, 225, 0.6); }
    .node-a { width: 40px; height: 40px; left: 8%; top: 4%; }
    .node-b { width: 40px; height: 40px; right: 0; top: 14%; }
    .node-c { width: 40px; height: 40px; right: 16%; bottom: 0; }

    @keyframes dash { to { stroke-dashoffset: -18; } }

    @media only screen and (max-width: 900px) {
        .banner-art { display: none; }
    }
</style>
