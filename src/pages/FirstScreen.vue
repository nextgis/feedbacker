<template>
    <div class="first-screen" :class="{'first-screen--withGreeting':withGreeting}">
        <div class="first-screen__greeting" v-if="withGreeting">
            <v-container fluid>
                <span class="first-screen__greeting-text">
                    Участвуйте в&nbsp;защите природы Архангельской области.<br>
                    Оставляйте сообщения о&nbsp;незаконных рубках, вносите предложения по&nbsp;охране 
                    природных&nbsp;объектов. В&nbsp;тесном взаимодействии мы&nbsp;сможем многое!
                </span>
            </v-container>
        </div>
        <div class="first-screen__themes">
           
            <v-container fluid >
                <h1 class="first-screen__title white--text">Выберите тему, чтобы оставить сообщение</h1>
                <theme-list class="first-screen__theme-list"
                            :themes="themes"></theme-list>
            </v-container>
        </div>
  </div>
</template>

<script>
import ThemeList from "../components/ThemeList"

export default {
    components:{
        ThemeList
    },
    props:[
        "themes"
    ],
    data () {
        return {
          conditionalFillHeight: "fill-height",
          withGreeting: true
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
            padding: $spacers.four.y

        &__greeting-text
            display: inline-block;
            max-width:680px;

        &__themes
            position: absolute;
            width: 100%;
            left:0;
            top: 0;
            bottom:0;
            background-color: #2ecc96;
            padding: $spacers.five.y $spacers.four.y

            @media (max-width: $grid-breakpoints.lg)
                padding-top: $spacers.four.y

            .container
                max-width: $grid-breakpoints.lg

        &__title
            font-weight: 400 !important;
            margin-bottom: $spacers.four.y;
            display: none

        &--withGreeting
            .first-screen__themes
                top: $greeting-height;
            .first-screen__title
                display: block
</style>
