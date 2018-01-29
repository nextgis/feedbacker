<template>
  <div class="main-content"
       :class="{ 'main-content--withForm':formActive }"
       v-if="themes.length">

    <map-toolbar class="main-content__toolbar"
                 :selectedTheme="selectedTheme!=undefined ? selectedTheme.name : ''"
                 ></map-toolbar>

    <div class="main-content__map">
      <app-map :messageGeojson = "selectedTheme!=undefined ? filteredCurrentLayer : undefined"
               :relatedLayers = "selectedTheme!=undefined ? selectedTheme.relatedLayers : undefined"
               :active-message = "messageId"
               ref="map"></app-map>
      <messages :activeMessageId="messageId"></messages>
    </div>

    <feedback-form :active="formActive"
                   @feedbackForm:submitted="showSnackbar('success', 'Сообщение отправлено')"
                   @feedbackForm:failed="showSnackbar('error', 'Произошла ошибка')"></feedback-form>

    <transition name="fade">
        <div class="main-content__themes" v-if="themesIsShown">
            <v-container>
                <theme-list class="first-screen__theme-list"
                            :themes="themes"></theme-list>
            </v-container>
        </div>
    </transition>    
    <v-snackbar
      :timeout="snackbar.timeout"
      :success="snackbar.mode === 'success'"
      :error="snackbar.mode === 'error'"
      v-model="snackbar.visibility"
    >
      {{ snackbar.text }}
      <v-btn dark flat @click.native="snackbar.visibility = false">Закрыть</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import bus from "../js/eventBus"
import axios from "axios"
import {config} from "../js/config"
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

import AppMap from "../components/AppMap"
import MapToolbar from "../components/MapToolbar"
import Messages from "../components/Messages"
import FeedbackForm from "../components/FeedbackForm"
import ThemeList from "../components/ThemeList"

export default {
  components:{
    AppMap,
    MapToolbar,
    Messages,
    FeedbackForm,
    ThemeList,
  },
  props:[
    "themeId",
    "messageId"
  ],
  data () {
    return {
      themesIsShown: false,
      snackbar: {
          visibility: false,
          mode: undefined,
          text: undefined,
          timeout: 3000
      }
    }
  },
  computed: {
    ...mapState([
        'themes',
        'selectedThemeId',
        'user',
        'formActive'
    ]),
    ...mapGetters([
        'filteredCurrentLayer'
    ]),
    selectedTheme(){
      if (this.selectedThemeId!=undefined){
        return this.themes[this.selectedThemeId];
      } else {
        return undefined;
      }
    },
  },
  mounted(){
      var that = this;

      bus.$on("themes:themeClicked", () => {      
        that.themesIsShown = false;
      });
  },
  created: function () {
    let that = this;

    bus.$on('maptoolbar:themeSwitcherClicked', function () {
      that.showThemes();
    })
  },
  methods: {
    hideMessages(){
      this.$refs.map.messagesShown = false
    },
    showMessages(){
      this.$refs.map.messagesShown = true
    },
    showThemes(){
        this.themesIsShown = !this.themesIsShown
    },
    showSnackbar(mode, text){
        this.snackbar.visibility = true
        this.snackbar.mode = mode
        this.snackbar.text = text
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
@require '../styl/custom-vuetify/_transitions'
@require '~vuetify/src/stylus/trumps/_spacing.styl'

.main-content
    position: absolute;
    width: 100%;
    left: 0;
    top:0;
    bottom: $footer-height;
    transition: margin-left $primary-transition;

    &--withForm
      margin-left: $feedback-form-width

      .main-content__map
        @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)
          right: $feedback-form-width;

    &__map
      position: absolute;
      left:0;
      right:0;
      top: $map-toolbar-height;
      bottom:0;
      z-index: 1;

    &__toolbar
      .input-group--single-line
        margin-top:0

    &__themes
        position: absolute;
        width: 100%;
        z-index: 2000;
        top: $map-toolbar-height;
        bottom:0;
        overflow:auto;
        background-color: $theme.secondary;
        padding: $spacers.five.y $spacers.four.y

        @media (max-width: $grid-breakpoints.lg)
            padding-top: $spacers.four.y

        .container
            max-width: $grid-breakpoints.lg
.feedback-btn
    position: absolute
    left: 16px
    bottom: 20px
    z-index:1000
    margin:0
</style>
