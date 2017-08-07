<template>
  <v-app>
    <app-header></app-header>
    <div class="content">
        <template v-if="currentPage == 'FirstScreen'">
            <first-screen :themes="themes" 
                          :selectedThemeId="selectedThemeId"></first-screen>
        </template>
        <template v-else-if="currentPage == 'MainContent'">
            <main-content :themes="themes" 
                          :selectedThemeId="selectedThemeId"></main-content>
        </template>
    </div>
  </v-app>
</template>

<script>
import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify)

import {config} from "./js/config"
import bus from "./js/eventBus"

import AppHeader from './components/AppHeader'
import MainContent from './pages/MainContent'
import FirstScreen from './pages/FirstScreen'
import axios from 'axios'

export default {
  name: 'app',
  components: {
    AppHeader,
    MainContent,
    FirstScreen
  },
  data () {
    return{
        selectedThemeId: undefined,
        themes: [],
        currentPage: "FirstScreen"
    }
  },
  created: function(){
    let that = this
    
    that.initData();

    bus.$on('themes:themeActivated', function (selectedThemeId) {
      that.selectedThemeId = selectedThemeId
      that.currentPage = "MainContent"
    })
  },
  methods: {
    initData(){
        axios.get(config.nextgiscomUrl + "/api/resource/", {
            params: {
                parent: config.baseResourceId
            }
        })
        .then(response => {
            let that = this,
                resources = response.data

            .map(function(item){
                return item.resource
            })
            .filter(function(resource){
                return resource.cls === 'resource_group'
            })

            resources.forEach(function(resource){
                that.themes.push({
                    id: resource.id,
                    name: resource.display_name,
                    geojson: undefined,
                    editableLayer: undefined
                })
            })
            that.getMessageLayers()
        })
        .catch(e => {
            console.log(e)
        })
    },
    getMessageLayers(){
        let that = this;

        this.themes.forEach(function(theme, index){
            axios.get(config.nextgiscomUrl + "/api/resource/", {
                params: {
                    parent: theme.id
                }
            })
            .then(response => {
                let editableLayer = response.data.filter(function(item){
                    return item.resource.display_name == "Messages"
                })[0]

                Object.assign(that.themes[index], {
                    editableLayer: editableLayer.resource
                });
                that.getMessages(editableLayer.resource.id, index)
            })
            .catch(e => {
                console.log(e)
            })
        })
    },
    getMessages(layerId, themeIndex){
        axios.get(config.nextgiscomUrl + "/api/resource/" + layerId + "/geojson")
        .then(response => {
            Object.assign(this.themes[themeIndex], {
                geojson: response.data
            });
        })
        .catch(e => {
            console.log(e)
        })
    }
  }
}
</script>

<style lang="styl">
  @import "./styl/variables"
  @import "./styl/vuetify"
</style>
