<template>
    <v-card class="message-card"
            :class="{ 
                'message-card--active':isActive,
                'message-card--withImage':message.attachments,
            }"
            @click = "activateMessage($event)"
           >
        <v-container fluid>
            <div class="message-card__title">{{ message.properties.title }}</div>
            <div class="message-card__text">{{ message.properties.text }}</div>
            <div class="message-card__meta">
                <span class="message-card__meta-item">{{ message.properties.date }}</span>
                <span class="message-card__meta-item"> <v-icon>comment</v-icon> {{ message.properties.comments || 0 }}</span>
                <span class="message-card__meta-item">{{ message.properties.type }}</span>
            </div>
            <div v-if="message.attachments"
                 class="message-card__photo"
                 :style="'background-image: url(' + message.attachments + '?size=200x200'">
            </div>
            <v-menu class="message-card__menu" bottom left 
                    v-if="user && user.uid === message.properties.author_id">
                <v-btn slot="activator" class="ma-0" icon small
                       ref="menuButton">
                    <v-icon class="icon--small">more_vert</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="onDeleteClick(message.id)">
                        <v-list-tile-title>Удалить</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
      </v-container>
    </v-card>
</template>

<script>
import bus from "../js/eventBus"
import { mapState } from 'vuex'
import { closest } from '../js/utilities'
closest();

export default {
  props: [
    "id",
    "message",
    "isActive"
  ],
  computed: mapState([
    "selectedThemeId",
    "user"
  ]),
  methods: {
    activateMessage(e){
        if (!this.$refs.menuButton || (e.target != this.$refs.menuButton.$el && e.target.closest('.btn') != this.$refs.menuButton.$el))
            this.$router.push({ path: '/map/' + this.$store.state.selectedThemeId + "/" + this.id});
    },
    onDeleteClick(messageId){
        bus.$emit('messageCard:deleteClicked', messageId);
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

.message-card
    background-color: #fff;
    box-shadow: none;
    margin: 12px 16px;
    cursor: pointer;
    elevationTransition();
    min-height: 108px;

    .container
      padding-bottom: 40px

    &--withImage .container
      padding-right: 60px

    &:hover
      elevation(16)

      .message-card__photo
        elevation(4)

    &--active
      elevation(16);
      background-color: #e8ffe2 !important;
      
    &__title
        @extend .subheading
        margin-bottom: $spacers.one.y

    &__text
        color: rgba(0,0,0,.87)
        max-height: 80px
        overflow: hidden

    &__meta
        position: absolute;
        @extend .caption
        color: $grey.lighten-1
        bottom: 13px;

    &__meta-item
        margin-left: $spacers.three.x

        &:first-child
            margin-left:0

        .icon
            font-size: 16px;
            color: $grey.lighten-1

    &__photo
      position: absolute
      width: 60px
      height: 60px
      z-index: 2
      border-radius: 4px
      background-size: cover
      background-repeat: no-repeat
      background-position: center center
      background-color: #f5f5f5
      right: -8px
      top: 8px
      elevation(1)

    &__menu
        position: absolute;
        right: 8px;
        bottom: 8px;

        .btn--icon .icon
            color: $grey.lighten-1;
</style>
