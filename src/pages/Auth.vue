<template>
    <v-layout class="auth ma-0" row wrap justify-center align-center>
        <v-container class="auth__inner ma-0">
            <router-link class="nolink" to="/">
                <img v-if="logoUrl" class="auth__logo" :src="logoUrl" alt="Feedbacker">
                <div v-else class="auth__logo-wrapper">
                    <img class="auth__logo" src="../assets/ng_logo.svg" alt="Feedbacker">
                </div>    
            </router-link>
            <router-link class="nolink" to="/"><h1 class="auth__title">Feedbacker</h1></router-link>
            <form name="auth-form" @submit.prevent="submitForm()">
                <v-text-field label="Логин" dark autofocus
                              v-model="login"
                              @input="hideError()"
                ></v-text-field>
                <v-text-field label="Пароль" dark
                              v-model="password"
                              @input="hideError()"
                              :append-icon="pwdVisibility ? 'visibility_off' : 'visibility'"
                              :append-icon-cb="function(){ pwdVisibility = !pwdVisibility }"              
                              :type="pwdVisibility ? 'text' : 'password'"              
                ></v-text-field>
                <div v-if="error" class="auth__error">
                    {{ error }}
                </div>
                <v-btn light class="btn--xlarge mt-3"
                       type="submit">Войти</v-btn>
            </form>           
        </v-container>
        <v-icon large dark class="auth__closer" @click="close()">close</v-icon>
    </v-layout>     
    </v-container>
</template>

<script>
import {config} from "../js/config"
import {mapState} from "vuex"
import axios from 'axios'

export default {
    components:{
    },
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
            "user",
            "previousRoute"
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

                        if (this.previousRoute){
                            this.$router.push(this.previousRoute);
                        } else {
                            this.$router.push("/");
                        }

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
        },
        close(){
            if (this.previousRoute){
                this.$router.push({
                    path: this.previousRoute.path,
                    params: this.previousRoute.params,
                    query: Object.assign({}, this.previousRoute.query, {feedback: undefined})
                });
            } else {
                this.$router.push("/");
            }
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

    .auth
        min-height: 600px;
        height: 100%;
        background-color: $theme.primary;
        color: #fff;

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

        &__logo-wrapper
            height: 44px;
            width: 44px;
            line-height: 44px;
            border-radius: 4px;
            text-align: center;
            margin-left: auto;
            margin-right: auto;
            background-color: #fff;
            elevation(2);

            .auth__logo
                vertical-align: middle;
        &__logo
            max-height: 48px;

        &__closer
            position: absolute;
            right: $spacers.three.x;
            top: $spacers.three.y;
            opacity: .7;
            cursor: pointer;

            &:hover
                opacity: 1;

        &__error
            margin-top: -12px;
            margin-bottom: 12px;

        .input-group.input-group--text-field.input-group--focused
            input 
                caret-color: #fff;

            .input-group__details:after
                background-color: #fff;

            &:not(.input-group--single-line):not(.input-group--error) label,
            .input-group__input .icon
                color: #fff;


        
</style>
