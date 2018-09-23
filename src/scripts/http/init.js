import Api from '/'

export default {

  get () {
    return Api().get('/init.json')
  }

}
