import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dzeawtdmt', // 👈 Thay bằng Cloud Name của bạn
      api_key: '749699543763672',       // 👈 Thay bằng API Key
      api_secret: 'OnumNUDsq6Jq1Ww3QqZ2oQXA4gU', // 👈 Thay bằng API Secret
    });
  },
};