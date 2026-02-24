import { useEffect, useState } from "react";
import axios from "../../services/api";
import { Link } from "react-router-dom";

export default function TrainerPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("/trainer/workout-plans");
      setPlans(res.data.items);
    } catch (err) {
      console.error("Error loading plans", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;

    try {
      await axios.delete(`/trainer/workout-plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <div>Loading plans...</div>;

  return (
    <div>
      <h2>Workout Plans</h2>

      <Link to="/trainer/plans/create">
        <button>Create Plan</button>
      </Link>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Client</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.client_name}</td>
              <td>
                <Link to={`/trainer/plans/${p.id}`}>
                  <button>View</button>
                </Link>
                <button onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
