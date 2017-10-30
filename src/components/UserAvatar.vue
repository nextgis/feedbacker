<template>
    <v-menu v-else class="user-avatar mr-2">
        <template slot="activator">                    
            <div class="user-avatar__label"> {{ nameLetters }} </div>
            <v-icon class="user-avatar__icon icon--small">keyboard_arrow_down</v-icon>
        </template>                
        <v-list>
            <v-subheader>{{ userName }}</v-subheader>
            <v-divider></v-divider>
            <v-list-tile @click="logout()">
              <v-list-tile-title>Выйти</v-list-tile-title>
            </v-list-tile>
        </v-list>
    </v-menu>
</template>

<script>
import bus from "../js/eventBus"

export default {
  props: [
    "userName"
  ],
  data () {
    return {
    }
  },
  computed: {
    nameLetters(){
      let nameLetters = "";
      this.userName.split(" ").forEach((word, index) => {         
        if (index < 2) {
          nameLetters += word.charAt(0) 
        }
      });
      return nameLetters; 
    }
  },
  methods: {
    logout(){
      localStorage.removeItem("clientId");
      this.$store.commit("setUserData", {uid: undefined, name:undefined});
      if (this.$route.query.feedback)
        this.$router.push(this.$route.path);
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
@require '~vuetify/src/stylus/tools/_elevations.styl'

.user-avatar
    &__label
        @extend .title;
        display: inline-block;
        width: 40px;
        height: 40px;
        line-height: 40px !important;
        background: rgba(0,0,0,.06);
        border-radius: 2px;
        color: $theme.primary;
        text-align: center;
        user-select: none;

    &__icon
        margin-left: -2px;

</style>
