import { Link, Outlet } from "react-router-dom";

function AdminLayout() {

	return (

		<div className="d-flex">

			<div
				style={{
					width: "240px",
					minHeight: "100vh",
					background: "#1f2937",
					color: "white",
					padding: "20px"
				}}
			>

				<h4 className="mb-4">Admin</h4>

				<div className="d-flex flex-column gap-3">

					<Link
						to="/admin"
						className="text-white text-decoration-none"
					>
						Dashboard
					</Link>

					<Link
						to="/admin/building"
						className="text-white text-decoration-none"
					>
						Buildings
					</Link>

					<Link
						to="/admin/analytics"
						className="text-white text-decoration-none"
					>
						Analytics
					</Link>

				</div>

			</div>

			<div
				style={{
					flex: 1,
					padding: "30px"
				}}
			>

				<Outlet />

			</div>

		</div>

	);

}

export default AdminLayout;