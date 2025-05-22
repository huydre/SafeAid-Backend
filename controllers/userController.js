const User = require('../models/User');
const bcrypt = require('bcrypt');
const e = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // dùng để sinh UUID cho user_id

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'; 

exports.updateAvatar = async (req, res) => {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
        }

        const user_id = req.user.user_id;
        //upload avatar
        const avatar_url = req.file.path; // Đường dẫn đến file ảnh đã upload

        // Kiểm tra xem file có tồn tại không
        if (!avatar_url) {
            return res.status(400).json({ error: 'Không tìm thấy file ảnh.' });
        }

        // Kiểm tra xem file có phải là ảnh không
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ error: 'File không phải là ảnh.' });
        }

        // Kiểm tra xem kích thước file có hợp lệ không (dưới 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (req.file.size > maxSize) {
            return res.status(400).json({ error: 'Kích thước file quá lớn. Vui lòng chọn file dưới 5MB.' });
        }

    
        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ where: { user_id } });
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại.' });
        }
        // Cập nhật avatar
        user.profile_image_path = avatar_url;
        await user.save();
        return res.status(200).json({ message: 'Cập nhật avatar thành công.', user });
    }
    catch (error) {
        console.error('Lỗi cập nhật avatar:', error);
        return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật avatar.' });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const username = req.body?.username;
        const phone_number = req.body?.phone_number;
    
        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ where: { user_id } });
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại.' });
        }

        // Kiểm tra username đã tồn tại chưa
        if (username) {
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser && existingUser.user_id !== user.user_id) {
                return res.status(400).json({ error: 'Tên người dùng đã tồn tại.' });
            }
        }
    
        // Cập nhật thông tin người dùng
        user.username = username || user.username;
        user.phone_number = phone_number || user.phone_number;
    
        await user.save();
    
        return res.status(200).json({ message: 'Cập nhật thông tin thành công.', user });
    } catch (error) {
        console.error('Lỗi cập nhật thông tin:', error);
        return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thông tin.' });
    }
}

exports.getUser = async (req, res) => {
    try {
        // Fix: directly access the user_id property
        const user_id = req.user.user_id;
        
        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ where: { user_id } });
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại.' });
        }

        // bỏ password và sửa lại đường dẫn ảnh

        user.password = undefined;
        
        if (user.profile_image_path) {
            user.profile_image_path = `${req.protocol}://${req.get('host')}/${user.profile_image_path.replace(/\\/g, '/')}`;
        }
    
        return res.status(200).json({ 
            message: 'Lấy thông tin người dùng thành công.', 
            user 
        });
    } catch (error) {
        console.error('Lỗi lấy thông tin người dùng:', error);
        return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin người dùng.' });
    }
}