export const CONNECTION_ADDING_CLICK = (state, id) => {
  if (!state.overlay.connectionFrom) {
    state.overlay.connectionFrom = id;
  } else {
    const from = state.overlay.connectionFrom;
    if (from === id) return;
    state.overlay.connectionTo = id;
    state.overlay.type = 'LINKS';
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

export const ADD_NEW_NODE = (state, { parentId, name, x, y }) => {

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

  // TODO: if a connection is added like below, you can time travel backwards
  //       and remove the connection while keeping the node
  //       --> should this adding of new connection be refactored away
  //           and a new getter like CONNECTIONS_FROM_USER_ADDED_NODES
  //           be implemented that would return connections from nodes
  //           the user added?????

  const conn = {
    type: 'connection',
    from: parentId,
    to: node.id,
    timestamp: (new Date()).getTime()
  };
  state.userLog.push(conn);
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

export const ADD_CONNECTION_WITH_COMMENT = (state, { from, to, text }) => {

  // TODO: should this text go here? or somewhere else?
  state.userLog.push({
    type: 'connection',
    from: from,
    to: to,
    text: text,
    timestamp: (new Date()).getTime()
  });
  state.userLogIndex = state.userLog.length;
  state.overlay.connectionFrom = undefined;
  state.overlay.connectionTo = undefined;
}
