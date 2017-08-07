<template>
    <div class="message-list">
        <message-card v-for="message in messages" 
                 :key="message.id"
                 :id="message.id"
                 :message="message.properties"
                 :isActive="message.id == activeMessage"
                 ref="card">
        </message-card>
    </div>
</template>

<script>
import MessageCard from "../components/MessageCard"

export default {
  props: [
    "messages",
    "activeMessage"
  ],
  components: {
    MessageCard
  },
  data () {
    return {
    }
  },
  watch:{
    activeMessage(value){
      if (!this.isActiveCardInView)
        this.activeCard.$el.scrollIntoView();
    }
  },
  computed:{
    activeCard(){
      let that = this
      return this.$refs.card.filter(function(card,){
        return (card.id == that.activeMessage)
      })[0]
    },
    activeCardRect(){      
      let activeCardRectAbs = this.activeCard.$el.getBoundingClientRect()

      return {
        top: activeCardRectAbs.top - this.listRect.top,
        left: activeCardRectAbs.left - this.listRect.left,
        right: activeCardRectAbs.right - this.listRect.left,
        bottom: activeCardRectAbs.bottom - this.listRect.top
      }
    },
    listRect(){
      return this.$el.getBoundingClientRect()
    },
    isActiveCardInView(){
      return  ((this.activeCardRect.top > 0) && 
              (this.activeCardRect.bottom < this.$el.clientHeight))
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
