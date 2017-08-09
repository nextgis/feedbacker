<template>
    <div class="message-list">
        <message-card v-for="message in messages" 
                 :key="message.id"
                 :id="message.id"
                 :message="message.properties"
                 :isActive="message.id == activeMessageId"
                 ref="card">
        </message-card>
    </div>
</template>

<script>
import MessageCard from "../components/MessageCard"

export default {
  props: [
    "messages",
    "activeMessageId"
  ],
  components: {
    MessageCard
  },
  data () {
    return {
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
@require '~vuetify/src/stylus/trumps/_spacing.styl'

.message-list
  position: absolute;
  right:0;
  top:0;
  bottom:0;
  z-index: 1000;
  overflow-y: scroll;

</style>
