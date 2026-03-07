import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyReservations, deleteReservation } from "../api/reservationApi";

const slotTimes = {
	1: "08:00–10:00",
	2: "10:00–12:00",
	3: "12:00–14:00",
	4: "14:00–16:00",
	5: "16:00–18:00",
	6: "18:00–20:00"
};

function MyReservationsPage() {

	const navigate = useNavigate();
	const [reservations, setReservations] = useState([]);

	useEffect(() => {
		loadReservations();
	}, []);

	const loadReservations = async () => {

		try {

			const data = await getMyReservations();
			setReservations(data);

		} catch (err) {

			console.error("Failed to load reservations", err);

		}

	};

	const handleCancel = async (id) => {

		const confirmCancel = window.confirm("Cancel this reservation?");

		if (!confirmCancel) return;

		try {

			await deleteReservation(id);
			loadReservations();

		} catch (err) {

			console.error("Cancel failed", err);

		}

	};

	return (

		<>

			<Navbar />

			<div className="container mt-5">

				<button
					className="btn btn-secondary mb-3"
					onClick={() => navigate(-1)}
				>
					← Back
				</button>

				<h2 className="mb-4">My Reservations</h2>

				<table className="table table-bordered">

					<thead>

						<tr>
							<th>Classroom</th>
							<th>Week</th>
							<th>Day</th>
							<th>Time</th>
							<th>Action</th>
						</tr>

					</thead>

					<tbody>

						{reservations.map(res => (

							<tr key={res.id}>

								<td
									style={{ cursor: "pointer", color: "blue" }}
									onClick={() => navigate(`/classroom/${res.classroomId}`)}
								>
									{res.classroomName}
								</td>

								<td>{res.week}</td>

								<td>{res.day}</td>

								<td>{slotTimes[res.slot]}</td>

								<td>

									<button
										className="btn btn-danger btn-sm"
										onClick={() => handleCancel(res.id)}
									>
										Cancel
									</button>

								</td>

							</tr>

						))}

					</tbody>

				</table>

			</div>

		</>

	);

}

export default MyReservationsPage;