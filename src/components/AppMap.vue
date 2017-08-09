<template>
    <v-map class="map"
           :zoom=6 
           :center="[64, 48]"
           :options="mapOptions"
           ref="map">
        <v-tilelayer url="https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"></v-tilelayer>
        <v-geojson-layer :geojson="geojson"
                         :options="geojsonOptions"
                         ref="geojson"></v-geojson-layer>
    </v-map>
</template>

<script>
import bus from "../js/eventBus"

import Vue from "vue"
import L from "leaflet"
import "leaflet-editable"
import Vue2Leaflet from "vue2-leaflet/dist/vue2-leaflet.js"
import {coordToLatlng} from "../js/utilities"
import "../js/extendLeaflet"

export default {
  props: [
    "activeMessage",
    "geojson"
  ],
  components: {
    'v-map': Vue2Leaflet.Map,
    'v-tilelayer': Vue2Leaflet.TileLayer,
    'v-marker': Vue2Leaflet.Marker,
    'v-geojson-layer' :Vue2Leaflet.GeoJSON
  },
  data () {
    let that = this;

    return {
        mapOptions: {
           editable: true,
           offset:  [-200, 0]
        },
        geojsonOptions: {
            coordsToLatLng: function(coords) {
                return coordToLatlng(L.point(coords[0], coords[1]))
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {icon: that.customIcon});
            },
            onEachFeature: function (feature, layer) {
                layer.on({
                    click: function(e){
                        that.activateMessage(e.target, false)
                    }
                });
            }
        }
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
        });
    },
    mapObject(){
        return this.$refs.map.mapObject
    },
    geojsonObject(){
        return this.$refs.geojson.$geoJSON
    }
  },
  watch: {
    activeMessage(value, oldValue){
        let activeMarker = this.getActiveMarker()

        if (oldValue)
            this.deactivateMessage(this.getMarkerById(oldValue))

        if (value)
            this.activateMessage(this.getMarkerById(value), true)
    }
  },
  mounted(){
    let that = this

    bus.$on("drawer:activated", function(){
        that.mapObject.editTools.startMarker(null, {icon: that.customIconActive});
    })

    bus.$on("drawer:reseted", function(){      
        that.mapObject.editTools.stopDrawing();
        that.removeEditableLayers();
    })

    bus.$on('card:cardClicked', function (messageId) {
        that.panToMarker(messageId)
    })

    this.mapObject.on('editable:drawing:commit editable:dragend', function (e) {
        bus.$emit("map:markerAdded", e.layer._latlng)
    });
  },
  methods: {
    activateMessage(marker, withMoving){
        marker.setIcon(this.customIconActive)
              .setZIndexOffset(1000)
        bus.$emit("map:markerClicked", marker.feature.id)
    },
    panToMarker(markerId){
        let marker = this.getMarkerById(markerId)
        this.mapObject.panToOffset(marker._latlng, this.mapOptions.offset)
    },
    deactivateMessage(marker){
        marker.setIcon(this.customIcon)
              .setZIndexOffset(0)
    },
    removeEditableLayers(){
        for (var id in this.mapObject.editTools.featuresLayer._layers){
            this.removeLayer(this.mapObject.editTools.featuresLayer._layers[id]);
        }
    },
    removeLayer(layer){
        this.mapObject.editTools.featuresLayer.removeLayer(layer);
        this.mapObject.removeLayer(layer);
    },
    getActiveMarker(){        
        let geojsonLayers = this.geojsonObject._layers;

        for (let layer in geojsonLayers) {
            if (geojsonLayers[layer].feature.id == this.activeMessage)
                return geojsonLayers[layer]
        }
    },
    getMarkerById(id){
        let geojsonLayers = this.geojsonObject._layers;

        for (let layer in geojsonLayers) {
            if (geojsonLayers[layer].feature.id == id)
                return geojsonLayers[layer]
        }
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
