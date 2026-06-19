import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const uploadImage = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const response = await axios.post('https://tmpfiles.org/api/v1/upload', formData, {
      headers: formData.getHeaders(),
    });

    if (response.data && response.data.status === 'success') {
      const pageUrl = response.data.data.url;
      // Convert page URL to direct download URL
      // Example: tmpfiles.org/1234/img.png -> tmpfiles.org/dl/1234/img.png
      return pageUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
    }
    throw new Error('Upload to tmpfiles failed');
  } catch (error) {
    console.error('Error uploading image to public host:', error.message);
    throw error;
  }
};
