

const post = (user_id, payload) => {
  console.log(`POST: ${user_id}`);
  console.log(payload);

  fetch(`${window.CC_LOG_API_URL}${user_id}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': user_id,
    },
    body: JSON.stringify(payload)
  })
  .then(res => {
    console.log(res)
  })

}


export const LOG = ({ state, commit }, payload) => {
  post(state.debug.username, payload)
}


export const DEBUG_SET_USERNAME = ({ state, dispatch, commit }, username) => {
  console.log('SET')
  state.debug.username = username;
  localStorage['USERLOG_API_USERNAME'] = username;


  state.userLog = [];
  state.userLogIndex = 0;

  dispatch('GET_USERLOG_FROM_SERVER');
}

export const GET_USERLOG_FROM_SERVER = ({ state, commit }) => {

  fetch(`${window.CC_LOG_API_URL}${state.debug.username}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': state.debug.username,
    },
  })
  .then(res => res.json())
  .then(userLog => {
    state.userLog = userLog;
    state.userLogIndex = userLog.length;
  })
}
