const express = require('express');
const mongoose = require('mongoose');
const Device = require('../models/Device');

const router = express.Router();

// GET: Lấy danh sách và tìm kiếm thiết bị
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      const keyword = search.trim();
      filter = {
        $or: [
          { deviceId: { $regex: keyword, $options: 'i' } },
          { name: { $regex: keyword, $options: 'i' } },
          { deviceType: { $regex: keyword, $options: 'i' } },
          { room: { $regex: keyword, $options: 'i' } }
        ]
      };
    }

    const devices = await Device.find(filter).sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách thiết bị', error: error.message });
  }
});

// GET: Lấy chi tiết thiết bị
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let device;

    if (mongoose.Types.ObjectId.isValid(id)) {
      device = await Device.findById(id);
    } else {
      device = await Device.findOne({ deviceId: id });
    }

    if (!device) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }

    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy thông tin thiết bị', error: error.message });
  }
});

// POST: Thêm thiết bị
router.post('/', async (req, res) => {
  try {
    const {
      deviceId, name, deviceType, room,
      brand, model, quantity, status,
      purchaseDate, description
    } = req.body;

    if (!deviceId || !name || !deviceType || !room || quantity === undefined) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mã, tên, loại, phòng và số lượng thiết bị' });
    }

    const device = await Device.create({
      deviceId, name, deviceType, room,
      brand, model, quantity, status,
      purchaseDate, description
    });

    res.status(201).json({ message: 'Thêm thiết bị thành công', device });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Mã thiết bị đã tồn tại' });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Lỗi thêm thiết bị', error: error.message });
  }
});

// PUT: Cập nhật thiết bị
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { deviceId: id };

    const device = await Device.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    });

    if (!device) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }

    res.status(200).json({ message: 'Cập nhật thiết bị thành công', device });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Mã thiết bị đã tồn tại' });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Lỗi cập nhật thiết bị', error: error.message });
  }
});

// DELETE: Xóa thiết bị
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { deviceId: id };

    const device = await Device.findOneAndDelete(filter);

    if (!device) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }

    res.status(200).json({ message: 'Xóa thiết bị thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa thiết bị', error: error.message });
  }
});

module.exports = router;
