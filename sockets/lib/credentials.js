module.exports = {
  mongo: {
    development: {
      connectionString: 'mongodb://127.0.0.1/socketstest',
    },
    production: {
      connectionString: 'mongodb://127.0.0.1/socketstest',
    }
  },

  session: {
    secret: 'knowledge is power'
  },

  authProviders: {
    facebook: {
      development: {
        appId: '354327985032962',
        appSecret: '9e9ac0549438e32ab1cac5af253d396b'
      },
      production: {
        appId: '354327985032962',
        appSecret: '9e9ac0549438e32ab1cac5af253d396b'
      }
    },
    google: {
      development: {
        clientID: '',
        clientSecret: ''
      },
      production: {
        clientID: '',
        clientSecret: ''
      }
    }
  }
};
