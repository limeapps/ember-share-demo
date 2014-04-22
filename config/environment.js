module.exports = function(environment) {
  var ENV = {
    rootURL: '/',
    FEATURES: {
      // Here you can enable experimental featuers on an ember canary build
      // e.g. 'with-controller': true
    }
  };

  if (environment === 'development') {
    ENV.port = '7007';
  }

  if (environment === 'production') {
    ENV.port = '80';
  }

  return JSON.stringify(ENV); // Set in index.html
};
