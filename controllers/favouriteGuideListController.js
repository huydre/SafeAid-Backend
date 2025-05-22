const { v4: uuidv4 } = require('uuid');
const FavouriteGuideList = require('../models/favouriteGuideList.model');
const FavouriteGuideItem = require('../models/favouriteGuideItem.model');
const Guide = require('../models/guide.model');

// Lấy danh sách yêu thích của người dùng
exports.getFavouriteList = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // const user_id = 1;

    const favouriteList = await FavouriteGuideList.findOne({
      where: { user_id },
      include: [{
        model: FavouriteGuideItem,
        as: 'items',
        include: [{
          model: Guide,
          as: 'guide',
          attributes: ['guide_id', 'title', 'description', 'thumbnail_path']
        }]
      }]
    });

    if (!favouriteList) {
      return res.status(404).json({ error: 'Không tìm thấy danh sách yêu thích.' });
    }

    res.json(favouriteList);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách yêu thích:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy danh sách yêu thích.' });
  }
};

// Tạo danh sách yêu thích mới cho người dùng
exports.createFavouriteList = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    // const { user_id } = req.body;

    // Kiểm tra xem người dùng đã có danh sách yêu thích chưa
    const existingList = await FavouriteGuideList.findOne({ where: { user_id } });
    // const existingList = await FavouriteGuideList.findOne({ where:  1  });
    if (existingList) {
      return res.status(400).json({ error: 'Người dùng đã có danh sách yêu thích.' });
    }

    const favlist_id = uuidv4();
    const newFavouriteList = await FavouriteGuideList.create({
      favlist_id,
      created_at: new Date(),
      user_id,
    });

    res.status(201).json(newFavouriteList);
  } catch (error) {
    console.error('Lỗi khi tạo danh sách yêu thích:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi tạo danh sách yêu thích.' });
  }
};

// Xóa danh sách yêu thích
exports.deleteFavouriteList = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const result = await FavouriteGuideList.destroy({ where: { user_id } });
    if (!result) {
      return res.status(404).json({ error: 'Không tìm thấy danh sách yêu thích.' });
    }

    res.json({ message: 'Đã xóa danh sách yêu thích thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa danh sách yêu thích:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi xóa danh sách yêu thích.' });
  }
};