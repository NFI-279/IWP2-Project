import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

function AdminLayout() {

	return (

		<>

			<Navbar />

			<div className="container mt-4">

				<Outlet />

			</div>

		</>

	);

}

export default AdminLayout;