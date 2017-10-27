import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import BaseLayout from '../pages/BaseLayout'
import MainContent from '../pages/MainContent'
import FirstScreen from '../pages/FirstScreen'
import Auth from '../pages/Auth'

const routes = [
    { path: '/signin', component: Auth },
    { path: '/', component: BaseLayout,
      children: [
        { path: '/', component: FirstScreen },
        { path: '/map/', component: MainContent },
        { path: '/map/:themeId', component: MainContent, props: true},
        { path: '/map/:themeId/:messageId', component: MainContent, props: true},
      ],
      props: true
    }
] 

export default new VueRouter({ mode: 'history', 
    base: '/demo/feedbacker/dist/', 
    routes })