import axios from 'axios'

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

export function STATIC () {
  return axios.create({
    baseURL: environment.staticURL,
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}