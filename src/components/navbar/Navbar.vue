<template>
    <nav id="navbar">
        <div class="navbar-left">
            <button v-on:click="generalSetSidebarMobile(generalSidebarMobile === 'Navbar' ? null : 'Navbar')" class="button-icon button-menu">
                <UiIcon name="menu" />
            </button>
            <router-link to="/" class="link-logo"><img src="@/assets/img/logo-chip.png" alt="" />YourStake</router-link>
        </div>

        <div class="navbar-mid">
            <NavbarCashier v-if="authUser.user !== null" />
        </div>

        <div class="navbar-right">
            <template v-if="authUser.user === null">
                <button v-on:click="navbarLoginButton()" class="button-signin">Sign In</button>
                <button v-on:click="navbarRegisterButton()" class="button-register">Register</button>
            </template>
            <template v-else>
                <router-link to="/rewards" class="button-icon" title="Rewards">
                    <UiIcon name="gift" />
                </router-link>
                <NavbarUserDropdown />
            </template>
            <button v-on:click="generalSetSidebarMobile(generalSidebarMobile === 'Chat' ? null : 'Chat')" class="button-icon button-chat" title="Chat">
                <UiIcon name="chat" />
            </button>
        </div>
    </nav>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import UiIcon from '@/components/UiIcon';
    import NavbarCashier from '@/components/navbar/NavbarCashier';
    import NavbarUserDropdown from '@/components/navbar/NavbarUserDropdown';

    export default {
        name: 'Navbar',
        components: {
            UiIcon,
            NavbarCashier,
            NavbarUserDropdown
        },
        methods: {
            ...mapActions([
                'modalsSetShow',
                'modalsSetData',
                'generalSetSidebarMobile'
            ]),
            navbarLoginButton() {
                this.modalsSetData(null);
                this.modalsSetShow('Login');
            },
            navbarRegisterButton() {
                this.modalsSetData({ tab: 'register' });
                this.modalsSetShow('Login');
            }
        },
        computed: {
            ...mapGetters([
                'generalSidebarMobile',
                'authUser'
            ])
        }
    }
</script>

<style scoped>
    nav#navbar {
        width: calc(100% - 240px - 340px);
        height: 60px;
        position: fixed;
        display: flex;
        justify-content: space-between;
        align-items: center;
        top: 0;
        left: 240px;
        padding: 0 24px;
        background: #1a2c38;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12);
        z-index: 50;
    }

    nav#navbar .navbar-left,
    nav#navbar .navbar-right {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    nav#navbar .navbar-right {
        justify-content: flex-end;
    }

    nav#navbar a.link-logo {
        font-size: 26px;
        font-weight: 800;
        font-style: italic;
        letter-spacing: -0.03em;
        color: #ffffff;
    }

    nav#navbar .button-icon {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        color: #b1bad3;
        transition: background .15s ease, color .15s ease;
    }

    nav#navbar .button-icon:hover {
        color: #ffffff;
        background: #213743;
    }

    nav#navbar .button-menu {
        display: none;
    }

    nav#navbar .button-signin,
    nav#navbar .button-register {
        height: 40px;
        padding: 0 18px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        transition: filter .15s ease;
    }

    nav#navbar .button-signin:hover {
        background: #213743;
    }

    nav#navbar .button-register {
        background: #1475e1;
    }

    nav#navbar .button-register:hover {
        filter: brightness(1.12);
    }

    @media only screen and (max-width: 1500px) {

        nav#navbar {
            width: calc(100% - 240px);
        }

    }

    @media only screen and (max-width: 1100px) {

        nav#navbar {
            width: 100%;
            left: 0;
            padding: 0 12px;
        }

        nav#navbar .button-menu {
            display: flex;
        }

    }

    @media only screen and (max-width: 650px) {

        nav#navbar .navbar-left a.link-logo {
            display: none;
        }

    }
</style>
