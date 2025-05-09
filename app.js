// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const db = require('./config/db');
const models = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Kiểm tra kết nối database
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error: ' + err));

// Tích hợp Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./config/swaggerOptions');

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Đồng bộ model với database (nếu cần, chỉ dùng trong development)
db.sync()
  .then(() => console.log('All models were synchronized successfully'))
  .catch((err) => console.log('Sync error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('First Aid App API is running');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/likes', require('./routes/likeRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/quiz-categories', require('./routes/quizCategoryRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/answers', require('./routes/answerRoutes'));
app.use('/api/quiz-attempts', require('./routes/quizAttemptsRoutes'));
app.use('/api/user-answers', require('./routes/userAnswerRoutes'));

// Các routes khác có thể thêm ở đây...
// app.use('/api/guides', require('./routes/guideRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
