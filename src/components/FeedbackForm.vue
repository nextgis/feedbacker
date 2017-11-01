<template>
    <div class="feedback-form" @scroll="onFormScroll($event)">
      <v-icon class="feedback-form__closer"
              @click="triggerClose()">close</v-icon>
        <h2 class="feedback-form__title primary--text">Оставить сообщение</h2>
        <v-stepper v-model="feedbackStep" vertical>

          <v-stepper-step step="1" :complete="feedbackStep > 1">
            <v-text-field class=""
              v-model = "formValues.title"
              label="Заголовок"
              single-line
              id="testing"
            ></v-text-field>            
            <v-select
              :items="messageTypes"
              v-model = "formValues.type"
              label="Тип сообщения"
              bottom
            ></v-select>               
            <v-select
              :items="themeList"
              v-model = "formValues.theme"
              label="Тема сообщения"
              bottom
              @input = "onThemeChanged($event)"
            ></v-select>
          </v-stepper-step>
          <v-stepper-content step="1">
          <v-btn primary :disabled="!formValues.theme || !formValues.type || !formValues.title" 
                         @click.native="feedbackStep = 2">Продолжить</v-btn>
          </v-stepper-content>

          <v-stepper-step step="2" :complete="feedbackStep > 2">
            <drawer class="feedback-form__set-location"
                    :latlng = "formValues.latlng"
                    ref="drawer"></drawer>
          </v-stepper-step>
          <v-stepper-content step="2">
          <v-btn primary :disabled="!formValues.latlng"
                         @click.native="feedbackStep = 3">Продолжить</v-btn>
          </v-stepper-content>

          <v-stepper-step step="3" :complete="feedbackStep > 3">
            <v-text-field
              :disabled = "feedbackStep < 3"
              v-model = "formValues.text"
              label="Текст сообщения"
              placeholder="Опишите суть обращения"
              multi-line
            ></v-text-field>
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-btn primary :disabled="!formValues.text"
                           @click.native="feedbackStep = 4">Продолжить</v-btn>
          </v-stepper-content>

          <v-stepper-step step="4">
            <file-uploader :disabled="feedbackStep<4"
                           :value="formValues.file"
                           @fileUploader:changed="setFiles"></file-uploader>
          </v-stepper-step>
        </v-stepper>
        <v-btn error large
               :disabled="feedbackStep<4"
               :class="{'btn--faded': formInProgress}"
               @click = "submitForm()">Отправить</v-btn>
        <v-progress-circular indeterminate class="feedback-form__loader accent--text"
                             v-if="formInProgress"></v-progress-circular>
    </div>
</template>

<script>
import {config} from "../js/config"
import bus from "../js/eventBus"
import {mapState} from "vuex"

import Drawer from "./Drawer"
import FileUploader from "./FileUploader"
import axios from 'axios'
import {latlngToCoord} from "../js/utilities"

export default {
    props: [ 
        "active"
    ],
    components: {
        Drawer,
        FileUploader
    },
    data () {
        return {
            feedbackStep: 1,
            formValues: {
                title: undefined,
                text: undefined,
                type: undefined,
                theme: undefined,
                latlng: undefined,
                file: []
            },
            messageTypes: [
                "Нарушение",
                "Предложение",
                "Природный объект"
            ],
            formInProgress: false
        }
    },
    computed:{
      ...mapState([
          'themes',
          'selectedThemeId',
          'user'
      ]),
      themeList(){
        return this.themes.map(function(theme){ return theme.name })
      },
      editableLayer(){
        return this.selectedThemeId!=undefined ? this.themes[this.selectedThemeId].editableLayer : undefined;
      }
    },
    watch:{
        feedbackStep(val){
          switch (val) {
            case 2:
                this.$refs.drawer.activate();
                break;
          }
        },
        selectedThemeId(val, oldVal){
            if (val!=undefined && val != oldVal && this.themes.length)
              this.$set(this.formValues, 'theme', this.themes[val].name);
        },
        themes(val, oldVal){
          if (!oldVal.length)
            this.$set(this.formValues, 'theme', this.themes[this.selectedThemeId].name);
        }
    },
    mounted(){
      if (this.themes.length && this.selectedThemeId!=undefined)
          this.$set(this.formValues, 'theme', this.themes[this.selectedThemeId].name);
    },
    created(){
        let that = this

        bus.$on("map:markerAdded", function(latlng){
            that.$set(that.formValues, 'latlng', latlng)
        });
    },
    methods: {
        triggerClose(){
          if (this.$store.state.selectedThemeId!=undefined){
            if (this.$route.params.themeId==this.$store.state.selectedThemeId)
              this.$router.push(this.$route.path)
            else
              this.$router.push("/map/" + this.$store.state.selectedThemeId)
          }
          else{
            this.$router.push("/");
          }
          this.resetForm();
        },
        onThemeChanged(value){
          let selectedThemeId = this.themes.findIndex((theme) => { return theme.name === value } );
          this.$store.commit("selectTheme", selectedThemeId);
        },
        setFiles(files){
          this.$set(this.formValues, 'file', files)
        },
        resetForm(){
          this.feedbackStep = 1;
          for (let key in this.formValues) {
            if (key == "file") this.$set(this.formValues, key, [])
            else if (key != "theme") this.$set(this.formValues, key, undefined)
          }
          this.$refs.drawer.reset();
          this.$el.scrollTop = 0
        },
        submitForm(){
            if (!this.formInProgress){
                let point = latlngToCoord(this.formValues.latlng),
                    date = new Date();

                this.formInProgress = true

                axios.post(config.nextgiscomUrl + "/api/resource/" + this.editableLayer.resource.id + "/feature/",
                    JSON.stringify( {
                        geom: "POINT(" + point.x + " " + point.y + ")",
                        fields: {
                            title: this.formValues.title,
                            type: this.formValues.type,
                            theme: this.formValues.theme,
                            text: this.formValues.text,
                            author: this.user.name,
                            author_id: this.user.uid,
                            date: date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear()
                        }
                    }), {
                        headers: {
                            "Authorization": "Basic " + localStorage.getItem("clientId")
                        } 
                    }
                 )
                 .then(response => {
                    this.uploadFiles(response.data.id)
                      .then(() => {
                        this.triggerClose();
                        this.resetForm();
                        this.formInProgress = false;
                        this.$store.dispatch('updateMessages', this.selectedThemeId);
                        this.$emit("feedbackForm:submitted", this.selectedThemeId);
                      })
                      .catch(e => {
                        this.formInProgress = false;
                        this.$emit("feedbackForm:failed", e);
                        console.log(e);
                     })
                 })
                 .catch(e => {
                    this.formInProgress = false
                    this.$emit("feedbackForm:failed", e)
                    console.log(e)
                 })
            }
        },
        onFormScroll(e){
            if (this.$refs.drawer.active)
                this.$refs.drawer.calcArrowPosition(e.target.scrollTop)
        },
        uploadFiles(featureId){
          let that = this

          return new Promise(function(resolve, reject){
            if (that.formValues.file.length){
              axios.put(config.nextgiscomUrl + "/api/component/file_upload/upload", that.formValues.file[0].file,{
                headers: {
                  "Authorization": "Basic " + localStorage.getItem("clientId")
                }
              })
              .then(function (res) {
                let attach_data = {}
                attach_data.file_upload = res.data

                axios.post(config.nextgiscomUrl + "/api/resource/" + that.editableLayer.resource.id + "/feature/" + featureId + "/attachment/", JSON.stringify(attach_data),{
                  headers: {
                    "Authorization": "Basic " + localStorage.getItem("clientId")
                  }
                })
                .then(function (res) {
                  resolve(res)
                })
                .catch(function (err) {
                  reject(err)
                });
              })
              .catch(function (err) {
                reject(err)
              });
            } else {
              resolve()
            }
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

.feedback-form
    width: $feedback-form-width;
    position: absolute;
    left: - $feedback-form-width;
    top:0;
    bottom:0;
    z-index: 2;
    background-color: #fff;
    padding: 24px;
    overflow: auto; 

    &__closer
        position: fixed;
        margin-left: $feedback-form-width - 65px;
        margin-top: -12px;
        cursor: pointer;
        z-index:2;

    &__title
        margin-bottom: $spacers.one.y

    &__loader
        position: relative;
        top: 12px;
        margin-left: 16px;

    .stepper 
        margin-left: -24px;
        margin-right: -24px;

        &__step
            align-items: flex-start
            padding-bottom:0

        &__label
            width: 85%
            line-height: 30px

</style>
