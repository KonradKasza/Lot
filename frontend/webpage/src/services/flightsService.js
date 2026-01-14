const API_BASE = 'http://localhost:8080/api/search';

async function handleResponse(res) {
	if (!res.ok) {
		const txt = await res.text();
		throw new Error(txt || 'API error');
	}
	return res.json();
}

export async function getCountries() {
	const res = await fetch(`${API_BASE}/countries`);
	return handleResponse(res);
}

export async function getAirportsByCountry(country) {
	const res = await fetch(`${API_BASE}/airports?country=${encodeURIComponent(country)}`);
	return handleResponse(res);
}

export async function getDatesByStartAirport(startAirportId) {
	const res = await fetch(`${API_BASE}/dates?startAirportId=${startAirportId}`);
	return handleResponse(res);
}

export async function searchResults(startAirportId, date) {
	const res = await fetch(`${API_BASE}/results?startAirportId=${startAirportId}&date=${encodeURIComponent(date)}`);
	return handleResponse(res);
}

export default {
	getCountries,
	getAirportsByCountry,
	getDatesByStartAirport,
	searchResults,
};

