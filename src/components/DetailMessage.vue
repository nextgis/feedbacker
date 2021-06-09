<template>
  <div
    class="detail-message"
    :class="{ 'detail-message--overflowed': isCardOverflowed }"
  >
    <v-icon class="detail-message__closer" @click="triggerClose($event)"
      >close</v-icon
    >
    <v-card class="detail-message__inner" ref="container">
      <v-container ref="innerContainer" fluid>
        <header class="detail-message__header">
          <div class="detail-message__theme">
            {{ message ? message.properties.theme : '' }}
          </div>
          <h2 class="detail-message__title">
            {{ message ? message.properties.title : '' }}
          </h2>
          <div class="detail-message__meta">
            {{ message ? message.properties.date : '' }},
            {{ message ? message.properties.author : '' }}
          </div>
        </header>
        <div class="deatil-message__text">
          {{ message ? message.properties.text : '' }}
        </div>
        <template
          v-if="message && message.attachments && message.attachments.length"
        >
          <div
            v-for="(attachment, id) in message.attachments"
            :key="id"
            class="detail-message__photo"
          >
            <img
              class="detail-message__pic"
              :src="attachment + '?size=400x800'"
              alt=""
              @click="galleryIndex = id"
            />
          </div>
          <vue-gallery
            class="detail-message__gallery"
            :images="message.attachments"
            :index="galleryIndex"
            @close="galleryIndex = null"
            ref="gallery"
          ></vue-gallery>
        </template>
      </v-container>
    </v-card>
    <v-menu
      class="detail-message__menu"
      bottom
      left
      v-if="user && message && user.uid === message.properties.author_id"
    >
      <template v-slot:activator>
        <v-btn
          class="detail-message__menu-button ma-0"
          icon
          small
          ref="menuButton"
        >
          <v-icon class="icon--small">more_vert</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-tile @click="onDeleteClick(message.id)">
          <v-list-tile-title>Удалить</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import bus from '../js/eventBus';
import Vue from 'vue';
import { mapState } from 'vuex';
import VueGallery from 'vue-gallery';

export default {
  components: { VueGallery },
  props: ['message'],
  data() {
    return {
      isCardOverflowed: false,
      galleryIndex: null,
    };
  },
  computed: {
    ...mapState(['user']),
  },
  watch: {
    message(value) {
      this.$el.scrollTop = 0;
      if (value != undefined) {
        Vue.nextTick(() => {
          this.checkCardOverflowing();
        });

        if (value.attachments && value.attachments.length)
          Vue.nextTick(() => {
            document.body.appendChild(this.$refs.gallery.$el);
          });
      }
    },
  },
  beforeUnmount() {
    if (this.$refs.gallery) document.body.removeChild(this.$refs.gallery.$el);
  },
  methods: {
    triggerClose() {
      this.$router.push({
        path: '/map/' + this.$store.state.selectedThemeId,
        query: this.$route.query,
      });
    },
    checkCardOverflowing() {
      this.isCardOverflowed =
        this.$refs.innerContainer.offsetHeight >
        this.$refs.container.offsetHeight;
    },
    onDeleteClick(messageId) {
      bus.$emit('detailMessage:deleteClicked', messageId);
    },
  },
};
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
        max-height: "calc(100vh - 24px - %s - %s - %s)" % ($header-height $map-toolbar-height $footer-height);
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
        margin-top: 12px
        background: #dedede
        min-height: 50px

    &__pic
        width: 100%
        display: block
        border-radius: $card-border-radius
        cursor: pointer
        cursor: -webkit-zoom-in
        cursor: zoom-in

    &--overflowed
        .detail-message__closer,
        .detail-message__menu
            right: 16px;

    &__gallery.blueimp-gallery
        & > .close,
        & > .next,
        & > .prev
            font-size:0;
            border:0;
            background: none;
            padding:0;

            &::before
                position: absolute;
                top:0;
                bottom:0;
                left:0;
                right:0;
                margin: auto;
                font-family: "Material Icons";
                font-size: 42px;
                width:42px;
                height: 42px;
                line-height: 42px;

        & > .close
            width: 72px;
            height: 72px;

            &::before
                content: "close"

        & > .next,
        & > .prev
            top:0;
            bottom:0;
            height:auto;
            width: 50%;

        & > .next
            right:0;

            &::before
                content: "arrow_forward";
                left: auto;
                right: 15px;

        & > .prev
            left:0;
            &::before
                content: "arrow_back";
                right: auto;
                left: 15px;
</style>
