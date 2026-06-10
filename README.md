# 📊 Market Pulse Skill

> A reusable Skill module for the Pharos AI Agent ecosystem that fetches live token prices and trending crypto news in a single, structured JSON output.

---

## What It Does

Market Pulse is a composable Skill that any Agent on Pharos can call to get an instant financial briefing:

- **Live token prices** (BTC, ETH, PROS) with 24h change and sentiment
- **Trending crypto news** (titles, sources, summaries, links)
- **Single structured JSON output** — ready for any Agent to consume
- **Graceful error handling** — returns partial data with error details if an API is unavailable

---

## Skill Output Format

```json
{
  "skill": "market-pulse",
  "version": "1.0.0",
  "timestamp": "2026-06-08T10:00:00.000Z",
  "status": "ok",
  "errors": {
    "prices": null,
    "news": null
  },
  "data": {
    "prices": [
      {
        "token": "bitcoin",
        "price_usd": 63394,
        "change_24h": "1.40",
        "sentiment": "bullish"
      }
    ],
    "news": [
      {
        "title": "Article title here",
        "source": "Crypto News",
        "published": "2026-06-08T10:00:00Z",
        "url": "https://...",
        "summary": "Article summary here"
      }
    ]
  },
  "summary": "Fetched 3 token prices and 5 news articles."
}
```

---

## How to Use

### 1. Install dependencies

```bash
npm install axios
```

### 2. Configure your API key

Open `marketPulseSkill.js` and update the `CONFIG` object:

```javascript
const CONFIG = {
  tokens: ["bitcoin", "ethereum", "pharos-network"],  // customize tokens
  newsQuery: "crypto DeFi blockchain",         // customize news topic
  newsCount: 5,                                // number of articles
  gnewsApiKey: "YOUR_GNEWS_API_KEY",           // get free key at gnews.io
};
```

### 3. Run standalone

```bash
node marketPulseSkill.js
```

### 4. Use as a module inside an Agent

```javascript
const { marketPulseSkill } = require("./marketPulseSkill");

const output = await marketPulseSkill({
  tokens: ["bitcoin", "ethereum", "pharos-network"],
  newsQuery: "Pharos PROS token",
  newsCount: 3,
});

console.log(output.data.prices);
console.log(output.data.news);
```

---

## Data Sources

| Source | Data | Free Tier |
|--------|------|-----------|
| [CoinGecko API](https://www.coingecko.com/en/api) | Token prices + 24h change | ✅ Yes |
| [GNews API](https://gnews.io) | Crypto news articles | ✅ Yes (100 req/day) |

---

## Why This Skill Is Useful for Agents

Any Agent on Pharos that needs market awareness can plug in this Skill:

- 🤖 **Trading Agent** — check price + sentiment before executing a swap
- 📰 **News Agent** — surface trending stories to users
- 💬 **Chat Agent** — answer "what's the price of PROS?" instantly
- 📊 **Portfolio Agent** — combine with wallet data for a full briefing

---

## Project Structure
pharos-skill/
├── marketPulseSkill.js   # Main Skill (use this)
├── getPrices.js          # Price module (standalone test)
├── getNews.js            # News module (standalone test)
└── README.md             # This file
---
## Demo

🔴 Live: [https://Yubbbyd.github.io/pharos-market-pulse-skill/demo.html](https://Yubbbyd.github.io/pharos-market-pulse-skill/demo.html)

Or open `demo.html` locally in any browser.

## Built For

[Pharos AI Agent Carnival](https://www.pharos.xyz/agent-carnival) — Phase 1 Skill Hackathon  
Submitted via [DoraHacks](https://dorahacks.io/hackathon/pharos-phase1/)