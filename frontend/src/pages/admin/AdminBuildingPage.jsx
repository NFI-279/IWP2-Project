import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBuildings } from "../../api/buildingApi";
import { createBuilding, deleteBuilding } from "../../api/adminApi";

function AdminBuildingPage() {
	const navigate = useNavigate();

	const [buildings, setBuildings] = useState([]);
	const [name, setName] = useState("");
	const [submitting, setSubmitting] = useState(false);

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

	const handleCreate = async () => {
		if (!name.trim()) {
			alert("Building name required");
			return;
		}

		try {
			setSubmitting(true);
			await createBuilding(name.trim());
			setName("");
			await loadBuildings();
		} catch (err) {
			console.error("Create building failed", err);
			alert(err.response?.data || "Failed to create building");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm("Delete this building?");

		if (!confirmDelete) return;

		try {
			await deleteBuilding(id);
			await loadBuildings();
		} catch (err) {
			console.error("Delete building failed", err);
			alert(err.response?.data || "Delete failed");
		}
	};

	return (
		<div className="container mt-5">
			<button
				className="btn btn-secondary mb-3"
				onClick={() => navigate(-1)}
			>
				← Back
			</button>
			<h2 className="mb-4">Admin — Buildings</h2>

			<div className="mb-4">
				<div className="input-group">
					<input
						className="form-control"
						placeholder="New building name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

					<button
						className="btn btn-success"
						onClick={handleCreate}
						disabled={submitting}
					>
						{submitting ? "Creating..." : "Create"}
					</button>
				</div>
			</div>

			<div className="row">
				{buildings.map((building) => (
					<div key={building.id} className="col-md-4 mb-4">
						<div className="card shadow-sm">
							<div className="card-body">
								<h5>{building.name}</h5>

								<p>Floors: {building.floors?.length ?? 0}</p>

								<div className="d-flex justify-content-between">
									<button
										className="btn btn-primary btn-sm"
										onClick={() => navigate(`/admin/floor/${building.id}`)}
									>
										Floors
									</button>

									<button
										className="btn btn-danger btn-sm"
										onClick={() => handleDelete(building.id)}
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default AdminBuildingPage;