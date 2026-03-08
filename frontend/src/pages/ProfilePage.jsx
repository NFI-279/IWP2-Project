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

	if (!user) return <div className="container mt-5">Loading...</div>;

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

				<div className="row justify-content-center">

					<div className="col-md-6">

						<div className="card shadow">

							<div className="card-body">

								<h3 className="card-title mb-4">Profile</h3>

								<p>
									<strong>Name:</strong> {user.name}
								</p>

								<p>
									<strong>Email:</strong> {user.email}
								</p>

								<p>
									<strong>Role:</strong> {user.role}
								</p>

								{user.role === "TEACHER" && (

									<button
										className="btn btn-primary mt-3"
										onClick={() => navigate("/my-reservations")}
									>
										My Reservations
									</button>

								)}

							</div>

						</div>

					</div>

				</div>

			</div>

		</>

	);

}

export default ProfilePage;