import { Devvit } from '@devvit/public-api';

// Configure Devvit with Reddit API access
Devvit.configure({
  redditAPI: true,
  http: true,
});

// Create a custom action that your web app can call
Devvit.addCustomPostType({
  name: 'Stock Sentiment App',
  height: 'tall',
  render: (context) => {
    return (
      <vstack height="100%" width="100%">
        <webview
          id="stockSentimentWebView"
          url="game.html"
          onMessage={async (msg) => {
            // Handle messages from the web app
            if (msg.type === 'FETCH_REDDIT_POSTS') {
              const { ticker } = msg.data;
              
              try {
                console.log(`Fetching posts for ${ticker}`);
                
                // Use Reddit API
                const posts = await context.reddit.getHotPosts({
                  subredditName: 'wallstreetbets',
                  limit: 50,
                  pageSize: 50,
                }).all();
                
                // Filter by ticker
                const tickerLower = ticker.toLowerCase();
                const filteredPosts = posts.filter(post => {
                  const title = post.title.toLowerCase();
                  const body = post.body?.toLowerCase() || '';
                  return (
                    title.includes(`$${tickerLower}`) ||
                    title.includes(tickerLower) ||
                    body.includes(`$${tickerLower}`) ||
                    body.includes(tickerLower)
                  );
                }).slice(0, 10);
                
                const formattedPosts = filteredPosts.map(post => ({
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
                
                // Send results back to web app
                context.ui.webView.postMessage('stockSentimentWebView', {
                  type: 'REDDIT_POSTS_RESPONSE',
                  data: {
                    success: true,
                    ticker,
                    count: formattedPosts.length,
                    posts: formattedPosts,
                  },
                });
              } catch (error) {
                context.ui.webView.postMessage('stockSentimentWebView', {
                  type: 'REDDIT_POSTS_RESPONSE',
                  data: {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to fetch',
                  },
                });
              }
            }
          }}
          grow
        />
      </vstack>
    );
  },
});

export default Devvit;