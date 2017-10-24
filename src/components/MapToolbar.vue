<template>    
    <div class="map-toolbar">
      <v-container class="pa-0" fluid>
        <v-layout nowrap class="map-toolbar__layout ma-0" >
          <v-flex xs3 class="map-toolbar__item pa-0">
            <fake-select :value="selectedTheme"
                         placeholder="Тема сообщения"
                         closeEvent="themes:themeClicked"
                         @fakeSelect:clicked = "onThemeSwitcherClicked()"></fake-select>
          </v-flex>
          <v-flex xs9 class="map-toolbar__item pa-0" >
            <v-text-field
              placeholder="Поиск"
              single-line
              full-width
              hide-details
              prepend-icon="search"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
</template>

<script>
import bus from "../js/eventBus"
import FakeSelect from "./ui/FakeSelect"

export default {
    components: { FakeSelect },   
    props:[ "selectedTheme" ],
    data () {
        return {
        }
    },
    methods: {
        onThemeSwitcherClicked(){
            bus.$emit('maptoolbar:themeSwitcherClicked')
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

.map-toolbar
    height: $map-toolbar-height
    border-bottom: 1px solid $line-color

    &__item
        border-left: 1px solid $line-color

        &:first-child
            border-left:0

    .input-group--text-field.input-group--full-width
        padding: 4px 16px

        &.input-group--append-icon
            padding-right:2px

            .icon
                margin-left: 4px

        &.input-group--prepend-icon
            padding-left:2px

            .icon
                min-width: 36px
                justify-content: center
                marign-right: 4px

        input, textarea
            font-size: 14px;

</style>
