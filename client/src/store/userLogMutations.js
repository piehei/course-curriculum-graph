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

export const USERLOG_APPEND = (state, item) => {
  state.userLog.push(item);
  state.userLogIndex = state.userLog.length;
}

