const { v4: uuidv4 } = require('uuid');
const GuideMedia = require('../models/guideMedia.model');
const Guide = require('../models/guide.model');

// Thêm media cho guide
exports.addMedia = async (req, res) => {
  try {
    const { guide_id } = req.params;
    const { media_type, caption, order_index, media_url } = req.body;

    if (!media_url || !media_type) {
      return res.status(400).json({ error: 'Media và loại media là bắt buộc.' });
    }

    // Kiểm tra guide có tồn tại
    const guide = await Guide.findByPk(guide_id);
    if (!guide) {
      return res.status(404).json({ error: 'Không tìm thấy hướng dẫn.' });
    }

    const media_id = uuidv4();
    const newMedia = await GuideMedia.create({
      media_id,
      guide_id,
      media_type,
      media_url,
      caption,
      order_index: order_index || 0
    });

    res.status(201).json({
      message: 'Thêm media thành công.',
      media: newMedia
    });
  } catch (error) {
    console.error('Lỗi khi thêm media:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi thêm media.' });
  }
};

// Cập nhật media
exports.updateMedia = async (req, res) => {
  try {
    const { media_id } = req.params;
    const { media_type, caption, order_index } = req.body;
    const media_url = req.file ? req.file.path : undefined;

    const media = await GuideMedia.findByPk(media_id);
    if (!media) {
      return res.status(404).json({ error: 'Không tìm thấy media.' });
    }

    await media.update({
      ...(media_type && { media_type }),
      ...(media_url && { media_url }),
      ...(caption && { caption }),
      ...(order_index !== undefined && { order_index })
    });

    res.json({
      message: 'Cập nhật media thành công.',
      media: await media.reload()
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật media:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi cập nhật media.' });
  }
};

// Xóa media
exports.deleteMedia = async (req, res) => {
  try {
    const { media_id } = req.params;

    const media = await GuideMedia.findByPk(media_id);
    if (!media) {
      return res.status(404).json({ error: 'Không tìm thấy media.' });
    }

    await media.destroy();

    res.json({ message: 'Xóa media thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa media:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi xóa media.' });
  }
};

// Lấy danh sách media của một guide
exports.getGuideMedia = async (req, res) => {
  try {
    const { guide_id } = req.params;

    const media = await GuideMedia.findAll({
      where: { guide_id },
      order: [['order_index', 'ASC']]
    });

    res.json(media);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách media:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy danh sách media.' });
  }
};