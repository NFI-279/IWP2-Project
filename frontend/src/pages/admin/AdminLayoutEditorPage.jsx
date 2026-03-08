import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getClassrooms } from "../../api/classroomApi";
import {
	createClassroom,
	updateClassroomCoordinates,
	deleteClassroom
} from "../../api/adminApi";
import { getFloor } from "../../api/floorApi";
import { useNavigate } from "react-router-dom";

function AdminLayoutEditorPage() {

	const { floorId } = useParams();

	const containerRef = useRef(null);

	const [floor, setFloor] = useState(null);
	const [classrooms, setClassrooms] = useState([]);

	const [drawing, setDrawing] = useState(false);
	const [start, setStart] = useState(null);
	const [rect, setRect] = useState(null);

	const [draggingRoom, setDraggingRoom] = useState(null);

	const navigate = useNavigate();

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

	const handleMouseDown = (e) => {

		if (draggingRoom) return;

		const rect = containerRef.current.getBoundingClientRect();

		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;

		setStart({ x, y });
		setDrawing(true);

	};

	const handleMouseMove = (e) => {

		if (!drawing) return;

		const rectContainer = containerRef.current.getBoundingClientRect();

		const x = ((e.clientX - rectContainer.left) / rectContainer.width) * 100;
		const y = ((e.clientY - rectContainer.top) / rectContainer.height) * 100;

		setRect({
			x1: start.x,
			y1: start.y,
			x2: x,
			y2: y
		});

	};

	const handleMouseMoveDrag = (e) => {

		if (!draggingRoom) return;

		const container = containerRef.current.getBoundingClientRect();

		const dx = ((e.clientX - draggingRoom.startX) / container.width) * 100;
		const dy = ((e.clientY - draggingRoom.startY) / container.height) * 100;

		const room = draggingRoom.room;

		setClassrooms(prev =>
			prev.map(r =>
				r.id === room.id
					? {
						...r,
						topLeftX: r.topLeftX + dx,
						topLeftY: r.topLeftY + dy,
						bottomRightX: r.bottomRightX + dx,
						bottomRightY: r.bottomRightY + dy
					}
					: r
			)
		);

		setDraggingRoom({
			room: {
				...room,
				topLeftX: room.topLeftX + dx,
				topLeftY: room.topLeftY + dy,
				bottomRightX: room.bottomRightX + dx,
				bottomRightY: room.bottomRightY + dy
			},
			startX: e.clientX,
			startY: e.clientY
		});

	};

	const handleMouseUp = async () => {

		if (draggingRoom) {

			const room = draggingRoom.room;

			try {

				await updateClassroomCoordinates(room.id, {
					topLeftX: room.topLeftX,
					topLeftY: room.topLeftY,
					bottomRightX: room.bottomRightX,
					bottomRightY: room.bottomRightY
				});

			} catch (err) {

				console.error("Failed to update classroom", err);

			}

			setDraggingRoom(null);
			return;

		}

		if (!rect) return;

		const name = prompt("Classroom name:");
		const capacity = prompt("Capacity:");

		if (!name || !capacity) {

			setDrawing(false);
			setRect(null);
			return;

		}

		try {

			await createClassroom(floorId, {
				name,
				capacity: Number(capacity),
				topLeftX: Math.min(rect.x1, rect.x2),
				topLeftY: Math.min(rect.y1, rect.y2),
				bottomRightX: Math.max(rect.x1, rect.x2),
				bottomRightY: Math.max(rect.y1, rect.y2)
			});

			loadClassrooms();

		} catch (err) {

			console.error("Failed to create classroom", err);

		}

		setDrawing(false);
		setRect(null);

	};

	const handleRoomMouseDown = (e, room) => {

		e.stopPropagation();

		setDraggingRoom({
			room,
			startX: e.clientX,
			startY: e.clientY
		});

	};

	return (

		<div className="container mt-4">
			<button
				className="btn btn-secondary mb-3"
				onClick={() => navigate(-1)}
			>
				← Back
			</button>
			<h2>Layout Editor</h2>

			<div
				ref={containerRef}
				style={{
					position: "relative",
					width: "100%",
					maxWidth: "900px",
					cursor: "crosshair"
				}}
				onMouseDown={handleMouseDown}
				onMouseMove={(e) => {
					handleMouseMove(e);
					handleMouseMoveDrag(e);
				}}
				onMouseUp={handleMouseUp}
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
							onMouseDown={(e) => handleRoomMouseDown(e, room)}
							onContextMenu={async (e) => {

								e.preventDefault();

								const confirmDelete = window.confirm("Delete classroom?");

								if (!confirmDelete) return;

								try {

									await deleteClassroom(room.id);
									loadClassrooms();

								} catch (err) {

									console.error("Delete failed", err);

								}

							}}
							style={{
								position: "absolute",
								left: `${room.topLeftX}%`,
								top: `${room.topLeftY}%`,
								width: `${width}%`,
								height: `${height}%`,
								border: "2px solid red",
								cursor: "move"
							}}
							title={room.name}
						/>

					);

				})}

				{rect && (

					<div
						style={{
							position: "absolute",
							left: `${Math.min(rect.x1, rect.x2)}%`,
							top: `${Math.min(rect.y1, rect.y2)}%`,
							width: `${Math.abs(rect.x2 - rect.x1)}%`,
							height: `${Math.abs(rect.y2 - rect.y1)}%`,
							border: "2px dashed blue"
						}}
					/>

				)}

			</div>

		</div>

	);

}

export default AdminLayoutEditorPage;