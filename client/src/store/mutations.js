import Vue from 'vue';

// import courseList from '../assets/course-list.json';

import { CHILDREN_BY_PARENT_ID } from './index';


export const RESET_STATE = (state) => {
  state.userLog = state.userLog.slice(0, 0);
  state.userLogIndex = 0;
  ORGANIZE_OBJECTS(state);
};

export const ORGANIZE = (state) => {
  ORGANIZE_OBJECTS(state);
};

export const ORGANIZE_OBJECTS = (state) => {

  let lastChildY= -125;

  state.nodeList.forEach(node => {

    if ('parent' in node) return;

    // have to use Vue.set since the properties x an y
    // don't yet exist on the node itself (original json
    // doesn't include any positional stuff)
    Vue.set(node, 'x', 100);
    Vue.set(node, 'y', lastChildY + 150);

    let verticalChildSpace = 0;
    const children = CHILDREN_BY_PARENT_ID(state, node.id);
    children.forEach((child, index) => {

       Vue.set(child, 'x', node.x + 300);
       Vue.set(child, 'y', node.y + index * 100);
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


export const MOVE_OBJECT_TO = (state, { newX, newY, objectId }) => {
  state.stateTouched = true;
  Vue.set(state.movingNode, 'id', objectId);
  state.movingNode.x = newX;
  state.movingNode.y = newY;
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


export const CHANGE_PATH_SHAPE = (state, shape) => {
  state.UI.pathShape = shape;
};
