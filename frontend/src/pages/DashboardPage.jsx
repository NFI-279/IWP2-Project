import { useEffect, useState } from "react";
import { getBuildings } from "../api/buildingApi";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function DashboardPage() {

	const navigate = useNavigate();
	const [buildings, setBuildings] = useState([]);
	const [openBuildingId, setOpenBuildingId] = useState(null);

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

	const toggleAccordion = (id, e) => {
		e.stopPropagation();
		setOpenBuildingId(prev => (prev === id ? null : id));
	};

	return (
		<>
			<Navbar />

			<div className="bg-background-light min-h-screen px-6 py-10">

				{/* HEADER */}
				<div className="max-w-[1400px] mx-auto mb-10">
					<h2 className="text-4xl font-extrabold text-text-main mb-2">
						Campus Buildings
					</h2>
					<p className="text-muted">
						Explore buildings and navigate through floors
					</p>
				</div>

				{/* GRID */}
				<div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

					{buildings.map((building) => {

						const isOpen = openBuildingId === building.id;

						return (
							<div
								key={building.id}
								onClick={() => navigate(`/building/${building.id}`)}
								className="bg-surface rounded-lg shadow-soft overflow-hidden cursor-pointer group transition hover:-translate-y-1 hover:shadow-lg flex flex-col"
							>

								{/* IMAGE */}
								<div className="relative h-48 w-full overflow-hidden">

									<div
										className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition duration-300"
										style={{
											backgroundImage:
												`url(http://localhost:8081${building.imagePath})`
										}}
									/>

									<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

								</div>

								{/* CONTENT */}
								<div className="p-6 flex flex-col gap-4">

									{/* TITLE */}
									<div>
										<h3 className="text-2xl font-extrabold text-text-main">
											{building.name}
										</h3>

										<p className="text-sm text-muted mt-1">
											{building.location || "Campus Area"}
										</p>
									</div>

									{/* ACCORDION HEADER */}
									<div
										onClick={(e) => toggleAccordion(building.id, e)}
										className="flex items-center justify-between pt-3 border-t border-gray-100"
									>

										<div className="flex items-center gap-2">

											<div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
												{building.floors?.length ?? 0}
											</div>

											<span className="text-sm font-semibold text-text-main">
												Floors
											</span>

										</div>

										{/* ARROW */}
										<span
											className={`text-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""
												}`}
										>
											⌄
										</span>

									</div>

									{/* ACCORDION CONTENT */}
									<div
										className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
											}`}
									>

										<div className="flex flex-col gap-3 pt-3">

											{building.floors?.map((floor) => (

												<div
													key={floor.id}
													className="flex items-center justify-between p-3 rounded-md bg-background-light border border-gray-100 hover:border-primary/30 transition"
												>

													<div>
														<h4 className="font-bold text-text-main text-sm">
															Floor {floor.level}
														</h4>

														<p className="text-muted text-xs">
															{floor.classrooms?.length ?? 0} rooms
														</p>
													</div>

												</div>

											))}

										</div>

									</div>

								</div>

							</div>
						);
					})}

				</div>

			</div>
		</>
	);
}

export default DashboardPage;