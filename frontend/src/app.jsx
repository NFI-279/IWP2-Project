import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BuildingPage from "./pages/BuildingPage";
import FloorPage from "./pages/FloorPage";
import ClassroomPage from "./pages/ClassroomPage";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminBuildingPage from "./pages/admin/AdminBuildingPage";
import AdminFloorPage from "./pages/admin/AdminFloorPage";
import AdminClassroomPage from "./pages/admin/AdminClassroomPage";
import AdminLayoutEditorPage from "./pages/admin/AdminLayoutEditorPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";

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

				<Route
					path="/admin"
					element={
						<ProtectedRoute>
							<AdminLayout />
						</ProtectedRoute>
					}
				>
					<Route index element={<AdminDashboardPage />} />
					<Route path="building" element={<AdminBuildingPage />} />
					<Route path="floor/:buildingId" element={<AdminFloorPage />} />
					<Route path="classroom/:floorId" element={<AdminClassroomPage />} />
					<Route path="layout/:floorId" element={<AdminLayoutEditorPage />} />
					<Route path="analytics" element={<AdminAnalyticsPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;