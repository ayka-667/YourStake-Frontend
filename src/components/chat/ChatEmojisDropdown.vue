<template>
    <div class="chat-emojis-dropdown" v-bind:class="{ 'dropdown-open': dropdownOpen === true }">
        <button v-on:click="chatToggleDropdown" class="button-toggle">
            <IconEmojisGradient />
            <span class="gradient-green">EMOJIS</span>
        </button>
        <div class="dropdown-window">
            <div class="window-inner">
                <div class="inner-list">

                    <button v-for="(emoji, index) in dropdownEmojis" v-on:click="chatEmojiButton(emoji)">{{emoji}}</button>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import IconEmojisGradient from '@/components/icons/IconEmojisGradient';

    export default {
        name: 'ChatEmojisDropdown',
        components: {
            IconEmojisGradient
        },
        data() {
            return {
                dropdownOpen: false,
                dropdownEmojis: [
                    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍',
                    '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
                    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴',
                    '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓',
                    '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢',
                    '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿',
                    '💀'
                ]
            }
        },
        methods: {
            chatToggleDropdown() {
                this.dropdownOpen = !this.dropdownOpen;
            },
            chatEmojiButton(emoji) {
                this.chatToggleDropdown();
                this.$parent.chatAddEmoji(emoji);
            }
        },
        created() {
            let self = this;
            document.addEventListener('click', function(event) {
                if(!self.$el.contains(event.target) && self.dropdownOpen == true) {
                    self.chatToggleDropdown();
                }
            });
        }
    }
</script>

<style scoped>
    .chat-emojis-dropdown {
        position: relative;
    }

    .chat-emojis-dropdown button.button-toggle {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
    }

    .chat-emojis-dropdown button.button-toggle svg {
        margin-right: 7px;
    }

    .chat-emojis-dropdown .dropdown-window {
        width: 325px;
        height: 0;
        position: absolute;
        display: flex;
        align-items: flex-end;
        bottom: 20px;
        right: -75px;
        padding: 0 15px;
        transition: height 0.2s ease;
        overflow: hidden;
        z-index: 10;
    }

    .chat-emojis-dropdown.dropdown-open .dropdown-window {
       height: 140px;
       padding: 15px 15px 0 15px;
    }

    .chat-emojis-dropdown .window-inner {
        width: 295px;
        height: 110px;
        position: relative;
        margin-bottom: 14px;
        padding: 13px;
        border-radius: 15px;

        background: #2f4553;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    }

    .chat-emojis-dropdown .window-inner::before {
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        bottom: -14px;
        right: 60px;
        border-left: 15px solid transparent;
        border-top: 14px solid #072d41;
    }

    .chat-emojis-dropdown .inner-list {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        overflow-y: scroll;
    }

    .chat-emojis-dropdown .inner-list::-webkit-scrollbar-track {
        background-color: transparent;
    }

    .chat-emojis-dropdown .inner-list::-webkit-scrollbar-thumb {
        background-color: transparent;
    }

    .chat-emojis-dropdown .inner-list::-webkit-scrollbar {
        width: 0;
        height: 0;
    }

    .chat-emojis-dropdown .inner-list button {
        width: 9.09%;
        height: 26px;
        font-size: 18px;
    }
</style>
