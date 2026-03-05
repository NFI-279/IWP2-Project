import { useAuth } from "../context/AuthContext";

function DashboardPage() {

  const { user, logout } = useAuth();

  return (
    <div className="container mt-5">

      <h2>Dashboard</h2>

      <p>Logged in as: {user.email}</p>

      <button
        className="btn btn-danger"
        onClick={logout}
      >
        Logout
      </button>

    </div>
  );
}

export default DashboardPage;