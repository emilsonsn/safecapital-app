declare const require: any;

export const environment = {
  production: false,
  appName: 'safecapital App',
  home: '/painel',
  api: 'http://46.202.144.243:8000/api',
  // api: 'http://127.0.0.1:8000/api',
  version: require('../../package.json').version
};

