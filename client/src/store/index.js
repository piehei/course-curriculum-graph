import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

import courseList from '../assets/course-list.json';

import * as mutations from './mutations'

export const CHILDREN_BY_PARENT_ID = (state, id) => {
  return state.nodeList.filter(node => {
    return 'parent' in node && node['parent'] === id
  })
}






const BASE_CONNECTIONS = (state) => {

  const baseList = [];

  state.nodeList.forEach(course => {
    CHILDREN_BY_PARENT_ID(state, course.id).forEach(topic => {
      baseList.push({
        from: course.id,
        to: topic.id,
      });
    });
  });

  return baseList;
};

const CONTAINER_SIZE_BY_ID = (state) => (objectId) => {
  if (objectId in state.meta) {
    return state.meta[objectId];
  }
  return { width: 0, height: 0, top: 0 };
};

const CONTAINER_MIDDLE_POINT_BY_ID = (state, getters) => (id) => {

  const size = getters.containerSize(id);
  const pos = getters.posById(id);

  return {
    x: pos.x + size.width / 2,
    y: pos.y + size.height / 2 + size.top,
  }

};


const POS_BY_ID = (state) => (objectId) => {
  const node = state.nodeList.filter(node => node.id === objectId)[0];
  return {
    x: node.x,
    y: node.y
  };
};


export default new Vuex.Store({

  state: {
    nodeList: courseList,
    meta: {},
    stateTouched: false,
    useCurves: true,
    connections: [
      { id: 1, from: "1001", to: "2001" },
    ],
    lowestPoint: 0,
    lowestId: "",
    UI: {
      pathShape: 'curve',
      possiblePathShapes: ['curve', 'path', 'line'],
    }
  },

  mutations: {
    ...mutations
  },

  actions: {},

  getters: {
    baseConnections: BASE_CONNECTIONS,
    posById: POS_BY_ID,
    containerSize: CONTAINER_SIZE_BY_ID,
    middlePointById: CONTAINER_MIDDLE_POINT_BY_ID,
  },

  plugins: [
    createPersistedState()
  ],

});
