<template>
  <v-card
    class="message-card"
    :class="{
      'message-card--active': isActive,
      'message-card--withImage': message.attachments,
    }"
    @click.native="activateMessage($event)"
  >
    <v-container fluid>
      <div class="message-card__title" v-html="highlightedTitle"></div>
      <div class="message-card__text" v-html="highlightedText"></div>
      <div class="message-card__meta">
        <span class="message-card__meta-item" v-if="message.properties.date">{{
          message.properties.date
        }}</span>
        <!-- <span class="message-card__meta-item"> <v-icon>comment</v-icon> {{ message.properties.comments || 0 }}</span> -->
        <span class="message-card__meta-item" v-if="message.properties.type">{{
          message.properties.type
        }}</span>
      </div>
      <div
        v-if="message.attachments && message.attachments.length"
        class="message-card__photo"
        :style="
          'background-image: url(' + message.attachments[0] + '?size=200x200'
        "
      >
        <span
          v-if="message.attachments.length > 1"
          class="message-card__photo-num"
        >
          {{ message.attachments.length }} фото</span
        >
      </div>
      <v-menu
        class="message-card__menu"
        bottom
        left
        v-if="user.uid && user.uid === message.properties.author_id"
      >
        <template v-slot:activator>
          <v-btn class="ma-0" icon small ref="menuButton">
            <v-icon class="icon--small">more_vert</v-icon>
          </v-btn>
        </template>
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
import bus from '../js/eventBus';
import { mapState } from 'vuex';
import { closest } from '../js/utilities';
closest();

export default {
  props: ['id', 'message', 'isActive'],
  computed: {
    ...mapState(['selectedThemeId', 'user', 'searchQuery']),
    highlightedTitle() {
      return this.getHighlightedString(this.message.properties.title);
    },
    highlightedText() {
      return this.getHighlightedString(this.message.properties.text);
    },
  },
  methods: {
    getHighlightedString(string) {
      let regex = new RegExp('\\' + this.searchQuery, 'ig');
      return this.searchQuery
        ? string.replace(regex, "<span class='yellow'>$&</span>")
        : string;
    },
    activateMessage(e) {
      if (
        !this.$refs.menuButton ||
        (e.target != this.$refs.menuButton.$el &&
          e.target.closest('.btn') != this.$refs.menuButton.$el)
      ) {
        this.$router.push({
          path: '/map/' + this.$store.state.selectedThemeId + '/' + this.id,
          query: this.$route.query,
        });
      }
    },
    onDeleteClick(messageId) {
      bus.$emit('messageCard:deleteClicked', messageId);
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

    &__photo-num
      position: absolute;
      width: 100%;
      text-align: center;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      bottom: 0;
      @extend .caption;

    &__menu
        position: absolute;
        right: 8px;
        bottom: 8px;

        .btn--icon .icon
            color: $grey.lighten-1;
</style>
