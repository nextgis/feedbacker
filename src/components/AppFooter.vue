<template>
    <footer class="app-footer caption" :class="{ 'app-footer--withForm':formActive }">
        <v-layout row wrap ma-0>
            <v-flex class="app-footer__map-attribution" xs8 px-2
                    v-html="attribution"></v-flex>
            <v-flex class="app-footer__copyright" xs4 px-2 text-xs-right>
                Разработано в <a href="https://nextgis.ru" target="_blank">NextGIS</a>
            </v-flex>
        </v-layout>    
    </footer>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: mapState(['attribution', 'formActive']),
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

.app-footer
    position: absolute;
    bottom:0;
    left:0;
    z-index: 2;
    width: 100%;
    background-color: rgba(0,0,0,.82);
    color: #dedede;
    line-height: $footer-height;
    height: $footer-height;

    a
        color: #dedede;

</style>