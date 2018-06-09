import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

import courseList from '../assets/course-list.json';

import * as mutations from './mutations'
import * as userLogMutations from './userLogMutations';

export const CHILDREN_BY_PARENT_ID = (state, id) => {
  return state.nodeList.filter(node => {
    return 'parent' in node && node['parent'] === id
  })
}


const USER_ADDED_CONNECTIONS = (state) => {
  return state.userLog.slice(0, state.userLogIndex).filter(e => e.type === 'connection');
};


const USER_ADDED_NODES = (state) => {
  return state.userLog.slice(0, state.userLogIndex).filter(e => e.type === 'node');
};


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

  // if this node is currently being dragged to a new location
  // return the position from movingNode
  // --> this ensures the connections that touch the node
  // are updated all the time and the animation is smooth
  if (state.movingNode.id === objectId) {
    return {
      x: state.movingNode.x,
      y: state.movingNode.y
    };
  }

  // history is a list that starts with the teacher defined original
  // nodes and connections and ends with the whole userlog
  // --> finding the first element from the end is the last committed pos
  const history = state.nodeList.concat(state.userLog);
  const node = history[history.map(elem => elem.id).lastIndexOf(objectId)];
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
    },
    userLog: [
      // { type: 'connection'|'node'|'location',
      //   id: '1001', for nodes
      //   from: '2002', for connections
      //   to: '1001', for connections
      //   timestamp: (new Date()).getTime() }
    ],
    // what point of time should be displayed
    userLogIndex: 0,
    // needed for nicely animating the dragging of a node
    // check POS_BY_ID for more comments
    movingNode: {
      id: undefined,
      x: 0,
      y: 0,
    },
  },

  mutations: {
    ...mutations,
    ...userLogMutations,
  },

  actions: {},

  getters: {
    baseConnections: BASE_CONNECTIONS,
    posById: POS_BY_ID,
    containerSize: CONTAINER_SIZE_BY_ID,
    middlePointById: CONTAINER_MIDDLE_POINT_BY_ID,
    userAddedConnections: USER_ADDED_CONNECTIONS,
    userAddedNodes: USER_ADDED_NODES,
  },

  plugins: [
    createPersistedState()
  ],

});
