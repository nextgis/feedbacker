<template>
    <div>
        <app-header></app-header>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>    
</template>

<script>
import AppHeader from '../components/AppHeader'

export default {
    components:{ AppHeader },
    props:[
    ],
    data () {
        return {
        }
    },
    methods:{
    }
}
</script>
