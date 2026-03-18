import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBuildings } from "../../api/buildingApi";
import { createBuilding, deleteBuilding } from "../../api/adminApi";

function AdminBuildingPage() {
	const navigate = useNavigate();

	const [buildings, setBuildings] = useState([]);
	const [name, setName] = useState("");
	const [file, setFile] = useState(null);
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
		if (!name.trim() || !file) {
			alert("Building name and image required");
			return;
		}

		const formData = new FormData();
		formData.append("name", name.trim());
		formData.append("file", file);

		try {
			setSubmitting(true);
			await createBuilding(formData);

			setName("");
			setFile(null);

			const fileInput = document.getElementById("building-file-input");
			if (fileInput) fileInput.value = "";

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
		<div className="max-w-6xl mx-auto px-4 py-6">

			{/* Back Button */}
			<button
				onClick={() => navigate(-1)}
				className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-red-500 transition"
			>
				<span className="transition group-hover:-translate-x-1">←</span>
				Back
			</button>

			<h2 className="text-2xl font-bold mb-6">Admin — Buildings</h2>

			{/* Create Building */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">

				<h3 className="text-lg font-semibold mb-4">Create Building</h3>

				<div className="space-y-3">

					<input
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Building name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

					<input
						id="building-file-input"
						type="file"
						accept="image/*"
						className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-md file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
						onChange={(e) => setFile(e.target.files[0] ?? null)}
					/>

					<button
						className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
						onClick={handleCreate}
						disabled={submitting}
					>
						{submitting ? "Creating..." : "Create Building"}
					</button>

				</div>

			</div>

			{/* Buildings Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

				{buildings.map((building) => (
					<div
						key={building.id}
						className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
					>

						{/* Image */}
						{building.imagePath && (
							<img
								src={`http://localhost:8081${building.imagePath}`}
								alt={building.name}
								className="w-full h-40 object-cover"
							/>
						)}

						<div className="p-4">

							<h3 className="text-lg font-semibold mb-2">
								{building.name}
							</h3>

							<p className="text-sm text-gray-500 mb-4">
								Floors: {building.floors?.length ?? 0}
							</p>

							<div className="flex justify-between">

								<button
									className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
									onClick={() => navigate(`/admin/floor/${building.id}`)}
								>
									Floors
								</button>

								<button
									className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
									onClick={() => handleDelete(building.id)}
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

export default AdminBuildingPage;