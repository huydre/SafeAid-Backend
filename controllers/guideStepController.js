const { v4: uuidv4 } = require('uuid');
const GuideStep = require('../models/guideStep.model');
const Guide = require('../models/guide.model');

// Lấy tất cả các bước của một guide
exports.getStepsByGuideId = async (req, res) => {
  try {
    const { guide_id } = req.params;
    
    const steps = await GuideStep.findAll({
      where: { guide_id },
      order: [['order_index', 'ASC']]
    });

    res.json(steps);
  } catch (error) {
    console.error('Lỗi khi lấy các bước hướng dẫn:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy các bước hướng dẫn.' });
  }
};

// Lấy chi tiết một bước
exports.getStepById = async (req, res) => {
  try {
    const { step_id } = req.params;

    const step = await GuideStep.findByPk(step_id);
    if (!step) {
      return res.status(404).json({ error: 'Không tìm thấy bước hướng dẫn.' });
    }

    res.json(step);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết bước hướng dẫn:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy chi tiết bước hướng dẫn.' });
  }
};

// Tạo bước mới
exports.createStep = async (req, res) => {
  try {
    const { title, content, order_index, guide_id } = req.body;

    // Kiểm tra guide có tồn tại
    const guide = await Guide.findByPk(guide_id);
    if (!guide) {
      return res.status(400).json({ error: 'Guide không tồn tại.' });
    }

    const step = await GuideStep.create({
      step_id: uuidv4(),
      title,
      content,
      order_index,
      guide_id
    });

    res.status(201).json(step);
  } catch (error) {
    console.error('Lỗi khi tạo bước hướng dẫn:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi tạo bước hướng dẫn.' });
  }
};

// Cập nhật bước
exports.updateStep = async (req, res) => {
  try {
    const { step_id } = req.params;
    const { title, content, order_index } = req.body;

    const step = await GuideStep.findByPk(step_id);
    if (!step) {
      return res.status(404).json({ error: 'Không tìm thấy bước hướng dẫn.' });
    }

    await step.update({
      title,
      content,
      order_index
    });

    res.json(step);
  } catch (error) {
    console.error('Lỗi khi cập nhật bước hướng dẫn:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi cập nhật bước hướng dẫn.' });
  }
};

// Xóa bước
exports.deleteStep = async (req, res) => {
  try {
    const { step_id } = req.params;

    const step = await GuideStep.findByPk(step_id);
    if (!step) {
      return res.status(404).json({ error: 'Không tìm thấy bước hướng dẫn.' });
    }

    await step.destroy();
    res.json({ message: 'Đã xóa bước hướng dẫn thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa bước hướng dẫn:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi xóa bước hướng dẫn.' });
  }
};