import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import {config} from "./config"
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    state:{
        themes: [],
        selectedThemeId: undefined,
        user: { 
            uid: undefined,
            name: undefined
        }
    },
    getters:{
        getThemeById: (state) => (id) => {
            return state.themes[id]
        }
    },
    mutations:{
        setData(state, data){
            state.themes = data
        },
        selectTheme(state, id){
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
            Vue.set(state.user, 'uid', data.uid);
            Vue.set(state.user, 'name', data.name);
        }
    },
    actions:{
        initStoreData({dispatch, commit}){
            dispatch('getThemes')
            .then((themes) => {
                dispatch('getLayers', themes).then((themes) => {
                    commit('setData', themes);
                });
            });

            dispatch('getUserData');
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
            let theme = getters.getThemeById(themeId);
            dispatch('getAttachements', theme)
            .then((data) => {
                commit('setAttachements', {id: themeId, data: data});
            })
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
                        axios.create({withCredentials: true})
                        .get(featureApiUrl)
                        .then(function(response){
                            let attachment,
                                imgUrl;

                            if (response.data.extensions.attachment && response.data.extensions.attachment[0].is_image){
                                attachment = response.data.extensions.attachment[0],
                                imgUrl = featureApiUrl + "/attachment/" + attachment.id + "/image"
                              //that.$set(feature, 'attachments', imgUrl)
                            }
                            resolve(imgUrl);
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
        getUserData({commit}){
            // get userData from NGW by API
            if (localStorage.getItem("clientId")){
                let clientIdDecoded = window.atob(localStorage.getItem("clientId")).split(":"),
                    userData = config.users.filter((user) => {return (user.login === clientIdDecoded[0] && user.password === clientIdDecoded[1])})[0];
                commit('setUserData', userData);
            }
        }
    },
    strict: debug
})