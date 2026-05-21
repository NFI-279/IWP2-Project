import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassroomSchedule } from "../api/scheduleApi";
import { createReservation, deleteReservation, subscribeToReservation, unsubscribeFromReservation } from "../api/reservationApi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const slotTimes = {
	1: "08:00 - 10:00",
	2: "10:00 - 12:00",
	3: "12:00 - 14:00",
	4: "14:00 - 16:00",
	5: "16:00 - 18:00",
	6: "18:00 - 20:00"
};

function getCurrentWeekNumber() {
	const date = new Date();
	const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

	const dayNumber = target.getUTCDay() || 7;
	target.setUTCDate(target.getUTCDate() + 4 - dayNumber);

	const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));

	return Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
}

function ClassroomPage() {

	const { classroomId } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();

	const [schedule, setSchedule] = useState({});
	const [week, setWeek] = useState(getCurrentWeekNumber);
	const [modal, setModal] = useState(null);

	const [courseName, setCourseName] = useState("");
	const [description, setDescription] = useState("");

	const [feedbackModal, setFeedbackModal] = useState(null);

	useEffect(() => {
		loadSchedule();
		const interval = setInterval(loadSchedule, 5000);
		return () => clearInterval(interval);
	}, [week, user]);

	const loadSchedule = async () => {
		if (!user) return;
		try {
			const data = await getClassroomSchedule(classroomId, week, user.id);
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
		const isMine = reserved && cell?.teacherName === user?.name;

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
				timeSlot: modal.slot,
				courseName,
				description
			});
			setModal(null);
			setCourseName("");
			setDescription("");
			loadSchedule();
		} catch {
			setFeedbackModal({
				title: "Reservation Failed",
				message: "Failed to create reservation. Please try again."
			});
		}
	};

	const cancelBooking = async () => {
		try {
			await deleteReservation(modal.cell.reservationId);
			setModal(null);
			loadSchedule();
		} catch {
			setFeedbackModal({
				title: "Cancellation Failed",
				message: "Failed to cancel reservation."
			});
		}
	};

	const handleSubscribe = async (reservationId) => {
		try {
			await subscribeToReservation(reservationId, user.id);
			setModal(null);
			loadSchedule();
		} catch {
			setFeedbackModal({
				title: "Subscription Failed",
				message: "Failed to join classroom."
			});
		}
	};

	const handleUnsubscribe = async (reservationId) => {
		try {
			await unsubscribeFromReservation(reservationId, user.id);
			setModal(null);
			loadSchedule();
		} catch {
			setFeedbackModal({
				title: "Leave Failed",
				message: "Failed to leave classroom."
			});
		}
	};

	return (
		<>
			<Navbar />

			<div className="bg-gray-50 min-h-screen px-6 py-10">

				<div className="max-w-7xl mx-auto mb-6">
					<div className="flex items-center justify-between mb-6">
						<button
							onClick={() => navigate(-1)}
							className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-red-500 transition"
						>
							<span className="transition group-hover:-translate-x-1">
								←
							</span>
							Back
						</button>
						<div className="flex items-center gap-3">
							<button
								onClick={() => setWeek(prev => Math.max(1, prev - 1))}
								className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-red-500 transition"
							>
								←
							</button>
							<div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
								Week {week}
							</div>
							<button
								onClick={() => setWeek(prev => prev + 1)}
								className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-red-500 transition"
							>
								→
							</button>
						</div>
					</div>
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
									const isMine = reserved && cell?.teacherName === user?.name;

									let classes = "h-24 rounded-xl flex items-center justify-center transition";

									if (!reserved) {
										if (user?.role === "TEACHER") {
											classes += " border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 cursor-pointer";
										} else {
											classes += " border-2 border-dashed border-gray-300";
										}
									} else if (isMine) {
										classes += " bg-red-500 text-white shadow-md cursor-pointer";
									} else {
										classes += " bg-red-100 border border-red-200 text-red-400 cursor-pointer";
									}

									return (
										<div
											key={day}
											className={classes}
											onClick={() => {
												if (reserved || user?.role === "TEACHER") {
													handleClick(day, slot, cell);
												}
											}}
										>
											{!reserved && user?.role === "TEACHER" && (
												<span className="text-red-400 text-xs opacity-0 hover:opacity-100 transition">
													Book
												</span>
											)}

											{reserved && (
												<div className="text-center px-1">

													<div className="text-xs font-semibold truncate">
														{cell.courseName || "Course"}
													</div>

													{user?.role === "STUDENT" && (
														<div className="text-[10px] mt-1">
															{cell.subscribedCount} / {cell.capacity}
														</div>
													)}

													{user?.role === "TEACHER" && isMine && (
														<div className="text-[10px] mt-1 opacity-80">
															Mine
														</div>
													)}

												</div>
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

							{modal.type === "book" && (
								<div className="mb-6">
									<h2 className="text-xl font-bold text-gray-900">
										Book Slot
									</h2>

									<p className="text-sm text-red-500 font-semibold mt-1">
										{modal.day}, {slotTimes[modal.slot]}
									</p>
								</div>
							)}

							{modal.type === "book" && (
								<div className="flex flex-col gap-4">

									<input
										value={courseName}
										onChange={(e) => setCourseName(e.target.value)}
										placeholder="Course name"
										className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
									/>

									<textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Description"
										className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
									/>

									<div className="flex gap-3 mt-2">

										<button
											onClick={() => setModal(null)}
											className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 rounded-md font-semibold"
										>
											Cancel
										</button>

										<button
											onClick={confirmBooking}
											className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold"
										>
											Confirm
										</button>

									</div>

								</div>
							)}

							{modal.type === "info" && (
								<div className="flex flex-col gap-4">

									<div>
										<h2 className="text-xl font-bold text-gray-900">
											{modal.cell.courseName || "Course"}
										</h2>

										<p className="text-sm text-red-500 font-semibold mt-1">
    										WEEK {week}, {modal.day}, {slotTimes[modal.slot]}
										</p>
									</div>

									<div>
										<p className="text-sm font-semibold text-gray-700">
											Description
										</p>

										<p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-words">
											{modal.cell.description || "No description provided"}
										</p>
									</div>

									<div className="flex flex-col gap-1 text-sm text-gray-700">

										<div>
											Teacher:{" "}
											<span className="font-semibold">
												{modal.cell.teacherName}
											</span>
										</div>

										{user?.role === "STUDENT" && (
											<div>
												Students:{" "}
												<span className="font-semibold">
													{modal.cell.subscribedCount} / {modal.cell.capacity}
												</span>
											</div>
										)}

									</div>

									<div className="flex gap-3 pt-3">

										<button
											onClick={() => setModal(null)}
											className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md font-semibold"
										>
											Close
										</button>

										{modal.mine && user?.role === "TEACHER" && (
											<button
												onClick={cancelBooking}
												className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold"
											>
												Cancel Booking
											</button>
										)}

										{user?.role === "STUDENT" && (
											modal.cell.isSubscribed ? (
												<button
													onClick={() => handleUnsubscribe(modal.cell.reservationId)}
													className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold"
												>
													Leave
												</button>
											) : modal.cell.subscribedCount < modal.cell.capacity ? (
												<button
													onClick={() => handleSubscribe(modal.cell.reservationId)}
													className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold"
												>
													Join
												</button>
											) : (
												<button
													disabled
													className="flex-1 bg-gray-200 text-gray-400 py-3 rounded-md font-semibold"
												>
													Full
												</button>
											)
										)}

									</div>

								</div>
							)}

						</div>

					</div>
				)}

			</div>

			<DeleteConfirmModal
				isOpen={!!feedbackModal}
				title={feedbackModal?.title}
				message={feedbackModal?.message}
				confirmText="OK"
				hideCancelButton={true}
				onCancel={() => setFeedbackModal(null)}
				onConfirm={() => setFeedbackModal(null)}
			/>

		</>
	);
}

export default ClassroomPage;
