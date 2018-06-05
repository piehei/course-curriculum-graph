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
