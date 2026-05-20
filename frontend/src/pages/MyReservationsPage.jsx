import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { getMyReservations, deleteReservation, getStudentsForReservation } from "../api/reservationApi";

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

	const [students, setStudents] = useState([]);
	const [selectedReservation, setSelectedReservation] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [reservationToDelete, setReservationToDelete] = useState(null);

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

	const handleCancelClick = (id) => {
		setReservationToDelete(id);
		setShowDeleteModal(true);
	};

	const confirmCancelReservation = async () => {
		try {
			await deleteReservation(reservationToDelete);
			closeModal();
			loadReservations();
		} catch (err) {
			console.error("Cancel failed", err);
		} finally {
			setShowDeleteModal(false);
			setReservationToDelete(null);
		}
	};

	const handleViewStudents = async (reservationId) => {
		try {
			const data = await getStudentsForReservation(reservationId);
			setStudents(data);
			setSelectedReservation(reservationId);
		} catch (err) {
			console.error("Failed to load students", err);
		}
	};

	const closeModal = () => {
		setSelectedReservation(null);
		setStudents([]);
	};

	return (
		<>
			<Navbar />

			<div className="min-h-screen bg-gray-50 px-6 py-10">

				{/* HEADER */}
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

					<h2 className="text-3xl font-bold text-gray-800 mb-1">
						My Reservations
					</h2>

					<p className="text-gray-500">
						View and manage your classroom bookings
					</p>
				</div>

				{/* CONTENT */}
				<div className="max-w-6xl mx-auto">
					<div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

						{reservations.length === 0 ? (
							<div className="p-8 text-center text-gray-500">
								You have no reservations yet.
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
												Classroom
											</th>
											<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
												Course
											</th>
											<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
												Description
											</th>
											<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
												Week
											</th>
											<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
												Day
											</th>
											<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
												Time
											</th>
											<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
												Students
											</th>
											<th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
												Action
											</th>
										</tr>
									</thead>

									<tbody className="divide-y divide-gray-200 bg-white">
										{reservations.map((res) => (

											<tr
												key={res.id}
												className="hover:bg-gray-50 transition"
											>

												<td className="px-6 py-4">
													<button
														onClick={() => navigate(`/classroom/${res.classroomId}`)}
														className="font-medium text-red-500 hover:underline"
													>
														{res.classroomName}
													</button>
												</td>

												<td className="px-6 py-4 font-semibold text-gray-800">
													{res.courseName}
												</td>

												<td
													className="px-6 py-4 text-gray-600 max-w-xs truncate"
													title={res.description}
												>
													{res.description || "—"}
												</td>

												<td className="px-6 py-4 text-gray-700">
													{res.week}
												</td>

												<td className="px-6 py-4 text-gray-700">
													{res.day}
												</td>

												<td className="px-6 py-4 text-gray-700">
													{slotTimes[res.slot]}
												</td>

												<td className="px-6 py-4 text-gray-700 font-medium">
													{(res.subscribedCount ?? 0)} / {(res.capacity ?? 0)}
												</td>

												<td className="px-6 py-4">
													<div className="flex flex-col gap-2">

														<button
															onClick={() => handleViewStudents(res.id)}
															className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 rounded-md"
														>
															View Students
														</button>

														<button
															onClick={() => handleCancelClick(res.id)}
															className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-md"
														>
															Cancel Reservation
														</button>

													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}

						{/* STUDENTS MODAL */}
						{selectedReservation && (
							<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

								<div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">

									<h2 className="text-lg font-bold mb-4">
										Students ({students.length})
									</h2>

									{students.length === 0 ? (
										<p className="text-sm text-gray-400">
											No students joined yet
										</p>
									) : (
										<div className="max-h-60 overflow-y-auto border rounded-md p-2">
											{students.map((s) => (
												<div
													key={s.id}
													className="text-sm py-2 border-b last:border-none"
												>
													{s.email}
												</div>
											))}
										</div>
									)}

									<div className="mt-4">
										<button
											onClick={closeModal}
											className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-md"
										>
											Close
										</button>
									</div>

								</div>

							</div>
						)}

					</div>
				</div>

			</div>

			{/* DELETE MODAL */}
			<DeleteConfirmModal
				isOpen={showDeleteModal}
				title="Cancel Reservation"
				message="Are you sure you want to cancel this reservation?

This action cannot be undone and all subscribed students will lose access to this session."
				confirmText="Cancel Reservation"
				onCancel={() => {
					setShowDeleteModal(false);
					setReservationToDelete(null);
				}}
				onConfirm={confirmCancelReservation}
			/>

		</>
	);
}

export default MyReservationsPage;