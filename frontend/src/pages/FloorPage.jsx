import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassrooms } from "../api/classroomApi";
import { getFloor } from "../api/floorApi";

function FloorPage() {

	const { floorId } = useParams();
	const navigate = useNavigate();

	const [floor, setFloor] = useState(null);
	const [classrooms, setClassrooms] = useState([]);

	useEffect(() => {
		loadFloor();
		loadClassrooms();
	}, []);

	const loadFloor = async () => {
		try {
			const data = await getFloor(floorId);
			setFloor(data);
		} catch (err) {
			console.error("Failed to load floor", err);
		}
	};

	const loadClassrooms = async () => {
		try {
			const data = await getClassrooms(floorId);
			setClassrooms(data);
		} catch (err) {
			console.error("Failed to load classrooms", err);
		}
	};

	return (
		<div className="container mt-4">

			<h2 className="mb-4">Floor Map</h2>

			<div
				style={{
					position: "relative",
					width: "100%",
					maxWidth: "900px"
				}}
			>
				{floor && (

					<img
						src={`http://localhost:8081${floor.imagePath}`}
						alt="Floor"
						style={{ width: "100%" }}
					/>

				)}
				
				{classrooms.map(room => {

					const width = room.bottomRightX - room.topLeftX;
					const height = room.bottomRightY - room.topLeftY;

					return (
						<div
							key={room.id}
							onClick={() => navigate(`/classroom/${room.id}`)}
							style={{
								position: "absolute",
								left: `${room.topLeftX}%`,
								top: `${room.topLeftY}%`,
								width: `${width}%`,
								height: `${height}%`,
								border: "2px solid red",
								cursor: "pointer"
							}}
							title={room.name}
						/>
					);

				})}

			</div>

		</div>
	);
}

export default FloorPage;