import { Hono } from 'hono';
import { reddit } from '@devvit/web/server';

type ErrorResponse = {
  status: 'error';
  message: string;
};

type SuccessResponse = {
  success: true;
  ticker: string;
  count: number;
  data: any[];
  debug?: string;
};

export const redditRoute = new Hono();

redditRoute.post('/search', async (c) => {
  const startTime = Date.now();
  
  try {
    const { ticker } = await c.req.json();
    
    if (!ticker) {
      console.error('[REDDIT API] Missing ticker in request');
      return c.json<ErrorResponse>(
        {
          status: 'error',
          message: 'Ticker is required',
        },
        400
      );
    }
    
    console.log(`[REDDIT API] Fetching posts for ticker: ${ticker}`);
    
    // Search multiple subreddits
const subreddits = [
  'wallstreetbets',
  'stocks', 
  'investing',
  'stockmarket',
  'options',
  'daytrading',
  'securityanalysis',
  'dividends',
  'valueinvesting',
  'robinhood',
];
    
    let allPosts: any[] = [];
    
    for (const subreddit of subreddits) {
      try {
        console.log(`[REDDIT API] Fetching from r/${subreddit}...`);
        
        // Get hot posts
        const hotPosts = await reddit.getNewPosts({
          subredditName: subreddit,
          limit: 100,
          pageSize: 100,
        }).all();
        
        // Get new posts
        const newPosts = await reddit.getNewPosts({
          subredditName: subreddit,
          limit: 100,
          pageSize: 100,
        }).all();
        
        allPosts = allPosts.concat(hotPosts, newPosts);
        console.log(`[REDDIT API] r/${subreddit}: ${hotPosts.length} hot + ${newPosts.length} new posts`);
      } catch (err) {
        console.error(`[REDDIT API] Failed to fetch from r/${subreddit}:`, err);
      }
    }
    
    console.log(`[REDDIT API] Total posts fetched across all subreddits: ${allPosts.length}`);
    
    // More flexible ticker matching
    const tickerUpper = ticker.toUpperCase();
    const tickerLower = ticker.toLowerCase();
    const tickerRegex = new RegExp(`\\b${ticker}\\b|\\$${ticker}\\b`, 'gi');
    
    const filteredPosts = allPosts.filter(post => {
      const title = post.title || '';
      const body = post.body || '';
      const combined = `${title} ${body}`;
      
      // Check multiple patterns
      return (
        combined.match(tickerRegex) || // Word boundary match
        title.toUpperCase().includes(tickerUpper) ||
        body.toUpperCase().includes(tickerUpper) ||
        title.includes(`$${tickerUpper}`) ||
        body.includes(`$${tickerUpper}`) ||
        title.includes(`$${tickerLower}`) ||
        body.includes(`$${tickerLower}`)
      );
    });
    
    // Remove duplicates and sort by score
    const uniquePosts = Array.from(
      new Map(filteredPosts.map(post => [post.id, post])).values()
    )
    .sort((a, b) => b.score - a.score) // Sort by score (upvotes)
    .slice(0, 20); // Get top 20
    
    console.log(`[REDDIT API] Found ${uniquePosts.length} posts mentioning ${ticker}`);
    
    const formattedPosts = uniquePosts.map(post => ({
      id: post.id,
      title: post.title,
      author: post.authorName || 'deleted',
      score: post.score,
      selftext: post.body?.substring(0, 300) || '',
      created: post.createdAt.getTime() / 1000,
      subreddit: post.subredditName,
      numComments: post.numberOfComments,
      url: post.url,
    }));

    console.log(`[REDDIT API] ✅ SUCCESS: Total time ${Date.now() - startTime}ms`);
    
    return c.json<SuccessResponse>({ 
      success: true, 
      ticker,
      count: formattedPosts.length,
      data: formattedPosts,
      debug: `Searched ${allPosts.length} posts across ${subreddits.length} subreddits, found ${formattedPosts.length} matches`
    });
  } catch (error) {
    console.error(`[REDDIT API] ❌ ERROR after ${Date.now() - startTime}ms:`, error);
    let errorMessage = 'Failed to fetch Reddit posts';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return c.json<ErrorResponse>(
      { status: 'error', message: errorMessage },
      500
    );
  }
});