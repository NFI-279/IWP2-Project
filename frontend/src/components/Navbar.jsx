import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (

		<nav className="navbar navbar-dark bg-dark navbar-expand-lg">

			<div className="container">

				<Link className="navbar-brand" to="/">
					Campus Rooms
				</Link>

				<div className="navbar-nav">

					<Link className="nav-link" to="/">
						Campus
					</Link>

					{user?.role === "TEACHER" && (
						<Link className="nav-link" to="/my-reservations">
							My Reservations
						</Link>
					)}

					{user?.role === "ADMIN" && (
						<>
							<Link className="nav-link" to="/admin/building">
								Manage Buildings
							</Link>

							<Link className="nav-link" to="/admin/analytics">
								Reservation Analytics
							</Link>
						</>
					)}

				</div>

				<div className="d-flex align-items-center">

					<span className="text-white me-3">
						{user?.email}
					</span>

					<button
						className="btn btn-danger btn-sm"
						onClick={handleLogout}
					>
						Logout
					</button>

				</div>

			</div>

		</nav>

	);
}

export default Navbar;