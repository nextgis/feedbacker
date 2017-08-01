<template>
  <v-app>
    <app-header></app-header>
    <div class="content">
      <component :is="currentPage"
                 :themes="themes"
                 :selectedThemeId="selectedThemeId"
                 :messages="messages"></component>
    </div>
  </v-app>
</template>

<script>
import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify)

import bus from "./js/eventBus"

import AppHeader from './components/AppHeader'
import MainContent from './pages/MainContent'
import FirstScreen from './pages/FirstScreen'

export default {
  name: 'app',
  components: {
    AppHeader,
    MainContent,
    FirstScreen
  },
  data () {
    return{
        selectedThemeId: undefined,
        themes: [
            "Санитарные рубки",
            "Рубки вблизи населенных пунктов",
            "Проектируемые парки и заповедники",
            "Существующие парки и заповедники",
            "Мораторные зоны",
            "Леса высокой социальной ценности FSC сертифицированных компаний"
        ],
        messages: [
            {
                id: 1,
                title: "Рубка в селе Поленово на взгорье за большим холмом",
                text: "Рядом с селом незаконно вырубают деревья. Прошу обратить внимание.",
                type: "Нарушение",
                themeId: 2,
                author: "Иван Феоктистов",
                date: "21.07.2017",
                coord: [64,44],
                photo: null,
                comments: 2
            },
            {
                id: 2,
                title: "Место сбора черники",
                text: "Собираю чернику в этом месте уже лет 10. Так же растут здесь и грибы.",
                type: "Предложение",
                themeId: 3,
                author: "Ангелина Сибагатулина",
                date: "21.07.2017",
                coord: [65,45],
                photo: null,
                comments: 0
            },
            {   
                id: 3,
                title: "Рубка в селе Поленово на взгорье за большим холмом",
                text: "Рядом с селом незаконно вырубают деревья. Прошу обратить внимание.",
                type: "Нарушение",
                themeId: 2,
                author: "Иван Феоктистов",
                date: "21.07.2017",
                coord: [63,43],
                photo: null,
                comments: 17
            },
            {
                id: 4,
                title: "Место сбора черники",
                text: "Собираю чернику в этом месте уже лет 10. Так же растут здесь и грибы.",
                type: "Предложение",
                themeId: 3,
                author: "Ангелина Сибагатулина",
                date: "21.07.2017",
                coord: [65.16,47],
                photo: null,
                comments: 2
            },
            {
                id: 5,
                title: "Рубка в селе Поленово на взгорье за большим холмом",
                text: "Рядом с селом незаконно вырубают деревья. Прошу обратить внимание.",
                type: "Нарушение",
                themeId: 2,
                author: "Иван Феоктистов",
                date: "21.07.2017",
                coord: [63.12,42],
                photo: null,
                comments: 0
            },
            {
                id: 6,
                title: "Место сбора черники",
                text: "Собираю чернику в этом месте уже лет 10. Так же растут здесь и грибы.",
                type: "Предложение",
                themeId: 3,
                author: "Ангелина Сибагатулина",
                date: "21.07.2017",
                coord: [61,46],
                photo: null,
                comments: 0
            }
      ],
      currentPage: "FirstScreen"
    }
  },
  created: function(){
    let that = this
    
    bus.$on('themes:themeActivated', function (selectedThemeId) {
      that.selectedThemeId = selectedThemeId
      that.currentPage = "MainContent"
    })
  }
}
</script>

<style lang="styl">
  @import "./styl/variables"
  @import "./styl/vuetify"
</style>
