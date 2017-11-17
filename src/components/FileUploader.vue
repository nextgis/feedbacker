<template>
    <div class="file-uploader" :class="{'file-uploader--disabled':disabled}">
        <bordered-block icon="photo"
                        text="Загрузите фото: <span class='link-style'>выберите его</span> или перетащите сюда">
            <file-upload v-if = "!disabled"
                :name="name"
                :extensions="extensions"
                :accept="accept"
                :multiple="multiple"
                :directory="directory"
                :thread="thread"
                :drop="drop"
                :dropDirectory="dropDirectory"
                v-model="files"
                @input-file="inputFile"
                ref="upload">
            </file-upload>
            <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active"></div>
        </bordered-block>
        <div v-if="files.length" class="file-uploader__files">
              <div class="file-uploader__file" v-for="(file, index) in files">
                    <div class="file-uploader__file-image">
                        <img v-if="file.type.substr(0, 6) == 'image/' && file.blob" :src="file.blob"/>
                    </div>
                    <div class="file-uploader__file-name">{{file.name}}</div>
                    <div class="file-uploader__file-action">
                        <v-icon class="file-uploader__file-remover" @click="$refs.upload.remove(file)">close</v-icon>
                    </div>
              </div>
        </div>
        <div v-else class="file-uploader__help-text caption">Загружать фото необязательно</div>
    </div>
</template>

<script>
import Vue from "vue"
import bus from "../js/eventBus"
import BorderedBlock from "./ui/BorderedBlock"
import FileUpload from 'vue-upload-component'

export default {
  props: [
    "disabled",
    "value"
  ],
  components: {
    BorderedBlock,
    FileUpload
  },
  data () {
    return {
        files: [],
        accept: 'image/png,image/gif,image/jpeg,image/webp',
        extensions: 'gif,jpg,jpeg,png,webp',
        multiple: true,
        directory: false,
        drop: true,
        dropElement: document.querySelector(".drop-active"),
        dropDirectory: false,
        thread: 3,
        name: 'file',
        auto: false
    }
  },
  watch:{
    value(value){
        if (!value.length) this.files = []
    }
  },
  mounted(){
    this.$forceUpdate()
  },
  methods:{
    inputFile(newFile, oldFile) {
        if (newFile && !oldFile) {
            var URL = window.URL || window.webkitURL
            if (URL && URL.createObjectURL) {
              this.$refs.upload.update(newFile, {blob: URL.createObjectURL(newFile.file)})
            }
        }

        let that = this
        Vue.nextTick(function () {
            that.$emit("fileUploader:changed", that.files)
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
@require '~vuetify/src/stylus/elements/_typography'
@require '../styl/custom-vuetify/_typography'
@require '~vuetify/src/stylus/trumps/_spacing'
@require '~vuetify/src/stylus/tools/_elevations'

.file-uploader
    width: 100%;
    
    .bordered-block
        position: relative

    .file-uploads,
    .drop-active
        position: absolute
        width: 100%
        height: 100%
        left: 0
        top:0
        cursor:pointer
        z-index: 2

    .drop-active
        border-radius: 2px
        background-color: rgba($theme.primary, .08)

    &__files
        display: table
        width: 100%
        margin-top: $spacer

    &__file
        display: table-row

        &:hover
            background-color: $light-bg


    &__file-image,
    &__file-name,
    &__file-action
        display: table-cell
        vertical-align: middle
        padding: $spacer*0.5 $spacer*0.5
    
    &__file-image
        border-bottom-left-radius: $card-border-radius
        border-top-left-radius: $card-border-radius

        img
            max-height: 60px
            max-width: 150px
            width: auto
            height: auto
            display: block
            border-radius: $card-border-radius
            elevation(3)

    &__file-name
        width: 100%
    
    &__file-action
        text-align: right
        padding-right: $spacer*0.75
        border-bottom-right-radius: $card-border-radius
        border-top-right-radius: $card-border-radius

    &__file-remover
        cursor: pointer

    &__help-text
        color: $grey.lighten-1

</style>
