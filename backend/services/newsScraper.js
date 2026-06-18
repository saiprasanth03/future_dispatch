import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Service to aggregate news from various AI sources.
 * In a production scenario, you would use NewsAPI, Perplexity, Tavily, or Exa API here.
 * Alternatively, you could scrape specific subreddits (r/artificial, r/MachineLearning) or RSS feeds.
 */
export const fetchLatestAINews = async () => {
  try {
    // Example using NewsAPI.org
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey || apiKey === 'your_news_api_key_here') {
      console.warn("WARNING: NEWS_API_KEY is not set. Using mock data for demonstration.");
      return getMockNews();
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0];

    // Search for highly relevant AI queries
    const queries = ['OpenAI', 'ChatGPT', 'Gemini AI', 'Claude AI', 'Midjourney', 'Artificial Intelligence'];
    const queryStr = queries.map(q => `"${q}"`).join(' OR ');

    const response = await axios.get(`https://newsapi.org/v2/everything`, {
      params: {
        q: queryStr,
        language: 'en',
        sortBy: 'popularity',
        from: dateString,
        apiKey: apiKey,
        pageSize: 30
      }
    });

    if (response.data && response.data.articles) {
      return response.data.articles.map(article => ({
        title: article.title,
        url: article.url,
        source: article.source.name,
        summary: article.description || article.content,
        publishedAt: new Date(article.publishedAt)
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching news:", error.message);
    throw error;
  }
};

function getMockNews() {
  return [
    {
      title: "OpenAI Releases GPT-5 with Advanced Reasoning",
      url: "https://openai.com/blog/gpt-5",
      source: "OpenAI Blog",
      summary: "GPT-5 has been officially released, featuring advanced multi-step reasoning capabilities and real-time voice translation across 50 languages.",
      publishedAt: new Date()
    },
    {
      title: "Midjourney v7 Launches: Photorealism Reaches New Heights",
      url: "https://midjourney.com/v7",
      source: "Midjourney Announcements",
      summary: "The latest version of Midjourney introduces perfect text generation within images and unprecedented photorealism.",
      publishedAt: new Date()
    },
    {
      title: "Google Gemini Ultra 2.0 Integrates Directly into Chrome",
      url: "https://blog.google/gemini",
      source: "Google Blog",
      summary: "Gemini Ultra 2.0 is now a built-in feature in Google Chrome, allowing users to summarize, analyze, and generate content instantly on any webpage.",
      publishedAt: new Date()
    },
    {
      title: "Anthropic's Claude 4 Sets New Benchmark in Coding Tasks",
      url: "https://anthropic.com/claude-4",
      source: "Anthropic News",
      summary: "Claude 4 dominates the SWE-bench benchmark, correctly resolving 45% of real-world GitHub issues autonomously.",
      publishedAt: new Date()
    },
    {
      title: "Runway Gen-4: Text to Full Feature Length Movie",
      url: "https://runwayml.com/gen4",
      source: "Runway",
      summary: "Runway's new model can generate consistent 10-minute 4K video clips from a single prompt, revolutionizing indie filmmaking.",
      publishedAt: new Date()
    },
    {
      title: "Apple Intelligence Rolls Out to iPhone 16",
      url: "https://apple.com/newsroom",
      source: "Apple Newsroom",
      summary: "The much-anticipated Apple Intelligence features are finally live, bringing on-device LLMs to millions of iOS users.",
      publishedAt: new Date()
    }
  ];
}
