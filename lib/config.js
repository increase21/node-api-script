const config = {};

// API Keys Database Configuration
config.databases = {
   staging: {
      databaseOne: {
         host: 'localhost',
         user: 'root',
         password: '',
         database: '',
         encoding: 'utf8'
      },
      databaseTwo: {
         host: 'localhost',
         user: 'root',
         password: '',
         database: '',
         encoding: 'utf8'
      }
   },
   prod: {
      databaseOne: {
         host: '',
         user: '',
         password: '',
         database: '',
         encoding: 'utf8'
      },
      databaseTwo: {
         host: '',
         user: '',
         password: '',
         database: '',
         encoding: 'utf8'
      }
   }
};

config.db = process.env.NODE_ENV === 'dev' ? config.databases.staging : config.databases.prod;

// Email Configuration
config.mail = {
   nodemailer: {
      host: 'mail.redber.io',
      port: 143, // Change to 465 when secure
      secure: true,
      auth: {
         user: '',
         pass: ''
      }
   }
};

// Certificates
config.cert = {
   dev: {
      key: '/etc/apache2/ssl/localhost.key',
      cert: '/etc/apache2/ssl/localhost.crt'
   },
   prod: {
      key: '/etc/letsencrypt/live/example.com/privkey.pem',
      cert: '/etc/letsencrypt/live/example.com/cert.pem',
      ca: '/etc/letsencrypt/live/example.com/chain.pem'
   }
};

config.cert.creds = process.env.NODE_ENV === 'dev' ? config.cert.dev : config.cert.prod;

// Secure Connection Port
config.sslPort = process.env.NODE_ENV === 'dev' ? 4000 : 4000;

module.exports = config;