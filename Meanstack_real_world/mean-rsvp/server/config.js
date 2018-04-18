module.exports = {
  AUTH0_DOMAIN: 'kevinkimaru.auth0.com', // e.g., kmaida.auth0.com
  AUTH0_API_AUDIENCE: 'http://localhost:8083/api/', // e.g., ''
  MONGO_URI: process.env.MONGO_URI || 'mongodb://rsvp:rsvp@ds157112.mlab.com:57112/mean_rsvp_auth0'
};
