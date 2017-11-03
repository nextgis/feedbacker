<template>
    <header class="header">
        <router-link class="header__title nolink" to="/">
            <img class="header__logo" src="../assets/wwf_logo.svg" alt="Сбор общественных мнений">
            <h1 class="header__title-text title">Сбор общественных мнений</h1>
        </router-link>
        <nav class="header-menu">
            <a href="#" class="header__link">О проекте</a>
            <a href="#" class="header__link">Инструкции</a>
        </nav>
        <div class="header-actions">
            <router-link to="/signin" v-if="!user.name" href="#" class="header__login-link header__link" @click.prevent="$emit('header:loginLinkClicked')">Войти</router-link>
            <user-avatar v-else :userName="user.name"></user-avatar>
            <v-btn primary dark large
                   class="header__feedback-button feedback-button"
                   :to="feedbackUrl">Оставить сообщение</v-btn>
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
        left: $spacers.three.x;
        top:0;
        white-space: nowrap;
  
        @media $display-breakpoints.xs-only
            left: $grid-gutters.xl;

    &__title-text
        @extend .title;
        @extend .ml-2;
        display: inline;
        vertical-align: middle;

    &__logo
        display: inline-block;
        vertical-align: middle;
        height: 36px;
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
