import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassrooms } from "../../api/classroomApi";
import { createClassroom, deleteClassroom } from "../../api/adminApi";

function AdminClassroomPage() {
	const { floorId } = useParams();
	const navigate = useNavigate();

	const [classrooms, setClassrooms] = useState([]);
	const [name, setName] = useState("");
	const [capacity, setCapacity] = useState("");

	useEffect(() => {
		loadClassrooms();
	}, []);

	const loadClassrooms = async () => {
		const data = await getClassrooms(floorId);
		setClassrooms(data);
	};

	const handleCreate = async () => {
		await createClassroom(floorId, {
			name,
			capacity,
			topLeftX: 10,
			topLeftY: 10,
			bottomRightX: 20,
			bottomRightY: 20
		});

		setName("");
		setCapacity("");
		loadClassrooms();
	};

	const handleDelete = async (id) => {
		await deleteClassroom(id);
		loadClassrooms();
	};

	return (
		<div className="max-w-5xl mx-auto px-4 py-6">

			{/* Back Button */}
			<button
				onClick={() => navigate(-1)}
				className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-red-500 transition"
			>
				<span className="transition group-hover:-translate-x-1">←</span>
				Back
			</button>

			<h2 className="text-2xl font-bold mb-6">Classrooms</h2>

			{/* Create Form */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 space-y-3">

				<input
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Classroom name"
					value={name}
					onChange={e => setName(e.target.value)}
				/>

				<input
					type="number"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Capacity"
					value={capacity}
					onChange={e => setCapacity(e.target.value)}
				/>

				<button
					className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
					onClick={handleCreate}
				>
					Create Classroom
				</button>

			</div>

			{/* Classroom List */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">

				{classrooms.map(room => (
					<div
						key={room.id}
						className="flex items-center justify-between px-4 py-3"
					>

						<div>
							<p className="font-medium">{room.name}</p>
							<p className="text-sm text-gray-500">
								Capacity: {room.capacity}
							</p>
						</div>

						<button
							className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
							onClick={() => handleDelete(room.id)}
						>
							Delete
						</button>

					</div>
				))}

			</div>

		</div>
	);
}

export default AdminClassroomPage;