import { API } from '/';
// import { STATIC } from '/';

export default {

  login (credentials) {
    return API().post('/users/login'  + (environment.name === "development" ? '.json' : ''), credentials);
  }
}
  // survey () {
  //   return STATIC().get('/data/questions.json');
  // }
