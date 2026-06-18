import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Service to publish a carousel to Instagram using the Facebook Graph API.
 * 
 * Flow:
 * 1. Upload each image to get an Item ID.
 * 2. Create a carousel container with all Item IDs.
 * 3. Publish the container.
 */
export const publishToInstagram = async (imageUrls, caption) => {
  try {
    const accessToken = process.env.IG_ACCESS_TOKEN;
    const igUserId = process.env.IG_USER_ID;

    if (!accessToken || !igUserId || accessToken === 'your_long_lived_access_token_here') {
      console.warn("WARNING: IG_ACCESS_TOKEN or IG_USER_ID not set. Simulating Instagram publish.");
      return { success: true, simulated: true, postId: `sim_${Date.now()}` };
    }

    const itemIds = [];

    // 1. Upload individual images
    for (const url of imageUrls) {
      const itemRes = await axios.post(`https://graph.facebook.com/v19.0/${igUserId}/media`, null, {
        params: {
          image_url: url,
          is_carousel_item: true,
          access_token: accessToken
        }
      });
      itemIds.push(itemRes.data.id);
    }

    // 2. Create Carousel Container
    const containerRes = await axios.post(`https://graph.facebook.com/v19.0/${igUserId}/media`, null, {
      params: {
        media_type: 'CAROUSEL',
        children: itemIds.join(','),
        caption: caption,
        access_token: accessToken
      }
    });
    
    const containerId = containerRes.data.id;

    // 3. Publish Container
    const publishRes = await axios.post(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, null, {
      params: {
        creation_id: containerId,
        access_token: accessToken
      }
    });

    return { success: true, simulated: false, postId: publishRes.data.id };

  } catch (error) {
    console.error("Error publishing to Instagram:", error.response?.data || error.message);
    throw error;
  }
};
