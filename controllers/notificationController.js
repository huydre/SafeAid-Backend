const { v4: uuidv4 } = require('uuid');
const Notification = require('../models/notification.model');

// Tạo thông báo
exports.createNotification = async (req, res) => {
  try {
    const { user_id, type, ref_id, title, content } = req.body;
    const notification = await Notification.create({
      notification_id: uuidv4(),
      user_id,
      type,
      ref_id,
      title,
      content,
    });
    res.status(200).json({ data: notification });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi tạo thông báo' });
  }
};

exports.getNotificationsByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const notifications = await Notification.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
    });
    res.status(200).json({ data: notifications });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy thông báo' });
  }
};
