// This file defines the Reddit search route for the server. It handles POST requests to /search and returns mock Reddit posts based on the provided ticker symbol.

import { Hono } from 'hono';

export const reddit = new Hono();

reddit.post('/search', async (c) => {
  try {
    const { ticker } = await c.req.json();
    
    if (!ticker) {
      return c.json({ success: false, error: 'Ticker is required' }, 400);
    }
    
    console.log('Searching Reddit for ticker:', ticker);
    
    const mockPosts = [
      { id: '1', title: `${ticker} to the moon!`, author: 'user1', score: 1250, selftext: 'Buy now!', created: Date.now() / 1000, subreddit: 'wallstreetbets', numComments: 100, url: '#' },
      { id: '2', title: `Why ${ticker} is undervalued`, author: 'user2', score: 890, selftext: 'Great stock', created: Date.now() / 1000, subreddit: 'wallstreetbets', numComments: 50, url: '#' },
      { id: '3', title: `${ticker} DD Analysis`, author: 'user3', score: 2100, selftext: 'Deep dive...', created: Date.now() / 1000, subreddit: 'wallstreetbets', numComments: 200, url: '#' },
    ];

    console.log(`✅ Returning ${mockPosts.length} posts for ${ticker}`);
    
    return c.json({ 
      success: true, 
      ticker,
      count: mockPosts.length,
      data: mockPosts 
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to search' 
    }, 500);
  }
});