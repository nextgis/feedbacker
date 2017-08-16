<template>
    <div class="file-uploader">
        <bordered-block icon="photo"
                        text="Загрузите фото: выберите его или перетащите сюда">
            <file-upload
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
        </bordered-block>
        <table v-if="files.length">
            <tbody>
              <tr v-for="(file, index) in files">
                  <td v-if="file.type.substr(0, 6) == 'image/' && file.blob">
                    <img :src="file.blob" width="50" height="auto" />
                  </td>
                  <td v-else></td>
                  <td>{{file.name}}</td>
                  <td>{{file.size}}</td>
                  <td><button type="button" @click.prevent="$refs.upload.remove(file)">x</button></td>
              </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import bus from "../js/eventBus"
import BorderedBlock from "./ui/BorderedBlock"
import FileUpload from 'vue-upload-component'

export default {
  props: [
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
        multiple: false,
        directory: false,
        drop: true,
        dropDirectory: false,
        thread: 3,
        name: 'file',
        auto: false
    }
  },
  methods:{
    inputFile(newFile, oldFile) {
        if (newFile && !oldFile) {
            var URL = window.URL || window.webkitURL
            if (URL && URL.createObjectURL) {
              this.$refs.upload.update(newFile, {blob: URL.createObjectURL(newFile.file)})
            }
        }
        if (newFile && oldFile) {
            this.$emit("input", newFile.file)
        }
    },
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

.file-uploader
    width: 100%;
    
    .bordered-block
        position: relative

    .file-uploads
        position: absolute
        width: 100%
        height: 100%
        left: 0
        top:0
        cursor:pointer
        z-index: 2

</style>
