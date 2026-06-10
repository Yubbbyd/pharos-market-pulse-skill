const axios = require("axios");

// ── Config ──────────────────────────────────────────────
const CONFIG = {
  tokens: ["bitcoin", "ethereum", "pharos-network",],
  newsQuery: "crypto DeFi blockchain",
  newsCount: 5,
  gnewsApiKey: process.env.GNEWS_API_KEY || "demo",
  timeoutMs: 8000,
};

const TOKEN_DISPLAY = {
  bitcoin: { ticker: "BTC", name: "Bitcoin" },
  ethereum: { ticker: "ETH", name: "Ethereum" },
  "pharos-network": { ticker: "PROS", name: "Pharos" },
  solana: { ticker: "SOL", name: "Solana" },
};

// ── Helper: Safe API call ────────────────────────────────
async function safeGet(url, label) {
  try {
    const response = await axios.get(url, { timeout: CONFIG.timeoutMs });
    return { success: true, data: response.data };
  } catch (error) {
    const reason = error.response
      ? `HTTP ${error.response.status}`
      : error.code === "ECONNABORTED"
      ? "Timeout"
      : error.message;
    console.warn(`⚠️  [${label}] failed: ${reason}`);
    return { success: false, error: reason };
  }
}

// ── Skill: Fetch Token Prices ────────────────────────────
async function getTokenPrices(tokens) {
  const ids = tokens.join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  const { success, data, error } = await safeGet(url, "CoinGecko");

  if (!success) return { error, prices: [] };

  const prices = tokens.map((token) => {
    const display = TOKEN_DISPLAY[token] || { ticker: token.toUpperCase(), name: token };
    const changeValue = data[token]?.usd_24h_change;

    return {
      token,
      ticker: display.ticker,
      name: display.name,
      price_usd: data[token]?.usd ?? null,
      change_24h: changeValue != null ? changeValue.toFixed(2) : null,
      sentiment: changeValue >= 0 ? "bullish" : "bearish",
    };
  });

  return { error: null, prices };
}

// ── Skill: Fetch Crypto News ─────────────────────────────
async function getCryptoNews(query, count, apiKey) {
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${count}&apikey=${apiKey}`;

  const { success, data, error } = await safeGet(url, "GNews");

  if (!success) return { error, news: [] };

  const news = (data.articles || []).map((article) => ({
    title: article.title,
    source: article.source.name,
    published: article.publishedAt,
    url: article.url,
    summary: article.description,
  }));

  return { error: null, news };
}

// ── Main Skill: Market Pulse ─────────────────────────────
async function marketPulseSkill(options = {}) {
  const tokens = options.tokens || CONFIG.tokens;
  const newsQuery = options.newsQuery || CONFIG.newsQuery;
  const newsCount = options.newsCount || CONFIG.newsCount;
  const gnewsApiKey = options.gnewsApiKey || CONFIG.gnewsApiKey;

  console.log("⚡ Running Market Pulse Skill...\n");

  const [priceResult, newsResult] = await Promise.all([
    getTokenPrices(tokens),
    getCryptoNews(newsQuery, newsCount, gnewsApiKey),
  ]);

  const hasErrors = priceResult.error || newsResult.error;

  const skill_output = {
    skill: "market-pulse",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    status: hasErrors ? "partial" : "ok",
    errors: {
      prices: priceResult.error || null,
      news: newsResult.error || null,
    },
    data: {
      prices: priceResult.prices,
      news: newsResult.news,
    },
    summary: `Fetched ${priceResult.prices.length} token prices and ${newsResult.news.length} news articles.`,
  };

  return skill_output;
}

// ── Run & Display ────────────────────────────────────────
marketPulseSkill().then((output) => {
  // Prices
  if (output.data.prices.length > 0) {
    console.log("📊 PRICES:");
    output.data.prices.forEach((p) => {
      const arrow = p.sentiment === "bullish" ? "📈" : "📉";
      const changeText = p.change_24h != null ? `${p.change_24h}% 24h` : "N/A";
      console.log(`  ${arrow} ${p.ticker}: $${p.price_usd} (${changeText})`);
    });
  } else {
    console.log("📊 PRICES: unavailable");
  }

  // News
  console.log("\n📰 NEWS:");
  if (output.data.news.length > 0) {
    output.data.news.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.title}`);
      console.log(`     ${item.source} | ${item.published}`);
    });
  } else {
    console.log("  News unavailable");
  }

  // Status
  console.log(`\n✅ Status: ${output.status.toUpperCase()}`);
  if (output.errors.prices) console.log(`  ❌ Prices error: ${output.errors.prices}`);
  if (output.errors.news) console.log(`  ❌ News error: ${output.errors.news}`);

  console.log("\n📦 Full JSON Output:");
  console.log(JSON.stringify(output, null, 2));
});

module.exports = { marketPulseSkill };