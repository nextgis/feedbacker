<template>
    <v-card class="theme-card"
            height = "136px"
            @click.native = "activateTheme($event)">
        <v-container fill-height fluid>
            <div class="theme-card__title">{{ theme }}</div>
            <div class="theme-card__meta" align-end flexbox>{{ messageCount }} сообщений</div>
        </v-container>
    </v-card>
</template>

<script>
import bus from "../js/eventBus"

export default {
  props: [
    "theme",
    "themeIndex",
    "messageCount"
  ],
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    activateTheme(e){
      this.$router.push({ path: '/map/' +  this.themeIndex });
      bus.$emit("themes:themeClicked", this.themeIndex);
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

.theme-card
    cursor: pointer;
    elevationTransition();
    box-shadow: none

    &:hover
      elevation(16);

    .container.fill-height
        justify-content: space-between
        align-items: flex-start
        flex-direction: column

    &__title
        @extend .title
        max-width: 95%

    &__meta
        font-size: 16px
        color: rgba($secondary-dark-color, .78)

</style>
