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
		<div className="max-w-6xl mx-auto px-4 py-6">
			<button
				onClick={() => navigate(-1)}
				className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-red-500 transition"
			>
				<span className="transition group-hover:-translate-x-1">
					←
				</span>
				Back
			</button>

			<h2 className="text-2xl font-bold mb-6">Admin — Floors</h2>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
				<h3 className="text-lg font-semibold mb-4">Upload Floor Map</h3>

				<div className="space-y-3">
					<input
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Floor name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

					<input
						id="floor-file-input"
						type="file"
						accept="image/*"
						className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-md file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
						onChange={(e) => setFile(e.target.files[0] ?? null)}
					/>

					<div>
						<button
							className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
							onClick={handleUpload}
							disabled={uploading}
						>
							{uploading ? "Uploading..." : "Upload Floor"}
						</button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
				{floors.map((floor) => (
					<div
						key={floor.id}
						className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
					>
						{floor.imagePath && (
							<img
								src={`http://localhost:8081${floor.imagePath}`}
								alt={floor.name}
								className="w-full h-48 object-cover"
							/>
						)}

						<div className="p-4">
							<h3 className="text-lg font-semibold mb-4">
								{floor.name}
							</h3>

							<div className="flex justify-between gap-2">
								<button
									className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
									onClick={() => navigate(`/admin/layout/${floor.id}`)}
								>
									Edit Layout
								</button>

								<button
									className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
									onClick={() => handleDelete(floor.id)}
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default AdminFloorPage;