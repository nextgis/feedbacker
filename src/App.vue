<template>
  <v-app>
    <router-view v-if="dataLoaded"></router-view>
    <template v-else>
      <v-progress-circular
        indeterminate
        class="loader primary--text"
        :size="48"
      ></v-progress-circular>
    </template>
  </v-app>
</template>

<script>
import Vue from 'vue';

import Vuetify from 'vuetify';
Vue.use(Vuetify, {
  theme: {
    primary: '#006fbf',
    accent: '#00b77e',
    secondary: '#e5eef7',
    info: '#2196f3',
    warning: '#ffc107',
    error: '#ff5252',
    success: '#4caf50',
  },
});

import { mapState, mapActions } from 'vuex';

export default {
  name: 'app',
  computed: mapState([
    'user',
    'themes',
    'selectedThemeId',
    'dataLoaded',
    'searchQuery',
  ]),
  watch: {
    $route(to, from) {
      this.$store.commit('setPreviousRoute', from); // store the previouse route

      if (!this.user.uid && to.query.feedback && from.path != '/signin') {
        this.$router.push('/signin');
      }

      this.initRoutesData();
    },
  },
  mounted() {
    this.initStoreData();
  },
  methods: {
    showFeedbackForm() {
      Vue.nextTick(() => {
        this.$refs.mainContent.showForm();
      });
    },
    ...mapActions(['initStoreData', 'initRoutesData']),
  },
};
</script>

<style lang="styl">
@import "./styl/vuetify"

.loader
  position: fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
  margin: auto;
</style>
