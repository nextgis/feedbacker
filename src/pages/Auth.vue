<template>
    <v-layout class="auth" row wrap justify-center align-center ma-0>
        <v-container class="auth__inner">
            <router-link class="nolink" to="/"><img class="auth__logo" src="../assets/wwf_logo.svg" alt="Сбор общественных мнений"></router-link>
            <router-link class="nolink" to="/"><h1 class="auth__title">Сбор общественных мнений</h1></router-link>
            <v-text-field label="Логин" dark autofocus
            ></v-text-field>
            <v-text-field label="Пароль" dark
                          :append-icon="pwdVisibility ? 'visibility_off' : 'visibility'"
                          :append-icon-cb="function(){ pwdVisibility = !pwdVisibility }"              
                          :type="pwdVisibility ? 'text' : 'password'"              
            ></v-text-field>
            <v-btn light class="btn--xlarge mt-3"
                   @click="submitForm()">Войти</v-btn>
        </v-container>
        <v-icon large dark class="auth__closer" @click="$router.go(-1)">close</v-icon>
    </v-layout>     
    </v-container>
</template>

<script>
import {config} from "../js/config"
import axios from 'axios'

export default {
    components:{
    },
    props:[
        "previousPage"
    ],
    data () {
        return {
            pwdVisibility: false
        }
    },
    methods:{
        submitForm(){
            axios.post(config.nextgiscomUrl + "/api/login?next=http://localhost:8080", "login=administrator&password=admin")
                 .then(response => {
                    console.log(response)
                 })
                 .catch(e => {
                    console.log(e)
                 })
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

    .auth
        min-height: 100%;
        background-color: $theme.primary-lighter;

        @media (max-height: 600px)
            padding-top: 60px;

        &__inner
            width: 100%;
            max-width: 480px;
            text-align: center;
            padding-bottom: 80px;
        
        &__title
            color: #fff !important;
            margin-bottom: 36px;
            margin-top: $spacers.three.y;

        &__logo
            height: 48px;

        &__closer
            position: absolute;
            right: $spacers.three.x;
            top: $spacers.three.y;
            opacity: .7;
            cursor: pointer;

            &:hover
                opacity: 1;

        .input-group.input-group--text-field.input-group--focused
            input 
                caret-color: #fff;

            .input-group__details:after
                background-color: #fff;

            &:not(.input-group--single-line):not(.input-group--error) label,
            .input-group__input .icon
                color: #fff;
        
</style>
