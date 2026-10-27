<template>
    <div class="avatar-image">
        <!-- Default avatars (the 9 legacy pixel-art ones) are drawn as a clean silhouette -->
        <svg v-if="avatarPalette !== null" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
                <linearGradient v-bind:id="avatarGradientId" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" v-bind:stop-color="avatarPalette[0]"/>
                    <stop offset="1" v-bind:stop-color="avatarPalette[1]"/>
                </linearGradient>
            </defs>
            <rect width="40" height="40" v-bind:fill="'url(#' + avatarGradientId + ')'"/>
            <circle cx="20" cy="15.5" r="6.5" fill="#ffffff" fill-opacity=".9"/>
            <path d="M7 37c1.2-7.2 6.4-11.5 13-11.5S31.8 29.8 33 37z" fill="#ffffff" fill-opacity=".9"/>
        </svg>
        <img v-else v-bind:src="serverUrl + avatarImage" @error="avatarImageError()" alt="avatar" />
    </div>
</template>

<script>
    // Muted two-tone palettes, picked from the default avatar number
    const PALETTES = [
        ['#3d7bff', '#1d3fbf'],
        ['#1fbf8f', '#0b6f62'],
        ['#7b5cff', '#4228b8'],
        ['#e0566f', '#9b1f3a'],
        ['#f2a33a', '#b5650c'],
        ['#2fb4e0', '#11638c'],
        ['#9aa9ba', '#4f5f70'],
        ['#c06be0', '#6f2a94'],
        ['#4fbf52', '#21752a']
    ];

    const DEFAULT_AVATAR = /^\/public\/img\/avatar\/(\d+)\.webp$/;

    let counter = 0;

    export default {
        name: 'AvatarImage',
        props: ['image'],
        data() {
            counter += 1;
            return {
                avatarImage: null,
                avatarGradientId: 'avatar-gradient-' + counter,
                serverUrl: process.env.VUE_APP_BACKEND_URL,
            }
        },
        computed: {
            avatarPalette() {
                const match = DEFAULT_AVATAR.exec(this.avatarImage || '');
                if(this.avatarImage === null || match !== null) {
                    const index = match !== null ? parseInt(match[1], 10) : 1;
                    return PALETTES[(index - 1 + PALETTES.length) % PALETTES.length];
                }
                return null;
            }
        },
        methods: {
            avatarImageError() {
                this.avatarImage = null;
            }
        },
        watch: {
            image(value) {
                this.avatarImage = value === undefined || value === null || value === '' ? null : value;
            }
        },
        created() {
            this.avatarImage = this.image === undefined || this.image === null || this.image === '' ? null : this.image;
        }
    }
</script>

<style scoped>
    .avatar-image {
        overflow: hidden;
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }

    .avatar-image img,
    .avatar-image svg {
        display: block;
        width: 100% !important;
        height: 100% !important;
    }
</style>
