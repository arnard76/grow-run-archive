export async function getData(startDate: Date, endDate: Date): Promise<{ x: number; y: number }[]> {
	const formatDate = (date: Date) => date.toISOString().split('T')[0];

	// Hari Nagar, New Delhi, India: 28.62277256437274, 77.10634012279095
	const [lat, lon] = [28.62277256437274, 77.10634012279095];

	const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${formatDate(
		startDate
	)}&end_date=${formatDate(endDate)}&hourly=temperature_2m`;
	const res = await fetch(url);
	const obj = await res.json();
	console.log(obj);
	return obj.hourly['temperature_2m'].map((temp: number, index: number) => ({
		x: new Date(obj.hourly.time[index]).valueOf(),
		y: temp
	}));
}
