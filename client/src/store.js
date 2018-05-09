import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

import CourseList from './assets/course-list.json';


const SAVE_OBJECT_POSITION = (state, { posX, posY, objectId }) => {

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

const POS_BY_ID = (state) => (objectId) => {
  console.log(objectId);
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
    connections: [
      { id: 1, from: "1001", to: "2001" },
    ],
  },

  mutations: {
    SAVE_OBJECT_POSITION,
  },

  actions: {},

  getters: {
    baseConnections: BASE_CONNECTIONS,
    posById: POS_BY_ID,
  },

  plugins: [
    createPersistedState()
  ],

});
