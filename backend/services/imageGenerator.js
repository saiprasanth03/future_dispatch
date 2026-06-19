import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

/**
 * Renders an HTML template and uses Puppeteer to take a high-res screenshot.
 * This is used to programmatically generate Instagram carousel slides.
 */
export const generateImagesForPost = async (postData, outputDir) => {
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: { width: 1080, height: 1350 }, // Instagram portrait size
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for Render/Linux
    });
    
    const page = await browser.newPage();
    const imagePaths = [];

    // Base HTML/CSS template
    const templatePath = path.resolve(process.cwd(), 'templates', 'slide.html');
    let baseHtml = '';
    
    // Fallback template if file doesn't exist
    if (fs.existsSync(templatePath)) {
      baseHtml = fs.readFileSync(templatePath, 'utf8');
    } else {
      baseHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            margin: 0; padding: 0; width: 1080px; height: 1350px; 
            background: linear-gradient(135deg, #0f172a 0%, #000000 100%);
            color: #ffffff; font-family: 'Inter', -apple-system, sans-serif;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            position: relative; overflow: hidden;
          }
          /* Futuristic glow effect */
          .glow {
            position: absolute; top: -20%; left: -20%; width: 140%; height: 140%;
            background: radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(0,0,0,0) 70%);
            z-index: 0;
          }
          .content {
            z-index: 1; padding: 80px; text-align: center; max-width: 900px;
          }
          .slide-number {
            position: absolute; top: 60px; right: 60px; font-size: 24px; color: #94a3b8;
            font-weight: bold; letter-spacing: 2px;
          }
          h1 {
            font-size: 84px; font-weight: 900; line-height: 1.1; margin-bottom: 40px;
            background: -webkit-linear-gradient(#fff, #94a3b8);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            text-transform: uppercase; letter-spacing: -2px;
          }
          p {
            font-size: 42px; line-height: 1.5; color: #e2e8f0; font-weight: 400;
          }
          .brand {
            position: absolute; bottom: 60px; left: 60px; font-size: 28px; font-weight: bold;
            display: flex; align-items: center; gap: 15px; color: #fff;
          }
        </style>
      </head>
      <body>
        <div class="glow"></div>
        <div class="slide-number">{{SLIDE_NUM}}/5</div>
        <div class="content">
          <h1>{{TITLE}}</h1>
          <p>{{TEXT}}</p>
        </div>
        <div class="brand">🚀 Future Dispatch</div>
      </body>
      </html>`;
    }

    // Generate screenshot for each slide
    for (let i = 0; i < postData.slides.length; i++) {
      const slide = postData.slides[i];
      let html = baseHtml
        .replace('{{SLIDE_NUM}}', slide.slideNumber)
        .replace('{{TITLE}}', slide.title)
        .replace('{{TEXT}}', slide.text);

      await page.setContent(html);
      
      const outputPath = path.join(outputDir, `slide_${slide.slideNumber}.png`);
      await page.screenshot({ path: outputPath, type: 'png' });
      imagePaths.push(outputPath);
    }

    await browser.close();
    return imagePaths;

  } catch (error) {
    console.error("Error generating images:", error.message);
    throw error;
  }
};
