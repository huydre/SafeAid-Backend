const FavouriteGuideItem = require('../models/favouriteGuideItem.model');
const FavouriteGuideList = require('../models/favouriteGuideList.model');
const Guide = require('../models/guide.model');
const { v4: uuidv4 } = require('uuid');

// Thêm một hướng dẫn vào danh sách yêu thích
exports.addGuideToFavourite = async (req, res) => {
  try {
    const { guide_id } = req.body;
    const user_id = req.user.user_id;

    console.log(user_id);

    // Kiểm tra và lấy danh sách yêu thích của người dùng
    let favouriteList = await FavouriteGuideList.findOne({ where: { user_id } });
    if (!favouriteList) {
      favouriteList = await FavouriteGuideList.create({
        favlist_id: uuidv4(),
        user_id,
        created_at: new Date()
      });
    }

    // Kiểm tra xem hướng dẫn có tồn tại không
    const guide = await Guide.findByPk(guide_id);
    if (!guide) {
      return res.status(404).json({ error: 'Không tìm thấy hướng dẫn.' });
    }

    // Kiểm tra xem hướng dẫn đã được thêm vào danh sách chưa
    const existingItem = await FavouriteGuideItem.findOne({
      where: {
        guide_id,
        favlist_id: favouriteList.favlist_id
      }
    });

    if (existingItem) {
      return res.status(400).json({ error: 'Hướng dẫn đã có trong danh sách yêu thích.' });
    }

    // Thêm hướng dẫn vào danh sách yêu thích
    const newFavouriteItem = await FavouriteGuideItem.create({
      guide_id,
      favlist_id: favouriteList.favlist_id,
      created_at: new Date()
    });

    res.status(201).json(newFavouriteItem);
  } catch (error) {
    console.error('Lỗi khi thêm hướng dẫn vào danh sách yêu thích:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi thêm hướng dẫn vào danh sách yêu thích.' });
  }
};

// Xóa một hướng dẫn khỏi danh sách yêu thích
exports.removeGuideFromFavourite = async (req, res) => {
  try {
    const { guide_id } = req.params;
    const user_id = req.user.user_id;

    // Kiểm tra và lấy danh sách yêu thích của người dùng
    const favouriteList = await FavouriteGuideList.findOne({ where: { user_id } });
    if (!favouriteList) {
      return res.status(404).json({ error: 'Không tìm thấy danh sách yêu thích.' });
    }

    // Xóa hướng dẫn khỏi danh sách yêu thích
    const result = await FavouriteGuideItem.destroy({
      where: {
        guide_id,
        favlist_id: favouriteList.favlist_id
      }
    });

    if (!result) {
      return res.status(404).json({ error: 'Không tìm thấy hướng dẫn trong danh sách yêu thích.' });
    }

    res.json({ message: 'Đã xóa hướng dẫn khỏi danh sách yêu thích thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa hướng dẫn khỏi danh sách yêu thích:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi xóa hướng dẫn khỏi danh sách yêu thích.' });
  }
};