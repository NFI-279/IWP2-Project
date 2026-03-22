import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMySubscriptions, unsubscribeFromReservation } from "../api/reservationApi";
import { useAuth } from "../context/AuthContext";

const slotTimes = {
	1: "08:00–10:00",
	2: "10:00–12:00",
	3: "12:00–14:00",
	4: "14:00–16:00",
	5: "16:00–18:00",
	6: "18:00–20:00"
};

function MySubscriptionsPage() {


	const { user } = useAuth();
	const navigate = useNavigate();

	const [subscriptions, setSubscriptions] = useState([]);

	useEffect(() => {
		loadSubscriptions();
	}, [user]);

	const loadSubscriptions = async () => {
		if (!user) return;

		try {
			const data = await getMySubscriptions(user.id);
			setSubscriptions(data);
		} catch (err) {
			console.error("Failed to load subscriptions", err);
		}
	};

	const handleLeave = async (reservationId) => {
		const confirmLeave = window.confirm("Leave this class?");
		if (!confirmLeave) return;

		try {
			await unsubscribeFromReservation(reservationId, user.id);
			loadSubscriptions();
		} catch (err) {
			console.error("Leave failed", err);
		}
	};

	return (
		<>
			<Navbar />

			<div className="min-h-screen bg-gray-50 px-6 py-10">

				<div className="max-w-6xl mx-auto mb-8">
					<button
						onClick={() => navigate(-1)}
						className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-red-500 transition"
					>
						<span className="transition group-hover:-translate-x-1">
							←
						</span>
						Back
					</button>

					<h2 className="text-3xl font-bold text-gray-800">
						My Classes
					</h2>

					<p className="text-gray-500">
						Classes you have joined
					</p>
				</div>

				<div className="max-w-6xl mx-auto bg-white rounded-lg shadow">

					{subscriptions.length === 0 ? (
						<div className="p-8 text-center text-gray-500">
							You have not joined any classes yet.
						</div>
					) : (
						<table className="min-w-full divide-y divide-gray-200">

							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-4 text-left text-xs text-gray-500">Classroom</th>
									<th className="px-6 py-4 text-left text-xs text-gray-500">Teacher</th>
									<th className="px-6 py-4 text-left text-xs text-gray-500">Week</th>
									<th className="px-6 py-4 text-left text-xs text-gray-500">Day</th>
									<th className="px-6 py-4 text-left text-xs text-gray-500">Time</th>
									<th className="px-6 py-4 text-left text-xs text-gray-500">Action</th>
								</tr>
							</thead>

							<tbody>
								{subscriptions.map((res) => (
									<tr key={res.reservationId} className="hover:bg-gray-50">

										<td className="px-6 py-4">
											<button
												onClick={() => navigate(`/classroom/${res.classroomId}`)}
												className="text-red-500 hover:underline"
											>
												{res.classroomName}
											</button>
										</td>

										<td className="px-6 py-4">
											{res.teacherName}
										</td>

										<td className="px-6 py-4">
											{res.week}
										</td>

										<td className="px-6 py-4">
											{res.day}
										</td>

										<td className="px-6 py-4">
											{slotTimes[res.slot]}
										</td>

										<td className="px-6 py-4">
											<button
												onClick={() => handleLeave(res.reservationId)}
												className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
											>
												Leave
											</button>
										</td>

									</tr>
								))}
							</tbody>

						</table>
					)}

				</div>

			</div>
		</>
	);

}

export default MySubscriptionsPage;
