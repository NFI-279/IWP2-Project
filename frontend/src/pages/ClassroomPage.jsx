import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassroomSchedule } from "../api/scheduleApi";
import { createReservation, deleteReservation } from "../api/reservationApi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

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
	const navigate = useNavigate();
	const { user } = useAuth();

	const [schedule, setSchedule] = useState({});
	const [week, setWeek] = useState(10);
	const [modal, setModal] = useState(null);

	useEffect(() => {
		loadSchedule();
		const interval = setInterval(loadSchedule, 5000);
		return () => clearInterval(interval);
	}, [week]);

	const loadSchedule = async () => {
		try {
			const data = await getClassroomSchedule(classroomId, week);
			setSchedule(data);
		} catch (err) {
			console.error(err);
		}
	};

	const getSlot = (day, slot) => {
		const dayData = schedule.schedule?.find(d => d.day === day);
		if (!dayData) return null;
		return dayData.slots.find(s => s.slot === slot);
	};

	const handleClick = (day, slot, cell) => {
		const reserved = cell?.reserved === true;
		const isMine = reserved && cell?.teacherName === user?.email;

		if (!reserved) {
			setModal({ type: "book", day, slot });
			return;
		}

		setModal({ type: "info", day, slot, cell, mine: isMine });
	};

	const confirmBooking = async () => {
		try {
			await createReservation({
				classroomId: Number(classroomId),
				weekNumber: Number(week),
				dayOfWeek: days.indexOf(modal.day) + 1,
				timeSlot: modal.slot
			});
			setModal(null);
			loadSchedule();
		} catch {
			alert("Reservation failed");
		}
	};

	const cancelBooking = async () => {
		try {
			await deleteReservation(modal.cell.reservationId);
			setModal(null);
			loadSchedule();
		} catch {
			alert("Cancel failed");
		}
	};

	return (
		<>
			<Navbar />

			<div className="bg-gray-50 min-h-screen px-6 py-10">

				<div className="max-w-7xl mx-auto mb-6">
					<button
						onClick={() => navigate(-1)}
						className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-red-500 transition"
					>
						<span className="transition group-hover:-translate-x-1">
							←
						</span>
						Back
					</button>

					<h2 className="text-3xl font-extrabold text-gray-900">
						Classroom Schedule
					</h2>
				</div>

				<div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">

					<div className="grid grid-cols-[80px_repeat(7,1fr)] gap-3">

						<div></div>
						{days.map(day => (
							<div key={day} className="text-center font-bold text-gray-800">
								{day.slice(0, 3)}
							</div>
						))}

						{[1, 2, 3, 4, 5, 6].map(slot => (
							<>
								<div className="text-right text-sm text-gray-400 pr-2">
									{slotTimes[slot]}
								</div>

								{days.map(day => {

									const cell = getSlot(day, slot);
									const reserved = cell?.reserved === true;
									const isMine = reserved && cell?.teacherName === user?.email;

									let classes = "h-24 rounded-xl flex items-center justify-center transition";

									if (!reserved) {
										classes += " border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 cursor-pointer";
									}
									else if (isMine) {
										classes += " bg-red-500 text-white shadow-md cursor-pointer";
									} else {
										classes += " bg-red-100 border border-red-200 text-red-400";
									}

									return (
										<div
											key={day}
											className={classes}
											onClick={() => handleClick(day, slot, cell)}
										>
											{!reserved && (
												<span className="text-red-400 text-xs opacity-0 hover:opacity-100 transition">
													Book
												</span>
											)}

											{reserved && isMine && (
												<span className="text-xs font-semibold">
													Mine
												</span>
											)}
										</div>
									);

								})}
							</>
						))}

					</div>

				</div>

				{modal && (
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

						<div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200">

							<div className="flex justify-between items-center mb-6">

								<div>
									<h2 className="text-xl font-bold text-gray-900">
										{modal.type === "book" ? "Book Slot" : "Reservation"}
									</h2>

									<p className="text-sm text-red-500 font-semibold mt-1">
										{modal.day}, {slotTimes[modal.slot]}
									</p>
								</div>

								<button
									onClick={() => setModal(null)}
									className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
								>
									✕
								</button>

							</div>

							{modal.type === "book" && (
								<div className="flex flex-col gap-4">

									<input
										placeholder="Course name"
										className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
									/>

									<textarea
										placeholder="Description"
										className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
									/>

									<div className="flex gap-3 mt-2">

										<button
											onClick={() => setModal(null)}
											className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md font-semibold"
										>
											Cancel
										</button>

										<button
											onClick={confirmBooking}
											className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold shadow-md"
										>
											Confirm
										</button>

									</div>

								</div>
							)}

							{modal.type === "info" && (
								<div className="flex flex-col gap-4">

									<p className="text-sm text-gray-700">
										Booked by: <strong>{modal.cell.teacherName}</strong>
									</p>

									<div className="flex gap-3">

										<button
											onClick={() => setModal(null)}
											className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 rounded-md font-semibold"
										>
											Close
										</button>

										{modal.mine && (
											<button
												onClick={cancelBooking}
												className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold"
											>
												Cancel Booking
											</button>
										)}

									</div>

								</div>
							)}

						</div>

					</div>
				)}

			</div>
		</>
	);
}

export default ClassroomPage;