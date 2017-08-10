<template>
    <div class="detail-message">
        <v-icon class="detail-message__closer"
              @click="triggerClose($event)">close</v-icon>
        <v-card class="detail-message__inner">     
            <v-container  fluid>
                <header class="detail-message__header">
                    <div class="detail-message__theme">{{ message ? message.theme : "" }}, {{ message ? message.type1 : ""  }}</div>
                    <h2 class="detail-message__title">{{ message ? message.title : "" }}</h2>
                    <div class="detail-message__meta">{{ message ? message.date : ""  }}, {{ message ? message.author : "" }}</div>
                </header>
                <div class="deatil-message__text">
                    {{message ? message.text : "" }}
                </div>
            </v-container>
        </v-card>
    </div>
</template>

<script>
import bus from "../js/eventBus"

export default {
  props: [
    "message"
  ],
  watch:{
    message(value){
        this.$el.scrollTop = 0
    }
  },
  methods: {
    triggerClose(e){
      bus.$emit("detailMessage:closed")
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
@require '~vuetify/src/stylus/tools/_elevations.styl'

.detail-message
    position: absolute;
    right:0;
    top:0;
    z-index: 1000;
    max-height: 100%;
    overflow: auto

    &__inner
        margin: 12px 16px;        
        width: 400px;
        box-shadow: none;

        .container
            padding-bottom: 24px

    &__closer
        position: fixed
        margin-left:388px
        margin-top: 16px
        cursor: pointer
        z-index:2

    &__header
        margin-bottom: 16px;

    &__theme
        margin-bottom: 12px 
        padding-right: 30px
        color: rgba($secondary-dark-color, .78)
    
    &__meta
        color: $grey.lighten-1
        margin-top: 2px

</style>
