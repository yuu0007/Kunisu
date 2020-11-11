function escapeRegex(str) {
	return str.replace(/[|\\{}()[}^$+*?.]/g, "\\$&");
}

function isURL(url) {
	if (!url) return false;
	const pattern = new RegExp(
		"^(https?:\\/\\/)?" +
			"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
			"((\\d{1,3}\\.){3}\\d{1,3}))|" +
			"localhost" +
			"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
			"(\\?[;&a-z\\d%_.~+=-]*)?" +
			"(\\#[-a-z\\d_]*)?$",
		"i"
	);
	return pattern.test(url);
}

module.exports = { escapeRegex, isURL };
