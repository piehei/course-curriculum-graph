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


const DELETE_EVENTS = (state) => {
  return state.userLog.slice(0, state.userLogIndex).filter(e => e.type === 'delete');
};


const ALL_NODES = (state) => {
  const all = state.nodeList.concat(USER_ADDED_NODES(state));
  const deletedIds = DELETE_EVENTS(state).map(d => d.id);
  const undeleted = all.filter(node => deletedIds.indexOf(node.id) === -1);
  return undeleted;
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


const ALL_CONNECTIONS = (state) => {
  const base = BASE_CONNECTIONS(state);
  const user = USER_ADDED_CONNECTIONS(state);

  const nodeIds = ALL_NODES(state).map(n => n.id);

  const connectionsWithBothEnds = base.concat(user).filter(connection => {
    return nodeIds.indexOf(connection.from) !== -1 && nodeIds.indexOf(connection.to) !== -1;
  });

  return connectionsWithBothEnds;
}


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
  const history = state.nodeList.concat(state.userLog.slice(0, state.userLogIndex));
  const node = history[history.map(elem => elem.id).lastIndexOf(objectId)];
  return {
    x: node.x,
    y: node.y
  };
};

const COMMENTS_BY_NODE_ID = (state) => (nodeId) => {
  if (nodeId in state.comments) {
    return state.comments[nodeId];
  }
  return [];
};


const SMILEYINDX_BY_NODE_ID = (state) => (nodeId) => {

  if (nodeId in state.smileys) {
    return state.smileys[nodeId];
  }

  // [ frown, meh, smile ] --> 1 is middleground
  return 0;
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
      deleteMode: false,
      zoomIdentity: undefined,
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
    comments: {
      // "1000": {
      //   text: "",
      //   type:
      // }
    },
    smileys: {
      // "1001": 3
    }
  },

  mutations: {
    ...mutations,
    ...userLogMutations,
  },

  actions: {},

  getters: {
    //userAddedConnections: USER_ADDED_CONNECTIONS,
    //userAddedNodes: USER_ADDED_NODES,
    nodes: ALL_NODES,
    //baseConnections: BASE_CONNECTIONS,
    connections: ALL_CONNECTIONS,
    posById: POS_BY_ID,
    containerSize: CONTAINER_SIZE_BY_ID,
    middlePointById: CONTAINER_MIDDLE_POINT_BY_ID,
    commentsByNodeId: COMMENTS_BY_NODE_ID,
    smileyIndxByNodeId: SMILEYINDX_BY_NODE_ID,
  },

  plugins: [
    // this will save everything in the browser's localStorage
    createPersistedState({
      paths: [
        'userLog',
        'userLogIndex',
        'comments',
        'smileys',
      ]

      // filter: (evt) => {
      //   // these commits will NOT be saved in the localStorage
      //   // ZOOM: do not save zoom state (state.ui.zoomIdentity)
      //   const skipThese = [
      //     'ZOOM',
      //     'CONNECTION_ADDING_CLICK',
      //   ];
      //   return skipThese.indexOf(evt.type) === -1;
      // }
    })
  ],

});
