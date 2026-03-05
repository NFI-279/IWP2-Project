import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClassroomSchedule } from "../api/scheduleApi";
import { createReservation, deleteReservation } from "../api/reservationApi";
import { useAuth } from "../context/AuthContext";

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const slotTimes = {
	1: "08:00–10:00",
	2: "10:00–12:00",
	3: "12:00–14:00",
	4: "14:00–16:00",
	5: "16:00–18:00",
	6: "18:00–20:00"
};

function ClassroomPage() {

	const { classroomId } = useParams();

	const [schedule, setSchedule] = useState({});
	const [week, setWeek] = useState(10);

	const { user } = useAuth();

	useEffect(() => {

		loadSchedule();

		const interval = setInterval(() => {
			loadSchedule();
		}, 5000); // every 5 seconds

		return () => clearInterval(interval);

	}, [week]);

	const loadSchedule = async () => {
		try {
			const data = await getClassroomSchedule(classroomId, week);
			setSchedule(data);
		} catch (err) {
			console.error("Failed to load schedule", err);
		}
	};

	const getSlot = (day, slot) => {
		const dayData = schedule.schedule?.find(d => d.day === day);
		if (!dayData) return null;
		return dayData.slots.find(s => s.slot === slot);
	};

	const handleSlotClick = async (day, slot, reserved) => {

		if (reserved) return;

		if (user.role !== "TEACHER") {
			alert("Only teachers can reserve classrooms");
			return;
		}

		const confirmBooking = confirm(
			`Reserve classroom for ${day} slot ${slot}?`
		);

		if (!confirmBooking) return;

		try {

			await createReservation({
				classroomId: Number(classroomId),
				weekNumber: Number(week),
				dayOfWeek: days.indexOf(day) + 1,
				timeSlot: slot
			});

			loadSchedule();

		} catch (err) {
			console.error(err);
			alert(err.response?.data?.message || "Reservation failed");
		}

	};

	const handleCancel = async (reservationId) => {

		const confirmCancel = confirm("Cancel this reservation?");

		if (!confirmCancel) return;

		try {

			await deleteReservation(reservationId);

			loadSchedule();

		} catch (err) {
			console.error(err);
			alert(err.response?.data?.message || "Failed to cancel reservation");
		}

	};


	return (
		<div className="container mt-5">

			<h2 className="mb-4">Classroom Schedule</h2>

			<div className="mb-3">
				Week:
				<input
					type="number"
					value={week}
					min="1"
					max="53"
					onChange={e => setWeek(e.target.value)}
				/>
			</div>

			<table className="table table-bordered text-center">

				<thead>
					<tr>
						<th>Slot</th>
						{days.map(day => (
							<th key={day}>{day}</th>
						))}
					</tr>
				</thead>

				<tbody>

					{[1, 2, 3, 4, 5, 6].map(slot => (

						<tr key={slot}>

							<td>
								<div>Slot {slot}</div>
								<small>{slotTimes[slot]}</small>
							</td>

							{days.map(day => {

								const cell = getSlot(day, slot);
								const reserved = cell?.reserved;
								const isMine = cell?.teacherName === user.email;

								return (
									<td
										key={day}
										onClick={() => {
											if (!reserved) {
												handleSlotClick(day, slot, reserved);
											}
											if (reserved && isMine) {
												console.log(cell);
												handleCancel(cell.reservationId);
											}

										}}
										title={
											reserved
												? `Reserved by: ${cell.teacherName}\nWeek: ${week}\nTime: ${slotTimes[slot]}`
												: "Available"
										}
										style={{
											backgroundColor:
												reserved
													? isMine
														? "#99ccff"
														: "#ffcccc"
													: "#ccffcc",
											cursor: "pointer"
										}}
									></td>
								);

							})}

						</tr>

					))}

				</tbody>

			</table>

		</div>
	);

}

export default ClassroomPage;