import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { Bar } from "react-chartjs-2";
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

	const [data, setData] = useState(null);
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
					backgroundColor: "rgba(59, 130, 246, 0.7)" // nicer blue
				}
			]
		});
	};

	if (!data) return <div className="p-6">Loading...</div>;

	return (
		<div className="max-w-6xl mx-auto px-4 py-6">

			{/* Back Button */}
			<button
				onClick={() => navigate(-1)}
				className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-red-500 transition"
			>
				<span className="transition group-hover:-translate-x-1">
					←
				</span>
				Back
			</button>

			<h2 className="text-2xl font-bold mb-6">
				Reservation Analytics
			</h2>

			{/* Chart Card */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

				<div className="h-[400px]">
					<Bar
						data={data}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							plugins: {
								legend: {
									display: false
								},
								title: {
									display: true,
									text: "Reservations per Classroom"
								}
							}
						}}
					/>
				</div>

			</div>

		</div>
	);
}

export default AdminAnalyticsPage;