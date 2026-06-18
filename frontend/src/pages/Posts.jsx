import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Camera, CheckCircle2 } from 'lucide-react';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/posts');
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="main-content"><h2>Loading Posts...</h2></div>;

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="gradient-text">Generated Carousels</h1>
        <p style={{ color: 'var(--text-secondary)' }}>AI generated Instagram posts ready for publishing.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Camera size={24} color="var(--accent-primary)" />
                  <span style={{ fontWeight: '600' }}>Instagram Carousel</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span className={`badge ${post.status === 'published' ? 'success' : 'info'}`}>
                    {post.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '32px' }}>
                {/* Visual Preview of Slides */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', flex: '1' }}>
                  {post.slidesText.map((slide, i) => (
                    <div key={i} style={{ aspectRatio: '4/5', background: '#000', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 60%)', zIndex: 0 }}></div>
                      <span style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '10px', color: 'var(--text-secondary)', zIndex: 1 }}>{slide.slideNumber}/5</span>
                      <h4 style={{ fontSize: '14px', zIndex: 1, marginBottom: '8px', color: '#fff' }}>{slide.title}</h4>
                      <p style={{ fontSize: '10px', color: 'var(--text-secondary)', zIndex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>{slide.text}</p>
                    </div>
                  ))}
                </div>

                {/* Caption Details */}
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>AI Generated Caption</h4>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                      {post.caption}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <Calendar size={16} /> 
                    <span>Scheduled for: {new Date(post.scheduledFor).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
            <h3 style={{ color: 'var(--text-secondary)' }}>No posts generated yet.</h3>
            <p style={{ marginTop: '8px', color: 'var(--border-color)' }}>Wait for the 8:15 AM generation job or trigger it manually.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
