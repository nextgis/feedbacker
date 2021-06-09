<template>
  <v-layout class="error-page" column wrap justify-center align-center ma-0>
    <div class="error-page__code">404</div>
    <div class="error-page__text">Такой страницы не существует</div>
    <v-btn class="error-page__btn" primary dark large to="/"
      >Вернуться на главную</v-btn
    >
  </v-layout>
</template>

<script>
export default {};
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
@require '~vuetify/src/stylus/tools/_elevations'

.error-page
    height: 100%;
    background-color: $theme.secondary;
    text-align: center;

    &__btn
        margin-top: 48px;

    &__code
        font-size: 150px;
        line-height: 1;
        color: $theme.primary;
        margin-top: -48px;
        font-family: $heading-font-family;
        font-weight: bold;
        marign-bottom: 6px;

    &__text
        font-size: 18px;
</style>
