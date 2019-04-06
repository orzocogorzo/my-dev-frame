module.exports = {
  dev: {
    host: 'localhost',
    name: 'development',
    apiURL: 'rest',
    staticURL: 'static/',
    port: 9000
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
