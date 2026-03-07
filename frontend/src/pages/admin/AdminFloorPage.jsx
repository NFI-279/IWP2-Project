import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFloors } from "../../api/floorApi";
import { uploadFloor, deleteFloor } from "../../api/adminApi";

function AdminFloorPage() {
	const { buildingId } = useParams();
	const navigate = useNavigate();

	const [floors, setFloors] = useState([]);
	const [name, setName] = useState("");
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		loadFloors();
	}, [buildingId]);

	const loadFloors = async () => {
		try {
			const data = await getFloors(buildingId);
			setFloors(data);
		} catch (err) {
			console.error("Failed to load floors", err);
		}
	};

	const handleUpload = async () => {
		if (!name.trim() || !file) {
			alert("Floor name and image required");
			return;
		}

		const formData = new FormData();
		formData.append("name", name.trim());
		formData.append("file", file);

		try {
			setUploading(true);
			await uploadFloor(buildingId, formData);

			setName("");
			setFile(null);

			const fileInput = document.getElementById("floor-file-input");
			if (fileInput) fileInput.value = "";

			await loadFloors();
		} catch (err) {
			console.error("Upload failed", err);
			alert(err.response?.data || "Upload failed");
		} finally {
			setUploading(false);
		}
	};

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm("Delete this floor?");

		if (!confirmDelete) return;

		try {
			await deleteFloor(id);
			await loadFloors();
		} catch (err) {
			console.error("Delete floor failed", err);
			alert(err.response?.data || "Delete failed");
		}
	};

	return (
		<div className="container mt-5">
			<h2 className="mb-4">Admin — Floors</h2>

			<div className="card p-3 mb-4">
				<h5>Upload Floor Map</h5>

				<input
					className="form-control mb-2"
					placeholder="Floor name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<input
					id="floor-file-input"
					type="file"
					className="form-control mb-3"
					accept="image/*"
					onChange={(e) => setFile(e.target.files[0] ?? null)}
				/>

				<button
					className="btn btn-success"
					onClick={handleUpload}
					disabled={uploading}
				>
					{uploading ? "Uploading..." : "Upload Floor"}
				</button>
			</div>

			<div className="row">
				{floors.map((floor) => (
					<div key={floor.id} className="col-md-4 mb-4">
						<div className="card shadow-sm">
							<div className="card-body">
								<h5>{floor.name}</h5>

								{floor.imagePath && (
									<img
										src={`http://localhost:8081${floor.imagePath}`}
										alt={floor.name}
										style={{
											width: "100%",
											height: "180px",
											objectFit: "cover",
											marginBottom: "10px",
											borderRadius: "6px"
										}}
									/>
								)}

								<div className="d-flex justify-content-between">
									<button
										className="btn btn-primary btn-sm"
										onClick={() => navigate(`/admin/layout/${floor.id}`)}
									>
										Edit Layout
									</button>

									<button
										className="btn btn-danger btn-sm"
										onClick={() => handleDelete(floor.id)}
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

export default AdminFloorPage;