<template>
    <v-card class="message-card"
            :class="{ 
                'message-card--active':isActive,
                'message-card--withImage':message.attachments,
            }"
            @click = "activateMessage($event)">
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
      </v-container>
    </v-card>
</template>

<script>
export default {
  props: [
    "id",
    "message",
    "isActive"
  ],
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    activateMessage(e){
      this.$router.push({ path: '/map/' + this.$store.state.selectedThemeId + "/" + this.id});
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
    width: 360px;
    cursor: pointer;
    elevationTransition();

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
        @extend .caption
        color: $grey.lighten-1
        margin-top: $spacers.two.y

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
      top: 12px
      elevation(1)
</style>
