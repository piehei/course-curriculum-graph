import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

import courseList from '../assets/course-list.json';

import * as actions from './actions';
import * as userLogActions from './userLogActions';
import * as mutations from './mutations'
import * as userLogMutations from './userLogMutations';
import * as getters from './getters';


const USERLOG_API_USERNAME = localStorage['USERLOG_API_USERNAME'] || Math.random().toString(36).substring(3);

if (!localStorage['USERLOG_API_USERNAME']) {
  localStorage['USERLOG_API_USERNAME'] = USERLOG_API_USERNAME;
}

export default new Vuex.Store({

  state: {
    nodeList: courseList,
    meta: {},
    stateTouched: false,
    lowestPoint: 0,
    lowestId: "",
    UI: {
      deleteMode: false,
      zoom: { x: 0, y: 0, k: 1 },
      mouse: { x: 0, y: 0 },
      marginX: 0,
      marginY: 0,
    },
    overlay: {
      type: undefined,
      commentNodeId: undefined,
      connectionFrom: undefined,
      connectionTo: undefined,
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

    debug: {
      username: USERLOG_API_USERNAME,
    }
  },

  mutations: {
    ...mutations,
    ...userLogMutations,
  },

  actions: {
    ...actions,
    ...userLogActions,
  },

  getters: {
    nodes: getters.ALL_NODES,
    connections: getters.ALL_CONNECTIONS,
    posById: getters.POS_BY_ID,
    containerSize: getters.CONTAINER_SIZE_BY_ID,
    middlePointById: getters.CONTAINER_MIDDLE_POINT_BY_ID,
    comments: getters.COMMENTS,
    commentsByNodeId: getters.COMMENTS_BY_NODE_ID,
    moodByTypeAndNode: getters.MOOD_BY_TYPE_AND_NODE,
    moods: getters.MOODS,
  },

  plugins: [
    // this will save everything in the browser's localStorage
    createPersistedState({
      paths: [
        'userLog',
        'userLogIndex',
      ]
    })
  ],

});
