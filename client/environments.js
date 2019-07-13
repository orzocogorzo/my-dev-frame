module.exports = {
  dev: {
    name: 'development',
    host: 'localhost',
    port: 8050,
    apiURL: 'statics/data/',
    staticURL: 'statics/'
  },
  "dev:py": {
    name: 'dev:py',
    apiURL: 'http://localhost:5000/rest/',
    host: "http://localhost:5000",
    staticURL: 'http://localhost:5000/statics/'
  },
  pro: {
    name: 'production',
    apiURL: 'rest/',
    host: "http://moaianalytics.com",
    staticURL: 'static/'
  }
}