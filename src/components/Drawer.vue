<template>
    <div v-if="latlng" class="drawer drawer--completed">
        <span class="drawer__label mr-2">Местоположение:</span> {{latlng.lat}}, {{latlng.lng}}
        <div class="drawer__help-text caption">Вы можете изменить местоположение, подвинув метку на карте</div>
    </div>
    <bordered-block v-else
                    class="drawer"
                    icon="my_location"
                    text="Укажите место на карте">
    </bordered-block>
</template>

<script>
import bus from "../js/eventBus"
import BorderedBlock from "./ui/BorderedBlock"

export default {
  props: [
    "latlng"
  ],
  components: {
    BorderedBlock
  },
  data () {
    return {
        active: false,
        arrow: undefined
    }
  },
  beforeDestroy(){
    this.removeArrow()
  },
  watch: {
    latlng(value){
        if (value)
           this.deactivate() 
    }
  },
  methods:{
    activate(){
        this.active = true
        this.createArrow()
        this.showArrow()
        bus.$emit("drawer:activated")
    },
    deactivate(){
        this.removeArrow()
        this.active = false
        bus.$emit("drawer:deactivated")
    },
    reset(){
        this.deactivate()
        bus.$emit("drawer:reseted")
    },
    createArrow(){
        let that = this;
            
        this.arrow = document.createElement('div');
        this.arrow.className = "drawer-arrow";
        this.arrow.innerHTML = "<svg x='0px' y='0px' width='196.9px' height='95.2px' viewBox='0 0 196.9 95.2' style='enable-background:new 0 0 196.9 95.2;' xml:space='preserve' fill='rgb(250,49,9)'>\
            <path d='M3,94.1c4.7-14.3,13.3-28.1,22.8-39.7C47,28,77.3,11,111.2,7.9c28.6-2.6,57.2,3.7,83.9,13.7c1.8,0.7,2.6-2.2,0.8-2.9\
                C153.5,2.9,105.1-3.2,63.7,18.7C39.3,31.7,20,52.9,7.2,77.2c-2.7,5.2-5.3,10.6-7.1,16.1C-0.5,95.2,2.4,96,3,94.1L3,94.1z'/>\
            <path d='M196.5,19c-6.2-6.2-12.4-12.4-18.6-18.6c-1.4-1.4-3.5,0.8-2.1,2.1c6.2,6.2,12.4,12.4,18.6,18.6 C195.8,22.5,197.9,20.4,196.5,19L196.5,19z'/>\
            <path d='M165.4,24.5c10-0.8,20-1.6,30-2.5c1.9-0.2,1.9-3.2,0-3c-10,0.8-20,1.6-30,2.5C163.5,21.6,163.5,24.6,165.4,24.5 L165.4,24.5z'/>\
        </svg>";

        document.body.append(this.arrow)

    },
    showArrow(){
        let that =this;

        setTimeout(function(){
            that.calcArrowPosition();
            that.arrow.classList.add("drawer-arrow--active");
            //that.arrow.style.display = "block"
        }, 600)
    },
    removeArrow(){
        if (this.arrow) {
            document.body.removeChild(this.arrow);
            this.arrow = undefined;
        }
    },
    calcArrowPosition(topScroll){
        let drawerCoords = this.$el.getBoundingClientRect();
        Object.assign(this.arrow.style, {
            top: drawerCoords.top  + "px"
        }); 
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

.drawer__label
    color: $material-light.text.secondary;

.drawer__help-text
    color: $grey.lighten-1
    margin-top: -6px


.drawer-arrow
    position: absolute
    top: 0
    left: $feedback-form-width - 100
    opacity:0
    z-index: 1000
    margin-top: -60px
    transition: none

    &--active
        opacity: 1
        transition: opacity $secondary-transition

</style>
