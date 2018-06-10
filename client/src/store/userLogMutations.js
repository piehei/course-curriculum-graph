export const CONNECTION_ADDING_CLICK = (state, id) => {
  state.UI.showConnectionAdder = true;
  if (!state.UI.newConnectionFrom) {
    state.UI.newConnectionFrom = id;
  } else {
    const from = state.UI.newConnectionFrom;
    state.UI.newConnectionFrom = undefined;
    if (from === id) return;
    state.userLog.push({
      type: 'connection',
      from: from,
      to: id,
      timestamp: (new Date()).getTime()
    });
    state.userLogIndex = state.userLog.length;
  }
};

export const TRAVEL_USERLOG_HISTORY = (state, direction) => {
  const currentLastIndex = state.userLog.length;

  if (direction === 1) {
    if (state.userLogIndex < currentLastIndex) {
      state.userLogIndex += 1;
    }
  } else if (direction === -1) {
    if (state.userLogIndex > 0) {
      state.userLogIndex -= 1;
    }
  }

};

export const RESET_USERLOG_TRAVEL = (state) => {
  state.userLogIndex = state.userLog.length;
};

export const ADD_NEW_NODE = (state, { name, x, y }) => {

  const node = {
    type: 'node',
    id: (new Date()).getTime().toString().slice(-4), // four digit string
    name: name,
    x: x,
    y: y,
    timestamp: (new Date()).getTime(),
  };

  state.userLog.push(node);
  state.userLogIndex = state.userLog.length;
}

export const SAVE_NODE_LOC_TO_USERLOG = (state, { id, x, y }) => {

  const posChange = {
    type: 'location',
    id: id,
    x: x,
    y: y,
    timestamp: (new Date()).getTime(),
  };

  state.userLog.push(posChange);
  state.userLogIndex = state.userLog.length;
  state.movingNode.id = undefined;
}


export const DELETE_ITEM = (state, { type, id }) => {

  const delEvent = {
    type: 'delete',
    id: id,
    timestamp: (new Date()).getTime()
  };

  state.userLog.push(delEvent);
  state.userLogIndex = state.userLog.length;
  state.UI.deleteMode = false;
}
