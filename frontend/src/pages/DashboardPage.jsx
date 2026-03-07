import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getBuildings } from "../api/buildingApi";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function DashboardPage() {

	const { user } = useAuth();
	const navigate = useNavigate();

	const [buildings, setBuildings] = useState([]);

	useEffect(() => {
		loadBuildings();
	}, []);

	const loadBuildings = async () => {
		try {
			const data = await getBuildings();
			setBuildings(data);
		} catch (err) {
			console.error("Failed to load buildings", err);
		}
	};

	return (
		<>
			<Navbar />

			<div className="container mt-5">

				<h2 className="mb-4">Campus Buildings</h2>

				<div className="row">

					{buildings.map((building) => (

						<div key={building.id} className="col-md-4 mb-4">

							<div
								className="card shadow-sm"
								style={{ cursor: "pointer" }}
								onClick={() => navigate(`/building/${building.id}`)}
							>

								<div className="card-body">

									<h5 className="card-title">
										{building.name}
									</h5>

									<p className="card-text">
										Floors: {building.floors?.length ?? 0}
									</p>

								</div>

							</div>

						</div>

					))}

				</div>

			</div>

		</>
	);
}

export default DashboardPage;