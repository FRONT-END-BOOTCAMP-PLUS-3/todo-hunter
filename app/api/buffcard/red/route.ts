import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const order = searchParams.get('order');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing query parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const maxResults = 1000;
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${apiKey}&order=${order}`;

  try {
    const youtubeRes = await fetch(searchUrl);
    const youtubeData = await youtubeRes.json();

    if (!youtubeData.items) {
      return new Response(JSON.stringify({ error: 'Failed to fetch YouTube data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const lowerQuery = query.toLowerCase();

    type YoutubeItem = {
      snippet: {
        title?: string;
        description?: string;
      };
    };

    const filtered = youtubeData.items.filter((item: YoutubeItem) => {
      const title = item.snippet.title?.toLowerCase() ?? '';
      const description = item.snippet.description?.toLowerCase() ?? '';
      return title.includes(lowerQuery) || description.includes(lowerQuery);
    });

    return new Response(JSON.stringify({ results: filtered }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('YouTube API fetch error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
