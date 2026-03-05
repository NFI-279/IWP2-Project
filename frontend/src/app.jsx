import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BuildingPage from "./pages/BuildingPage";
import FloorPage from "./pages/FloorPage";
import ClassroomPage from "./pages/ClassroomPage";

function App() {

	return (
		<BrowserRouter>
			<Routes>

				<Route path="/login" element={<LoginPage />} />

				<Route
					path="/"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/building/:buildingId"
					element={
						<ProtectedRoute>
							<BuildingPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/floor/:floorId"
					element={
						<ProtectedRoute>
							<FloorPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/classroom/:classroomId"
					element={
						<ProtectedRoute>
							<ClassroomPage />
						</ProtectedRoute>
					}
				/>

			</Routes>
		</BrowserRouter>
	);
}

export default App;