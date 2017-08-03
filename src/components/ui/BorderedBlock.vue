<template>
    <div class="bordered-block">
        <v-icon large class="bordered-block__icon">{{ icon }}</v-icon>
        <div class="bordered-block__text">{{ text }}</div>
    </div>
</template>

<script>
    export default {
      props: [
        "icon",
        "text"
      ]
    }
</script>

<style lang="styl">

@require '~vuetify/src/stylus/settings/_colors';
@require '../../styl/custom-vuetify/_theme'
@require '../../styl/custom-vuetify/_variables'
@require '../../styl/variables'
@require '~vuetify/src/stylus/elements/_typography.styl'
@require '../../styl/custom-vuetify/_typography'
@require '../../styl/custom-vuetify/_transitions'
@require '~vuetify/src/stylus/trumps/_spacing.styl'


.bordered-block
    width: 100%
    height: 120px
    display: flex
    flex-direction: column
    align-items:center
    justify-content: center
    border: 1px dashed $grey.base
    border-radius:2px

    &__icon
        margin-bottom: $spacers.one.y
</style>
