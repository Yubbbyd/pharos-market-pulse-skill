const axios = require("axios");

async function getTokenPrices(tokens = ["bitcoin", "ethereum", "solana"]) {
	const ids = tokens.join(",");
	const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

	const response = await axios.get(url);
	const data = response.data;

	const result = tokens.map((token) => ({
		token,
		price_usd: data[token]?.usd ?? "N/A",
		change_24h: data[token]?.usd_24h_change?.toFixed(2) ?? "N/A",
	}));

	return result;
}

// Test it
getTokenPrices().then((prices) => {
	console.log("📊 Token Prices:");
	prices.forEach((p) => {
		console.log(`  ${p.token}: $${p.price_usd} (${p.change_24h}% 24h)`);
	});
});

