import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import img1 from "../assets/login/campus1.jpg";
import img2 from "../assets/login/campus2.jpg";
import img3 from "../assets/login/campus3.jpg";

function LoginPage() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();

	const images = [img1, img2, img3];
	const [currentImage, setCurrentImage] = useState(images[0]);

	useEffect(() => {

		const interval = setInterval(() => {

			const random = images[Math.floor(Math.random() * images.length)];
			setCurrentImage(random);

		}, 8000);

		return () => clearInterval(interval);

	}, []);

	const handleSubmit = async (e) => {

		e.preventDefault();

		setLoading(true);
		setError("");

		try {

			await login(email, password);
			navigate("/");

		} catch {

			setError("Invalid email or password");

		} finally {

			setLoading(false);

		}

	};

	return (
		<>
			<Navbar minimal />

			<div className="min-h-screen flex items-center justify-center bg-background-light p-6">

				<div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">

					{/* LEFT SIDE IMAGE */}

					<div
						className="hidden md:flex w-1/2 relative bg-cover bg-center"
						style={{ backgroundImage: `url(${currentImage})` }}
					>

						<div className="absolute inset-0 bg-primary/30 backdrop-blur-sm flex flex-col justify-center items-center text-white p-10">

							<h2 className="text-3xl font-bold mb-3">
								CampusView
							</h2>

							<p className="text-center text-sm opacity-90">
								Discover available classrooms and reserve spaces instantly across campus.
							</p>

						</div>

					</div>

					{/* LOGIN FORM */}

					<div className="w-full md:w-1/2 p-10 flex flex-col justify-center">

						<h1 className="text-3xl font-bold text-slate-900 mb-2">
							Welcome Back
						</h1>

						<p className="text-slate-500 mb-8">
							Log in to your student or faculty account
						</p>

						{error && (

							<div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
								{error}
							</div>

						)}

						<form onSubmit={handleSubmit} className="space-y-6">

							{/* EMAIL */}

							<div>

								<label className="text-sm font-semibold text-slate-700">
									Email
								</label>

								<input
									type="email"
									placeholder="name@university.edu"
									className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>

							</div>

							{/* PASSWORD */}

							<div>

								<label className="text-sm font-semibold text-slate-700">
									Password
								</label>

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

							</div>

							{/* BUTTON */}

							<button
								disabled={loading}
								className="w-full bg-red-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition"						>

								{loading ? (

									<div className="flex items-center gap-2">

										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

										Signing in...

									</div>

								) : (

									"Login"

								)}

							</button>

						</form>

						<p className="mt-8 text-sm text-slate-600 text-center">

							Don't have an account?

							<Link
								to="/register"
								className="ml-2 text-primary font-semibold hover:underline hover:text-red-600 transition"
							>
								Register
							</Link>

						</p>

					</div>

				</div>

			</div>
		</>
	);

}

export default LoginPage;