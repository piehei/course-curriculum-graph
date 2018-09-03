
const initLogging = (store) => {

  const localhost = "http://localhost:8888";
  const heroku = "https://cryptic-sierra-44763.herokuapp.com"

  window.CC_LOG_API_URL = window.location.origin.includes("localhost") ? localhost : heroku;
  window.CC_LOG_API_URL += "/api/v1/";

  store.subscribe((mutation, state) => {

    switch(mutation.type) {

      case "USERLOG_APPEND": {
        setTimeout(() => store.dispatch('LOG', mutation.payload), 0);
        break;
      }

    }

  })

}

export default initLogging;
