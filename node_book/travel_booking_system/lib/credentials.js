module.exports = {
  cookieSecret: 'your cookie secret goes here',
  gmail: {
    user: 'kevinkimaru99@gmail.com',
    password: ''
  },
  mongo: {
    development: {
      connectionString: 'mongodb://127.0.0.1:27017/vacations',
    },
    production: {
      connectionString: 'mongodb://127.0.0.1:27017/vacations',
    }
  }
};
