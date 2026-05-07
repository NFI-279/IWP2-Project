import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ minimal = false }) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<nav className="bg-white border-b border-gray-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

				{/* LOGO */}
				<Link to="/" className="flex items-center space-x-2">
					<div className="w-6 h-6 bg-red-500 rounded-md"></div>
					<span className="font-semibold text-gray-800 text-lg">
						Spotix
					</span>
				</Link>

				{!minimal && (
					<>
						{/* NAV LINKS */}
						<div className="flex items-center space-x-6 text-sm font-medium text-gray-600">

							{user?.role !== "ADMIN" && (
								<Link to="/" className="hover:text-red-500">
									Campus
								</Link>
							)}

							{user?.role === "STUDENT" && (
								<Link to="/my-classes" className="hover:text-red-500">
									My Classes
								</Link>
							)}

							{user?.role === "TEACHER" && (
								<Link to="/my-reservations" className="hover:text-red-500">
									My Reservations
								</Link>
							)}

							{user?.role === "ADMIN" && (
								<>
									<Link to="/admin/building" className="hover:text-red-500">
										Manage Buildings
									</Link>
									<Link to="/admin/analytics" className="hover:text-red-500">
										Analytics
									</Link>
								</>
							)}

							<Link to="/profile" className="hover:text-red-500">
								Profile
							</Link>
						</div>

						{/* RIGHT SIDE */}
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-600">
								{user?.email}
							</span>

							<button
								onClick={handleLogout}
								className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md"
							>
								Logout
							</button>
						</div>
					</>
				)}

			</div>
		</nav>
	);
}

export default Navbar;