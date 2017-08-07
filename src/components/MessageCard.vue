<template>
    <v-card class="message-card"
            :class="{ 'message-card--active':isActive }"
            @click = "activateMessage($event)">
        <v-container fluid>
            <div class="message-card__title">{{ message.title }}</div>
            <div class="message-card__text">{{ message.text }}</div>
            <div class="message-card__meta">
                <span class="message-card__meta-item">{{ message.date }}</span>
                <span class="message-card__meta-item"> <v-icon>comment</v-icon> {{ message.comments || 0 }}</span>
                <span class="message-card__meta-item">{{ message.type }}</span>
            </div>
      </v-container>
    </v-card>
</template>

<script>
import bus from "../js/eventBus"

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
      bus.$emit("card:cardClicked", this.id)
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

    &:hover
      elevation(16)

    &--active
      elevation(16);
      background-color: #e8ffe2 !important;
      
    &__title
        @extend .subheading
        margin-bottom: $spacers.one.y

    &__text
        color: rgba(0,0,0,.87)

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

</style>
