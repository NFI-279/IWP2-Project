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

			<div className="container mt-5">

				<button
					className="btn btn-secondary mb-3"
					onClick={() => navigate(-1)}
				>
					← Back
				</button>

				<h2 className="mb-4">Floors</h2>

				<div className="row">

					{floors.map((floor) => (

						<div key={floor.id} className="col-md-4 mb-4">

							<div
								className="card shadow-sm"
								style={{ cursor: "pointer" }}
								onClick={() => navigate(`/floor/${floor.id}`)}
							>

								<div className="card-body">

									<h5 className="card-title">
										{floor.name}
									</h5>

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