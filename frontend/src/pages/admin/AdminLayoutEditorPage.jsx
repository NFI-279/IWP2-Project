import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassrooms } from "../../api/classroomApi";
import {
	createClassroom,
	updateClassroomCoordinates,
	deleteClassroom
} from "../../api/adminApi";
import { getFloor } from "../../api/floorApi";

function AdminLayoutEditorPage() {

	const { floorId } = useParams();
	const navigate = useNavigate();
	const containerRef = useRef(null);

	const [floor, setFloor] = useState(null);
	const [classrooms, setClassrooms] = useState([]);

	const [drawing, setDrawing] = useState(false);
	const [start, setStart] = useState(null);
	const [rect, setRect] = useState(null);

	const [draggingRoom, setDraggingRoom] = useState(null);

	const [modal, setModal] = useState(null);
	const [pendingRect, setPendingRect] = useState(null);

	const [roomName, setRoomName] = useState("");
	const [capacity, setCapacity] = useState("");

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

	const overlaps = (a, b) => {
		return (
			a.topLeftX < b.bottomRightX &&
			a.bottomRightX > b.topLeftX &&
			a.topLeftY < b.bottomRightY &&
			a.bottomRightY > b.topLeftY
		);
	};

	const insideBounds = (room) => {
		return (
			room.topLeftX >= 0 &&
			room.topLeftY >= 0 &&
			room.bottomRightX <= 100 &&
			room.bottomRightY <= 100
		);
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

		const movedRoom = {
			...room,
			topLeftX: room.topLeftX + dx,
			topLeftY: room.topLeftY + dy,
			bottomRightX: room.bottomRightX + dx,
			bottomRightY: room.bottomRightY + dy
		};

		if (!insideBounds(movedRoom)) return;

		for (const r of classrooms) {
			if (r.id !== room.id && overlaps(movedRoom, r)) {
				return;
			}
		}

		setClassrooms(prev =>
			prev.map(r =>
				r.id === room.id ? movedRoom : r
			)
		);

		setDraggingRoom({
			room: movedRoom,
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

		const newRoom = {
			topLeftX: Math.min(rect.x1, rect.x2),
			topLeftY: Math.min(rect.y1, rect.y2),
			bottomRightX: Math.max(rect.x1, rect.x2),
			bottomRightY: Math.max(rect.y1, rect.y2)
		};

		if (!insideBounds(newRoom)) {
			alert("Classroom must stay inside the floor image");
			setDrawing(false);
			setRect(null);
			return;
		}

		for (const room of classrooms) {
			if (overlaps(newRoom, room)) {
				alert("Classroom overlaps with another classroom");
				setDrawing(false);
				setRect(null);
				return;
			}
		}

		setPendingRect(newRoom);
		setModal({ type: "create-room" });

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

	const confirmCreateRoom = async () => {

		if (!roomName || !capacity) {
			alert("All fields required");
			return;
		}

		try {
			await createClassroom(floorId, {
				name: roomName,
				capacity: Number(capacity),
				...pendingRect
			});

			setRoomName("");
			setCapacity("");
			setPendingRect(null);
			setModal(null);

			loadClassrooms();

		} catch (err) {
			console.error("Failed to create classroom", err);
		}
	};

	return (
		<div className="max-w-6xl mx-auto px-4 py-6">

			<button
				onClick={() => navigate(-1)}
				className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-red-500 transition"
			>
				<span className="transition group-hover:-translate-x-1">←</span>
				Back
			</button>

			<h2 className="text-2xl font-bold mb-6">Layout Editor</h2>

			<div
				ref={containerRef}
				className="relative w-full max-w-5xl border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-100 cursor-crosshair"
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
						className="w-full select-none pointer-events-none"
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
								if (!window.confirm("Delete classroom?")) return;

								await deleteClassroom(room.id);
								loadClassrooms();
							}}
							className="absolute border-2 border-red-500 cursor-move hover:bg-red-200/30"
							style={{
								left: `${room.topLeftX}%`,
								top: `${room.topLeftY}%`,
								width: `${width}%`,
								height: `${height}%`
							}}
							title={room.name}
						/>
					);
				})}

				{rect && (
					<div
						className="absolute border-2 border-blue-500 border-dashed"
						style={{
							left: `${Math.min(rect.x1, rect.x2)}%`,
							top: `${Math.min(rect.y1, rect.y2)}%`,
							width: `${Math.abs(rect.x2 - rect.x1)}%`,
							height: `${Math.abs(rect.y2 - rect.y1)}%`
						}}
					/>
				)}

			</div>

			{modal?.type === "create-room" && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

					<div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200">

						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-bold">Create Classroom</h2>

							<button
								onClick={() => setModal(null)}
								className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
							>
								✕
							</button>
						</div>

						<div className="flex flex-col gap-4">

							<input
								placeholder="Classroom name"
								value={roomName}
								onChange={(e) => setRoomName(e.target.value)}
								className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
							/>

							<input
								type="number"
								placeholder="Capacity"
								value={capacity}
								onChange={(e) => setCapacity(e.target.value)}
								className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
							/>

							<div className="flex gap-3 mt-2">

								<button
									onClick={() => setModal(null)}
									className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md font-semibold"
								>
									Cancel
								</button>

								<button
									onClick={confirmCreateRoom}
									className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold shadow-md"
								>
									Create
								</button>

							</div>

						</div>

					</div>

				</div>
			)}

		</div>
	);
}

export default AdminLayoutEditorPage;