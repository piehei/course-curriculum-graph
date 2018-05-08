import Vue from 'vue';
import Vuex from 'vuex';

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




export default new Vuex.Store({

  state: {
    courseList: CourseList,
  },

  mutations: {
    SAVE_OBJECT_POSITION,
  },

  actions: {},

});
