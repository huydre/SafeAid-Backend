// swagger.js
const swaggerAutogen = require('swagger-autogen')({
    openapi: '3.0.0',           // hoặc để default swagger: '2.0'
    language: 'en',
    autoHeaders: true,          // tự nhận headers Authorization nếu có
  });
  
  const outputFile = './docs/swagger-output.json';
  const endpointsFiles = [
    // đường dẫn tương đối đến mọi file route bạn có
    './routes/postRoutes.js',
    './routes/newsRoutes.js',
    './routes/commentRoutes.js',
    './routes/likeRoutes.js'
  ];
  
  const doc = {
    info: {
      title: 'First Aid App API',
      version: '1.0.0',
      description: 'Tài liệu API tự sinh bằng swagger-autogen'
    },
    servers: [
      { url: 'http://localhost:5000' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ],
    tags: [
      { name: 'Posts', description: 'Quản lý bài viết' },
      { name: 'News',  description: 'Quản lý tin tức' },
      { name: 'Comments', description: 'Bình luận trên News/Post' },
      { name: 'Likes', description: 'Like/Unlike bài viết' }
    ],
    // Bạn có thể định nghĩa sẵn mẫu chung
    definitions: {
      ErrorResponse: { error: 'Bạn chưa đăng nhập. Vui lòng cung cấp token.' }
    }
  };
  
  // Sinh file docs/swagger-output.json rồi khởi chạy app
  swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('✅ Swagger docs generated.');
    require('./app');  // hoặc './app.js'
  });
  