import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLink, Star } from 'lucide-react';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('/api/news');
        setNews(res.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return <div className="main-content"><h2>Loading News...</h2></div>;

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="gradient-text">Aggregated AI News</h1>
        <p style={{ color: 'var(--text-secondary)' }}>The latest updates scraped from around the web.</p>
      </div>

      <div className="list-container">
        {news.length > 0 ? (
          news.map((item) => (
            <div key={item._id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '20px', margin: 0, maxWidth: '80%' }}>{item.title}</h3>
                {item.selectedForPost && (
                  <span className="badge success" style={{ gap: '4px' }}><Star size={12} fill="currentColor" /> Selected</span>
                )}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '16px', lineHeight: '1.6' }}>
                {item.summary}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge info">{item.source}</span>
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                  Read Original <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
            <h3 style={{ color: 'var(--text-secondary)' }}>No news found in database.</h3>
            <p style={{ marginTop: '8px', color: 'var(--border-color)' }}>Wait for the 8:00 AM scraping job or trigger it manually.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
