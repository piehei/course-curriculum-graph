export const USERLOG_ADD_NEW_NODE = ({ commit }, { parentId, name, x, y }) => {

  const node = {
    type: 'node',
    id: (new Date()).getTime().toString().slice(-4), // four digit string
    name: name,
    x: x,
    y: y,
    timestamp: (new Date()).getTime(),
  };

  commit('USERLOG_APPEND', node);

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
  commit('USERLOG_APPEND', conn);
}

export const USERLOG_SAVE_NODE_LOCATION = ({ commit, state }, { id, x, y }) => {

  const posChange = {
    type: 'location',
    id: id,
    x: x,
    y: y,
    timestamp: (new Date()).getTime(),
  };
  commit('USERLOG_APPEND', posChange);
  state.movingNode.id = undefined;
}


export const USERLOG_DELETE_ITEM = ({ commit, state }, { type, id }) => {

  const delEvent = {
    type: 'delete',
    id: id,
    timestamp: (new Date()).getTime()
  };
  commit('USERLOG_APPEND', delEvent);
  state.UI.deleteMode = false;
}

export const USERLOG_ADD_CONNECTION_WITH_COMMENT = ({ commit, state }, { from, to, text }) => {

  // TODO: should this text go here? or somewhere else?
  const conn = {
    type: 'connection',
    from: from,
    to: to,
    text: text,
    timestamp: (new Date()).getTime()
  };
  commit('USERLOG_APPEND', conn);
  state.overlay.connectionFrom = undefined;
  state.overlay.connectionTo = undefined;
}

export const USERLOG_MOOD_CLICKED = ({ commit }, { type, nodeId, indx }) => {

  const mood = {
    timestamp: (new Date()).getTime(),
    type: type.toLowerCase(),
    node: nodeId,
    indx: indx,
  };
  commit('USERLOG_APPEND', mood);
}

