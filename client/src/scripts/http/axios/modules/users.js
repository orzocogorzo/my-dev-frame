import { API } from '/';

export default {

  login (credentials) {
    return API().post('login', credentials);
  }
}
