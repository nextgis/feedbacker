<template>
    <div class="theme-list">
        <v-layout row wrap>
          <v-flex xs4 lg3 v-for="(theme, index) in themes" :key="index">
            <theme-card :messageCount="theme.editableLayer.geojson ? theme.editableLayer.geojson.features.length : 0"
                        :theme="theme.name"
                        :themeIndex="index">
            </theme-card>
          </v-flex>
        </v-layout>
    </div>
</template>

<script>
import ThemeCard from "./ThemeCard"

export default {
  props: [
    "themes"
  ],
  components: {
    ThemeCard
  },
  data () {
    return {
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

</style>
