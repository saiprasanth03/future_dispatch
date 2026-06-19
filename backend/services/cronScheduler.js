import { fetchLatestAINews } from './newsScraper.js';
import { filterAndGenerateContent } from './aiFilter.js';
import { generateImagesForPost } from './imageGenerator.js';
import { publishToInstagram } from './instagramPublisher.js';
import Article from '../models/Article.js';
import Post from '../models/Post.js';
import Log from '../models/Log.js';
import path from 'path';

// 8:00 AM Task: Aggregation
export const runNewsAggregation = async () => {
  try {
    console.log("Starting News Aggregation...");
    await Log.create({ action: 'scrape_news', status: 'info', message: 'Started news aggregation' });
    
    const articles = await fetchLatestAINews();
    
    // Save to DB
    for (const item of articles) {
      await Article.findOneAndUpdate(
        { url: item.url }, 
        item, 
        { upsert: true, new: true }
      );
    }

    await Log.create({ action: 'scrape_news', status: 'success', message: `Aggregated ${articles.length} articles` });
    console.log("News Aggregation Complete.");
  } catch (error) {
    await Log.create({ action: 'scrape_news', status: 'error', message: error.message });
  }
};

// 8:15 AM Task: Content Generation
export const runContentGeneration = async () => {
  try {
    console.log("Starting Content Generation...");
    await Log.create({ action: 'generate_post', status: 'info', message: 'Started AI content generation' });

    // Get latest articles from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const articles = await Article.find({ createdAt: { $gte: today } }).limit(20);

    if (articles.length === 0) {
      throw new Error("No articles found for today to generate content.");
    }

    const generatedPosts = await filterAndGenerateContent(articles);

    for (let i = 0; i < generatedPosts.length; i++) {
      const postData = generatedPosts[i];
      const originalArticle = articles[postData.originalArticleIndex];
      
      // Save post to DB
      const post = await Post.create({
        articles: [originalArticle ? originalArticle._id : null],
        caption: postData.caption,
        hashtags: postData.hashtags,
        slidesText: postData.slides,
        status: 'generated',
        scheduledFor: new Date(today.setHours(9, 0, 0, 0)) // 9:00 AM
      });

      // Generate Images
      const outputDir = path.resolve(process.cwd(), 'output', post._id.toString());
      await generateImagesForPost(postData, outputDir);
    }

    await Log.create({ action: 'generate_post', status: 'success', message: `Generated ${generatedPosts.length} posts` });
    console.log("Content Generation Complete.");
  } catch (error) {
    await Log.create({ action: 'generate_post', status: 'error', message: error.message });
  }
};

// 9:00 AM Task: Publish
export const runInstagramPublishing = async () => {
  try {
    console.log("Starting Instagram Publishing...");
    await Log.create({ action: 'publish_instagram', status: 'info', message: 'Started publishing scheduled posts' });

    // Find posts scheduled for today that haven't been published
    const pendingPosts = await Post.find({ status: 'generated' });

    for (const post of pendingPosts) {
      const outputDir = path.resolve(process.cwd(), 'output', post._id.toString());
      const localImagePaths = await generateImagesForPost({ slides: post.slidesText }, outputDir);

      // Upload images to public temporary host so Facebook can read them
      console.log('Uploading generated images to temporary public host for Facebook...');
      const { uploadImage } = await import('./imageUploader.js');
      const livePublicUrls = [];
      for (const imgPath of localImagePaths) {
        const url = await uploadImage(imgPath);
        livePublicUrls.push(url);
      }

      const result = await publishToInstagram(livePublicUrls, post.caption);
      
      post.status = result.success ? 'published' : 'failed';
      post.instagramPostId = result.postId;
      post.publishedAt = new Date();
      await post.save();
    }

    await Log.create({ action: 'publish_instagram', status: 'success', message: `Published ${pendingPosts.length} posts` });
    console.log("Publishing Complete.");
  } catch (error) {
    await Log.create({ action: 'publish_instagram', status: 'error', message: error.message });
  }
};
