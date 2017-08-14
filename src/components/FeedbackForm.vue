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
            <div class="feedback-form__set-location bordered-block">
              <v-icon large class="bordered-block__icon">photo</v-icon>
              <div class="bordered-block__text">Загрузите фото</div>
            </div>
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
import Drawer from "./Drawer"
import axios from 'axios'
import {latlngToCoord} from "../js/utilities"

export default {
    props: [ 
        "active",
        "themes",
        "selectedThemeId",
        "editableLayer"
    ],
    components: {
        Drawer
    },
    data () {
        return {
            feedbackStep: 1,
            formValues: {
                title: undefined,
                text: undefined,
                type: undefined,
                theme: this.themes[this.selectedThemeId].name,
                latlng: undefined
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
      themeList(){
        return this.themes.map(function(theme){ return theme.name })
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
        selectedThemeId(val){
            this.$set(this.formValues, 'theme', this.themes[val].name)
        }
    },
    created(){
        let that = this

        bus.$on("map:markerAdded", function(latlng){
            that.formValues.latlng = latlng
        })
    },
    methods: {
        triggerClose(){
          this.$emit("feedbackForm:closed");
          this.resetForm();
        },
        resetForm(){
          this.feedbackStep = 1;
          for (let key in this.formValues) {
            if (key != "theme") this.formValues[key] = undefined;
          }
          this.$refs.drawer.reset();
          this.$el.scrollTop = 0
        },
        submitForm(){
            if (!this.formInProgress){
                let point = latlngToCoord(this.formValues.latlng)

                this.formInProgress = true

                axios.create({withCredentials: true})
                     .post(config.nextgiscomUrl + "/api/resource/" + this.editableLayer.resource.id + "/feature/",
                            JSON.stringify( {
                                geom: "POINT(" + point.x + " " + point.y + ")",
                                fields: {
                                    title: this.formValues.title,
                                    type1: this.formValues.type,
                                    theme: this.formValues.theme,
                                    text: this.formValues.text,
                                    author: "Иван Иванов",
                                    date: new Date()
                                }
                            })
                     )
                     .then(response => {
                        this.triggerClose()
                        this.resetForm()
                        this.formInProgress = false
                        bus.$emit("feedbackForm:submitted", this.selectedThemeId)
                     })
                     .catch(e => {
                        this.formInProgress = false
                        bus.$emit("feedbackForm:failed", e)
                        console.log(e)
                     })
            }
        },
        onFormScroll(e){
            if (this.$refs.drawer.active)
                this.$refs.drawer.calcArrowPosition(e.target.scrollTop)
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
        position: absolute;
        right:$spacers.two.x;
        top: $spacers.two.y;
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
