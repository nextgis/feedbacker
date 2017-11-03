import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import BaseLayout from '../pages/BaseLayout'
import MainContent from '../pages/MainContent'
import FirstScreen from '../pages/FirstScreen'
import Auth from '../pages/Auth'

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
        { path: '/map/:themeId?/:messageId?', component: MainContent, props: true,
            beforeEnter: (to, from, next) => {
                if (to.query.feedback){
                    if (!localStorage.getItem("clientId")){
                        if (from.path!='/signin')
                            next('/signin')
                        else
                            next(to.path);
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            },
        },
      ]
    },
    { path: '/index.html', redirect: '/' }
] 

export default new VueRouter({ mode: 'history', 
    base: '/demo/feedbacker/dist/', 
    routes })