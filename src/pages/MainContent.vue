<template>
  <div class="main-content"
       :class="{ 'main-content--withForm':formActive }">

    <map-toolbar class="main-content__toolbar"
                 :selectedTheme="selectedTheme"
                 ></map-toolbar>

    <div class="main-content__map">
      <app-map :messages = "localMessages"
               :active-message = "activeMessage"></app-map>
      <message-list :messages = "localMessages"
                    :activeMessage = "activeMessage"></message-list>
      <transition name="fade">
        <v-btn primary dark large
               v-if="!formActive"
               class="feedback-btn"
               @click="showForm()">Оставить сообщение</v-btn>
      </transition>
    </div>

    <feedback-form :active="formActive"
                   @feedbackForm:closed="closeForm()"
                   :themes="themes"></feedback-form>

    <transition name="fade">
        <div class="main-content__themes" v-if="themesIsShown">
            <v-container>
                <theme-list class="first-screen__theme-list"
                            :themes="themes"
                            :messages="localMessages"></theme-list>
            </v-container>
        </div>
    </transition>
  </div>
</template>

<script>
import bus from "../js/eventBus"

import AppMap from "../components/AppMap"
import MapToolbar from "../components/MapToolbar"
import MessageList from "../components/MessageList"
import FeedbackForm from "../components/FeedbackForm"
import ThemeList from "../components/ThemeList"

export default {
  components:{
    AppMap,
    MapToolbar,
    MessageList,
    FeedbackForm,
    ThemeList
  },
  props:[
    "selectedThemeId",
    "themes",
    "messages"
  ],
  data () {
    return {
      bufferMessages: [],
      activeMessage: null,
      formActive: false,
      localMessages: this.messages,
      themesIsShown: false
    }
  },
  computed: {
    selectedTheme: function(){
      return this.themes[this.selectedThemeId]
    }
  },
  created: function () {
    let that = this
    bus.$on('messages.messageActivated', function (activeMessage) {
      that.activeMessage = activeMessage
    })

    bus.$on('maptoolbar:themeSwitcherClicked', function () {
      that.showThemes()
    })

    bus.$on('themes:themeActivated', function (selectedThemeId) {
      that.themesIsShown = false
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
      this.bufferMessages = this.messages
      this.localMessages = []
    },
    showMessages(){
      this.localMessages = this.bufferMessages
    },
    showThemes(){
        this.themesIsShown = !this.themesIsShown
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
    transition: transform $primary-transition;

    .feedback-form
      transform: translate(-$feedback-form-width,0)

    &--withForm
      transform: translate($feedback-form-width,0)

      .feedback-form
          transform: translate(0,0)

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
