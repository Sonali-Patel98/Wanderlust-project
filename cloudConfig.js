const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET,
});
cloudinary.api.ping()
.then(result => console.log("Cloudinary Connected:", result))
.catch(err => console.log("Cloudinary Error:", err));
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowed_formats:["png","jpg","jpeg"],
  },
});

module.exports={
    cloudinary,
    storage
};