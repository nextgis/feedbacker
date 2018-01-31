<template>
    <div class="feedback-form" @scroll="onFormScroll($event)">
        <div class="feedback-form__header">
            <v-icon class="feedback-form__closer"
                  @click="triggerClose()">close</v-icon>
            <h2 class="feedback-form__title">Добавить точку</h2>
        </div>
        <v-form class="feedback-form__main"
                v-model="formValid"
                ref="feedbackForm"
                lazy-validation>
            <v-stepper v-model="feedbackStep" vertical>
              <v-stepper-step step="1" 
                              :complete="feedbackStep > 1"
                              :rules="[() => (!!formValues.title || formValues.title==undefined)]"
                              >
                <v-text-field class=""
                  v-model = "formValues.title"
                  label="Заголовок"
                  single-line
                  :rules = "[() => !!formValues.title || 'Это обязательное поле']"
                  ref="titleInput"
                ></v-text-field>
                <v-select
                  :items="themeList"
                  v-model = "formValues.theme"
                  label="Тема сообщения"
                  bottom
                  @input = "onThemeChanged($event)"
                  ref="themeInput"
                ></v-select>
              </v-stepper-step>
              <v-stepper-content step="1">
              <v-btn color="primary" depressed :disabled="!formValues.theme || !formValues.title"
                             @click.native="feedbackStep = 2">Продолжить</v-btn>
              </v-stepper-content>

              <v-stepper-step step="2" :complete="feedbackStep > 2">
                <drawer class="feedback-form__set-location"
                        :latlng = "formValues.latlng"
                        ref="drawer"></drawer>
              </v-stepper-step>
              <v-stepper-content step="2">
              <v-btn color="primary" depressed :disabled="!formValues.latlng"
                             @click.native="feedbackStep = 3">Продолжить</v-btn>
              </v-stepper-content>

              <v-stepper-step step="3"
                              :complete="feedbackStep > 3"
                              :rules="[() => (!!formValues.text || formValues.text==undefined)]">
                <v-text-field
                  :disabled = "feedbackStep < 3"
                  v-model = "formValues.text"
                  label="Описание точки"
                  placeholder="Расскажите, что вы знаете об этом объекте"
                  rows="3"
                  multi-line
                  :rules = "[() => !!formValues.text || 'Это обязательное поле']"
                  ref="textInput"
                ></v-text-field>
              </v-stepper-step>
              <v-stepper-content step="3">
                <v-btn color="primary" depressed :disabled="!formValues.text"
                               @click.native="feedbackStep = 4">Продолжить</v-btn>
              </v-stepper-content>

              <v-stepper-step step="4">
                <file-uploader :disabled="feedbackStep<4"
                               :value="formValues.file"
                               @fileUploader:changed="setFiles"></file-uploader>
              </v-stepper-step>
            </v-stepper>
        </v-form>
        <div class="feedback-form__footer">
            <v-btn color="primary" depressed large
                   :disabled="feedbackStep<4 || !formValid"
                   class="feedback-form__btn"
                   :class="{'accent': true, 'btn--faded': formInProgress}"
                   @click = "submitForm()">Отправить</v-btn>
            <v-progress-circular indeterminate class="feedback-form__loader accent--text"
                             v-if="formInProgress"></v-progress-circular>
        </div>
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
            formValid: false,
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
          this.$router.push({ 
            query: Object.assign({}, this.$route.query, { feedback: undefined })
          });
          this.resetForm();
        },
        onThemeChanged(value){
          let selectedThemeId = this.themes.findIndex((theme) => { return theme.name === value } )
          this.$router.push({ 
            path: '/map/' +  selectedThemeId,
            query: this.$route.query
          });
        },
        setFiles(files){
          this.$set(this.formValues, 'file', files)
        },
        resetForm(){
          this.feedbackStep = 1;
          this.$refs.feedbackForm.inputs.forEach((input) =>{
            if (input != this.$refs.themeInput) input.reset();
          });
          this.$set(this.formValues, "file", []) // clear files
          this.$set(this.formValues, "latlng", undefined) // clear position
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
                        this.$store.dispatch('updateMessages', this.selectedThemeId);
                        this.$emit("feedbackForm:submitted", this.selectedThemeId);
                        this.formInProgress = false;
                        this.triggerClose();
                        this.resetForm();
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
              let files = that.formValues.file.map( item => { return item.file }),
                  formData = new FormData();

              files.forEach(function(file) {
                formData.append("files[]", file);
              });

              axios.post(config.nextgiscomUrl + "/api/component/file_upload/upload", formData, {
                headers: {
                  "Authorization": "Basic " + localStorage.getItem("clientId")
                }
              })
              .then(function (res) {
                  let uplodedFiles = res.data.upload_meta,
                      successCounter = 0;

                  uplodedFiles.forEach(function(file) {

                    let attach_data = {};
                    attach_data.file_upload = file;

                    axios.post(config.nextgiscomUrl + "/api/resource/" + that.editableLayer.resource.id + "/feature/" + featureId + "/attachment/", JSON.stringify(attach_data),{
                      headers: {
                        "Authorization": "Basic " + localStorage.getItem("clientId")
                      }
                    })
                    .then(function (res) {
                      successCounter ++;
                      if (successCounter === uplodedFiles.length) resolve(res);
                    })                      
                    .catch(function (err) {
                      reject(err)
                    });

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

$ff-header-height := 64px;
$ff-footer-height := 72px;

.feedback-form
    width: $feedback-form-width;
    position: absolute;
    left: - $feedback-form-width;
    top:0;
    bottom:0;
    z-index: 2;
    background-color: #fff;
    border-right: 1px solid $line-color;

    &__header
        position: absolute;
        top:0;
        width: 100%;
        height: $ff-header-height;
        padding: 0 24px;
        background-color: $theme.secondary;
        border-bottom: 1px solid $line-color;

    &__main
        padding: $ff-header-height 24px $ff-footer-height;
        height: 100%;

    &__footer
        position: absolute;
        bottom:0;
        width: 100%;
        height: $ff-footer-height;
        padding: 0 24px;
        background-color: $grey.lighten-4;
        border-top: 1px solid $line-color;

    &__closer
        position: absolute;
        top: -2px;
        bottom: 0;
        right: 16px;
        margin-top: auto;
        margin-bottom: auto;
        z-index:2;
        height: 24px;
        cursor: pointer;

    &__title
        line-height: $ff-header-height !important;

    &__btn
        position: absolute;
        left: 20px;
        top: 0;
        bottom: 0;
        margin-top: auto;
        margin-bottom: auto;

    &__loader
        position: absolute;
        top: 18px;
        left: 164px;

    .stepper 
        margin-left: -24px;
        margin-right: -24px;
        padding-top: 12px;
        padding-bottom: 16px;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;

        &__step
            align-items: flex-start
            padding-bottom:0

        &__label
            width: 85%
            line-height: 30px

        .input-group--required label:after{
          content: "";
        }

</style>
