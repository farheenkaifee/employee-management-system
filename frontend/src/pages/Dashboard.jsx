import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import api from "../services/api";

const initialStats = [
  { label: "Total Employees", value: "—", icon: Users },
  { label: "Total Documents", value: "—", icon: FileText },
  { label: "Pending Leaves", value: "—", icon: Clock },
  { label: "Approved Leaves", value: "—", icon: CheckCircle },
];

export default function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get("/dashboard/summary");

        const data = response.data;

        setStats([
          {
            label: "Total Employees",
            value: data.totalEmployees ?? 0,
            icon: Users,
          },
          {
            label: "Total Documents",
            value: data.totalDocuments ?? 0,
            icon: FileText,
          },
          {
            label: "Pending Leaves",
            value: data.pendingLeaves ?? 0,
            icon: Clock,
          },
          {
            label: "Approved Leaves",
            value: data.approvedLeaves ?? 0,
            icon: CheckCircle,
          },
        ]);
      } catch {
        setMessage(
          "Dashboard data will appear when the summary API is connected."
        );
      }
    };

    fetchSummary();
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Good day, {user.name || "there"}!</h1>
          <p>Here's what's happening in your workspace.</p>
        </div>

        <span className="role-badge">
          {user.role || "User"}
        </span>
      </div>

      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="stat-card" key={label}>
            <div className="stat-top">
              <span>{label}</span>
              <div className="stat-icon">
                <Icon size={20} />
              </div>
            </div>

            <h2>{value}</h2>

            <span className="stat-caption">
              <ArrowUpRight size={14} />
              Current system overview
            </span>
          </div>
        ))}
      </div>

      {message && <p className="muted">{message}</p>}

      <div className="welcome-panel">
        <div>
          <span className="eyebrow">YOUR WORKSPACE</span>
          <h2>Everything in one place.</h2>
          <p>
            Manage employee records, organize documents and
            keep track of leave requests from one workspace.
          </p>
        </div>

        <div className="welcome-icon">
          <Users size={46} />
        </div>
      </div>
    </div>
  );
}