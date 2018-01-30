<template>
    <div class="messages">
        <detail-message v-show="activeMessageId && activeMessage"
                        :message = "activeMessage"></detail-message>
        <message-list v-show="!activeMessageId || !activeMessage"
                      :messages = "messages"></message-list>

        <v-dialog v-model="dialog.visibility" width="290">
          <v-card>
            <v-card-text>Вы действительно хотите удалить сообщение «{{ dialog.message ? dialog.message.properties.title : ""}}»?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn depressed @click.native="hideDialog()">Отмена</v-btn>
              <v-btn color="primary" depressed @click.native="deleteMessage(dialog.message.id)">Удалить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </div>
</template>

<script>
import {mapState} from "vuex"
import {mapGetters} from "vuex"
import bus from "../js/eventBus"
import MessageList from "../components/MessageList"
import DetailMessage from "../components/DetailMessage"

export default {
  components:{
    MessageList,
    DetailMessage
  },
  props: [
    "activeMessageId"
  ],
  data () {
    return {
      dialog: {
        visibility: false,
        message: undefined
      }
    }
  },
  computed:{
    ...mapState([
        "themes",
        "selectedThemeId"
    ]),
    ...mapGetters([
        "filteredCurrentLayer"
    ]),
    messages(){
      return this.filteredCurrentLayer ? this.filteredCurrentLayer.features : [];
    },
    activeMessage: function(){
      if (this.activeMessageId){
        let that = this,
            activeMessage = that.activeMessageId && that.messages.length ? that.messages.filter(function(message){
              return message.id==that.activeMessageId
            })[0] : null;
          return activeMessage
      }
    }
  },
  mounted(){
    bus.$on(["messageCard:deleteClicked", "detailMessage:deleteClicked"], (messageId) => {      
        this.showDialog(messageId);
    }, this);
  },
  methods: {
    showDialog(messageId){
        this.dialog.message = this.messages.filter((message) => { return (message.id==messageId) })[0];
        this.dialog.visibility = true;
    },
    hideDialog(){
        this.dialog.visibility = false;
        this.dialog.message = undefined;
    },
    deleteMessage(messageId){
        this.hideDialog();
        this.$store.dispatch('deleteMessage', {
            themeId: this.selectedThemeId,
            messageId: messageId
        });
    }
  }
}
</script>