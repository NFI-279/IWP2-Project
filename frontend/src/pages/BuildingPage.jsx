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
						className="mb-6 flex items-center gap-2 text-sm text-muted hover:text-primary transition"
					>
						← Back
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
							className="bg-surface rounded-lg shadow-soft p-6 cursor-pointer transition hover:-translate-y-1 hover:shadow-lg flex items-center justify-between"
						>

							{/* LEFT */}
							<div>

								<h3 className="text-lg font-bold text-text-main">
									{floor.name}
								</h3>

								<p className="text-sm text-muted mt-1">
									{floor.classrooms?.length ?? 0} classrooms
								</p>

							</div>

							{/* RIGHT ICON */}
							<div className="text-muted group-hover:text-primary transition">
								→
							</div>

						</div>

					))}

				</div>

			</div>
		</>
	);
}

export default BuildingPage;