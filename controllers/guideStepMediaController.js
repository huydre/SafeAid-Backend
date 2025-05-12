const { v4: uuidv4 } = require('uuid');
const GuideStepMedia = require('../models/guideStepMedia.model');
const GuideStep = require('../models/guideStep.model');

// Lấy tất cả media của một step
exports.getMediaByStepId = async (req, res) => {
  try {
    const { step_id } = req.params;
    
    const media = await GuideStepMedia.findAll({
      where: { step_id }
    });

    res.json(media);
  } catch (error) {
    console.error('Lỗi khi lấy media:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy media.' });
  }
};

// Lấy chi tiết một media
exports.getMediaById = async (req, res) => {
  try {
    const { media_id } = req.params;

    const media = await GuideStepMedia.findByPk(media_id);
    if (!media) {
      return res.status(404).json({ error: 'Không tìm thấy media.' });
    }

    res.json(media);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết media:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy chi tiết media.' });
  }
};

// Thêm media mới
exports.createMedia = async (req, res) => {
  try {
    const { step_id, media_type, media_url, caption, order_index } = req.body;

    // Kiểm tra step có tồn tại
    const step = await GuideStep.findByPk(step_id);
    if (!step) {
      return res.status(400).json({ error: 'Step không tồn tại.' });
    }

    const media = await GuideStepMedia.create({
      // Bỏ dòng media_id: uuidv4() vì đã có autoIncrement
      step_id,
      media_type,
      media_url,
      caption,
      order_index
    });

    res.status(201).json(media);
  } catch (error) {
    console.error('Lỗi khi tạo media:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi tạo media.' });
  }
};

// Cập nhật media
exports.updateMedia = async (req, res) => {
  try {
    const { media_id } = req.params;
    const { media_type, media_url, caption } = req.body;

    const media = await GuideStepMedia.findByPk(media_id);
    if (!media) {
      return res.status(404).json({ error: 'Không tìm thấy media.' });
    }

    await media.update({
      media_type,
      media_url,
      caption
    });

    res.json(media);
  } catch (error) {
    console.error('Lỗi khi cập nhật media:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi cập nhật media.' });
  }
};

// Xóa media
exports.deleteMedia = async (req, res) => {
  try {
    const { media_id } = req.params;

    const media = await GuideStepMedia.findByPk(media_id);
    if (!media) {
      return res.status(404).json({ error: 'Không tìm thấy media.' });
    }

    await media.destroy();
    res.json({ message: 'Đã xóa media thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa media:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi xóa media.' });
  }
};