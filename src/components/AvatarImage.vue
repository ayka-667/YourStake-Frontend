<template>
    <div class="avatar-image">
        <img v-bind:src="serverUrl + avatarImage" @error="avatarImageError()" alt="avatar" />
    </div>
</template>

<script>
    const DEFAULT_AVATAR = '/public/img/avatar/1.webp';

    export default {
        name: 'AvatarImage',
        props: ['image'],
        data() {
            return {
                avatarImage: DEFAULT_AVATAR,
                serverUrl: process.env.VUE_APP_BACKEND_URL,
            }
        },
        methods: {
            avatarImageError() {
                if(this.avatarImage !== DEFAULT_AVATAR) { this.avatarImage = DEFAULT_AVATAR; }
            }
        },
        watch: {
            image(value) {
                this.avatarImage = value === undefined || value === null || value === '' ? DEFAULT_AVATAR : value;
            }
        },
        created() {
            this.avatarImage = this.image === undefined || this.image === null || this.image === '' ? DEFAULT_AVATAR : this.image;
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

    .avatar-image img {
        display: block;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover;
    }
</style>
