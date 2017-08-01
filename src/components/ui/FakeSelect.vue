<template>
    <v-text-field
        class="fake-select"
        :class="{'fake-select--opened' : isOpened}"
        :value = "value"
        single-line
        full-width
        hide-details
        append-icon="arrow_drop_down"
        readonly
        @click.native = "onClick()"
    ></v-text-field>
</template>

<script>
export default {
    props:[ "value" ],
    data () {
        return {
            isOpened: false
        }
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
