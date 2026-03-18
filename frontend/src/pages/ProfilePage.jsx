import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import Navbar from "../components/Navbar";

function ProfilePage() {

	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	useEffect(() => {
		loadUser();
	}, []);

	const loadUser = async () => {
		try {
			const res = await api.get("/auth/me");
			setUser(res.data);
		} catch (err) {
			console.error("Failed to load profile", err);
		}
	};

	if (!user) {
		return (
			<>
				<Navbar />
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<p className="text-gray-500">Loading...</p>
				</div>
			</>
		);
	}

	const getRoleBadge = (role) => {
		switch (role) {
			case "TEACHER":
				return "bg-red-100 text-red-600";
			case "ADMIN":
				return "bg-gray-800 text-white";
			default:
				return "bg-gray-100 text-gray-600";
		}
	};

	return (
		<>
			<Navbar />

			<div className="min-h-screen bg-gray-50 px-6 py-10">

				{/* HEADER */}
				<div className="max-w-4xl mx-auto mb-8">

					<button
						onClick={() => navigate(-1)}
						className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-red-500 transition"
					>
						<span className="transition group-hover:-translate-x-1">
							←
						</span>
						Back
					</button>

					<h2 className="text-3xl font-bold text-gray-800 mb-1">
						Profile
					</h2>

					<p className="text-gray-500">
						Your account details
					</p>

				</div>

				{/* CARD */}
				<div className="max-w-4xl mx-auto">

					<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">

						<div className="space-y-6">

							{/* NAME */}
							<div>
								<p className="text-sm text-gray-500">Name</p>
								<p className="text-lg font-semibold text-gray-800">
									{user.name}
								</p>
							</div>

							{/* EMAIL */}
							<div>
								<p className="text-sm text-gray-500">Email</p>
								<p className="text-lg font-semibold text-gray-800">
									{user.email}
								</p>
							</div>

							{/* ROLE */}
							<div>
								<p className="text-sm text-gray-500 mb-1">Role</p>
								<span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge(user.role)}`}>
									{user.role}
								</span>
							</div>

						</div>

					</div>

				</div>

			</div>
		</>
	);
}

export default ProfilePage;