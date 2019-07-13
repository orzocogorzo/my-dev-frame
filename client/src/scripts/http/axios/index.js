import axios from 'axios';
import users from './modules/users.js';

export {
  users
};

export function API () {
  return axios.create({
    baseURL: environment.apiURL,
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}