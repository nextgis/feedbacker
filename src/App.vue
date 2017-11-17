<template>
  <v-app>
    <router-view v-if="dataLoaded"></router-view>
    <template v-else>
      <v-progress-circular indeterminate class="loader primary--text" :size="48"></v-progress-circular>
    </template>
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
    'selectedThemeId',
    'dataLoaded'
  ]),
  watch: {
      '$route' (to, from) {
          if (!this.user.uid && to.query.feedback && from.path!='/signin'){
              this.$router.push('/signin');
          }

          this.initRoutesData();
      }
  },
  mounted(){
    let that = this;
    this.initStoreData();
  },
  methods: {    
    showFeedbackForm(){
        Vue.nextTick(() => {
            this.$refs.mainContent.showForm();
        });  
    },
    ...mapActions([ 
        "initStoreData",
        "initRoutesData"
    ])
  }
}
</script>

<style lang="styl">
  @import "./styl/variables"
  @import "./styl/vuetify"

  .loader
    position: fixed;
    top:0;
    bottom:0;
    left:0;
    right:0;
    margin: auto;
</style>
