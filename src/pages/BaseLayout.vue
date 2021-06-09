<template>
  <div>
    <app-header></app-header>
    <div class="content">
      <router-view></router-view>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  props: [],
  data() {
    return {};
  },
  methods: {},
};
</script>
