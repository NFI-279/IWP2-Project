import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/apiClient";
import Navbar from "../components/Navbar";

function RegisterPage() {

	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("STUDENT");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e) => {

		e.preventDefault();

		setLoading(true);
		setError("");

		try {

			await api.post("/auth/register", {
				name,
				email,
				password,
				role
			});

			alert("Account created!");
			navigate("/login");

		} catch {

			setError("Registration failed");

		} finally {

			setLoading(false);

		}

	};

	return (
		<>
			<Navbar minimal />



			<div className="min-h-screen flex items-center justify-center bg-background-light p-6">

				<div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">

					<h1 className="text-3xl font-bold text-slate-900 mb-2">
						Create Account
					</h1>

					<p className="text-slate-500 mb-8">
						Register for CampusView
					</p>

					{error && (

						<div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
							{error}
						</div>

					)}

					<form onSubmit={handleSubmit} className="space-y-6">

						{/* NAME */}

						<input
							placeholder="Full name"
							className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>

						{/* EMAIL */}

						<input
							placeholder="Email"
							type="email"
							className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						{/* PASSWORD */}

						<div className="relative mt-2">

							<input
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>

							<button
								type="button"
								className="absolute right-3 top-3 text-sm text-gray-500"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? "Hide" : "Show"}
							</button>

						</div>

						{/* ROLE */}

						<select
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
						>

							<option value="STUDENT">Student</option>
							<option value="TEACHER">Teacher</option>
							<option value="ADMIN">Admin</option>

						</select>

						{/* BUTTON */}

						<button
							disabled={loading}
							className="w-full bg-red-500 text-white font-semibold py-3 rounded-xl hover:bg-red-600 transition"
						>

							{loading ? "Creating account..." : "Register"}

						</button>

					</form>

					<p className="mt-6 text-sm text-center text-slate-600">

						Already have an account?

						<Link
							to="/login"
							className="ml-2 text-red-500 font-semibold hover:underline"
						>
							Login
						</Link>

					</p>

				</div>

			</div>
		</>
	);

}

export default RegisterPage;