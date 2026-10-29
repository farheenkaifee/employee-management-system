
import { useEffect, useState } from "react";
import { Users, Files, Clock, CheckCircle } from "lucide-react";
import api from "../services/api";

const initialStats = {
  totalEmployees: 0,
  totalDocuments: 0,
  pendingLeaves: 0,
  approvedLeaves: 0,
};

const statCards = [
  {
    key: "totalEmployees",
    title: "Total Employees",
    icon: Users,
  },
  {
    key: "totalDocuments",
    title: "Total Documents",
    icon: Files,
  },
  {
    key: "pendingLeaves",
    title: "Pending Leaves",
    icon: Clock,
  },
  {
    key: "approvedLeaves",
    title: "Approved Leaves",
    icon: CheckCircle,
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/dashboard/summary");
        const data = response.data.stats || response.data.data || response.data;

        setStats({
          totalEmployees: Number(data.totalEmployees ?? 0),
          totalDocuments: Number(data.totalDocuments ?? 0),
          pendingLeaves: Number(data.pendingLeaves ?? 0),
          approvedLeaves: Number(data.approvedLeaves ?? 0),
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your employee management system.</p>
        </div>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-stats-grid">
        {statCards.map(({ key, title, icon: Icon }) => (
          <div className="dashboard-stat-card" key={key}>
            <div className="dashboard-stat-icon">
              <Icon size={23} />
            </div>

            <div>
              <p>{title}</p>
              <h2>
                {loading ? "..." : stats[key].toLocaleString()}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <section className="dashboard-welcome-card">
        <h2>Welcome to PeopleDesk</h2>
        <p>
          Manage employee records, documents, and leave requests
          from one centralized workspace.
        </p>
      </section>
    </div>
  );
}
