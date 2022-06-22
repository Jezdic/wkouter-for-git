const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dlsovnnst',
  api_key: '431875987364673',
  api_secret: 'QXgrcEMDNS7QNIaES56lu-8bElc'
});

module.exports = cloudinary;
