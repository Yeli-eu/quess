const fs = require('fs');
const path = require('path');
const moment = require('moment');

// 确保uploads文件夹存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 图片上传
const uploadImage = (req, res) => {
  try {
    // 判断是否有文件上传
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.json({ code: 400, message: '请选择要上传的图片' });
    }

    const imageFile = req.files.file;
    // 校验文件格式：仅允许jpg/jpeg/png/gif
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return res.json({ code: 400, message: '仅支持jpg/jpeg/png/gif格式的图片' });
    }
    // 校验文件大小：最大2M
    const maxSize = 2 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return res.json({ code: 400, message: '图片大小不能超过2MB' });
    }

    // 生成唯一文件名：时间戳+随机数+原扩展名，避免重复
    // const ext = path.extname(imageFile.name);
    const ext = path.extname(imageFile.name).toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)?.[0] || '';
if (!ext) {
  return res.json({ code: 400, message: '图片格式无效，请重新选择' });
}
    const fileName = `${moment().format('YYYYMMDDHHmmss')}_${Math.floor(Math.random() * 10000)}${ext}`;
    const uploadPath = path.join(uploadDir, fileName);

    // 保存文件到uploads文件夹
    imageFile.mv(uploadPath, (err) => {
      if (err) {
        console.error('图片上传失败：', err);
        return res.json({ code: 500, message: '图片上传失败，请重试' });
      }
      // 返回图片访问地址（前端可直接访问，格式：http://域名/uploads/文件名）
      const imageUrl = `/uploads/${fileName}`;
      res.json({ code: 200, message: '图片上传成功', data: { imageUrl } });
    });
  } catch (error) {
    console.error('图片上传异常：', error);
    res.json({ code: 500, message: '服务器异常，图片上传失败' });
  }
};

module.exports = { uploadImage };