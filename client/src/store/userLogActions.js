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
};


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
};




export const USERLOG_ADD_CONNECTION_WITH_COMMENT = ({ commit, state }, { from, to, text }) => {

  // TODO: should this text go here? or somewhere else?
  const ts = (new Date()).getTime();
  const conn = {
    type: 'connection',
    from: from,
    to: to,
    text: text,
    connection_id: `${from}-${to}-${ts}`,
    timestamp: ts,
  };
  commit('USERLOG_APPEND', conn);
  state.overlay.connectionFrom = undefined;
  state.overlay.connectionTo = undefined;
};


export const USERLOG_MOOD_CLICKED = ({ commit }, { type, nodeId, indx }) => {

  const mood = {
    timestamp: (new Date()).getTime(),
    type: type.toLowerCase(),
    node: nodeId,
    indx: indx,
  };
  commit('USERLOG_APPEND', mood);
};


export const USERLOG_ADD_COMMENT_TO_NODE = ({ commit, state }, { nodeId, text, type }) => {

  if (!nodeId) {
    throw `${nodeId} is not legal nodeId!!!!`
  }
  const timestamp = (new Date()).getTime();
  const comment = {
    type: 'comment',
    node: nodeId,
    comment_id: `${nodeId}-${timestamp}`,
    text,
    comment_type: type,
    timestamp,
  };

  commit('USERLOG_APPEND', comment);
};


export const USERLOG_DELETE_COMMENT_FROM_NODE = ({ commit }, { nodeId, commentId }) => {
  const delete_comment = {
    type: 'comment',
    delete: true, // TODO: is this good?????????
    node: nodeId,
    comment_id: commentId,
    timestamp: (new Date()).getTime(),
  };
  commit('USERLOG_APPEND', delete_comment);
};


export const USERLOG_DELETE_CONNECTION = ({ commit, state }, { connectionId }) => {
  const delete_connection = {
    type: 'connection',
    delete: true,
    connection_id: connectionId,
    timestamp: (new Date()).getTime()
  };
  commit('USERLOG_APPEND', delete_connection);
  state.UI.deleteMode = false;
};

