import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import {
	Bar
} from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

function AdminAnalyticsPage() {

	const [data, setData] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		load();
	}, []);

	const load = async () => {

		const res = await api.get("/reservations");

		const reservations = res.data;

		const counts = {};

		reservations.forEach(r => {
			counts[r.classroomName] =
				(counts[r.classroomName] || 0) + 1;
		});

		const labels = Object.keys(counts);
		const values = Object.values(counts);

		setData({
			labels,
			datasets: [
				{
					label: "Reservations",
					data: values,
					backgroundColor: "rgba(75,192,192,0.6)"
				}
			]
		});

	};

	if (!data.labels) return <div>Loading...</div>;

	return (

		<div>
			<button
				className="btn btn-secondary mb-3"
				onClick={() => navigate(-1)}
			>
				← Back
			</button>
			<h2 className="mb-4">Reservation Analytics</h2>

			<Bar data={data} />

		</div>

	);
}

export default AdminAnalyticsPage;