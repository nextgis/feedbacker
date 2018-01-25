import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import BaseLayout from '../pages/BaseLayout'
import MainContent from '../pages/MainContent'
import FirstScreen from '../pages/FirstScreen'
import Auth from '../pages/Auth'
import NotFound from '../pages/NotFound'

const routes = [
    { path: '/signin', component: Auth,
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem("clientId")){
                next('/');
            } else {
                next();
            }
        }, 
    },
    { path: '/', component: BaseLayout,
      children: [
        { path: '/', component: FirstScreen, props: true },
        { path: '/map/:themeId?/:messageId?', 
            component: MainContent,
            props: true
        },
        { path: '*', component: NotFound  }
      ]
    },
    { path: '/index.html', redirect: '/' },    
    { path: '/404', component: NotFound }
] 

export default new VueRouter({ mode: 'history', 
    base: '/demo/ngw-feedbacker/feedbacker/dist/', 
    routes })