import Vue from 'vue';

import courseList from '../assets/course-list.json';

import { CHILDREN_BY_PARENT_ID } from './index';


export const RESET_STATE = (state) => {
  ORGANIZE_OBJECTS(state);
};


export const ORGANIZE_OBJECTS = (state) => {

  let lastChildY= -125;

  state.nodeList.forEach(node => {

    if ('parent' in node) return;


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


export const LOWEST_POINT_AND_ID = (nodeList) => {
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


export const SAVE_OBJECT_CONTAINER_SIZE = (state, { id, width, height, top }) => {

  Vue.set(state.meta, id, { width, height, top });

};


export const MOVE_OBJECT_BY = (state, { deltaX, deltaY, objectId }) => {
  state.stateTouched = true;
  const node = state.nodeList.filter(node => node.id === objectId)[0];
  node.x += deltaX;
  node.y += deltaY;
};


export const SAVE_OBJECT_POSITION = (state, { posX, posY, objectId }) => {

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

