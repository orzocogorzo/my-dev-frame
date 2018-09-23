import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: environment.apiURL,
    withCredentials: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}