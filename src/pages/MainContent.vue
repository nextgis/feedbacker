<template>
  <div class="main-content"
       :class="{ 'main-content--withForm':formActive }">

    <map-toolbar class="main-content__toolbar"
                 :selectedTheme="selectedTheme.name"
                 ></map-toolbar>

    <div class="main-content__map">
      <app-map :geojson = "selectedTheme.geojson"
               :active-message = "activeMessageId"></app-map>
      <detail-message v-show="activeMessageId"
                      :message = "activeMessage"></detail-message>
      <message-list v-show="!activeMessageId"
                    :messages = "messages"
                    :activeMessageId = "activeMessageId"></message-list>
      <transition name="fade">
        <v-btn primary dark large
               v-if="!formActive"
               class="feedback-btn"
               @click="showForm()">Оставить сообщение</v-btn>
      </transition>
    </div>

    <feedback-form :active="formActive"
                   @feedbackForm:closed="closeForm()"
                   :themes="themes"
                   :selectedThemeId="selectedThemeId"
                   :editableLayer="themes[selectedThemeId].editableLayer.id"></feedback-form>

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

import AppMap from "../components/AppMap"
import MapToolbar from "../components/MapToolbar"
import MessageList from "../components/MessageList"
import FeedbackForm from "../components/FeedbackForm"
import ThemeList from "../components/ThemeList"
import DetailMessage from "../components/DetailMessage"

export default {
  components:{
    AppMap,
    MapToolbar,
    MessageList,
    FeedbackForm,
    ThemeList,
    DetailMessage
  },
  props:[
    "selectedThemeId",
    "themes"
  ],
  data () {
    return {
      bufferFeatures: [],
      activeMessageId: null,
      formActive: false,
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
    selectedTheme: function(){
      return this.themes[this.selectedThemeId]
    },
    messages: function(){
      return this.selectedTheme.geojson.features
    },
    activeMessage: function(){
      let that = this
      return that.activeMessageId && that.messages.length ? that.messages.filter(function(message){
        return message.id==that.activeMessageId
      })[0].properties : null
    }
  },
  watch:{
    selectedThemeId(value){
      this.activeMessageId = null
    }
  },
  created: function () {
    let that = this
    bus.$on('map:markerClicked', function (activeMessageId) {
      that.activeMessageId = activeMessageId
    })

    bus.$on('card:cardClicked', function (activeMessageId) {
        that.activeMessageId = activeMessageId
    })

    bus.$on('maptoolbar:themeSwitcherClicked', function () {
      that.showThemes()
    })

    bus.$on('themes:themeActivated', function (selectedThemeId) {
      that.themesIsShown = false
    })

    bus.$on('feedbackForm:submitted', function (selectedThemeId) {
      that.showSnackbar('success', 'Сообщение отправлено')
    })

    bus.$on('feedbackForm:failed', function (selectedThemeId) {
      that.showSnackbar('error', 'Произошла ошибка')
    })

    bus.$on("detailMessage:closed", function(){
      that.activeMessageId = null
    })
  },
  methods: {
    showForm(){
      this.formActive = true
      this.hideMessages()
    },
    closeForm: function(){
      this.formActive = false
      this.showMessages()
    },
    hideMessages(){
      this.bufferFeatures = this.selectedTheme.geojson.features
      this.selectedTheme.geojson.features = []
    },
    showMessages(){
      this.selectedTheme.geojson.features = this.bufferFeatures
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
    bottom:0;
    transition: margin-left $primary-transition;

    &--withForm
      margin-left: $feedback-form-width

    &__map
      position: absolute;
      width: 100%;
      left:0;
      top: $map-toolbar-height;
      bottom:0;

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
        background-color: #2ecc96;
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
