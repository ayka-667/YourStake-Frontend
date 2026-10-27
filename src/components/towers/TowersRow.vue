<template>
    <div class="towers-row" v-bind:class="{
        'row-active': towersGame !== null && towersGame.state !== 'completed' && towersGame.revealed.length === row,
        'row-revealed': towersGame !== null && towersGame.revealed[row] !== undefined
    }">
        <div v-for="tile in towersGetTilesCount" v-bind:key="tile" class="row-tile">
            <transition name="fade" mode="out-in">
                <div v-if="towersGame !== null && towersGame.revealed[row] !== undefined && towersGame.revealed[row].tile === (tile - 1) && towersGame.revealed[row].row[tile - 1] === 'coin'" class="tile-coin">
                    <div class="coin-inner">
                        <div class="inner-value">
                        </div>
                        <img class="tile-mine" src="@/assets/img/mines/bomb.svg" />
                    </div>
                </div>
                <div v-else-if="
                        towersGame !== null && 
                        (
                            (towersGame.revealed[row] !== undefined && towersGame.revealed[row].tile === (tile - 1) && towersGame.revealed[row].row[tile - 1] === 'lose') ||
                            (towersGame.state === 'completed' && towersGame.revealed.length <= row && towersGame.deck[row][tile - 1] === 'lose')
                            
                        )" class="coin-inners">
                    <img class="tile-mine" src="@/assets/img/mines/bomb.svg" />
                </div>
                <button 
                    v-else 
                    v-on:click="towersRevealButton(tile - 1)" 
                    class="button-reveal" 
                    v-bind:disabled="socketSendLoading !== null || towersGame === null || towersGame.state === 'completed' || towersGame.revealed.length !== row"
                >
                    <div class="button-inner">
                        <div class="inner-value">
                            <span>{{ towersFormatValue(towersGetRowCashout).split('.')[0] }}</span>.{{ towersFormatValue(towersGetRowCashout).split('.')[1] }}
                        </div>
                    </div>
                </button>
            </transition>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconSkull from '@/components/icons/IconSkull';

    export default {
        name: 'TowersRow',
        components: {
            IconSkull
        },
        props: [
            'row'
        ],
        methods: {
            ...mapActions([
                'towersSendRevealSocket'
            ]),
            towersFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            towersRevealButton(tile) {
                const data = { tile: tile };
                this.towersSendRevealSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'towersRisk',
                'towersGame'
            ]),
            towersGetTilesCount() {
                let count = 3;

                if((this.towersGame !== null && this.towersGame.state !== 'completed' ? this.towersGame.risk : this.towersRisk) === 'medium') {
                    return 2;
                }

                return count;
            },
            towersGetRowCashout() {
                const multiplierPerRow = this.towersRisk === 'easy' ? 1.425 : this.towersRisk === 'medium' ? 1.90 : 2.85;
                const amount = this.towersGame !== null ? this.towersGame.amount : 0;

                return Math.floor(amount * Math.pow(multiplierPerRow, this.row + 1));
            }
        }
    }
</script>

<style scoped>
    .towers-row {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
        margin-top: 18px;
        padding: 0 30px;
    }

    .towers-row:last-child {
        margin-top: 0;
    }

    .towers-row.row-active::before,
    .towers-row.row-active::after {
        content: '';
        width: 3px;
        height: 45px;
        position: absolute;
        top: 0;
        border-radius: 3px;
        background: linear-gradient(255deg, #00e701 -20%, #1fff20 100%);
    }

    .towers-row.row-active::before {
        left: 0;
    }

    .towers-row.row-active::after {
        right: 0;
        
    }

    .towers-row .row-tile {
        width: calc(33.33% - 12px);
        height: 45px;
    }

    .container-game.game-medium .towers-row .row-tile {
        width: calc(50% - 8px);
    }

    .towers-row  .tile-coin,
    .towers-row  .tile-lose {
        width: 100%;
        height: 100%;
        position: relative;
        padding: 1px;
        z-index: 1;
        
    }

    .towers-row.row-active  .tile-coin,
    .towers-row.row-active  .tile-lose {
        opacity: 1;
    }

    .towers-row  .tile-coin::before,
    .towers-row  .tile-lose::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .towers-row  .tile-coin::before {
        background: transparent;
    }

    .towers-row  .tile-lose::before {
        background: transparent;
    }

    .towers-row  .tile-coin::after,
    .towers-row  .tile-lose::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #031421;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .towers-row .coin-inner,
    .towers-row .coin-inners,

    .towers-row .lose-inner {
        width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    overflow: hidden;
    position: relative;  
    
   }

    .towers-row .coin-inner {
        width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    overflow: hidden;
    position: relative;  
    }
    .towers-row .coin-inners {
        width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    overflow: hidden;
    position: relative;  
    }


    .towers-row .coin-inner {
        width: 146px;
height: 47px;

background: #15753A;
border-bottom: 5px solid #17472B;
border-radius: 10px;

    }
    .towers-row .coin-inners {
        width: 146px;
height: 47px;

background: linear-gradient(0deg, #AD1239, #AD1239),
linear-gradient(0deg, #AD1239, #AD1239);
border-radius: 10px;
    }

    .towers-row .lose-inner {
        width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    overflow: hidden;
    position: relative;  


    }

    .towers-row .lose-inner {
        width: 146px;
height: 47px;

background: linear-gradient(0deg, #AD1239, #AD1239),
linear-gradient(0deg, #AD1239, #AD1239);
border-radius: 10px;
    }

    .towers-row button.button-reveal {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        border-bottom: 5px solid #0A2B4B;
        background: #1a2c38;
                transition: transform 0.3s;

    }

    .towers-row.row-active button.button-reveal {
        transition: transform 0.3s ease;
    }

    .towers-row.row-active button.button-reveal:hover {
        transform: scale(1.05);
    }

    .towers-row button.button-reveal .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        isolation: isolate;
    }

    .towers-row.row-active button.button-reveal .button-inner,
    .towers-row.row-revealed button.button-reveal .button-inner {
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), 
                    radial-gradient(160% 160% at 50% 30%, rgba(0, 194, 255, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    #213743;
                    
    }

    .towers-row.row-revealed button.button-reveal .button-inner {
        opacity: 0.25;
        
    }

    .towers-row button.button-reveal .button-inner img,
    .towers-row .coin-inner img {
        transform: scaleX(-1);
    }
    .towers-row .coin-inners img {
        transform: scaleX(-1);
    }

    .towers-row button.button-reveal .button-inner .inner-value,
    .towers-row .coin-inner .inner-value  {
        font-size: 11px;
        font-weight: 600;
        color: #b1bad3;
        
    }
    .towers-row .coin-inners .inner-value  {
        font-size: 11px;
        font-weight: 600;
        color: #b1bad3;
    }

    .towers-row button.button-reveal .button-inner .inner-value span,
    .towers-row .coin-inner .inner-value span {
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
    }
    .towers-row .coin-inners .inner-value span {
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
    }

    .towers-row .coin-inner img.image-knight {
        width: 46px;
        height: auto;
        position: absolute;
        top: 4px;
        right: -3px;
        transform: scaleX(-1);
    }
    .towers-row .coin-inners img.image-knight {
        width: 46px;
        height: auto;
        position: absolute;
        top: 4px;
        right: -3px;
        transform: scaleX(-1);
    }
    @media only screen and (max-width: 550px) {

        .towers-row {
            padding: 0 15px;
        }

        .towers-row .row-tile {
            width: calc(33.33% - 6px);
        }

    }

    @media only screen and (max-width: 500px) {

        .towers-row .coin-inner {
            padding: 0;
        }

        .towers-row .coin-inners {
            padding: 0;
        }
        .towers-row .coin-inner img.image-knight {
            display: none;
        }
        .towers-row .coin-inners img.image-knight {
            display: none;
        }
    }
</style>
