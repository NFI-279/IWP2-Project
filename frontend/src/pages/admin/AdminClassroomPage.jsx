import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClassrooms } from "../../api/classroomApi";
import { createClassroom, deleteClassroom } from "../../api/adminApi";

function AdminClassroomPage() {

	const { floorId } = useParams();

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

		<div>

			<h2 className="mb-4">Classrooms</h2>

			<div className="card p-3 mb-4">

				<input
					className="form-control mb-2"
					placeholder="Classroom name"
					value={name}
					onChange={e => setName(e.target.value)}
				/>

				<input
					className="form-control mb-2"
					placeholder="Capacity"
					value={capacity}
					onChange={e => setCapacity(e.target.value)}
				/>

				<button className="btn btn-success" onClick={handleCreate}>
					Create Classroom
				</button>

			</div>

			<ul className="list-group">

				{classrooms.map(room => (

					<li
						key={room.id}
						className="list-group-item d-flex justify-content-between"
					>

						{room.name} — Capacity {room.capacity}

						<button
							className="btn btn-danger btn-sm"
							onClick={() => handleDelete(room.id)}
						>
							Delete
						</button>

					</li>

				))}

			</ul>

		</div>

	);
}

export default AdminClassroomPage;