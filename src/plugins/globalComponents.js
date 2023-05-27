import Vue from 'vue'
import Navigation from '@/components/core/NavigationDrawer.vue';
import Toolbar from '@/components/core/Toolbar.vue';

import Auth from '@/components/layouts/Auth.vue';
import Default from '@/components/layouts/Default.vue';

Vue.component('navigation', Navigation);
Vue.component('toolbar', Toolbar);

Vue.component('auth', Auth);
Vue.component('default', Default);
