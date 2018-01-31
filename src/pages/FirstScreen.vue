<template>
    <div class="first-screen" :class="{'first-screen--withGreeting': (projectDescription && projectDescription.length)}">
        <div class="first-screen__greeting" v-if="projectDescription && projectDescription.length">
            <v-container fluid>
                <span class="first-screen__greeting-text" v-html="projectDescription"></span>
            </v-container>
        </div>
        <div class="first-screen__themes">   
            <v-container fluid grid-list-md>
                <h1 class="first-screen__title">Выберите тему, чтобы оставить сообщение</h1>
                <theme-list class="first-screen__theme-list"
                            :themes="themes"></theme-list>
            </v-container>
        </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ThemeList from "../components/ThemeList"
export default {
    components:{
        ThemeList
    },
    computed: mapState([
        'themes',
        'projectDescription'
    ]),
    mounted(){
        this.$store.dispatch('selectTheme', undefined);
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
    @require '../styl/custom-vuetify/_transitions'
    @require '~vuetify/src/stylus/trumps/_spacing.styl'

    $greeting-height := 120px

    .first-screen
        position: absolute;
        width: 100%;
        top:0;
        bottom:0;
        left:0;

        &__greeting
            height: $greeting-height;
            display:flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            width: 100%;
            font-size: 16px;
            line-height: 1.5;

        &__greeting-text
            display: inline-block;
            max-width:680px;

        &__themes
            position: absolute;
            width: 100%;
            left:0;
            top: 0;
            bottom: $footer-height;
            background-color: $theme.secondary;
            padding: 40px $spacers.three.y

            @media (max-width: $grid-breakpoints.lg)
                padding-top: $spacers.three.y

            .container
                max-width: $grid-breakpoints.lg

        &__title
            margin-bottom: 32px;
            display: none

        &--withGreeting
            .first-screen__themes
                top: $greeting-height;
            .first-screen__title
                display: block
</style>
