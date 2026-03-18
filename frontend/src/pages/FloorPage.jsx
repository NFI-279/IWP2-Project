import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassrooms } from "../api/classroomApi";
import { getFloor } from "../api/floorApi";
import Navbar from "../components/Navbar";

function FloorPage() {

	const { floorId } = useParams();
	const navigate = useNavigate();

	const [floor, setFloor] = useState(null);
	const [classrooms, setClassrooms] = useState([]);

	useEffect(() => {
		loadFloor();
		loadClassrooms();
	}, []);

	const loadFloor = async () => {
		try {
			const data = await getFloor(floorId);
			setFloor(data);
		} catch (err) {
			console.error("Failed to load floor", err);
		}
	};

	const loadClassrooms = async () => {
		try {
			const data = await getClassrooms(floorId);
			setClassrooms(data);
		} catch (err) {
			console.error("Failed to load classrooms", err);
		}
	};

	return (
		<>
			<Navbar />

			<div className="bg-background-light min-h-screen px-6 py-10">

				{/* HEADER */}
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

					<h2 className="text-4xl font-extrabold text-text-main mb-2">
						Floor Map
					</h2>

					<p className="text-muted">
						Click on a classroom to view details
					</p>

				</div>

				{/* MAP CONTAINER */}
				<div className="max-w-5xl mx-auto bg-surface rounded-lg shadow-soft p-4">

					<div className="relative w-full">

						{/* FLOOR IMAGE */}
						{floor && (
							<img
								src={`http://localhost:8081${floor.imagePath}`}
								alt="Floor"
								className="w-full rounded-md"
							/>
						)}

						{/* CLASSROOM OVERLAYS */}
						{classrooms.map((room) => {

							const width = room.bottomRightX - room.topLeftX;
							const height = room.bottomRightY - room.topLeftY;

							return (
								<div
									key={room.id}
									onClick={() => navigate(`/classroom/${room.id}`)}
									className="absolute group cursor-pointer"
									style={{
										left: `${room.topLeftX}%`,
										top: `${room.topLeftY}%`,
										width: `${width}%`,
										height: `${height}%`,
									}}
								>

									{/* OVERLAY BOX */}
									<div className="w-full h-full border-2 border-primary bg-primary/10 group-hover:bg-primary/20 transition rounded-sm" />

									{/* TOOLTIP */}
									<div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-text-main text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
										{room.name}
									</div>

								</div>
							);
						})}

					</div>

				</div>

			</div>
		</>
	);
}

export default FloorPage;