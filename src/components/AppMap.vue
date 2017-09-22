<template>
    <v-map class="map"
           :options="mapOptions"
           ref="map">

        <v-tilelayer url="https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"></v-tilelayer>

        <v-tilelayer v-show="relatedLayersUrl"
                     :url="relatedLayersUrl"
                     ref="relatedLayers"></v-tilelayer>

        <v-geojson-layer v-if="messageGeojson && messagesShown"
                         :geojson="messageGeojson"
                         :options="messageGeojsonOptions"
                         ref="messageGeojson"></v-geojson-layer>
    </v-map>
</template>

<script>
import {config} from "../js/config"
import bus from "../js/eventBus"

import Vue from "vue"
import {mapState} from "vuex"
import L from "leaflet"
import "leaflet-editable"
import Vue2Leaflet from "vue2-leaflet"
import {coordToLatlng} from "../js/utilities"
import "../js/extendLeaflet"
import axios from 'axios'

export default {
  props: [
    "activeMessage",
    "messageGeojson",
    "relatedLayers",
  ],
  components: {
    'v-map': Vue2Leaflet.Map,
    'v-tilelayer': Vue2Leaflet.TileLayer,
    'v-geojson-layer': Vue2Leaflet.GeoJSON,
    'v-marker': Vue2Leaflet.Marker
  },
  data () {
    let that = this;

    return {
        messagesShown: true,
        mapOptions: {
           editable: true,
           offset:  [-200, 0]
        },
        messageGeojsonOptions: {
            coordsToLatLng: function(coords) {
                return coordToLatlng(L.point(coords[0], coords[1]))
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: (feature.id==that.activeMessage) ? that.customIconActive : that.customIcon
                });
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
    ...mapState([
        'themes',
        'selectedThemeId'
    ]),
    extent(){
        let selectedTheme = this.themes[this.selectedThemeId];
        if (selectedTheme && selectedTheme.extent.top && selectedTheme.extent.left && selectedTheme.extent.bottom && selectedTheme.extent.right)
            return selectedTheme.extent
        else 
            return undefined;
    },
    mapPaddingRight(){
        return this.messageGeojson.features.length ? 400 : 0;
    },
    customIcon() {
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
    relatedLayersUrl(){
        return this.relatedLayers && this.relatedLayers.length ? config.nextgiscomUrl + "/api/component/render/tile?x={x}&y={y}&z={z}&resource=" + this.relatedLayers.toString() : '#'
    } 
  },
  watch: {
    activeMessage(value, oldValue){
        if (value != undefined)
            this.panToMarker(value);

        if (oldValue && this.getMarkerById(oldValue))
            this.deactivateMessage(this.getMarkerById(oldValue))

        if (value && this.getMarkerById(value))
            this.activateMessage(this.getMarkerById(value), true)
    },
    extent(value, oldValue){
        if (value && value!=oldValue)
            this.setExtent(value);
    },
    messageGeojson(value, oldValue){
        let messagesCount = value ? value.features.length:0,
            messagesCountOld = oldValue ? oldValue.features.length: 0;

        if ((!messagesCount || !messagesCountOld) && messagesCount!=messagesCountOld){
            this.setExtent(this.extent);
        }
    }
  },
  mounted(){
    let that = this;

    if (this.extent)
        this.setExtent(this.extent);
    else
        this.mapObject.setView([64.539393, 40.516939], 5);

    if(that.activeMessage){
        this.panToMarker(that.activeMessage);
    };

    bus.$on("drawer:activated", function(){
        that.mapObject.editTools.startMarker(null, {icon: that.customIconActive});
    });

    bus.$on("drawer:reseted", function(){      
        that.mapObject.editTools.stopDrawing();
        that.removeEditableLayers();
    });

    this.mapObject.on('editable:drawing:commit editable:dragend', function (e) {
        bus.$emit("map:markerAdded", e.layer._latlng)
    });
  },
  methods: {
    geojsonObject(ref){
        return this.$refs[ref] ? this.$refs[ref].mapObject : undefined
    },
    activateMessage(marker, withMoving){
        this.$router.push({ path: '/map/' + this.$store.state.selectedThemeId + "/" + marker.feature.id}); 
        this.panToMarker(this.activeMessage);
        marker.setIcon(this.customIconActive)
              .setZIndexOffset(1000);    
    },
    panToMarker(markerId){
        let marker = this.getMarkerById(markerId);
        if (marker)
            this.mapObject.panToOffset(marker._latlng, this.mapOptions.offset);
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
        let geojsonLayers = this.geojsonObject("messageGeojson")._layers;

        for (let layer in geojsonLayers) {
            if (geojsonLayers[layer].feature.id == this.activeMessage)
                return geojsonLayers[layer]
        }
    },
    getMarkerById(id){
        if (this.geojsonObject("messageGeojson")){
            let geojsonLayers = this.geojsonObject("messageGeojson")._layers;

            for (let layer in geojsonLayers) {
                if (geojsonLayers[layer].feature.id == id)
                    return geojsonLayers[layer]
            }
        }
    },
    setExtent(extent){
        if (extent){
            let southWest = L.latLng(extent.bottom, extent.left),
                northEast = L.latLng(extent.top, extent.right),
                bounds = L.latLngBounds(southWest, northEast);

            this.mapObject.fitBounds(bounds,{
                paddingBottomRight:[this.mapPaddingRight, 0]
            });
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
