<template>
  <v-app>    
    <template v-if="currentPage!='Auth'">
        <app-header @header:feedbackBtnClicked="showFeedbackForm()"
                @header:loginLinkClicked="currentPage='Auth'"></app-header>
        <div class="content">
            <template v-if="currentPage == 'FirstScreen'">
                <first-screen :themes="themes" 
                              :selectedThemeId="selectedThemeId"
                              ref="firstScreen"></first-screen>
            </template>
            <template v-else-if="currentPage == 'MainContent'">
                <main-content :themes="themes" 
                              :selectedThemeId="selectedThemeId"
                              ref="mainContent"></main-content>
            </template>
        </div>
    </template>    
    <template v-else>
        <auth @auth:closed="goToPage($event)" :previousPage="previousPage"></auth>
    </template>
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
import Auth from './pages/Auth'
import axios from 'axios'

export default {
  name: 'app',
  components: {
    AppHeader,
    MainContent,
    FirstScreen,
    Auth
  },
  data () {
    return{
        selectedThemeId: undefined,
        themes: [],
        previousPage: undefined,
        currentPage: "FirstScreen",
        dialog: true
    }
  },
  watch: {
    currentPage(value, oldValue){
        this.previousPage = oldValue;
    }
  },
  created: function(){
    let that = this
    
    that.initData();

    bus.$on('themes:themeActivated', function (selectedThemeId) {
      that.selectedThemeId = selectedThemeId
      that.currentPage = "MainContent"
    })

    bus.$on('feedbackForm:submitted', function (selectedThemeId) {
      that.getMessages(selectedThemeId)
    })

    bus.$on("map:relateLayersLoaded", function(data, relatedLayerIndex){
        that.$set(that.themes[that.selectedThemeId].relatedLayers[relatedLayerIndex], 'geojson', data)
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
                    editableLayer: {
                        resource: undefined,
                        geojson: undefined
                    },
                    relatedLayers: [],
                    extent: {
                        top: undefined,
                        right: undefined,
                        bottom: undefined,
                        left: undefined
                    }
                })
            })
            that.getLayers()
        })
        .catch(e => {
            console.log(e)
        })
    },
    getLayers(){
        let that = this;

        this.themes.forEach(function(theme, index){
            axios.get(config.nextgiscomUrl + "/api/resource/", {
                params: {
                    parent: theme.id
                }
            })
            .then(response => {
                let editableLayer,
                    relatedLayers = []

                response.data.forEach(function(item){
                    if (item.resource.display_name == "Messages")
                        editableLayer = item.resource
                    else if (item.resource.cls == "webmap"){
                        that.getRelatedLayers(item.resource.id, index)
                        that.getExtent(item.resource.id, index)
                    }
                })

                if (editableLayer){
                    that.$set(that.themes[index].editableLayer, 'resource', editableLayer)
                    that.getMessages(index)
                }

            })
            .catch(e => {
                console.log(e)
            })
        })
    },
    getMessages(themeIndex){
        axios.get(config.nextgiscomUrl + "/api/resource/" + this.themes[themeIndex].editableLayer.resource.id + "/geojson")
        .then(response => {
            this.$set(this.themes[themeIndex].editableLayer, 'geojson', response.data)
        })
        .catch(e => {
            console.log(e)
        })
    },
    getRelatedLayers(mapId, themeIndex){
        axios.get(config.nextgiscomUrl + "/api/resource/" + mapId)
        .then(response => {
            let relatedLayers = response.data.webmap.root_item.children.map(function(layer){
                return layer.layer_style_id
            }).reverse()
            if (relatedLayers.length)
                this.$set(this.themes[themeIndex], 'relatedLayers', relatedLayers)
        })
        .catch(e => {
            console.log(e)
        })
    },
    getExtent(mapId, themeIndex){
        axios.get(config.nextgiscomUrl + "/api/resource/" + mapId)
        .then(response => {
            this.$set(this.themes[themeIndex].extent, 'left', response.data.webmap.extent_left)
            this.$set(this.themes[themeIndex].extent, 'top', response.data.webmap.extent_top)
            this.$set(this.themes[themeIndex].extent, 'rihgt', response.data.webmap.extent_rihgt)
            this.$set(this.themes[themeIndex].extent, 'bottom', response.data.webmap.extent_bottom)
        })
        .catch(e => {
            console.log(e)
        })
    },
    showFeedbackForm(){
        this.currentPage = "MainContent";

        Vue.nextTick(() => {
            this.$refs.mainContent.showForm();
        });  
    },
    goToPage(page){
        this.currentPage = page;
    }
  }
}
</script>

<style lang="styl">
  @import "./styl/variables"
  @import "./styl/vuetify"
</style>
