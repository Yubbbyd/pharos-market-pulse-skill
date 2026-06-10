const axios = require("axios");

const API_KEY = process.env.GNEWS_API_KEY || null;

async function getCryptoNews(query = "crypto DeFi blockchain", count = 5) {
  if (!API_KEY) throw new Error("Missing GNEWS_API_KEY environment variable.");

  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
    query
  )}&lang=en&max=${count}&apikey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const articles = response.data.articles || [];

    return articles.map((article) => ({
      title: article.title,
      source: article.source.name,
      published: article.publishedAt,
      url: article.url,
      summary: article.description,
    }));
  } catch (err) {
    console.error("Failed to fetch crypto news:", err.response?.status, err.response?.data || err.message);
    return [];
  }
}

// Test it
(async () => {
  try {
    const news = await getCryptoNews();
    if (!news.length) {
      console.log("No news returned.");
      return;
    }

    console.log("📰 Crypto News:\n");
    news.forEach((item, i) => {
      console.log(`${i + 1}. ${item.title}`);
      console.log(`   Source: ${item.source} | ${item.published}`);
      console.log(`   ${item.summary}`);
      console.log();
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
