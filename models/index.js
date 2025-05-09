// models/index.js
const User = require('./User');
const Post = require('./post.model');
const Comment = require('./comment.model');
const Like = require('./like.model');
const PostMedia = require('./postMedia.model'); // Giả sử bạn đã tạo model cho PostMedia

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

// Export các model sau khi associations đã được thiết lập
module.exports = {
  User,
  Post,
  Comment,
  Like,
  PostMedia
};
