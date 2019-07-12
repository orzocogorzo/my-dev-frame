module.exports = {
  dev: {
    name: 'development',
    host: 'localhost',
    port: 8050,
    apiURL: 'statics/data/',
    staticURL: 'statics/'
  },
  "dev:remote": {
    name: 'remotehost',
    apiURL: '{{protocol}}://{{host}}/rs/tracking/',
    host: "{{protocol}}://{{host}}/tracking/",
    staticURL: 'static/'
  },
  pro: {
    name: 'production',
    apiURL: './rest',
    host: "{{domain}}",
    staticURL: 'static/'
  }
}
