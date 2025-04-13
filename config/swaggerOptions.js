// config/swaggerOptions.js

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'First Aid App API',
        version: '1.0.0',
        description: 'API Documentation cho ứng dụng First Aid App'
      },
      servers: [
        {
          url: 'http://localhost:5000',
          description: 'Local server'
        }
      ]
    },
    // Các file để Swagger scan comment API (ví dụ: routes và controllers)
    apis: ['./routes/*.js', './controllers/*.js']
  };
  
  module.exports = options;
  