import Vue from 'vue';
import VueMeta from 'vue-meta';
import axios from 'axios';

import App from './App.vue';
import router from './router';
import store from './store';

import '@/assets/css/global.css';
import '@/assets/css/theme-games.css';
import '@/assets/css/ui-pro.css';
import '@/assets/css/motion.css';
import '@/assets/css/apple.css';

Vue.use(VueMeta);

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_BACKEND_URL;

const token = localStorage.getItem('token');
if (token !== undefined && token !== null) {
    axios.defaults.headers.common['x-auth-token'] = token;
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
