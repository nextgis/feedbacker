<template>
    <v-text-field
        class="fake-select"
        :class="{'fake-select--opened' : isOpened}"
        :value = "value"
        :placeholder="placeholder"
        single-line
        full-width
        hide-details
        append-icon="arrow_drop_down"
        readonly        
        @click.native = "onClick()"
    ></v-text-field>
</template>

<script>
import bus from "../../js/eventBus"

export default {
    props:[ "value", "placeholder" ],
    data () {
        return {
            isOpened: false
        }
    },
    created(){
        let that = this

        bus.$on("themes:themeClicked", function(){
            that.isOpened = false
        })
    },
    methods:{
        onClick(){
            this.isOpened = !this.isOpened
            this.$emit("fakeSelect:clicked")
        }
    }
}
</script>

<style lang="styl">

    .fake-select
        cursor: pointer

        input
            cursor: pointer

        &--opened
            .icon
                transform: rotate(-180deg);

</style>
