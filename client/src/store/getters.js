export const CHILDREN_BY_PARENT_ID = (state, id) => {
  return state.nodeList.filter(node => {
    return 'parent' in node && node['parent'] === id
  })
}


export const USER_ADDED_CONNECTIONS = (state) => {
  const connections = [];
  const connectionIds = [];

  // go through all user added connections from back to front
  // pick only the first appearance by id
  state.userLog.slice(0, state.userLogIndex).reverse()
    .filter(e => e.type === 'connection')
    .map(conn => { return { ...conn, userAdded: true }; })
    .forEach(conn => {
      if (!connectionIds.includes(conn.connection_id)) {
        connections.push(conn);
        connectionIds.push(conn.connection_id);
      }
    })
  // filter out those with kv delete: true
  return connections.filter(conn => !conn.delete);
};


export const USER_ADDED_NODES = (state) => {
  return state.userLog.slice(0, state.userLogIndex).filter(e => e.type === 'node');
};


export const DELETE_EVENTS = (state) => {
  return state.userLog.slice(0, state.userLogIndex).filter(e => e.type === 'delete');
};


export const ALL_NODES = (state) => {
  const all = state.nodeList.concat(USER_ADDED_NODES(state));
  const deletedIds = DELETE_EVENTS(state).map(d => d.id);
  const undeleted = all.filter(node => deletedIds.indexOf(node.id) === -1);
  return undeleted;
};


export const BASE_CONNECTIONS = (state) => {

  const baseList = [];

  state.nodeList.forEach(course => {
    CHILDREN_BY_PARENT_ID(state, course.id).forEach(topic => {
      baseList.push({
        from: course.id,
        to: topic.id,
      });
    });
  });

  return baseList;
};


export const ALL_CONNECTIONS = (state) => {
  const base = BASE_CONNECTIONS(state);
  const user = USER_ADDED_CONNECTIONS(state);

  const nodeIds = ALL_NODES(state).map(n => n.id);

  const connectionsWithBothEnds = base.concat(user).filter(connection => {
    return nodeIds.indexOf(connection.from) !== -1 && nodeIds.indexOf(connection.to) !== -1;
  });

  return connectionsWithBothEnds;
};


export const CONTAINER_SIZE_BY_ID = (state) => (objectId) => {
  if (objectId in state.meta) {
    return state.meta[objectId];
  }
  return { width: 0, height: 0, top: 0 };
};


export const CONTAINER_MIDDLE_POINT_BY_ID = (state, getters) => (id) => {

  const size = getters.containerSize(id);
  const pos = getters.posById(id);

  return {
    x: pos.x + size.width / 2,
    y: pos.y + size.height / 2 + size.top,
  }

};


export const POS_BY_ID = (state) => (objectId) => {
  // if this node is currently being dragged to a new location
  // return the position from movingNode
  // --> this ensures the connections that touch the node
  // are updated all the time and the animation is smooth
  // REMEMBER: the location is NOT saved to userLog until dragging finishes
  if (state.movingNode.id === objectId) {
    return {
      x: state.movingNode.x,
      y: state.movingNode.y
    };
  }


  const s = (id) => {
    // history is a list that starts with the teacher defined original
    // nodes and connections and ends with the whole userlog
    // --> finding the first element from the end is the last committed pos
    const history = state.nodeList.concat(state.userLog.slice(0, state.userLogIndex));
    const node = history[history.map(elem => elem.id).lastIndexOf(id)];
    const origNode = state.nodeList.find(elem => elem.id === id);
    if (origNode.parent) {
      node.parent = origNode.parent;
    }
    return node;
  }

  const node = s(objectId);



  if (node.parent) {
    const parent = s(node.parent);
    //console.log(`${parent.id} + ${node.id}`);
    //console.log(`${parent.x} + ${node.x}`)

    if (state.movingNode.id === parent.id) {
      //console.log('parent moving')
      return {
        x: state.movingNode.x + node.x,
        y: state.movingNode.y + node.y,
      };
    }

    return {
      x: parent.x + node.x,
      y: parent.y + node.y,
    };
  }

  return {
    x: node.x,
    y: node.y
  };
};


export const COMMENTS = (state) => {
  const comments = {};

  // this goes reads userLog from back to front and picks all comments
  state.userLog.slice(0, state.userLogIndex).reverse().forEach(logElem => {
    if (logElem.type === 'comment') {
      if (!(logElem.node in comments)) {
        comments[logElem.node] = [];
      }

      // only the first instance of a comment with comment_id is picked
      if (!comments[logElem.node].map(i => i.comment_id).includes(logElem.comment_id)) {
        comments[logElem.node].push(logElem);
      }
    }
  });

  return comments;
};


export const COMMENTS_BY_NODE_ID = (state, getters) => (nodeId) => {
  if (nodeId in getters.comments) {
    // don't return comments whose state is deleted
    return getters.comments[nodeId].filter(c => !c.delete);
  }
  return [];
};


export const MOODS = (state) => {

  const mood = {
    star: {},
    smiley: {},
  };

  state.userLog.slice(0, state.userLogIndex).forEach(logElem => {
    if (logElem.type === 'star' || logElem.type === 'smiley') {
      if (!(logElem.id in mood[logElem.type])) {
        mood[logElem.type][logElem.node] = logElem.indx;
      }
    }
  });

  return mood;
};


export const MOOD_BY_TYPE_AND_NODE = (state, getters) => (type, nodeId) => {
  if (nodeId in getters.moods[type]) {
    return getters.moods[type][nodeId];
  }
  return 0;
};

