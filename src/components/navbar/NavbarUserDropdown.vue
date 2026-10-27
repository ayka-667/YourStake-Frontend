<template>
    <div class="navbar-user-dropdown" v-bind:class="{ 'dropdown-open': navbarDropdown === true }">
        <button v-on:click="navbarSetDropdown(!navbarDropdown)" class="button-toggle" title="Account">
            <UiIcon name="user" />
        </button>
        <transition name="drop">
            <div v-if="navbarDropdown === true" class="dropdown-menu">
                <div class="menu-head">
                    <AvatarImage v-bind:image="authUser.user.avatar" />
                    <div class="head-info">
                        <span class="info-name" v-html="authUser.user.username"></span>
                        <span class="info-level">Level {{navbarGetLevel}}</span>
                    </div>
                </div>
                <router-link v-on:click.native="navbarSetDropdown(false)" to="/profile">
                    <UiIcon name="user" />Profile
                </router-link>
                <button v-on:click="navbarVaultButton()">
                    <UiIcon name="vault" />Vault
                </button>
                <router-link v-on:click.native="navbarSetDropdown(false)" to="/rewards">
                    <UiIcon name="gift" />Rewards
                </router-link>
                <router-link v-on:click.native="navbarSetDropdown(false)" to="/affiliates">
                    <UiIcon name="affiliates" />Affiliates
                </router-link>
                <router-link v-on:click.native="navbarSetDropdown(false)" to="/leaderboard">
                    <UiIcon name="trophy" />Leaderboard
                </router-link>
                <router-link v-if="authUser.user.rank === 'admin'" v-on:click.native="navbarSetDropdown(false)" to="/admin">
                    <UiIcon name="shield" />Admin
                </router-link>
                <button v-on:click="navbarLogoutButton()" class="item-logout">
                    <UiIcon name="logout" />Log Out
                </button>
            </div>
        </transition>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AvatarImage from '@/components/AvatarImage';
    import UiIcon from '@/components/UiIcon';
    import IconDropdown from '@/components/icons/IconDropdown';
    import IconSword from '@/components/icons/IconSword';
    import IconUser from '@/components/icons/IconUser';
    import IconVault from '@/components/icons/IconVault';
    import IconRakeback from '@/components/icons/IconRakeback';
    import IconAffiliates from '@/components/icons/IconAffiliates';
    import IconLeaderboard from '@/components/icons/IconLeaderboard';
    import IconSignOut from '@/components/icons/IconSignOut';

    export default {
        name: 'NavbarUserDropdown',
        components: {
            AvatarImage,
            UiIcon,
            IconDropdown,
            IconSword,
            IconUser,
            IconVault,
            IconRakeback,
            IconAffiliates,
            IconLeaderboard,
            IconSignOut
        },
        data() {
            return {
                navbarDropdown: false
            }
        },
        methods: {
            ...mapActions([
                'modalsSetShow', 
                'authLogoutUser'
            ]),
            navbarSetDropdown(value) {
                this.navbarDropdown = value;
            },
            navbarVaultButton() {
                this.modalsSetShow('Vault');
                this.navbarSetDropdown(false);
            },
            navbarLogoutButton() {
                this.navbarSetDropdown(false);
                this.authLogoutUser();
            }
        },
        computed: {
            ...mapGetters([
                'authUser'
            ]),
            navbarGetLevel() {
                let level = Math.floor(Math.pow(this.authUser.user.xp / 1000 / 100, 1 / 3));
                return level >= 100 ? 100 : level; 
            },
            navbarGetLevelColor() {
                let color = '';

                if(this.navbarGetLevel >= 2 && this.navbarGetLevel < 26) { color = 'blue'; }
                else if(this.navbarGetLevel >= 26 && this.navbarGetLevel < 51) { color = 'green'; }
                else if(this.navbarGetLevel >= 51 && this.navbarGetLevel < 76) { color = 'orange'; }
                else if(this.navbarGetLevel >= 76 && this.navbarGetLevel < 100) { color = 'red'; }
                else if(this.navbarGetLevel >= 100) { color = 'purple'; }

                return color;
            }
        },
        created() {
            let self = this;
            document.addEventListener('click', function(event) {
                if(!self.$el.contains(event.target) && self.navbarDropdown == true) {
                    self.navbarSetDropdown(false);
                }
            });
        }
    }
</script>

<style scoped>
    .navbar-user-dropdown {
        position: relative;
    }

    .navbar-user-dropdown button.button-toggle {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        color: #b1bad3;
        transition: background .15s ease, color .15s ease;
    }

    .navbar-user-dropdown button.button-toggle:hover,
    .navbar-user-dropdown.dropdown-open button.button-toggle {
        color: #ffffff;
        background: #213743;
    }

    .navbar-user-dropdown .dropdown-menu {
        width: 220px;
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        padding: 6px 0;
        border-radius: 4px;
        background: #ffffff;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        z-index: 100;
    }

    .navbar-user-dropdown .dropdown-menu::before {
        content: '';
        position: absolute;
        top: -6px;
        right: 14px;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #ffffff;
    }

    .navbar-user-dropdown .menu-head {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 16px 12px 16px;
        margin-bottom: 4px;
        border-bottom: 1px solid #e3e8ef;
    }

    .navbar-user-dropdown .menu-head .avatar-image {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        overflow: hidden;
    }

    .navbar-user-dropdown .head-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .navbar-user-dropdown .info-name {
        font-size: 14px;
        font-weight: 700;
        color: #0f212e;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .navbar-user-dropdown .info-level {
        font-size: 12px;
        font-weight: 500;
        color: #557086;
    }

    .navbar-user-dropdown .dropdown-menu a,
    .navbar-user-dropdown .dropdown-menu > button {
        width: 100%;
        height: 38px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 16px;
        font-size: 14px;
        font-weight: 600;
        color: #0f212e;
        text-align: left;
    }

    .navbar-user-dropdown .dropdown-menu a .ui-icon,
    .navbar-user-dropdown .dropdown-menu > button .ui-icon {
        width: 16px;
        height: 16px;
        color: #2f4553;
    }

    .navbar-user-dropdown .dropdown-menu a:hover,
    .navbar-user-dropdown .dropdown-menu > button:hover {
        background: #e7ecf2;
    }

    .navbar-user-dropdown .drop-enter-active,
    .navbar-user-dropdown .drop-leave-active {
        transition: opacity .12s ease, transform .12s ease;
    }

    .navbar-user-dropdown .drop-enter,
    .navbar-user-dropdown .drop-leave-to {
        opacity: 0;
        transform: translateY(-4px);
    }
</style>
