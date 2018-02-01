import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import {config} from "./config"
import router from "./router"
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    state:{
        projectName: "Feedbacker",
        projectDescription: undefined,
        dataLoaded: false,
        themes: [],
        selectedThemeId: undefined,
        messageId: undefined,
        searchQuery: undefined,
        attribution: "",
        user: { 
            uid: undefined,
            name: undefined
        },
        formActive: false,
        previousRoute: null
    },
    getters:{
        getThemeById: (state) => (id) => {
            return state.themes[id]
        },
        currentLayer: (state) => {
            return state.themes[state.selectedThemeId] ? state.themes[state.selectedThemeId].editableLayer.geojson : undefined
        },
        filteredCurrentLayer: (state, getters) => {
            let filteredLayer = Object.assign({}, getters.currentLayer);
            if (state.searchQuery && getters.currentLayer) {
                filteredLayer.features = getters.currentLayer.features.filter((feature) => {
                    let totalString = (feature.properties.title + " " + feature.properties.text + " " + feature.properties.author).toLowerCase();
                    return totalString.indexOf(state.searchQuery.toLowerCase()) > -1;
                });
            }
            return filteredLayer;
        }
    },
    mutations:{
        setData(state, data){
            state.themes = data;
            state.dataLoaded = true;
        },
        setSelectedThemeId(state, id){
            state.selectedThemeId = id;
        },
        setMessages(state, params){
            Vue.set(state.themes[params.id].editableLayer, 'geojson', params.data);
        },
        setAttachements(state, params){
            state.themes[params.id].editableLayer.geojson.features.forEach((feature, index) => {
                Vue.set(feature, 'attachments', params.data[index]);
            });
        },
        setUserData(state, data){
            Vue.set(state.user, 'uid', data.id);
            Vue.set(state.user, 'name', data.display_name);
        },
        setAttribution(state, attribution){
            state.attribution = attribution;
        },
        setSearchQuery(state, searchQuery){
            state.searchQuery = searchQuery;
        },
        setFormActive(state, formActive){
            state.formActive = formActive;
        },
        setPreviousRoute(state, route){
            state.previousRoute = route
        },
        setProjectName(state, name){
            state.projectName = name;            
        },
        setProjectDescription(state, description){
            state.projectDescription = description;            
        }
    },
    actions:{
        initRoutesData({state, commit, dispatch}){
            dispatch('initRoutesTheme');
            dispatch('initRoutesFeedback');
            dispatch('initRoutesSearch');
        },
        initRoutesTheme({state, commit, dispatch}){
            if (state.selectedThemeId != state.route.params.themeId){
                let themeExist = state.route.params.themeId && state.themes[ state.route.params.themeId];
                if (!themeExist && state.route.params.themeId!=undefined)
                    router.push("/404");

                if (themeExist){
                    let activeMessage = state.themes[state.route.params.themeId].editableLayer.geojson.features.filter( feature => {
                        return parseInt(feature.id) == state.route.params.messageId;
                    })[0],
                    messageExist = state.route.params.messageId && activeMessage;

                    if (!messageExist && state.route.params.messageId!=undefined)
                            router.push("/404");
                }

                dispatch('selectTheme', state.route.params.themeId);
            }
        },
        initRoutesFeedback({state, commit, dispatch}){
            if (state.route.query.feedback != state.formActive ){
                commit("setFormActive", state.route.query.feedback)
            }
        },
        initRoutesSearch({state, commit, dispatch}){
            if (state.route.query.search != state.searchQuery ){
                commit("setSearchQuery", state.route.query.search)
            }
        },
        initStoreData({dispatch, commit}){
            //init project data
            axios.get(config.nextgiscomUrl + "/api/resource/" + config.baseResourceId)
            .then(response => {
                commit('setProjectName', response.data.resource.display_name);
                commit('setProjectDescription', response.data.resource.description);
            })
            .catch(e => {
                console.error(e);
            })

            // init themes
            dispatch('getThemes')
            .then((themes) => {
                dispatch('getLayers', themes).then((themes) => {
                    commit('setData', themes);
                    dispatch('initRoutesData');
                });
            });

            // init user data
            if (localStorage.getItem("clientId")){
                dispatch('getUserData', localStorage.getItem("clientId")).then((userData) =>{
                    if (userData.keyname != "guest")
                        commit('setUserData', userData)
                    else
                        localStorage.removeItem("clientId");
                });
            }
        },
        updateMessages({dispatch, commit, getters}, themeId){
            let theme = getters.getThemeById(themeId);
            dispatch('getMessages', theme)
            .then((data) => {
                commit('setMessages', {id: themeId, data: data});

                dispatch('getAttachements', theme)
                .then((data) => {
                    commit('setAttachements', {id: themeId, data: data});
                })
            })
        },
        updateAttachements({dispatch, commit, getters}, themeId){
            if (themeId){
                let theme = getters.getThemeById(themeId);
                dispatch('getAttachements', theme)
                .then((data) => {
                    commit('setAttachements', {id: themeId, data: data});
                })
            }
        },
        getThemes(){
            return new Promise(function(resolve, reject) {
                axios.get(config.nextgiscomUrl + "/api/resource/", {
                    params: {
                        parent: config.baseResourceId
                    }
                })
                .then(response => {
                    let resources = response.data
                        .map(function(item){
                            return item.resource
                        })
                        .filter(function(resource){
                            return resource.cls === 'resource_group'
                        })
                    let responseThemes = [];

                    resources.forEach(function(resource){
                        responseThemes.push({
                            id: resource.id,
                            name: resource.display_name,
                            editableLayer: {
                                resource: undefined,
                                geojson: undefined
                            },
                            relatedLayers: [],
                            extent: {
                                top: undefined,
                                right: undefined,
                                bottom: undefined,
                                left: undefined
                            }
                        })
                    })

                    resolve(responseThemes);
                })
                .catch(e => {
                    reject(e);
                })
            });
        },
        getLayers({dispatch}, themes){
            return new Promise( (resolve, reject) => {
                let themesPromises = [];

                themes.forEach(function(theme, index){
                    themesPromises.push(dispatch('getLayer', theme));
                });

                Promise.all(themesPromises)
                .then( response => {
                    resolve(themes);
                })
                .catch( e => {
                    reject(e);
                });
            });
        },
        getLayer({dispatch}, theme){
            return new Promise(function(resolve, reject) {
                axios.get(config.nextgiscomUrl + "/api/resource/", {
                    params: {
                        parent: theme.id
                    }
                })
                .then(response => {
                    let editableLayer,
                        relatedLayers = [],
                        layerPromises = [],
                        layerPromisesKeys = [];

                    response.data.forEach(function(item){
                        if (item.resource.display_name == "Messages"){
                            editableLayer = item.resource
                        } else if (item.resource.cls == "webmap"){
                            layerPromises.push(dispatch("getRelatedLayers", {
                                theme: theme,
                                mapId: item.resource.id
                            }));
                            layerPromisesKeys.push("relatedLayers");

                            layerPromises.push(dispatch("getExtent", {
                                theme: theme,
                                mapId: item.resource.id
                            }));
                            layerPromisesKeys.push("extent");
                        }
                    })

                    if (editableLayer){
                        theme.editableLayer.resource = editableLayer;
                        layerPromises.push(dispatch("getMessages", theme));
                        layerPromisesKeys.push("editableLayer");
                    }

                    if (layerPromises.length)
                        Promise.all(layerPromises).then((response) => {
                            let editableLayerIndex = layerPromisesKeys.findIndex((item) => item=='editableLayer');

                            if ( editableLayerIndex>=0 )
                                theme.editableLayer.geojson = response[editableLayerIndex];
                            resolve();
                        })
                        .catch((e) => reject(e))
                    else
                        resolve();
                })
                .catch(e => {
                    reject(e)
                });
            })
        },
        getMessages(context, theme){
            return new Promise( (resolve, reject) => {
                axios.get(config.nextgiscomUrl + "/api/resource/" + theme.editableLayer.resource.id + "/geojson")
                .then(response => {
                    resolve(response.data);
                })
                .catch(e => {
                    reject(e)
                });   
            });
        },
        getRelatedLayers(context, params){
            return new Promise( (resolve, reject) => {
                axios.get(config.nextgiscomUrl + "/api/resource/" + params.mapId)
                .then(response => {
                    let relatedLayers = response.data.webmap.root_item.children.map(function(layer){
                        return layer.layer_style_id
                    }).reverse()
                    if (relatedLayers.length)
                        params.theme.relatedLayers = relatedLayers;
                    resolve(params.theme)
                })
                .catch(e => {
                    reject(e)
                })   
            });
        },
        getExtent(context, params){
            return new Promise( (resolve, reject) => {
                axios.get(config.nextgiscomUrl + "/api/resource/" + params.mapId)
                .then(response => {
                    params.theme.extent.left = response.data.webmap.extent_left;
                    params.theme.extent.right = response.data.webmap.extent_right;
                    params.theme.extent.top = response.data.webmap.extent_top;
                    params.theme.extent.bottom = response.data.webmap.extent_bottom;
                    resolve(params.theme)
                })
                .catch(e => {
                    reject(e)
                });
            });
        },
        getAttachements(context, theme){
            return new Promise((resolve, reject) => {
                let featurePromises = [];

                theme.editableLayer.geojson.features.forEach((feature, index) => {
                    let featureApiUrl = config.nextgiscomUrl + "/api/resource/" + theme.editableLayer.resource.id + "/feature/" + feature.id;

                    featurePromises[index] = new Promise( (resolve, reject) => {
                        axios.get(featureApiUrl)
                        .then(function(response){
                            let attachment,
                                imgUrls = [];
                            if (response.data.extensions.attachment){
                                response.data.extensions.attachment.forEach(attachment  => {
                                    if (attachment.is_image){  
                                        imgUrls.push(featureApiUrl + "/attachment/" + attachment.id + "/image");
                                    }       
                                });
                            }   
                            
                            resolve(imgUrls);
                        })
                        .catch(e => {
                            reject(e)
                        });
                    });
                });

                Promise.all(featurePromises).then( response => {
                    resolve(response);
                })
                .catch( e => {
                    reject(e);
                });
            });    
        },
        getUserData({commit}, clientId){
            return new Promise( (resolve, reject) => {                
                axios.get(config.nextgiscomUrl + "/api/component/auth/current_user",{
                    headers: {
                        "Authorization" : "Basic " + clientId
                    }
                })
                .then(response => {
                    resolve(response.data);
                })
                .catch(e => {
                    reject(e)
                });
            });
        },
        deleteMessage({state, dispatch, commit}, params){
            let featureApiUrl = config.nextgiscomUrl + "/api/resource/" + state.themes[params.themeId].editableLayer.resource.id + "/feature/" + params.messageId;

            return new Promise((resolve, reject) => {
                axios.delete(featureApiUrl, { 
                    headers: {
                      "Authorization": "Basic " + localStorage.getItem("clientId")
                    }
                })
                .then(function(response){
                    dispatch("updateMessages", params.themeId);
                    resolve(response);
                })
                .catch(e => {
                    reject(e)
                });
            });
        },
        selectTheme({state, commit, dispatch}, id){
            commit('setSelectedThemeId', id);
            if (state.themes[id])
                dispatch('updateAttachements', id);
        },
    },
    strict: debug
})