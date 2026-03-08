import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";

function RegisterPage() {

	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("STUDENT");

	const handleSubmit = async (e) => {

		e.preventDefault();

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

			alert("Registration failed");

		}

	};

	return (

		<div className="container mt-5">

			<h2>Register</h2>

			<form onSubmit={handleSubmit}>

				<input
					className="form-control mb-3"
					placeholder="Name"
					value={name}
					onChange={e => setName(e.target.value)}
				/>

				<input
					className="form-control mb-3"
					placeholder="Email"
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>

				<input
					type="password"
					className="form-control mb-3"
					placeholder="Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>

				<select
					className="form-control mb-3"
					value={role}
					onChange={e => setRole(e.target.value)}
				>

					<option value="STUDENT">Student</option>
					<option value="TEACHER">Teacher</option>

				</select>

				<button className="btn btn-success">
					Register
				</button>

			</form>

		</div>

	);

}

export default RegisterPage;