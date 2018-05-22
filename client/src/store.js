import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

import CourseList from './assets/course-list.json';


const ORGANIZE_OBJECTS = (state) => {

  let lastTopicY = 0;

  state.courseList.forEach((course, courseCount) => {

    course.x = 100;
    course.y = lastTopicY + 150;

    let verticalTopicSpace = 0;
    course.topics.forEach((topic, index) => {

      topic.x = course.x + 300;
      topic.y = course.y + index * 100;
      lastTopicY = topic.y;
      verticalTopicSpace = index * 100;

    });

    course.y += verticalTopicSpace / 2 - 5;

  });


};


const SAVE_OBJECT_CONTAINER_SIZE = (state, { id, width, height, top }) => {

  Vue.set(state.meta, id, { width, height, top });

};


const SAVE_OBJECT_POSITION = (state, { posX, posY, objectId }) => {

  state.stateTouched = true;

  state.courseList.forEach(course => {
    if (course.id === objectId) {
      course.x = posX;
      course.y = posY;
    }
    course.topics.forEach(topic => {
      if (topic.id === objectId) {
        topic.x = posX;
        topic.y = posY;
      }
    });
  });

};



const BASE_CONNECTIONS = (state) => {

  const baseList = [];

  state.courseList.forEach(course => {
    course.topics.forEach(topic => {
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
  let match = {};
  state.courseList.forEach(course => {
    if (course.id === objectId) {
      match = {
        x: course.x,
        y: course.y,
      };
    }
    course.topics.forEach(topic => {
      if (topic.id === objectId) {
        match = {
          x: topic.x,
          y: topic.y,
        };
      }
    });
  });

  return match;
};


export default new Vuex.Store({

  state: {
    courseList: CourseList,
    meta: {},
    stateTouched: false,
    connections: [
      { id: 1, from: "1001", to: "2001" },
    ],
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
