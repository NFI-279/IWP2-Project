import { useNavigate } from "react-router-dom";

function AdminDashboardPage() {

	const navigate = useNavigate();

	return (

		<div className="container">

			<h2 className="mb-4">Admin Dashboard</h2>

			<div className="row">

				<div className="col-md-4">

					<div
						className="card shadow-sm"
						style={{ cursor: "pointer" }}
						onClick={() => navigate("/admin/building")}
					>

						<div className="card-body">

							<h5>Manage Buildings</h5>

						</div>

					</div>

				</div>

				<div className="col-md-4">

					<div
						className="card shadow-sm"
						style={{ cursor: "pointer" }}
						onClick={() => navigate("/admin/analytics")}
					>

						<div className="card-body">

							<h5>Reservation Analytics</h5>

						</div>

					</div>

				</div>

			</div>

		</div>

	);

}

export default AdminDashboardPage;