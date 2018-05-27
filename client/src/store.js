import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

import CourseList from './assets/course-list.json';

const COMMIT_INITIAL_NODE_LIST = (state) => {
 console.log('lol');
};

const CHILDREN_BY_PARENT_ID = (state, id) => {

  return state.nodeList.filter(node => {
    return 'PARENT' in node && node['PARENT'] === id
  })
}

const ORGANIZE_OBJECTS = (state) => {

  let lastChildY= -125;

  state.nodeList.forEach(node => {

    if ('PARENT' in node) return;


    node.x = 100;
    node.y = lastChildY += 150;

    let verticalChildSpace = 0;
    const children = CHILDREN_BY_PARENT_ID(state, node.id);
    console.log(children)
    children.forEach((child, index) => {

       child.x = node.x + 300;
       child.y = node.y + index * 100;
       lastChildY = child.y;
       verticalChildSpace = index * 100;

     });

    node.y += verticalChildSpace / 2 - 5;

  });

  // const { point, id } = LOWEST_POINT_AND_ID(state.courseList);
  // state.lowestId = id;
  // state.lowestPoint = point;
};

const LOWEST_POINT_AND_ID = (nodeList) => {
  let lowestPointId = "";
  let lowestPoint = 0;

  nodeList.forEach(node => {
    if (node.y > lowestPoint) {
      lowestPoint = node.y;
      lowestPointId = node.id;
    }
  });

  return { point: lowestPoint, id: lowestPointId };
};

const SAVE_OBJECT_CONTAINER_SIZE = (state, { id, width, height, top }) => {

  Vue.set(state.meta, id, { width, height, top });

};


const SAVE_OBJECT_POSITION = (state, { posX, posY, objectId }) => {

  state.stateTouched = true;

  let lowestPointId = "";
  let lowestPoint = 0;

  const node = state.nodeList.filter(node => node.id === objectId)[0];

  node.x = posX;
  node.y = posY;

  if (node.y > lowestPoint) {
    lowestPoint = node.y;
    lowestPointId = node.id;
  }

  // TODO: fix this somehow
  if (posY > state.lowestPoint) {
    state.lowestId = objectId;
    state.lowestPoint = posY;
  }

  if (posY < lowestPoint) {
    state.lowestId = lowestPointId;
  }

  if (posY < state.lowestPoint && objectId === state.lowestId) {
    state.lowestPoint = posY;
  }
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
  const node = state.nodeList.filter(node => node.id === objectId)[0];
  return {
    x: node.x,
    y: node.y
  };
};


export default new Vuex.Store({

  state: {
    nodeList: CourseList,
    meta: {},
    stateTouched: false,
    connections: [
      { id: 1, from: "1001", to: "2001" },
    ],
    lowestPoint: 0,
    lowestId: "",
  },

  mutations: {
    SAVE_OBJECT_POSITION,
    ORGANIZE_OBJECTS,
    SAVE_OBJECT_CONTAINER_SIZE,
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
