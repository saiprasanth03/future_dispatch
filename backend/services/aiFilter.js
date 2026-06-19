import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Service to filter and rank the news using an LLM.
 * Selects the top 5 most viral/useful AI updates and generates slide content and captions.
 */
export const filterAndGenerateContent = async (articles) => {
  try {
    const apiKey = process.env.LLM_API_KEY;
    
    // If no real API key is provided, return mock generated content
    if (!apiKey || apiKey === 'your_llm_api_key_here') {
      console.warn("WARNING: LLM_API_KEY is not set. Returning mock generated posts.");
      return generateMockPosts(articles.slice(0, 5));
    }

    // Use Groq for 100% free AI generation!
    const openai = new OpenAI({ 
      apiKey: apiKey,
      baseURL: 'https://api.groq.com/openai/v1'
    });

    const systemPrompt = `
You are an expert AI media company editor with 50+ years of creative experience.
Your goal is to select the top 5 most important, viral, and useful AI news updates from the provided list.
For EACH of the 5 selected updates, you must generate a highly engaging Instagram carousel post structure.

Each carousel must contain 5 slides with short, punchy text:
Slide 1: Powerful hook headline, Eye-catching title.
Slide 2: What is the update? Explain clearly.
Slide 3: Why is this important? Real-world impact.
Slide 4: How can users benefit? Creator/business use cases.
Slide 5: Final summary, Engagement CTA (e.g., "Would you use this?").

Also, write a captivating Instagram caption for each post, including trending hashtags.
Your writing tone should be modern, exciting, viral, easy to understand, and futuristic.

Output JSON EXACTLY in this schema:
{
  "topPosts": [
    {
      "originalArticleIndex": <index of the article from the input array>,
      "caption": "Your highly engaging caption here... #AI #Tech",
      "hashtags": ["AI", "Tech", "Future"],
      "slides": [
        { "slideNumber": 1, "title": "...", "text": "..." },
        { "slideNumber": 2, "title": "...", "text": "..." },
        { "slideNumber": 3, "title": "...", "text": "..." },
        { "slideNumber": 4, "title": "...", "text": "..." },
        { "slideNumber": 5, "title": "...", "text": "..." }
      ]
    }
  ]
}
`;

    const userPrompt = `Here are the latest AI articles:\n\n${articles.map((a, i) => `[${i}] ${a.title}\n${a.summary}`).join('\n\n')}`;

    const response = await openai.chat.completions.create({
      model: 'mixtral-8x7b-32768', // Fast, high-quality, completely FREE model on Groq
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    return parsedResponse.topPosts;

  } catch (error) {
    console.error("Error in AI filtering:", error.message);
    throw error;
  }
};

function generateMockPosts(articles) {
  const hashtagPool = [
    "AI", "TechNews", "ArtificialIntelligence", "Future", "Innovation", 
    "MachineLearning", "TechTrends", "AITools", "DeepLearning", "OpenAI", 
    "DigitalTransformation", "FutureOfWork"
  ];
  
  return articles.map((article, index) => {
    // Shuffle and pick 5 random hashtags for each post so they vary
    const randomHashtags = [...hashtagPool].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    return {
      originalArticleIndex: index,
      caption: `${article.title} is here and it's insane!\n\nWould you use this in your workflow? Let us know below! 👇\n\nSave this post to stay ahead of the curve 🚀\n\n${randomHashtags.map(h => '#' + h).join(' ')}`,
      hashtags: randomHashtags,
    slides: [
      { slideNumber: 1, title: "THE FUTURE IS HERE", text: article.title },
      { slideNumber: 2, title: "WHAT IS IT?", text: article.summary.substring(0, 80) + "..." },
      { slideNumber: 3, title: "WHY IT MATTERS", text: "This completely changes how we interact with technology." },
      { slideNumber: 4, title: "HOW YOU CAN USE IT", text: "Automate your daily tasks and save 10+ hours a week." },
      { slideNumber: 5, title: "WHAT DO YOU THINK?", text: "Comment your thoughts below! 👇" }
    ]
    };
  });
}
