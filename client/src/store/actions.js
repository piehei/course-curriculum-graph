

const post = (user_id, payload) => {
  console.log(`POST: ${user_id}`);
  console.log(payload);

  fetch(window.CC_LOG_API_URL, {
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
  post(1111, payload)
}
