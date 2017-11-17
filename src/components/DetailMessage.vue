<template>
    <div class="detail-message"
         :class="{ 'detail-message--overflowed':isCardOverflowed }">
        <v-icon class="detail-message__closer"
                @click="triggerClose($event)">close</v-icon>
        <v-card class="detail-message__inner"
                ref="container">     
            <v-container ref="innerContainer" fluid>
                <header class="detail-message__header">
                    <div class="detail-message__theme">{{ message ? message.properties.theme : "" }}, {{ message ? message.properties.type : ""  }}</div>
                    <h2 class="detail-message__title">{{ message ? message.properties.title : "" }}</h2>
                    <div class="detail-message__meta">{{ message ? message.properties.date : ""  }}, {{ message ? message.properties.author : "" }}</div>
                </header>
                <div class="deatil-message__text">
                    {{message ? message.properties.text : "" }}
                </div>
                <template v-if="message && message.attachments">
                    <div v-for="attachment in message.attachments"
                         class="detail-message__photo">
                        <img class="detail-message__pic" :src="attachment + '?size=400x800'" alt="">
                    </div>
                </template>    
            </v-container>
        </v-card>
        <v-menu class="detail-message__menu" bottom left 
                v-if="user && message && user.uid === message.properties.author_id"
                >
            <v-btn slot="activator" class="detail-message__menu-button ma-0" icon small
                   ref="menuButton">
                <v-icon class="icon--small">more_vert</v-icon>
            </v-btn>
            <v-list>
                <v-list-tile @click="onDeleteClick(message.id)">
                    <v-list-tile-title>Удалить</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
import bus from "../js/eventBus"
import Vue from "vue"
import {mapState} from "vuex"

export default {
  props: [
    "message"
  ],
  data(){
    return {
        isCardOverflowed: false
    }
  },
  computed: {
    ...mapState([
        "user"
    ])
  },
  watch:{
    message(value){
        this.$el.scrollTop = 0;
        if (value!=undefined) Vue.nextTick(()=>{ 
            this.checkCardOverflowing();
        })        
    }
  },
  methods: {
    triggerClose(e){
        this.$router.push({path: '/map/' + this.$store.state.selectedThemeId});
    },
    checkCardOverflowing(){
        this.isCardOverflowed = (this.$refs.innerContainer.offsetHeight > this.$refs.container.offsetHeight)
    },
    onDeleteClick(messageId){
        bus.$emit('detailMessage:deleteClicked', messageId);
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
    right:16px;
    top: 12px;
    z-index: 1000;

    &__inner
        width: 400px;
        box-shadow: none;        
        max-height: "calc(100vh - 24px - %s - %s)" % ($header-height $map-toolbar-height);
        overflow: auto;

        .container
            padding-bottom: 24px

    &__closer,
    &__menu
        position: absolute;
        top: 8px;
        right: 8px;
        cursor: pointer;
        z-index:2;
        transition: right .2s;

    &__menu
        top: auto;
        margin-right: -2px;
        bottom: 8px;

    &__menu-button
        background-color: rgba(255,255,255,.92);

    &__header
        margin-bottom: 16px;

    &__theme
        margin-bottom: 12px 
        padding-right: 30px
        color: rgba($secondary-dark-color, .78)
    
    &__meta
        color: $grey.lighten-1
        margin-top: 2px
    
    &__photo
        margin-top: 16px;
        background: #dedede
        min-height: 50px

    &__pic
        width: 100%
        display: block

    &--overflowed
        .detail-message__closer,
        .detail-message__menu
            right: 16px;

</style>
