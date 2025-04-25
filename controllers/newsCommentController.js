const { v4: uuidv4 } = require('uuid');
const NewsComment = require('../models/newsComment.model');
const News        = require('../models/news.model');

exports.createComment = async (req,res) => {
  const { news_id } = req.params;
  const user_id     = req.user.user_id;
  const { content, parent_comment_id } = req.body;

  if(!content) return res.status(400).json({ error:'Content bắt buộc.' });
  // check exists news  
  if(!(await News.findByPk(news_id)))
    return res.status(404).json({ error:'Tin tức không tồn tại.' });

  const comment = await NewsComment.create({
    comment_id: uuidv4(),
    news_id, user_id, content,
    parent_comment_id: parent_comment_id || null
  });
  res.status(201).json({ message:'Comment thành công', comment });
};

exports.updateComment = async (req,res) => {
  const { comment_id } = req.params;
  const user_id        = req.user.user_id;
  const { content }    = req.body;

  const c = await NewsComment.findByPk(comment_id);
  if(!c) return res.status(404).json({ error:'Không tìm thấy comment.' });
  if(c.user_id!==user_id)
    return res.status(403).json({ error:'Không có quyền.' });

  const updated = await c.update({ content, updated_at: new Date() });
  res.json({ message:'Cập nhật thành công', comment:updated });
};

exports.deleteComment = async (req,res) => {
  const { comment_id } = req.params;
  const user_id        = req.user.user_id;

  const c = await NewsComment.findByPk(comment_id);
  if(!c) return res.status(404).json({ error:'Không tìm thấy comment.' });
  if(c.user_id!==user_id)
    return res.status(403).json({ error:'Không có quyền.' });

  await c.destroy();
  res.json({ message:'Xoá thành công' });
};
