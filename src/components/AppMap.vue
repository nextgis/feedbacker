<template>
    <div class="map">
        <v-map :zoom=6 :center="[64, 48]">
            <v-tilelayer url="https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"></v-tilelayer>
            <template v-for="message in messages">
                <v-marker
                       :icon = "message.id == activeMessage ? customIconActive : customIcon"
                       :key="message.id"
                       :lat-lng="message.coord"
                        
                       @l-add = "onMarkerAdd($event, message.id)"
                       @l-click = "activateMessage($event)"
                       ></v-marker>
            </template>
        </v-map>
    </div>
</template>

<script>
import bus from "../js/eventBus"

import Vue from "vue"
import L from "leaflet"
import Vue2Leaflet from "vue2-leaflet/dist/vue2-leaflet.js"

Vue.component('v-map', Vue2Leaflet.Map);
Vue.component('v-tilelayer', Vue2Leaflet.TileLayer);
Vue.component('v-marker', Vue2Leaflet.Marker);

export default {
  props: [
    "messages",
    "activeMessage"
  ],
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    customIcon () {
        return L.icon({
            iconUrl: require('../assets/custom-marker.svg'),
            shadowUrl: require('../assets/custom-marker-shadow.png'),
            iconSize:     [24, 31], // size of the icon
            shadowSize:   [54, 61], // size of the shadow
            iconAnchor:   [12, 31], // point of the icon which will correspond to marker's location
            shadowAnchor: [24, 45],  // the same for the shadow
            //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
    },
    customIconActive () {
        return L.icon({
            iconUrl: require('../assets/custom-marker-active.svg'),
            shadowUrl: require('../assets/custom-marker-shadow.png'),
            iconSize:     [24, 31], // size of the icon
            shadowSize:   [54, 61], // size of the shadow
            iconAnchor:   [12, 31], // point of the icon which will correspond to marker's location
            shadowAnchor: [24, 45],  // the same for the shadow
            //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
    }
  },
  methods: {
    activateMessage(e){
      bus.$emit("messages.messageActivated", e.target.messageId)
    },
    onMarkerAdd(e, id){      
      e.target.messageId = id
    }
  }
}
</script>

<style lang="styl">
@require '~vuetify/src/stylus/settings/_colors';
@require '../styl/custom-vuetify/_theme'
@require '../styl/custom-vuetify/_variables'
@require '../styl/variables'
@require '~vuetify/src/stylus/elements/_typography.styl'
@require '../styl/custom-vuetify/_typography'
@require '~vuetify/src/stylus/trumps/_spacing.styl'

@require '~leaflet/dist/leaflet.css'

.map{
    height: 100%
}

</style>
