// models/index.js
const User = require('./User');
const Post = require('./post.model');
const Comment = require('./comment.model');
const Like = require('./like.model');
const PostMedia = require('./postMedia.model'); 
const News = require('./news.model');
const NewsMedia = require('./newsMedia.model');
const NewsComment = require('./newsComment.model');

// Import các model mới
const Answer = require('./answer.model');
const EmergencyContact = require('./emergencyContact.model');
const FavouriteGuideList = require('./favouriteGuideList.model');
const FavouriteGuideItem = require('./favouriteGuideItem.model');
const GuideCategory = require('./guideCategory.model');
const GuideMedia = require('./guideMedia.model');
const Guide = require('./guide.model');
const Leaderboard = require('./leaderboard.model');
const News = require('./news.model');
const NewsMedia = require('./newsMedia.model');
const Question = require('./question.model');
const QuizAttempt = require('./quizAttempt.model');
const QuizCategory = require('./quizCategory.model');
const Quiz = require('./quiz.model');
const SOSRequest = require('./sosRequest.model');
const UserAnswer = require('./userAnswer.model');
const GuideStep = require('./guideStep.model');
const GuideStepMedia = require('./guideStepMedia.model');

/**
 * Thiết lập Association:
 */

// Một User có nhiều Post
User.hasMany(Post, { foreignKey: 'user_id', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Một Post có nhiều Comment
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// Một User có nhiều Comment
User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Một Post có nhiều Like
Post.hasMany(Like, { foreignKey: 'post_id', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// Một User có nhiều Like
User.hasMany(Like, { foreignKey: 'user_id', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Một Post có nhiều PostMedia (ví dụ, hình ảnh hoặc video liên quan)
Post.hasMany(PostMedia, { foreignKey: 'post_id', as: 'media' });
PostMedia.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// Nếu cần, có thể thiết lập quan hệ giữa User và PostMedia (người upload media)
// User.hasMany(PostMedia, { foreignKey: 'user_id', as: 'uploadMedia' });
// PostMedia.belongsTo(User, { foreignKey: 'user_id', as: 'uploader' });

// Một User (author) có nhiều News
User.hasMany(News, { foreignKey: 'author_id', as: 'news' });
News.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// Một News có nhiều NewsMedia
News.hasMany(NewsMedia, { foreignKey: 'news_id', as: 'media' });
NewsMedia.belongsTo(News, { foreignKey: 'news_id', as: 'news' });

// News ↔ NewsComment
News.hasMany(NewsComment, { foreignKey:'news_id', as:'comments' });
NewsComment.belongsTo(News,     { foreignKey:'news_id', as:'news' });

// comment ↔ reply
NewsComment.belongsTo(NewsComment, { foreignKey:'parent_comment_id', as:'parent' });
NewsComment.hasMany(NewsComment,   { foreignKey:'parent_comment_id', as:'replies' });

// User ↔ NewsComment
User.hasMany(NewsComment, { foreignKey:'user_id', as:'newsComments' });
NewsComment.belongsTo(User, { foreignKey:'user_id', as:'user' });

// Export các model sau khi associations đã được thiết lập
// Associations cho News và NewsMedia
News.hasMany(NewsMedia, { foreignKey: 'news_id', as: 'media' });
NewsMedia.belongsTo(News, { foreignKey: 'news_id', as: 'news' });

// Associations cho User và News (author)
User.hasMany(News, { foreignKey: 'author_id', as: 'authored_news' });
News.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// Associations cho Guide và GuideCategory
GuideCategory.hasMany(Guide, { foreignKey: 'category_id', as: 'guides' });
Guide.belongsTo(GuideCategory, { foreignKey: 'category_id', as: 'category' });

// Associations cho Guide và GuideMedia
Guide.hasMany(GuideMedia, { foreignKey: 'guide_id', as: 'media' });
GuideMedia.belongsTo(Guide, { foreignKey: 'guide_id', as: 'guide' });

// Associations cho FavouriteGuideList và FavouriteGuideItem
FavouriteGuideList.hasMany(FavouriteGuideItem, { foreignKey: 'favlist_id', as: 'items' });
FavouriteGuideItem.belongsTo(FavouriteGuideList, { foreignKey: 'favlist_id', as: 'list' });

// Associations cho Guide và FavouriteGuideItem
Guide.hasMany(FavouriteGuideItem, { foreignKey: 'guide_id', as: 'favourite_items' });
FavouriteGuideItem.belongsTo(Guide, { foreignKey: 'guide_id', as: 'guide' });

// Associations cho User và FavouriteGuideList
User.hasMany(FavouriteGuideList, { foreignKey: 'user_id', as: 'favourite_lists' });
FavouriteGuideList.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Associations cho Quiz và QuizCategory
QuizCategory.hasMany(Quiz, { foreignKey: 'category_id', as: 'quizzes' });
Quiz.belongsTo(QuizCategory, { foreignKey: 'category_id', as: 'category' });

// Associations cho Quiz và Question
Quiz.hasMany(Question, { foreignKey: 'quiz_id', as: 'questions' });
Question.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

// Associations cho Question và Answer
Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// Associations cho User và QuizAttempt
User.hasMany(QuizAttempt, { foreignKey: 'user_id', as: 'quiz_attempts' });
QuizAttempt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Associations cho Quiz và QuizAttempt
Quiz.hasMany(QuizAttempt, { foreignKey: 'quiz_id', as: 'attempts' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

// Associations cho User và UserAnswer
User.hasMany(UserAnswer, { foreignKey: 'user_id', as: 'answers' });
UserAnswer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Associations cho Question và UserAnswer
Question.hasMany(UserAnswer, { foreignKey: 'question_id', as: 'user_answers' });
UserAnswer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// Associations cho QuizAttempt và UserAnswer
QuizAttempt.hasMany(UserAnswer, { foreignKey: 'attempt_id', as: 'answers' });
UserAnswer.belongsTo(QuizAttempt, { foreignKey: 'attempt_id', as: 'attempt' });

// Associations cho User và EmergencyContact
User.hasMany(EmergencyContact, { foreignKey: 'user_id', as: 'emergency_contacts' });
EmergencyContact.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Associations cho EmergencyContact và SOSRequest
EmergencyContact.hasMany(SOSRequest, { foreignKey: 'contact_id', as: 'sos_requests' });
SOSRequest.belongsTo(EmergencyContact, { foreignKey: 'contact_id', as: 'contact' });

// Associations cho User và SOSRequest
User.hasMany(SOSRequest, { foreignKey: 'user_id', as: 'sos_requests' });
SOSRequest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Associations cho User và Leaderboard
User.hasMany(Leaderboard, { foreignKey: 'user_id', as: 'leaderboard_entries' });
Leaderboard.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Guide.hasMany(GuideStep, { foreignKey: 'guide_id', as: 'steps' });
GuideStep.belongsTo(Guide, { foreignKey: 'guide_id', as: 'guide' });

GuideStep.hasMany(GuideStepMedia, { foreignKey: 'step_id', as: 'media' });
GuideStepMedia.belongsTo(GuideStep, { foreignKey: 'step_id', as: 'step' });

// Export tất cả các model
module.exports = {
  User,
  Post,
  Comment,
  Like,
  PostMedia,
  News, 
  NewsMedia,
  EmergencyContact,
  FavouriteGuideList,
  FavouriteGuideItem,
  GuideCategory,
  GuideMedia,
  Guide,
  GuideStep,
  GuideStepMedia,
  Leaderboard,
  News,
  NewsMedia,
  Question,
  QuizAttempt,
  QuizCategory,
  Quiz,
  SOSRequest,
  UserAnswer
};
