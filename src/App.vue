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
import { mapActions } from 'vuex'

export default {
  name: 'app',
  data () {
    return{
        selectedThemeId: undefined,
        themes: [],
        dialog: true
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
