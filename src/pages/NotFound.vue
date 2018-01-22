<template>
    <v-layout class="error-page" column wrap justify-center align-center ma-0>
        <div class="error-page__code">404</div>
        <div class="error-page__text">Такой страницы не существует</div>
        <v-btn class="error-page__btn" primary dark large to="/">Вернуться на главную</v-btn>
    </v-layout>
</template>  

<script>
import {config} from "../js/config"
import {mapState} from "vuex"
import axios from 'axios'

export default {
    data () {
        return {
            login: undefined,
            password: undefined,
            pwdVisibility: false,
            error: undefined
        }
    },
    computed:{ 
        ...mapState([
            "user"
        ]),
        logoUrl(){
            let logoFile = config.logoFile;
            return config.logoFile ? require('../assets/' + logoFile) : undefined;
        }
    },
    methods:{
        submitForm(){
            if (this.login && this.password){
                let clientId = window.btoa(this.login + ":" + this.password); 
                this.$store.dispatch('getUserData', clientId)
                .then((userData) => {
                    if (userData.keyname != "guest"){
                        localStorage.setItem("clientId", clientId);
                        this.$store.commit('setUserData', userData);
                        this.$router.go(-1);
                    } else {
                        this.error = "Логин и пароль неверны"
                    }
                })
                .catch((e) => {
                    this.error = e;
                });
            }
        },
        hideError(){
            this.error = undefined;
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
    @require '~vuetify/src/stylus/tools/_elevations'

    .error-page
        height: 100%;
        background-color: $theme.secondary;
        text-align: center;

        &__btn
            margin-top: 48px;

        &__code
            font-size: 150px;
            line-height: 1;
            color: $theme.primary;
            margin-top: -48px;
            font-family: $heading-font-family;
            font-weight: bold;
            marign-bottom: 6px;

        &__text
            font-size: 18px;
</style>
