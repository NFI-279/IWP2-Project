import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFloors } from "../api/floorApi";
import Navbar from "../components/Navbar";

function BuildingPage() {

	const { buildingId } = useParams();
	const navigate = useNavigate();

	const [floors, setFloors] = useState([]);

	useEffect(() => {
		loadFloors();
	}, []);

	const loadFloors = async () => {
		try {
			const data = await getFloors(buildingId);
			setFloors(data);
		} catch (err) {
			console.error("Failed to load floors", err);
		}
	};

	return (
		<>
			<Navbar />

			<div className="bg-background-light min-h-screen px-6 py-10">

				{/* HEADER */}
				<div className="max-w-7xl mx-auto mb-8">

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
						Floors
					</h2>

					<p className="text-muted">
						Select a floor to view classrooms
					</p>

				</div>

				{/* GRID */}
				<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

					{floors.map((floor) => (

						<div
							key={floor.id}
							onClick={() => navigate(`/floor/${floor.id}`)}
							className="bg-surface rounded-xl overflow-hidden shadow-soft cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
						>

							{/* FLOOR IMAGE */}
							{floor.imagePath && (
								<img
									src={`http://localhost:8080${floor.imagePath}`}
									alt={floor.name}
									className="w-full h-48 object-cover"
								/>
							)}

							{/* CONTENT */}
							<div className="p-5 flex items-center justify-between">

								<div>

									<h3 className="text-lg font-bold text-text-main">
										{floor.name}
									</h3>

									<p className="text-sm text-muted mt-1">
										{floor.classrooms?.length ?? 0} classrooms
									</p>

								</div>

								<div className="text-muted transition">
									→
								</div>

							</div>

						</div>

					))}

				</div>

			</div>
		</>
	);
}

export default BuildingPage;