<template>
    <div class="admin">
        <div class="admin-container">
            <div class="container-header">
                <router-link to="/admin" class="header-title">Admin panel</router-link>
                <AdminFilterNavbar />
            </div>
            <div class="container-content">
                <transition name="slide-fade" mode="out-in">
                    <router-view/>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import AdminFilterNavbar from '@/components/admin/AdminFilterNavbar';

    export default {
        name: 'Admin',
        metaInfo: {
            title: 'Admin - YourStake.fr'
        },
        components: {
            AdminFilterNavbar
        }
    }
</script>

<style scoped>
    .admin {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px 45px 20px;
    }

    .admin .admin-container {
        width: 100%;
        padding: 28px;
        border-radius: 12px;
        background: #0f212e;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04), 0 24px 48px -24px rgba(0, 0, 0, 0.6);
    }

    .admin .container-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .admin .container-header a.header-title {
        font-size: 26px;
        font-weight: 800;
        letter-spacing: -0.01em;
        color: #ffffff;
    }

    .admin .container-content {
        width: 100%;
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .admin .container-content .slide-fade-enter-active {
        transition: all .3s ease-out;
    }

    .admin .container-content .slide-fade-enter {
        opacity: 0;
    }

    @media only screen and (max-width: 750px) {

        .admin {
            padding: 24px 10px 45px 10px;
        }

        .admin .admin-container {
            padding: 15px;
        }

    }

    @media only screen and (max-width: 650px) {

        .admin .container-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .admin .container-content {
            margin-top: 10px;
        }

    }
</style>
