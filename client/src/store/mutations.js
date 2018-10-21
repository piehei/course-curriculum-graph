import Vue from 'vue';

import { CHILDREN_BY_PARENT_ID } from './getters';

export const SCALE_X_Y = (state, { x, y }) => {
  // this properly scales mouse event client{X,Y} to current zoom
  // if you don't do this, dragged items move strangely on non-default zoom levels
  return {
    x: (x - state.UI.marginX - state.UI.zoom.x)/state.UI.zoom.k,
    y: (y - state.UI.marginY - state.UI.zoom.y)/state.UI.zoom.k,
  };
};


export const RESET_STATE = (state) => {
  // TODO: make sure this actually resets everything needed
  state.userLog = state.userLog.slice(0, 0);
  state.userLogIndex = 0;
  ORGANIZE_OBJECTS(state);
  state.UI.deleteMode = false;
  state.comments = {};
};

export const ORGANIZE = (state) => {
  ORGANIZE_OBJECTS(state);
};

const container_size_by_id = (state, id) => {
  if (id in state.meta) {
    return state.meta[id];
  }
  return { width: 0, height: 0, top: 0 };
};

export const ORGANIZE_OBJECTS = (state) => {
  console.log('ORGANIZE');
  let lastChildY = 0;
  const childMargin = 15;
  let actualCalc = false;

  state.nodeList.filter(node => node.type === 'PARENT').forEach(parent => {

    const children = CHILDREN_BY_PARENT_ID(state, parent.id);

    const sizes = children.map(c => container_size_by_id(state, c.id).height);
    let actualVertical = sizes.reduce((acc, curr) => acc + curr, 0);

    if (actualVertical === 0) {
      const childrenVSpace = children.length * 85;
      const parentY = lastChildY + childrenVSpace / 2;
      Vue.set(parent, 'x', 100);
      Vue.set(parent, 'y', parentY);
      children.forEach((child, index) => {
         Vue.set(child, 'x', parent.x + 400);
         Vue.set(child, 'y', lastChildY + index * 85 - parentY);
       });
      lastChildY = lastChildY + childrenVSpace + 150;
    } else {
      actualCalc = true;

      actualVertical += childMargin * sizes.length;

      // Y is the top most coordinate of the SVG box
      const parentY = lastChildY +
                      (actualVertical / 2) -
                      container_size_by_id(state, parent.id).height/2;

      Vue.set(parent, 'x', 100);
      Vue.set(parent, 'y', parentY);

      let currLastChildBottom = lastChildY;
      children.forEach((child, index) => {
        Vue.set(child, 'x', parent.x + 400);
        const currH = index === 0 ? 0 : sizes[index - 1];
        Vue.set(child, 'y', currLastChildBottom + currH + childMargin - parentY);
        currLastChildBottom += currH + childMargin;
       });

      lastChildY = lastChildY + actualVertical + 150;
    }
  });

  if (actualCalc) {
    state.stateTouched = true;
  }
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
  const { x, y } = SCALE_X_Y(state, { x: newX, y: newY });
  state.movingNode.x = x;
  state.movingNode.y = y;
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


export const TOGGLE_DELETE_MODE = (state) => {
  state.UI.deleteMode = !state.UI.deleteMode;
};


export const ZOOM = (state, zoom) => {
  state.UI.zoom = zoom;
};



export const SET_MOUSE_POSITION = (state, obj) => {
  const { x, y } = SCALE_X_Y(state, obj);
  state.UI.mouse.x = x;
  state.UI.mouse.y = y;
};

export const SET_APP_MARGINS = (state, { x, y }) => {
  state.UI.marginX = x;
  state.UI.marginY = y;
};


export const ADD_COMMENTS = (state, id) => {
  state.overlay.type = 'COMMENTS';
  state.overlay.commentNodeId = id;
}

export const ADD_LINKS = (state) => {
  state.overlay.type = 'LINKS';
}

export const CLOSE_OVERLAY = (state) => {
  state.overlay.type = undefined;
  state.overlay.commentNodeId = undefined;
  state.overlay.connectionFrom = undefined;
  state.overlay.connectionTo = undefined;
}
