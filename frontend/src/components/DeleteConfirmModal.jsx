function DeleteConfirmModal({
	isOpen,
	title,
	message,
	onCancel,
	onConfirm
}) {

	if (!isOpen) return null;

	return (

		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

			<div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">

				{/* Header */}
				<div className="flex items-start justify-between mb-4">

					<div>
						<h2 className="text-2xl font-bold text-gray-900">
							{title}
						</h2>
					</div>

					<button
						onClick={onCancel}
						className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
					>
						×
					</button>

				</div>

				{/* Message */}
				<p className="text-gray-600 whitespace-pre-line leading-relaxed mb-8">
					{message}
				</p>

				{/* Actions */}
				<div className="flex gap-3">

					<button
						onClick={onCancel}
						className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
					>
						Cancel
					</button>

					<button
						onClick={onConfirm}
						className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
					>
						Delete
					</button>

				</div>

			</div>

		</div>

	);
}

export default DeleteConfirmModal;