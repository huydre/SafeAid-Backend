// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const db = require('./config/db');
const models = require('./models'); 
const path = require('path');
const commentRoutes = require('./routes/commentRoutes');

const guideStepRoutes = require('./routes/guideStepRoutes');
const guideStepMediaRoutes = require('./routes/guideStepMediaRoutes');

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

// Serve thư mục uploads dưới đường dẫn /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Đồng bộ model với database (nếu cần, chỉ dùng trong development)
// Đồng bọc model với database (nếu cần, chỉ dùng trong development)
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
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/news/:news_id/comments', require('./routes/newsCommentRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/quiz-categories', require('./routes/quizCategoryRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/answers', require('./routes/answerRoutes'));
app.use('/api/quiz-attempts', require('./routes/quizAttemptsRoutes'));
app.use('/api/user-answers', require('./routes/userAnswerRoutes'));
app.use('/api/posts/:post_id/comments', commentRoutes);

// Các routes khác có thể thêm ở đây...
// app.use('/api/guides', require('./routes/guideRoutes'));

// Thêm route cho guides
app.use('/api/guides', require('./routes/guideRoutes'));

// Thêm route cho guide categories
app.use('/api/guide-categories', require('./routes/guideCategoryRoutes'));

// Thêm route cho guide media (nested route)
app.use('/api/guides/:guide_id/media', require('./routes/guideMediaRoutes'));

app.use('/api/guide-steps', guideStepRoutes);
app.use('/api/guide-step-media', guideStepMediaRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
