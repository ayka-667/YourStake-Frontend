// Google Ad Manager rewarded ads for web (GPT out-of-page REWARDED slot).
// https://developers.google.com/publisher-tag/samples/display-rewarded-ad

// Google's public demo unit, used in development when no unit is configured.
const DEMO_UNIT = '/22639388115/rewarded_web_example';
const READY_TIMEOUT = 15000;

export const rewardedAdUnit = () => {
    if(process.env.VUE_APP_GAM_REWARDED_UNIT) { return process.env.VUE_APP_GAM_REWARDED_UNIT; }
    return process.env.NODE_ENV === 'development' ? DEMO_UNIT : null;
};

let gptPromise = null;

const loadGpt = () => {
    if(gptPromise !== null) { return gptPromise; }

    gptPromise = new Promise((resolve, reject) => {
        window.googletag = window.googletag || { cmd: [] };
        const script = document.createElement('script');
        script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.onload = () => resolve(window.googletag);
        script.onerror = () => {
            // Usually an ad blocker; allow a retry after it is turned off
            gptPromise = null;
            reject(new Error('blocked'));
        };
        document.head.appendChild(script);
    });

    return gptPromise;
};

// Shows one rewarded ad. Resolves with:
// 'granted' (watched, reward earned), 'closed' (closed early), 'nofill' (no ad available),
// 'unsupported' (page or browser not eligible) or 'blocked' (GPT could not load).
export const showRewardedAd = (unit) => new Promise((resolve) => {
    loadGpt().then((googletag) => {
        googletag.cmd.push(() => {
            const slot = googletag.defineOutOfPageSlot(unit, googletag.enums.OutOfPageFormat.REWARDED);
            if(slot === null) { resolve('unsupported'); return; }

            const pubads = googletag.pubads();
            slot.addService(pubads);

            let granted = false;
            let done = false;
            let timer = null;

            const finish = (result) => {
                if(done === true) { return; }
                done = true;
                clearTimeout(timer);
                pubads.removeEventListener('rewardedSlotReady', onReady);
                pubads.removeEventListener('rewardedSlotGranted', onGranted);
                pubads.removeEventListener('rewardedSlotClosed', onClosed);
                pubads.removeEventListener('slotRenderEnded', onRender);
                googletag.destroySlots([slot]);
                resolve(result);
            };

            const onReady = (event) => {
                if(event.slot !== slot) { return; }
                clearTimeout(timer);
                event.makeRewardedVisible();
            };
            const onGranted = (event) => { if(event.slot === slot) { granted = true; } };
            const onClosed = (event) => { if(event.slot === slot) { finish(granted === true ? 'granted' : 'closed'); } };
            const onRender = (event) => { if(event.slot === slot && event.isEmpty === true) { finish('nofill'); } };

            pubads.addEventListener('rewardedSlotReady', onReady);
            pubads.addEventListener('rewardedSlotGranted', onGranted);
            pubads.addEventListener('rewardedSlotClosed', onClosed);
            pubads.addEventListener('slotRenderEnded', onRender);

            timer = setTimeout(() => finish('nofill'), READY_TIMEOUT);

            googletag.enableServices();
            googletag.display(slot);
        });
    }).catch(() => resolve('blocked'));
});
