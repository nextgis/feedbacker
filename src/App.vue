<template>
  <v-app>
    <router-view ></router-view>
  </v-app>
</template>

<script>
import Vue from 'vue'

import Vuetify from 'vuetify'
Vue.use(Vuetify)

import {config} from "./js/config"
import bus from "./js/eventBus"
import axios from 'axios'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'app',
  computed: mapState([
    'user',
    'themes',
    'selectedThemeId'
  ]),
  watch: {
      '$route' (to, from) {
          if (!this.user.uid && to.query.feedback && from.path!='/signin'){
              this.$router.push('/signin');
          }
      }
  },
  mounted(){
    this.initStoreData();
  },
  methods: {    
    showFeedbackForm(){
        Vue.nextTick(() => {
            this.$refs.mainContent.showForm();
        });  
    },
    ...mapActions([ 
        "initStoreData"
    ])
  }
}
</script>

<style lang="styl">
  @import "./styl/variables"
  @import "./styl/vuetify"
</style>
