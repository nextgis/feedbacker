<template>
    <header class="header">
        <router-link class="header__title nolink" to="/">
            <svg class="header__logo" version="1.1" width="22px" height="22px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="3.2 1.9 20.1 20.5" style="enable-background:new 3.2 1.9 20.1 20.5;" xml:space="preserve">
                <g transform="translate(0,-924.36218)">
                    <path fill="#0070c5" d="M15.5,939.3l-1.6,2.3l3.4,5.2
                        l5.9,0l-3.4-4.8l-3.1-4.5L15.5,939.3z"></path>
                    <path fill="#000000" d="M8.9,946.8l7.2-10.2l-7.2-10.2
                        H3.2l7.2,10.3l-7.1,10.2H8.9z"></path>
                    <path fill="#0070c5" d="M15.8,928.9l-1.9,2.7l2.8,4
                        l6.5-9.3h-2.8h-2.8L15.8,928.9z"></path>
                </g>
            </svg>
            <h1 class="header__title-text title">Feedbacker</h1>
        </router-link>
        <div class="header-actions">
            <router-link to="/signin" v-if="!user.name" href="#" class="header__login-link header__link" @click.prevent="$emit('header:loginLinkClicked')">Войти</router-link>
            <user-avatar v-else :userName="user.name"></user-avatar>
            <v-btn primary dark large
                   class="header__feedback-button feedback-button"
                   :to="feedbackUrl">Добавить точку</v-btn>
        </div>
    </header>
</template>

<script>
import {mapState} from "vuex"
import UserAvatar from "./UserAvatar"

export default {
    components: {
        UserAvatar
    },
    computed:{
        feedbackUrl(){
            return this.$store.state.selectedThemeId!=undefined ? "/map/" + this.$store.state.selectedThemeId + "?feedback=true" : "/map/?feedback=true"
        },
        ...mapState([
            "user"
        ])
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



.header
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: $header-height;
    background-color: #fff;
    border-bottom: 1px solid $line-color;    
    min-width: $grid-breakpoints.md
    z-index: 2

    &__title
        position:absolute;
        line-height: $header-height;
        left: 14px;
        top:0;
        white-space: nowrap;
  
        @media $display-breakpoints.xs-only
            left: $grid-gutters.xl;

    &__title-text
        @extend .title;
        @extend .ml-2;
        display: inline;
        vertical-align: middle;
        position: relative;
        top: -1px;

    &__logo
        display: inline-block;
        vertical-align: middle;
        height: 24px;
        width: auto;

    &__feedback-button
        margin:0;
        vertical-align: baseline;
  
        @media $display-breakpoints.xs-only
            right: $grid-gutters.xl;

    .header__link
        @extend .title;
        @extend .mr-4;
        text-decoration: none;
        line-height: $header-height !important;
        color: $theme.primary

        &:hover
            color: $theme.secondary

    .header__login-link
        color: #000;

        &:hover
            color: $theme.secondary

.header-menu
    text-align: center;

    &__link
        &:first-child
            margin-left: 24px;

.header-actions
    position: absolute;
    right: $spacers.three.x;
    top:0;
    bottom:0;    
    margin-top: auto;
    margin-bottom: auto;
    line-height: $header-height;

    .btn
        margin-top: 0;
        margin-bottom:0;
</style>
